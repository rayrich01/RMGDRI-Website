import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { BITE_REPORT_HUMAN_FORM_KEY } from "@/lib/forms/bite-report-human/labels";
import { BiteReportHumanSchema } from "@/lib/forms/bite-report-human/schema";
import { BITE_REPORT_HUMAN_FIELD_MAP } from "@/lib/forms/bite-report-human/field-map";

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
  if (
    typeof payload === "object" &&
    payload !== null &&
    (payload as Record<string, unknown>)[HONEYPOT_KEY]
  ) {
    // Bot filled the hidden field — silently "succeed"
    return json(200, { ok: true, application_id: "noop", event_id: "noop" });
  }

  // Required field enforcement via field-map (raw payload keys)
  const requiredDefs = BITE_REPORT_HUMAN_FIELD_MAP.filter((f) => f.required);
  const missingRequired = requiredDefs
    .filter((f) => {
      const val = (payload as Record<string, unknown>)?.[f.key];
      if (val === undefined || val === null) return true;
      if (typeof val === "boolean") return !val; // checkbox must be true
      return !String(val ?? "").trim();
    })
    .map((f) => f.key);

  if (missingRequired.length) {
    const labelByKey = Object.fromEntries(
      BITE_REPORT_HUMAN_FIELD_MAP.map((f) => [f.key, f.label])
    );
    return json(400, {
      ok: false,
      error: "Missing required fields",
      missing: missingRequired,
      labels: labelByKey,
      stage: "required-raw",
    });
  }

  // Schema validation (Zod — with conditional refinement)
  const parsed = BiteReportHumanSchema.safeParse(payload);
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

  const data = parsed.data as Record<string, unknown>;

  // Supabase constraint allows: adopt, foster, surrender, volunteer, contact
  // Bite reports use "contact" type with form_type flag for differentiation
  const insertApp = {
    type: "contact" as const,
    status: "submitted",
    source: "web_form",
    applicant_name: String(data.reporter_full_name ?? "").trim() || null,
    applicant_email: String(data.signer_email ?? "").trim() || null,
    applicant_phone: null,
    applicant_profile: {
      form_key: BITE_REPORT_HUMAN_FORM_KEY,
      form_type: "bite_report_human",
      payload: data,
      submitted_at: new Date().toISOString(),
    },
    internal_flags: {
      public_intake: true,
      form_type: "bite_report_human",
    },
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
      details: {
        source: "public_intake",
        form_key: BITE_REPORT_HUMAN_FORM_KEY,
        form_type: "bite_report_human",
      },
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

  return json(200, {
    ok: true,
    application_id: appRow.id,
    event_id: evRow.id,
  });
}
