import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ReviewLogEntry {
  action: string;
  note?: string;
  by: string;
  at: string;
}

/**
 * POST /api/admin/review/[id]
 *
 * Updates review fields on an application:
 * - status change (with timestamp)
 * - assessment text
 * - clarification request
 * - reviewer notes
 * - add comment to activity log
 *
 * All changes are logged in the review_log JSONB array.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const supabase = createAdminSupabaseClient();

  // Fetch current state
  const { data: current, error: fetchErr } = await supabase
    .from("applications")
    .select("status, internal_flags")
    .eq("id", id)
    .single();

  if (fetchErr || !current) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const flags = (current.internal_flags ?? {}) as Record<string, unknown>;
  const existingLog = (flags.review_log ?? []) as ReviewLogEntry[];
  const now = new Date().toISOString();
  const newLog = [...existingLog];

  const updates: Record<string, unknown> = {};

  // Status change
  if (body.status && body.status !== current.status) {
    updates.status = body.status;
    newLog.push({
      action: `Status changed: ${current.status} → ${body.status}`,
      by: "admin",
      at: now,
    });
    // Processing timestamps
    if (body.status === "reviewing") {
      flags.reviewed_at = now;
    } else if (body.status === "approved" || body.status === "rejected") {
      flags.assessed_at = now;
    }
    flags.status_changed_at = now;
  }

  // Assessment
  if (body.assessment !== undefined) {
    flags.assessment = body.assessment;
    if (body.assessment && body.assessment !== flags._prev_assessment) {
      newLog.push({ action: "Assessment updated", note: body.assessment.slice(0, 100), by: "admin", at: now });
      flags._prev_assessment = body.assessment;
    }
  }

  // Clarification
  if (body.clarification !== undefined) {
    flags.clarification_requested = body.clarification;
    if (body.clarification && body.clarification !== flags._prev_clarification) {
      newLog.push({ action: "Clarification requested", note: body.clarification.slice(0, 100), by: "admin", at: now });
      flags._prev_clarification = body.clarification;
    }
  }

  // Reviewer notes
  if (body.notes !== undefined) {
    flags.reviewer_notes = body.notes;
  }

  // Comment
  if (body.comment) {
    newLog.push({ action: "Comment", note: body.comment, by: "admin", at: now });
  }

  flags.review_log = newLog;
  updates.internal_flags = flags;

  const { error: updateErr } = await supabase
    .from("applications")
    .update(updates)
    .eq("id", id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, log: newLog });
}
