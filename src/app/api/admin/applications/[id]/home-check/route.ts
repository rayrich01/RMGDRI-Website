/**
 * Home Check CRUD API
 * TTP-RMGDRI-SCREENING-VALIDATION-001
 *
 * GET  /api/admin/applications/[id]/home-check — list home checks
 * POST /api/admin/applications/[id]/home-check — create home check record
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { logApplicationEvent } from "@/lib/applications/event-logger";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("application_home_checks")
    .select("*")
    .eq("application_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ home_checks: data });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("application_home_checks")
    .insert({
      application_id: id,
      home_checker: body.home_checker || "Unknown",
      check_date: body.check_date || null,
      observations: body.observations || null,
      environment_validation: body.environment_validation || null,
      yard_fence_gate: body.yard_fence_gate || null,
      household_context: body.household_context || null,
      safety_concerns: body.safety_concerns || null,
      assessment: body.assessment || null,
      check_data: body.check_data || {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  logApplicationEvent({
    applicationId: id,
    eventType: "application_section_saved",
    actorType: "admin",
    metadata: { action: "home_check_recorded", checker: body.home_checker },
  });

  return NextResponse.json({ home_check: data }, { status: 201 });
}
