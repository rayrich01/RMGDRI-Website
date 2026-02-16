import { NextResponse } from "next/server";
import type { z } from "zod";
import { insertSubmission } from "./supabase";
import type { FormKey } from "./types";

/**
 * In-memory rate limiter (MVP).
 * Resets on deploy — good enough for now; upgrade to Upstash later.
 */
type Bucket = { count: number; resetAtMs: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xrip = req.headers.get("x-real-ip");
  if (xrip) return xrip.trim();
  return "unknown";
}

function checkRateLimit(ip: string): number | null {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.resetAtMs) {
    buckets.set(ip, { count: 1, resetAtMs: now + WINDOW_MS });
    return null;
  }
  b.count += 1;
  if (b.count > MAX_PER_WINDOW) {
    return Math.max(1, Math.ceil((b.resetAtMs - now) / 1000));
  }
  return null;
}

/**
 * Standard GET handler — returns 405 Method Not Allowed with Allow header.
 */
export function methodNotAllowed() {
  return new NextResponse(JSON.stringify({ error: "method_not_allowed" }), {
    status: 405,
    headers: {
      Allow: "POST",
      "Content-Type": "application/json",
    },
  });
}

/**
 * Create a POST handler for a form.
 *
 * @param formKey   — kebab-case form identifier
 * @param version   — schema version (matches form_definitions)
 * @param schema    — Zod schema to validate payload
 * @param opts      — optional config
 */
export function createSubmitHandler(
  formKey: FormKey,
  version: number,
  schema: z.ZodType<any>,
  opts?: {
    /** Apply rate limiting (default: true for public forms) */
    rateLimit?: boolean;
    /** Check honeypot field (default: true for public forms) */
    honeypot?: boolean;
    /** Extract email from payload for submitted_by_email */
    emailField?: string;
  }
) {
  const rateLimit = opts?.rateLimit ?? true;
  const honeypot = opts?.honeypot ?? true;
  const emailField = opts?.emailField;

  async function POST(req: Request) {
    // Rate limit
    if (rateLimit) {
      const ip = getClientIp(req);
      const retryAfter = checkRateLimit(ip);
      if (retryAfter !== null) {
        return NextResponse.json(
          { error: "rate_limited" },
          { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
      }
    }

    // Parse JSON body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    // Honeypot check
    if (honeypot && typeof body === "object" && body !== null) {
      const hp = (body as Record<string, unknown>).website;
      if (typeof hp === "string" && hp.trim() !== "") {
        // Bot detected — silently accept
        return NextResponse.json({ submission_id: "00000000-0000-0000-0000-000000000000" });
      }
    }

    // Validate
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_failed",
          issues: parsed.error.issues.map((i) => ({
            path: i.path,
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const payload = parsed.data as Record<string, unknown>;

    // Extract email
    let email: string | null = null;
    if (emailField && typeof payload[emailField] === "string") {
      email = payload[emailField] as string;
    }

    // Persist
    try {
      const submissionId = await insertSubmission({
        formKey,
        formVersion: version,
        email,
        payload,
      });

      return NextResponse.json({ submission_id: submissionId });
    } catch (err: any) {
      console.error(`[forms/${formKey}/submit]`, err?.message);
      return NextResponse.json({ error: "insert_failed" }, { status: 500 });
    }
  }

  function GET() {
    return methodNotAllowed();
  }

  return { POST, GET };
}
