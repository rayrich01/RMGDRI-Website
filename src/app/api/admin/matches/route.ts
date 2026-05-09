/**
 * Match Candidates API
 * TTP-RMGDRI-MATCHING-SYSTEM-001
 *
 * POST /api/admin/matches — Generate match candidates for an applicant against all active danes
 * GET  /api/admin/matches?applicant_profile_id=X — List match candidates
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { evaluateCompatibility } from "@/lib/matching/compatibility-engine";
import { logApplicationEvent } from "@/lib/applications/event-logger";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient();
  const body = await request.json();
  const applicantProfileId = body.applicant_profile_id;

  if (!applicantProfileId) {
    return NextResponse.json({ error: "applicant_profile_id required" }, { status: 400 });
  }

  // Fetch applicant profile
  const { data: profile } = await supabase
    .from("applicant_profiles")
    .select("*")
    .eq("id", applicantProfileId)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Applicant profile not found" }, { status: 404 });
  }

  if (!profile.queue_eligible || !profile.active_for_matching) {
    return NextResponse.json({ error: "Applicant not eligible or not active for matching" }, { status: 400 });
  }

  // Fetch all active danes
  const { data: danes } = await supabase
    .from("dane_profiles")
    .select("*")
    .eq("active_for_matching", true);

  if (!danes || danes.length === 0) {
    return NextResponse.json({ error: "No active danes available for matching" }, { status: 404 });
  }

  // Generate candidates
  const candidates = [];
  for (const dane of danes) {
    const result = evaluateCompatibility(
      {
        household_profile: profile.household_profile,
        environment_profile: profile.environment_profile,
        experience_profile: profile.experience_profile,
        lifestyle_profile: profile.lifestyle_profile,
        dog_preference_profile: profile.dog_preference_profile,
        constraints_profile: profile.constraints_profile,
      },
      {
        name: dane.name,
        age: dane.age,
        sex: dane.sex,
        size: dane.size,
        energy_level: dane.energy_level,
        environment_needs: dane.environment_needs,
        household_fit: dane.household_fit,
        constraints: dane.constraints,
        behavior_profile: dane.behavior_profile,
        training_profile: dane.training_profile,
      },
    );

    // Upsert candidate (unique pair constraint)
    const { data: candidate, error } = await supabase
      .from("match_candidates")
      .upsert({
        applicant_profile_id: applicantProfileId,
        dane_profile_id: dane.id,
        compatibility_summary: result.compatibility_summary,
        fit_strengths: result.fit_strengths,
        fit_cautions: result.fit_cautions,
        hard_stops: result.hard_stops,
        missing_information: result.missing_information,
        suggested_disposition: result.suggested_disposition,
        candidate_status: "generated",
      }, { onConflict: "applicant_profile_id,dane_profile_id" })
      .select()
      .single();

    if (!error && candidate) candidates.push(candidate);
  }

  logApplicationEvent({
    applicationId: profile.application_id,
    eventType: "application_section_saved",
    actorType: "system",
    metadata: {
      action: "match_candidates_generated",
      count: candidates.length,
      applicant_profile_id: applicantProfileId,
    },
  });

  return NextResponse.json({ candidates }, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const applicantProfileId = searchParams.get("applicant_profile_id");
  const daneProfileId = searchParams.get("dane_profile_id");

  const supabase = createAdminSupabaseClient();
  let query = supabase.from("match_candidates").select("*");

  if (applicantProfileId) query = query.eq("applicant_profile_id", applicantProfileId);
  if (daneProfileId) query = query.eq("dane_profile_id", daneProfileId);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ candidates: data });
}
