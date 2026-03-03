import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const runtime = "nodejs";

/**
 * Anti-abuse (MVP):
 * - Honeypot: `website` must be empty
 * - Rate limit: in-memory per-IP window
 * NOTE: In-memory rate limiting resets on server restart and may not work across serverless instances.
 *       Good for local/MVP; later move to Upstash/Redis or Cloudflare Turnstile + durable rate limiting.
 */
type Bucket = { count: number; resetAtMs: number };
const buckets = new Map<string, Bucket>();

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_PER_WINDOW = 6; // per IP per minute (tune as needed)

function getClientIp(req: Request): string {
  // Prefer x-forwarded-for (Vercel/Proxies). Fall back to unknown.
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xrip = req.headers.get("x-real-ip");
  if (xrip) return xrip.trim();
  return "unknown";
}

function rateLimitOrThrow(ip: string) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.resetAtMs) {
    buckets.set(ip, { count: 1, resetAtMs: now + RATE_LIMIT_WINDOW_MS });
    return;
  }
  b.count += 1;
  if (b.count > RATE_LIMIT_MAX_PER_WINDOW) {
    const retryAfter = Math.max(1, Math.ceil((b.resetAtMs - now) / 1000));
    const err: any = new Error("rate_limited");
    err.retryAfter = retryAfter;
    throw err;
  }
}

// Allowlisted payload: keep PII controlled and structured.
// Minimal shared fields; everything else goes into applicant_profile.
const BaseSchema = z.object({
  type: z.enum(["adopt", "foster", "volunteer", "surrender", "contact"]),
  // Honeypot: must be empty or absent
  website: z.string().optional().transform((v) => (v ?? "").trim()),
  // Optional top-level "contact-ish" fields (still PII)
  name: z.string().optional().transform((v) => (v ?? "").trim()).refine((v) => v.length <= 120, "name too long"),
  email: z.string().email().optional(),
  phone: z.string().optional().transform((v) => (v ?? "").trim()).refine((v) => v.length <= 40, "phone too long"),
  // Form-specific payload (allowlist enforced by downstream schemas)
  payload: z.record(z.any()).default({}),
});

const AdoptSchema = BaseSchema.extend({
  type: z.literal("adopt"),
  payload: z.object({
    // Keep MVP light; you can expand later.
    household_size: z.number().int().min(1).max(20).optional(),
    has_other_pets: z.boolean().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    message: z.string().optional(),
  }).passthrough(),
});

const FosterSchema = BaseSchema.extend({
  type: z.literal("foster"),
  payload: z.object({
    experience_level: z.enum(["none", "some", "experienced"]).optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    message: z.string().optional(),
  }).passthrough(),
});

const VolunteerSchema = BaseSchema.extend({
  type: z.literal("volunteer"),
  payload: z.object({
    interests: z.array(z.string()).optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    message: z.string().optional(),
  }).passthrough(),
});

const SurrenderSchema = BaseSchema.extend({
  type: z.literal("surrender"),
  payload: z.object({
    dog_name: z.string().optional(),
    urgency: z.enum(["low", "medium", "high"]).optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    message: z.string().optional(),
  }).passthrough(),
});

const ContactSchema = BaseSchema.extend({
  type: z.literal("contact"),
  payload: z.object({
    topic: z.string().optional(),
    message: z.string().min(1).max(5000),
  }).passthrough(),
});

const IntakeSchema = z.discriminatedUnion("type", [
  AdoptSchema,
  FosterSchema,
  VolunteerSchema,
  SurrenderSchema,
  ContactSchema,
]);

export async function POST(req: Request) {
  const ip = getClientIp(req);

  try {
    rateLimitOrThrow(ip);
  } catch (e: any) {
    const retryAfter = e?.retryAfter ?? 60;
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = IntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues.map(i => ({ path: i.path, message: i.message })) },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if ((data.website ?? "") !== "") {
    // Honeypot tripped: pretend accepted
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const url = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "server_misconfigured" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Data minimization:
  // - Put full user form under applicant_profile (jsonb)
  // - Keep a few optional top-level fields for convenience searches
  const insertApp = {
    type: data.type,
    status: "submitted",
    source: "web_form",
    applicant_name: data.name || null,
    applicant_email: data.email || null,
    applicant_phone: data.phone || null,
    applicant_profile: {
      // Keep allowlisted structure
      ip,
      type: data.type,
      payload: data.payload ?? {},
      submitted_at: new Date().toISOString(),
      // never echo service-side secrets; no raw headers
    },
    internal_flags: { public_intake: true },
  };

  const { data: appRow, error: appErr } = await supabase
    .from("applications")
    .insert(insertApp)
    .select("id")
    .single();

  if (appErr || !appRow?.id) {
    return NextResponse.json(
      { error: "insert_failed" },
      { status: 500 }
    );
  }

  const { data: evRow, error: evErr } = await supabase
    .from("application_events")
    .insert({
      application_id: appRow.id,
      event_type: "status_change",
      from_status: null,
      to_status: "submitted",
      actor_user_id: null,
      details: { source: "public_intake" },
    })
    .select("id")
    .single();

  if (evErr || !evRow?.id) {
    // We created an application but failed audit row. Return 500 (caller can retry),
    // and we can reconcile later (v2: wrap in RPC transaction).
    return NextResponse.json(
      { error: "event_insert_failed", application_id: appRow.id },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { ok: true, application_id: appRow.id, event_id: evRow.id },
    { status: 200 }
  );
}
