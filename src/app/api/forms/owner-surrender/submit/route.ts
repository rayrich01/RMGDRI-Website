import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OwnerSurrenderSchema } from "@/lib/forms/owner-surrender/schema";
import { OWNER_SURRENDER_FORM_KEY } from "@/lib/forms/owner-surrender/labels";

import * as OwnerSurrenderFieldMapMod from "@/lib/forms/owner-surrender/field-map";

function getOwnerSurrenderFieldMap(): Array<{ key: string; label: string; required?: boolean }> {
  const mod: any = OwnerSurrenderFieldMapMod;
  // Common patterns: default export, or a named export that's an array
  if (Array.isArray(mod?.default)) return mod.default;
  for (const k of Object.keys(mod)) {
    if (Array.isArray(mod[k])) return mod[k];
  }
  throw new Error("Owner surrender field-map export not found (expected default export or named array export).");
}

export const runtime = "nodejs";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return json(500, { ok: false, error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json(400, { ok: false, error: "Invalid JSON body" });
  }

  const parsed = OwnerSurrenderSchema.safeParse(payload);
  if (!parsed.success) {
    return json(400, {
      ok: false,
      error: "Validation failed",
      issues: parsed.error.issues,
    });
  }

  // Field-map required enforcement (treat empty strings as missing)
  const requiredDefs = (getOwnerSurrenderFieldMap()).filter((f) => f.required);
  const labelByKey = Object.fromEntries((getOwnerSurrenderFieldMap()).map((f) => [f.key, f.label]));
  const missingRequired = requiredDefs
    .filter((f) => !String((parsed.data as any)[f.key] ?? "").trim())
    .map((f) => f.key);

  if (missingRequired.length) {
    return json(400, {
      ok: false,
      error: "Missing required fields",
      missing: missingRequired,
      labels: labelByKey,
    });
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
      submitted_at: new Date().toISOString(),
    })
    .select()
    .maybeSingle();

  if (error) {
    return json(500, { ok: false, error: error.message });
  }

  return json(200, { ok: true, id: (data as any)?.id ?? null });
}
