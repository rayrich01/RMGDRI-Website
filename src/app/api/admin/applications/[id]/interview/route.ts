/**
 * Interview CRUD API
 * TTP-RMGDRI-SCREENING-VALIDATION-001
 *
 * GET  /api/admin/applications/[id]/interview — list interviews
 * POST /api/admin/applications/[id]/interview — create interview record
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
    .from("application_interviews")
    .select("*")
    .eq("application_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ interviews: data });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("application_interviews")
    .insert({
      application_id: id,
      interviewer: body.interviewer || "Unknown",
      interview_date: body.interview_date || null,
      notes: body.notes || null,
      trust_observations: body.trust_observations || null,
      clarifications: body.clarifications || null,
      contradictions: body.contradictions || null,
      assessment: body.assessment || null,
      validation_dimensions: body.validation_dimensions || {},
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
    metadata: { action: "interview_recorded", interviewer: body.interviewer },
  });

  return NextResponse.json({ interview: data }, { status: 201 });
}
