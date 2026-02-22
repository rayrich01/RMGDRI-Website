import { NextRequest, NextResponse } from "next/server";
import { generateKey, uploadToR2, getPublicUrl } from "@/lib/r2/client";

export const runtime = "nodejs";

/**
 * Anti-abuse: simple in-memory rate limiting.
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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILENAME_LEN = 200;

/**
 * POST /api/forms/owner-surrender/upload
 *
 * Accepts multipart/form-data with a single file field named "file".
 * Uploads the file server-side to R2 (no CORS issues).
 *
 * Returns: { publicUrl: string, key: string }
 */
export async function POST(req: NextRequest) {
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
          "Photo uploads are not yet configured. Please email your photos to adoptadane@rmgreatdane.org.",
      },
      { status: 503 }
    );
  }

  // Parse multipart form data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "invalid_form_data", message: "Expected multipart/form-data with a file." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "missing_file", message: "No file field found in form data." },
      { status: 400 }
    );
  }

  // Validate file name
  if (file.name.length > MAX_FILENAME_LEN) {
    return NextResponse.json({ error: "file_name_too_long" }, { status: 400 });
  }

  // Validate content type
  const ct = file.type.toLowerCase();
  if (!ALLOWED_CONTENT_TYPES.includes(ct)) {
    return NextResponse.json(
      { error: "invalid_content_type", allowed: ALLOWED_CONTENT_TYPES },
      { status: 400 }
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "file_too_large", message: `Max file size is ${MAX_FILE_SIZE / 1024 / 1024} MB.` },
      { status: 400 }
    );
  }

  try {
    const key = generateKey("rmgdri-media/dogs/surrender", file.name);
    const buffer = Buffer.from(await file.arrayBuffer());

    await uploadToR2(key, buffer, { contentType: ct });
    const publicUrl = getPublicUrl(key);

    return NextResponse.json({ publicUrl, key });
  } catch (e: any) {
    console.error("[owner-surrender/upload] R2 error:", e?.message ?? e);
    return NextResponse.json(
      { error: "upload_failed", message: "Failed to upload photo. Please try again or email your photos to adoptadane@rmgreatdane.org." },
      { status: 500 }
    );
  }
}
