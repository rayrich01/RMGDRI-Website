/* ------------------------------------------------------------------ *
 *  POST /api/forms/shelter-transfer/submit                             *
 *  Shelter / Rescue Transfer — server-side handler                     *
 * ------------------------------------------------------------------ */

import { NextRequest, NextResponse } from "next/server";
import { SHELTER_TRANSFER_FORM_KEY } from "@/lib/forms/shelter-transfer/labels";
import { SHELTER_TRANSFER_FIELD_MAP } from "@/lib/forms/shelter-transfer/field-map";
import { shelterTransferSchema } from "@/lib/forms/shelter-transfer/schema";

/* ── Rate-limiter (simple in-memory, per-IP) ── */
const hits = new Map<string, number[]>();
const RATE_WINDOW = 60_000; // 1 min
const RATE_LIMIT = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const log = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW);
  log.push(now);
  hits.set(ip, log);
  return log.length > RATE_LIMIT;
}

/* ── Handler ── */
export async function POST(req: NextRequest) {
  /* 1. Rate limit */
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests — please wait a minute.", stage: "rate-limit" },
      { status: 429 }
    );
  }

  /* 2. Parse JSON body */
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body", stage: "parse" },
      { status: 400 }
    );
  }

  /* 3. Honeypot */
  if (body.website_url_hp) {
    // Silent 200 — don't reveal bot detection
    return NextResponse.json({ ok: true, application_id: "none", event_id: "none" });
  }

  /* 4. Required-field enforcement (raw stage) */
  const requiredFields = SHELTER_TRANSFER_FIELD_MAP.filter((f) => f.required);
  const missing: string[] = [];
  const labels: Record<string, string> = {};

  for (const f of requiredFields) {
    const val = body[f.key];
    if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
      missing.push(f.key);
      labels[f.key] = f.label;
    }
  }

  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields", missing, labels, stage: "required-raw" },
      { status: 400 }
    );
  }

  /* 5. Zod schema validation */
  const parsed = shelterTransferSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues, stage: "zod" },
      { status: 400 }
    );
  }

  /* 6. Persist to Supabase */
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Database not configured — submission received but could not be saved. Please contact shelterrequests@rmgreatdane.org.",
        stage: "env",
      },
      { status: 503 }
    );
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    /* 6a. Insert application row */
    const { data: app, error: appErr } = await supabase
      .from("applications")
      .insert({
        form_key: SHELTER_TRANSFER_FORM_KEY,
        application_type: "shelter-transfer",
        payload: parsed.data,
        ip_address: ip,
      })
      .select("id")
      .single();

    if (appErr) throw appErr;

    /* 6b. Insert audit event */
    const { data: evt, error: evtErr } = await supabase
      .from("application_events")
      .insert({
        application_id: app.id,
        event_type: "submitted",
        metadata: { form_key: SHELTER_TRANSFER_FORM_KEY, ip_address: ip },
      })
      .select("id")
      .single();

    if (evtErr) throw evtErr;

    return NextResponse.json({
      ok: true,
      application_id: app.id,
      event_id: evt.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown database error";
    console.error("[shelter-transfer/submit]", message);
    return NextResponse.json(
      { ok: false, error: "Failed to save submission. Please try again or email shelterrequests@rmgreatdane.org.", stage: "db" },
      { status: 500 }
    );
  }
}
