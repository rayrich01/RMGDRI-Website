/**
 * Queue List API — list queue-eligible applicant profiles
 * TTP-RMGDRI-APPLICANT-PROFILING-QUEUE-001
 *
 * GET /api/admin/queue — returns profiles where queue_eligible = true
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("applicant_profiles")
    .select(`
      id,
      application_id,
      profile_summary,
      queue_status,
      queue_priority,
      readiness_tier,
      active_for_matching,
      entered_queue_at,
      generated_at
    `)
    .eq("queue_eligible", true)
    .order("queue_priority", { ascending: false })
    .order("entered_queue_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ queue: data });
}
