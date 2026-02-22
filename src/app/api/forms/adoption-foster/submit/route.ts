import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ADOPTION_FOSTER_FORM_KEY } from "@/lib/forms/adoption-foster/labels";
import { AdoptionFosterSchema } from "@/lib/forms/adoption-foster/schema";
import { ADOPTION_FOSTER_FIELD_MAP } from "@/lib/forms/adoption-foster/field-map";

export const runtime = "nodejs";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

// --- Anti-abuse: simple in-memory rate limiting ---
type Bucket = { count: number; resetAtMs: number };
const buckets = new Map<string, Bucket>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xrip = req.headers.get("x-real-ip");
  if (xrip) return xrip.trim();
  return "unknown";
}

function rateLimitCheck(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.resetAtMs) {
    buckets.set(ip, { count: 1, resetAtMs: now + RATE_WINDOW_MS });
    return true;
  }
  b.count += 1;
  return b.count <= RATE_MAX;
}

// --- Honeypot field name (must not be filled by humans) ---
const HONEYPOT_KEY = "website_url_hp";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!rateLimitCheck(ip)) {
    return json(429, { ok: false, error: "rate_limited" });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json(400, { ok: false, error: "Invalid JSON body" });
  }

  // Honeypot check
  if (typeof payload === "object" && payload !== null && (payload as any)[HONEYPOT_KEY]) {
    // Bot filled the hidden field — silently "succeed"
    return json(200, { ok: true, application_id: "noop", event_id: "noop" });
  }

  // Required field enforcement via field-map (raw payload keys)
  const requiredDefs = ADOPTION_FOSTER_FIELD_MAP.filter((f) => f.required);
  const missingRequired = requiredDefs
    .filter((f) => !String((payload as any)?.[f.key] ?? "").trim())
    .map((f) => f.key);

  if (missingRequired.length) {
    const labelByKey = Object.fromEntries(
      ADOPTION_FOSTER_FIELD_MAP.map((f) => [f.key, f.label])
    );
    return json(400, {
      ok: false,
      error: "Missing required fields",
      missing: missingRequired,
      labels: labelByKey,
      stage: "required-raw",
    });
  }

  // Schema validation (loose — passthrough + partial for forward compat)
  const SchemaAny: any = AdoptionFosterSchema as any;
  const SchemaLoose =
    typeof SchemaAny?.passthrough === "function" ? SchemaAny.passthrough() : SchemaAny;
  const Schema = typeof SchemaLoose?.partial === "function" ? SchemaLoose.partial() : SchemaLoose;

  const parsed = Schema.safeParse(payload);
  if (!parsed.success) {
    return json(400, {
      ok: false,
      error: "Validation failed",
      issues: parsed.error.issues,
      stage: "schema",
    });
  }

  // --- Supabase persistence ---
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return json(503, {
      ok: false,
      error: "Database not configured",
      stage: "env",
    });
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const data = parsed.data as Record<string, any>;

  // Determine application type from payload
  const applicationType = data.application_type === "foster"
    ? "foster"
    : data.application_type === "both"
    ? "adoption-foster"
    : "adoption";

  const insertApp = {
    type: applicationType,
    status: "submitted",
    source: "web_form",
    applicant_name:
      (String(data.applicant_first_name ?? "").trim() +
        " " +
        String(data.applicant_last_name ?? "").trim()).trim() || null,
    applicant_email: data.email || null,
    applicant_phone: data.phone_primary || null,
    applicant_profile: {
      form_key: ADOPTION_FOSTER_FORM_KEY,
      payload: data,
      raw_payload: payload,
      submitted_at: new Date().toISOString(),
    },
    internal_flags: { public_intake: true },
  };

  const { data: appRow, error: appErr } = await supabase
    .from("applications")
    .insert(insertApp)
    .select("id")
    .single();

  if (appErr || !appRow?.id) {
    return json(500, {
      ok: false,
      error: appErr?.message ?? "insert_failed",
      stage: "db_insert",
    });
  }

  // Audit event
  const { data: evRow, error: evErr } = await supabase
    .from("application_events")
    .insert({
      application_id: appRow.id,
      event_type: "status_change",
      from_status: null,
      to_status: "submitted",
      actor_user_id: null,
      details: { source: "public_intake", form_key: ADOPTION_FOSTER_FORM_KEY },
    })
    .select("id")
    .single();

  if (evErr || !evRow?.id) {
    return json(500, {
      ok: false,
      error: "event_insert_failed",
      application_id: appRow.id,
      stage: "db_event",
    });
  }

  return json(200, { ok: true, application_id: appRow.id, event_id: evRow.id });
}
