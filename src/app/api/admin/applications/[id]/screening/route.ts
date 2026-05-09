/**
 * Screener Assignment + Status Transition API
 * TTP-RMGDRI-SCREENING-VALIDATION-001
 *
 * PATCH /api/admin/applications/[id]/screening
 * - Assign screener
 * - Update application status
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { logApplicationEvent } from "@/lib/applications/event-logger";

// WORKFLOW STATES ONLY — outcomes live in application_recommendations
const VALID_STATUSES = [
  "submitted",
  "screening",
  "interview_complete",
  "home_check_complete",
  "decision_pending",
  "decisioned",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  const updates: Record<string, unknown> = {};

  if (body.assigned_screener !== undefined) {
    updates.assigned_screener = body.assigned_screener;
    updates.assigned_at = new Date().toISOString();
  }

  if (body.status) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updates.status = body.status;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("applications")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Not found" }, { status: 500 });
  }

  // Log events
  if (body.assigned_screener !== undefined) {
    logApplicationEvent({
      applicationId: id,
      eventType: "application_section_saved",
      actorType: "admin",
      metadata: { action: "screener_assigned", screener: body.assigned_screener },
    });
  }

  if (body.status) {
    logApplicationEvent({
      applicationId: id,
      eventType: "application_submitted",
      actorType: "admin",
      metadata: { action: "status_changed", to_status: body.status },
    });
  }

  return NextResponse.json({ application: data });
}
