/**
 * Application Submission API
 * TTP-RMGDRI-APPLICATION-INGEST-001
 *
 * POST /api/applications/[id]/submit — Transition draft → submitted
 */
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { onApplicationSubmitted } from "@/lib/hooks/application-hooks";
import { logApplicationEvent } from "@/lib/applications/event-logger";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Transition: draft → submitted
  const { data, error } = await supabase
    .from("applications")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "draft")
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Application not found or already submitted" },
      { status: 404 }
    );
  }

  // Log state transition (non-blocking)
  logApplicationEvent({
    applicationId: id,
    eventType: "application_submitted",
    actorId: user.id,
    metadata: { from_status: "draft", to_status: "submitted", type: data.type },
  });

  // Fire hook stubs (non-blocking)
  await onApplicationSubmitted(data);

  return NextResponse.json({ application: data });
}
