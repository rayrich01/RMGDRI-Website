/**
 * Placement Detail API — state transitions + agreement tracking
 * TTP-RMGDRI-PLACEMENT-GOVERNANCE-EXECUTION-001
 *
 * GET   /api/admin/placements/[id] — get placement
 * PATCH /api/admin/placements/[id] — advance state / update agreements
 *
 * Every transition is explicit and human-driven.
 * No auto-advancement. No auto-agreement-trigger before approval.
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { validatePlacementReadiness } from "@/lib/matching/placement-readiness";
import { logApplicationEvent } from "@/lib/applications/event-logger";

const VALID_STATUSES = [
  "proposed", "under_review", "approved", "agreement_pending",
  "agreement_signed", "ready_for_transfer", "completed", "cancelled",
];

const AGREEMENT_STATUSES = ["not_required", "pending", "sent", "signed"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("placements")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Placement not found" }, { status: 404 });
  }

  return NextResponse.json({ placement: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  // Fetch current placement
  const { data: current } = await supabase
    .from("placements")
    .select("*, applicant_profile_id, match_candidate_id")
    .eq("id", id)
    .single();

  if (!current) {
    return NextResponse.json({ error: "Placement not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};
  const events: { action: string; metadata: Record<string, unknown> }[] = [];

  // Status transition
  if (body.placement_status && body.placement_status !== current.placement_status) {
    const newStatus = body.placement_status;

    if (!VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json({ error: "Invalid placement status" }, { status: 400 });
    }

    // Readiness gate for approval
    if (newStatus === "approved" && current.placement_status !== "approved") {
      // Fetch application_id from applicant profile
      const { data: profile } = await supabase
        .from("applicant_profiles")
        .select("application_id")
        .eq("id", current.applicant_profile_id)
        .single();

      if (profile) {
        const readiness = await validatePlacementReadiness(
          profile.application_id,
          current.match_candidate_id,
        );

        if (!readiness.ready) {
          const failures = readiness.checks.filter(c => !c.passed);
          return NextResponse.json({
            error: "Placement readiness gate failed",
            checks: readiness.checks,
            failures: failures.map(f => f.reason),
          }, { status: 422 });
        }
      }

      updates.approved_by = body.approved_by || "admin";
      updates.approved_at = new Date().toISOString();
    }

    // Agreement columns only writable at/after approved
    if (newStatus === "agreement_pending" && current.placement_status !== "approved") {
      if (current.placement_status !== "approved") {
        return NextResponse.json({ error: "Cannot move to agreement_pending before approval" }, { status: 400 });
      }
    }

    // Cancellation
    if (newStatus === "cancelled") {
      updates.cancelled_at = new Date().toISOString();
      updates.cancellation_reason = body.cancellation_reason || null;
    }

    // Completion
    if (newStatus === "completed") {
      updates.completed_at = new Date().toISOString();
    }

    // Ready for transfer
    if (newStatus === "ready_for_transfer") {
      updates.ready_for_transfer_at = new Date().toISOString();
    }

    updates.placement_status = newStatus;
    events.push({
      action: `placement_status_${newStatus}`,
      metadata: { from: current.placement_status, to: newStatus },
    });
  }

  // Agreement status updates (only if placement is approved or later)
  const approvedOrLater = ["approved", "agreement_pending", "agreement_signed", "ready_for_transfer", "completed"];
  const canUpdateAgreements = approvedOrLater.includes(
    (updates.placement_status as string) || current.placement_status
  );

  for (const field of ["adoption_agreement_status", "behavioral_addendum_status", "medical_addendum_status"] as const) {
    if (body[field] !== undefined) {
      if (!canUpdateAgreements) {
        return NextResponse.json({ error: `Cannot update ${field} before placement is approved` }, { status: 400 });
      }
      if (!AGREEMENT_STATUSES.includes(body[field])) {
        return NextResponse.json({ error: `Invalid ${field} value` }, { status: 400 });
      }
      updates[field] = body[field];

      if (body[field] === "sent" && !current.agreement_sent_at) {
        updates.agreement_sent_at = new Date().toISOString();
      }
      if (body[field] === "signed") {
        updates.agreement_signed_at = new Date().toISOString();
      }

      events.push({
        action: `agreement_${body[field]}`,
        metadata: { agreement_type: field, status: body[field] },
      });
    }
  }

  // Notes
  if (body.notes !== undefined) {
    updates.notes = body.notes;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("placements")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log events
  const { data: profile } = await supabase
    .from("applicant_profiles")
    .select("application_id")
    .eq("id", current.applicant_profile_id)
    .single();

  for (const evt of events) {
    logApplicationEvent({
      applicationId: profile?.application_id || null,
      eventType: "application_section_saved",
      actorType: "admin",
      metadata: { ...evt.metadata, placement_id: id },
    });
  }

  return NextResponse.json({ placement: data });
}
