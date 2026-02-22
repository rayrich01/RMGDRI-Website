import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OWNER_SURRENDER_FORM_KEY } from "@/lib/forms/owner-surrender/labels";
import { OwnerSurrenderSchema } from "@/lib/forms/owner-surrender/schema";
import { OWNER_SURRENDER_FIELD_MAP } from "@/lib/forms/owner-surrender/field-map";
export const runtime = "nodejs";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json(400, { ok: false, error: "Invalid JSON body" });
  }

  // --- Field-map required enforcement ---
  // The UI now posts canonical snake_case keys directly (no normalization needed).
  // Treat empty strings and empty arrays as missing.
  const requiredDefs = OWNER_SURRENDER_FIELD_MAP.filter((f) => f.required);
  const labelByKey = new Map(OWNER_SURRENDER_FIELD_MAP.map((f) => [f.key, f.label]));
  const missingRequired = requiredDefs
    .filter((f) => {
      const val = (payload as any)?.[f.key];
      if (Array.isArray(val)) return val.length === 0;
      return !String(val ?? "").trim();
    })
    .map((f) => f.key);

  if (missingRequired.length) {
    return json(400, {
      ok: false,
      error: "Missing required fields",
      missing: missingRequired,
      labels: Object.fromEntries(labelByKey.entries()),
      stage: "required-raw",
    });
  }

  // --- Zod validation (passthrough + partial for forward-compat) ---
  const parsed = OwnerSurrenderSchema.safeParse(payload);
  if (!parsed.success) {
    return json(400, {
      ok: false,
      error: "Validation failed",
      issues: parsed.error.issues,
      stage: "validation",
    });
  }

  // --- Supabase persistence ---
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return json(500, {
      ok: false,
      error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
      stage: "env",
    });
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const insertApp = {
    type: "surrender" as const,
    status: "submitted",
    source: "web_form",
    applicant_name: String(parsed.data.owner_name ?? "").trim() || null,
    applicant_email: parsed.data.owner_email || null,
    applicant_phone: parsed.data.owner_phone_primary || null,
    applicant_profile: {
      form_key: OWNER_SURRENDER_FORM_KEY,
      payload: parsed.data,
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
    return json(500, { ok: false, error: appErr?.message ?? "insert_failed", stage: "db_insert" });
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
      details: { source: "public_intake", form_key: OWNER_SURRENDER_FORM_KEY },
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
