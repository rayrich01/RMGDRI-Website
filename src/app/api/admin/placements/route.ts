/**
 * Placements API — create from match candidate + list
 * TTP-RMGDRI-PLACEMENT-GOVERNANCE-EXECUTION-001
 *
 * POST /api/admin/placements — Create placement from match candidate
 * GET  /api/admin/placements — List placements
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { logApplicationEvent } from "@/lib/applications/event-logger";
import { checkBehavioralAddendum, checkMedicalAddendum } from "@/lib/applications/bite-policy";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient();
  const body = await request.json();
  const matchCandidateId = body.match_candidate_id;

  if (!matchCandidateId) {
    return NextResponse.json({ error: "match_candidate_id required" }, { status: 400 });
  }

  // Fetch match candidate with related data
  const { data: match } = await supabase
    .from("match_candidates")
    .select("*, applicant_profile_id, dane_profile_id")
    .eq("id", matchCandidateId)
    .single();

  if (!match) {
    return NextResponse.json({ error: "Match candidate not found" }, { status: 404 });
  }

  // Fetch profiles for snapshot
  const { data: applicantProfile } = await supabase
    .from("applicant_profiles")
    .select("*, application_id")
    .eq("id", match.applicant_profile_id)
    .single();

  const { data: daneProfile } = await supabase
    .from("dane_profiles")
    .select("*")
    .eq("id", match.dane_profile_id)
    .single();

  if (!applicantProfile || !daneProfile) {
    return NextResponse.json({ error: "Applicant or Dane profile not found" }, { status: 404 });
  }

  // Determine agreement requirements using governed policy rules
  const behaviorData = (daneProfile.behavior_profile || {}) as Record<string, unknown>;
  const medicalData = (daneProfile.medical_profile || {}) as Record<string, unknown>;

  const behavioralCheck = checkBehavioralAddendum({
    has_bite_history: behaviorData.has_bite_history === true,
    is_reactive: behaviorData.is_reactive === true,
    must_be_only_dog: behaviorData.must_be_only_dog === true,
    requires_training: behaviorData.requires_training === true,
    eats_non_edible: behaviorData.eats_non_edible === true,
  });

  const medicalCheck = checkMedicalAddendum({
    has_heart_condition: medicalData.has_heart_condition === true,
    has_wobblers: medicalData.has_wobblers === true,
    has_structural_issues: medicalData.has_structural_issues === true,
    has_ongoing_treatment: medicalData.has_ongoing_treatment === true,
    has_lifelong_medication: medicalData.has_lifelong_medication === true,
  });

  const needsBehavioral = behavioralCheck.required;
  const needsMedical = medicalCheck.required;

  // Build immutable snapshot
  const snapshot = {
    applicant_profile: applicantProfile,
    dane_profile: daneProfile,
    match_candidate: match,
    behavioral_addendum: behavioralCheck,
    medical_addendum: medicalCheck,
    captured_at: new Date().toISOString(),
  };

  // Create placement
  const { data: placement, error } = await supabase
    .from("placements")
    .insert({
      applicant_profile_id: match.applicant_profile_id,
      dane_profile_id: match.dane_profile_id,
      match_candidate_id: matchCandidateId,
      placement_status: "proposed",
      adoption_agreement_status: "pending",
      behavioral_addendum_status: needsBehavioral ? "pending" : "not_required",
      medical_addendum_status: needsMedical ? "pending" : "not_required",
      notes: body.notes || null,
      placement_snapshot: snapshot,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // match_candidates are NEVER mutated during placement creation.
  // Placements are the sole lifecycle entity for placement execution.
  // Linkage is via placements.match_candidate_id only.

  // Log event
  logApplicationEvent({
    applicationId: applicantProfile.application_id,
    eventType: "application_section_saved",
    actorType: "admin",
    metadata: {
      action: "placement_created",
      placement_id: placement.id,
      dane_name: daneProfile.name,
      match_candidate_id: matchCandidateId,
    },
  });

  return NextResponse.json({ placement }, { status: 201 });
}

export async function GET() {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("placements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ placements: data });
}
