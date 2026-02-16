import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OwnerSurrenderSchema } from "@/lib/forms/owner-surrender/schema";
import { OWNER_SURRENDER_FORM_KEY } from "@/lib/forms/owner-surrender/labels";
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
    return json(500, { ok: false, error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" });
  }





const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  // Mirror existing intake pattern: store the full payload as JSON + a form key.
  // NOTE: Table names may differ; adjust to match your intake tables if needed.
  // This is intentionally conservative: one row insert + clear error return.
  const { data, error } = await supabase
    .from("intake_applications")
    .insert({
      form_key: OWNER_SURRENDER_FORM_KEY,
      payload: parsed.data,
      raw_payload: payload,
      normalization_version: OWNER_SURRENDER_NORMALIZATION_VERSION,
      submitted_at: new Date().toISOString(),
    })
    .select()
    .maybeSingle();

  if (error) {
    return json(500, { ok: false, error: error.message });
  }

  return json(200, { ok: true, id: (data as any)?.id ?? null });
}
