/**
 * Applicant Profile API
 * TTP-RMGDRI-APPLICANT-PROFILING-QUEUE-001
 *
 * POST  — Generate/regenerate profile
 * GET   — Get current profile
 * PATCH — Update queue state/notes
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { generateApplicantProfile } from "@/lib/applications/profile-engine";
import { logApplicationEvent } from "@/lib/applications/event-logger";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const profile = await generateApplicantProfile(id);
    const supabase = createAdminSupabaseClient();

    // Upsert: replace existing profile for this application
    const { data: existing } = await supabase
      .from("applicant_profiles")
      .select("id")
      .eq("application_id", id)
      .single();

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from("applicant_profiles")
        .update({ ...profile, generated_at: new Date().toISOString() })
        .eq("application_id", id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      result = data;

      logApplicationEvent({
        applicationId: id,
        eventType: "application_section_saved",
        actorType: "system",
        metadata: { action: "applicant_profile_refreshed", tier: profile.readiness_tier },
      });
    } else {
      const { data, error } = await supabase
        .from("applicant_profiles")
        .insert(profile)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      result = data;

      logApplicationEvent({
        applicationId: id,
        eventType: "application_section_saved",
        actorType: "system",
        metadata: {
          action: "applicant_profile_generated",
          tier: profile.readiness_tier,
          queue_eligible: profile.queue_eligible,
        },
      });

      if (profile.queue_eligible) {
        logApplicationEvent({
          applicationId: id,
          eventType: "application_section_saved",
          actorType: "system",
          metadata: { action: "applicant_queue_entered", queue_status: profile.queue_status },
        });
      }
    }

    return NextResponse.json({ profile: result }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Profile generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("applicant_profiles")
    .select("*")
    .eq("application_id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ profile: null });
  }

  return NextResponse.json({ profile: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  const allowed = ["queue_status", "queue_notes", "queue_priority", "active_for_matching"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid updates" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("applicant_profiles")
    .update(updates)
    .eq("application_id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Not found" }, { status: 500 });
  }

  logApplicationEvent({
    applicationId: id,
    eventType: "application_section_saved",
    actorType: "admin",
    metadata: { action: "applicant_queue_updated", updates },
  });

  return NextResponse.json({ profile: data });
}
