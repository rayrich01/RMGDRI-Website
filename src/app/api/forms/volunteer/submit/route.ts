/* ------------------------------------------------------------------ *
 *  POST /api/forms/volunteer/submit                                    *
 *  Volunteer Application — server-side handler                         *
 * ------------------------------------------------------------------ */

import { NextRequest, NextResponse } from "next/server";
import { VOLUNTEER_FORM_KEY, VOLUNTEER_ROLE_IDS } from "@/lib/forms/volunteer/labels";
import { VOLUNTEER_FIELD_MAP } from "@/lib/forms/volunteer/field-map";
import { volunteerSchema } from "@/lib/forms/volunteer/schema";

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
      { status: 429 },
    );
  }

  /* 2. Parse JSON body */
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body", stage: "parse" },
      { status: 400 },
    );
  }

  /* 3. Honeypot */
  if (body.website_url_hp) {
    // Silent 200 — don't reveal bot detection
    return NextResponse.json({ ok: true, application_id: "none", event_id: "none" });
  }

  /* 4. Required-field enforcement (raw stage) */
  const requiredFields = VOLUNTEER_FIELD_MAP.filter((f) => f.required);
  const missing: string[] = [];
  const labels: Record<string, string> = {};

  for (const f of requiredFields) {
    if (f.key === "roles") {
      // Special handling: roles must be an array with ≥ 1 element
      const roles = body.roles;
      if (!Array.isArray(roles) || roles.length === 0) {
        missing.push("roles");
        labels["roles"] = f.label;
      }
      continue;
    }
    if (f.key === "certify_info_true") {
      // Must be truthy
      const val = body.certify_info_true;
      if (val !== true && val !== "true" && val !== "Yes") {
        missing.push("certify_info_true");
        labels["certify_info_true"] = f.label;
      }
      continue;
    }
    const val = body[f.key];
    if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
      missing.push(f.key);
      labels[f.key] = f.label;
    }
  }

  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields", missing, labels, stage: "required-raw" },
      { status: 400 },
    );
  }

  /* 5. Validate role IDs are from canonical set */
  if (Array.isArray(body.roles)) {
    const invalid = (body.roles as string[]).filter((r) => !VOLUNTEER_ROLE_IDS.includes(r as any));
    if (invalid.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Invalid role IDs", invalid, stage: "role-validation" },
        { status: 400 },
      );
    }
  }

  /* 6. Zod schema validation */
  const parsed = volunteerSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues, stage: "zod" },
      { status: 400 },
    );
  }

  /* 7. Persist to Supabase */
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Database not configured — submission received but could not be saved. Please contact info@rmgreatdane.org.",
        stage: "env",
      },
      { status: 503 },
    );
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    /* 7a. Insert application row */
    const { data: app, error: appErr } = await supabase
      .from("applications")
      .insert({
        form_key: VOLUNTEER_FORM_KEY,
        application_type: "volunteer",
        payload: parsed.data,
        ip_address: ip,
      })
      .select("id")
      .single();

    if (appErr) throw appErr;

    /* 7b. Insert audit event */
    const { data: evt, error: evtErr } = await supabase
      .from("application_events")
      .insert({
        application_id: app.id,
        event_type: "submitted",
        metadata: { form_key: VOLUNTEER_FORM_KEY, ip_address: ip },
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
    console.error("[volunteer/submit]", message);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to save submission. Please try again or email info@rmgreatdane.org.",
        stage: "db",
      },
      { status: 500 },
    );
  }
}
