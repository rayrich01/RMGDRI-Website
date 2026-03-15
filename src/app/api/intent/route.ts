import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLUG = "default";

function authorize(req: NextRequest): boolean {
  const header = req.headers.get("x-admin-passphrase") ?? "";
  const expected = (process.env.ADMIN_PASSPHRASE ?? "").trim();
  return !!expected && header.trim() === expected;
}

/**
 * GET /api/intent — fetch the current intent profile
 */
export async function GET(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("intent_profile")
    .select("data, updated_at")
    .eq("slug", SLUG)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data?.data ?? {}, updated_at: data?.updated_at ?? null });
}

/**
 * POST /api/intent — upsert the intent profile
 */
export async function POST(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body must be a JSON object" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("intent_profile")
    .upsert(
      { slug: SLUG, data: body, updated_at: new Date().toISOString() },
      { onConflict: "slug" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
