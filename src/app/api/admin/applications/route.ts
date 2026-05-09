/**
 * Admin Applications API — lists ONLY submitted applications
 * TTP-RMGDRI-APPLICATION-INGEST-001
 *
 * Drafts are NEVER visible to admin.
 * Uses service role to bypass RLS.
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("applications")
    .select("id, user_id, type, status, data, submitted_at, created_at")
    .eq("status", "submitted")
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ applications: data });
}
