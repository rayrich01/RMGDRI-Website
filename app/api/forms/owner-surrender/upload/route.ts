import { NextResponse } from "next/server";
import { generateKey, getUploadUrl, getPublicUrl } from "@/lib/r2/client";

export const runtime = "nodejs";

/**
 * Anti-abuse: simple in-memory rate limiting (same pattern as intake route).
 * NOTE: resets on restart / doesn't share across serverless instances — fine for MVP.
 */
type Bucket = { count: number; resetAtMs: number };
const buckets = new Map<string, Bucket>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20; // generous — photos come in batches

function getClientIp(req: Request): string {
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
    buckets.set(ip, { count: 1, resetAtMs: now + RATE_WINDOW_MS });
    return;
  }
  b.count += 1;
  if (b.count > RATE_MAX) {
    const retryAfter = Math.max(1, Math.ceil((b.resetAtMs - now) / 1000));
    const err: any = new Error("rate_limited");
    err.retryAfter = retryAfter;
    throw err;
  }
}

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
];

const MAX_FILENAME_LEN = 200;

/**
 * POST /api/forms/owner-surrender/upload
 *
 * Body: { fileName: string, contentType: string }
 * Returns: { uploadUrl: string, publicUrl: string, key: string }
 *
 * The client uses `uploadUrl` to PUT the file directly to R2.
 * `publicUrl` is the permanent public URL for the uploaded file.
 */
export async function POST(req: Request) {
  const ip = getClientIp(req);

  try {
    rateLimitOrThrow(ip);
  } catch (e: any) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(e?.retryAfter ?? 60) } }
    );
  }

  // Check R2 env vars
  if (
    !process.env.R2_ACCOUNT_ID ||
    !process.env.R2_ACCESS_KEY_ID ||
    !process.env.R2_SECRET_ACCESS_KEY
  ) {
    return NextResponse.json(
      {
        error: "upload_not_configured",
        message:
          "Photo uploads are not yet configured. Please contact us to submit photos by email.",
      },
      { status: 503 }
    );
  }

  let body: { fileName?: string; contentType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { fileName, contentType } = body;

  if (!fileName || typeof fileName !== "string") {
    return NextResponse.json(
      { error: "missing_file_name" },
      { status: 400 }
    );
  }
  if (fileName.length > MAX_FILENAME_LEN) {
    return NextResponse.json(
      { error: "file_name_too_long" },
      { status: 400 }
    );
  }

  if (!contentType || typeof contentType !== "string") {
    return NextResponse.json(
      { error: "missing_content_type" },
      { status: 400 }
    );
  }

  if (!ALLOWED_CONTENT_TYPES.includes(contentType.toLowerCase())) {
    return NextResponse.json(
      {
        error: "invalid_content_type",
        allowed: ALLOWED_CONTENT_TYPES,
      },
      { status: 400 }
    );
  }

  try {
    const key = generateKey("rmgdri-media/dogs/surrender", fileName);
    const uploadUrl = await getUploadUrl(key, {
      contentType,
      expiresIn: 600, // 10 minutes
    });
    const publicUrl = getPublicUrl(key);

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (e: any) {
    console.error("[owner-surrender/upload] R2 error:", e?.message ?? e);
    return NextResponse.json(
      { error: "upload_url_failed", message: "Failed to generate upload URL." },
      { status: 500 }
    );
  }
}
