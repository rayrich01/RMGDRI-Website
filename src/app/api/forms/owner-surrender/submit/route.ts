import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OWNER_SURRENDER_FORM_KEY } from "@/lib/forms/owner-surrender/labels";
import { OwnerSurrenderSchema } from "@/lib/forms/owner-surrender/schema";
import { OWNER_SURRENDER_FIELD_MAP } from "@/lib/forms/owner-surrender/field-map";
import { normalizeOwnerSurrenderPayload, OWNER_SURRENDER_NORMALIZATION_VERSION } from "@/lib/forms/owner-surrender/normalize";
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

  // Allow UI (JotForm-style) keys to flow through while we enforce required via field-map.
// - passthrough(): keep unknown keys (e.g., hyphenated field-map keys)
// - partial(): avoid hard-required enforcement by schema (field-map is canonical for now)
const SchemaAny: any = OwnerSurrenderSchema as any;
const SchemaLoose =
  typeof SchemaAny?.passthrough === "function" ? SchemaAny.passthrough() : SchemaAny;
const Schema = typeof SchemaLoose?.partial === "function" ? SchemaLoose.partial() : SchemaLoose;

// 1) Parse + required enforcement happens on RAW payload (field-map keys)
  // 2) Normalize raw -> canonical
  // 3) Strict validate canonical with OwnerSurrenderSchema
  //
  // NOTE: Until the UI posts all canonical-required keys, this strict validation will fail (expected during parity buildout).

  // Field-map required enforcement (treat empty strings as missing)
  const requiredDefs = OWNER_SURRENDER_FIELD_MAP.filter((f) => f.required);
  const labelByKey = new Map(OWNER_SURRENDER_FIELD_MAP.map((f) => [f.key, f.label]));
  const missingRequired = requiredDefs
    .filter((f) => !String((payload as any)?.[f.key] ?? "").trim())
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

  // Normalize raw -> canonical
  const { canonical, warnings } = normalizeOwnerSurrenderPayload(payload as any);

  // Strict canonical validation
  const parsed = OwnerSurrenderSchema.safeParse(canonical);
if (!parsed.success) {
    return json(400, {
      ok: false,
      error: "Validation failed",
      issues: parsed.error.issues,
      stage: "canonical",
      warnings,
    });
  }

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

  // Aligned with working intake route: src/app/api/intake/submit/route.ts
  // Table: "applications", columns: type, status, source, applicant_name,
  //   applicant_email, applicant_phone, applicant_profile (jsonb), internal_flags (jsonb)
  const insertApp = {
    type: "surrender" as const,
    status: "submitted",
    source: "web_form",
    applicant_name:
      (String(parsed.data.owner_first_name ?? "").trim() +
        " " +
        String(parsed.data.owner_last_name ?? "").trim()).trim() || null,
    applicant_email: parsed.data.owner_email || null,
    applicant_phone: parsed.data.owner_contact_phone_primary || null,
    applicant_profile: {
      form_key: OWNER_SURRENDER_FORM_KEY,
      normalization_version: OWNER_SURRENDER_NORMALIZATION_VERSION,
      payload: parsed.data,
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
    return json(500, { ok: false, error: appErr?.message ?? "insert_failed", stage: "db_insert" });
  }

  // Mirror intake route: write audit event into application_events
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
