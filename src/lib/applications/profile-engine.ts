/**
 * Applicant Profile Synthesis Engine
 * TTP-RMGDRI-APPLICANT-PROFILING-QUEUE-001
 *
 * Deterministic. No dog-specific logic. No matching assumptions.
 * Aggregates application + interview + home check + recommendation
 * into normalized profile dimensions with queue eligibility.
 */
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

type Json = Record<string, unknown>;

export interface ApplicantProfile {
  application_id: string;
  profile_status: string;
  queue_eligible: boolean;
  queue_status: string;
  entered_queue_at: string | null;
  queue_priority: number;
  active_for_matching: boolean;
  profile_summary: string;
  household_profile: Json;
  environment_profile: Json;
  experience_profile: Json;
  lifestyle_profile: Json;
  dog_preference_profile: Json;
  constraints_profile: Json;
  conditions_profile: Json;
  strengths_profile: Json;
  risk_summary: Json;
  readiness_tier: string;
  readiness_notes: string;
  source_snapshot: Json;
}

export async function generateApplicantProfile(
  applicationId: string
): Promise<ApplicantProfile> {
  const supabase = createAdminSupabaseClient();

  // ── Fetch all inputs ──
  const { data: app } = await supabase
    .from("applications").select("*").eq("id", applicationId).single();
  if (!app) throw new Error("Application not found");

  const appData = (app.data || {}) as Json;

  const { data: interviews } = await supabase
    .from("application_interviews").select("*")
    .eq("application_id", applicationId).order("created_at", { ascending: false }).limit(1);
  const interview = interviews?.[0] || null;

  const { data: homeChecks } = await supabase
    .from("application_home_checks").select("*")
    .eq("application_id", applicationId).order("created_at", { ascending: false }).limit(1);
  const homeCheck = homeChecks?.[0] || null;

  const { data: recs } = await supabase
    .from("application_recommendations").select("*")
    .eq("application_id", applicationId).order("created_at", { ascending: false }).limit(1);
  const recommendation = recs?.[0] || null;

  const { data: intels } = await supabase
    .from("application_decision_intelligence").select("trust_signals, risk_signals, contradictions")
    .eq("application_id", applicationId).order("generated_at", { ascending: false }).limit(1);
  const intelligence = intels?.[0] || null;

  // ── Profile dimensions ──
  const household: Json = {
    size: appData.household_size ?? null,
    home_type: appData.home_type ?? null,
    rent_or_own: appData.rent_or_own ?? null,
    context: homeCheck?.household_context ?? null,
  };

  const environment: Json = {
    has_yard: appData.has_yard ?? null,
    yard_fence_gate: homeCheck?.yard_fence_gate ?? null,
    environment_validation: homeCheck?.environment_validation ?? null,
    safety_concerns: homeCheck?.safety_concerns ?? null,
  };

  const experience: Json = {
    large_dog_experience: appData.experience_with_large_dogs ?? null,
    other_pets: appData.has_other_pets ?? null,
    other_pets_details: appData.other_pets_details ?? null,
    interview_assessment: interview?.assessment ?? null,
  };

  const lifestyle: Json = {
    activity_level: appData.activity_level ?? null,
    household_size: appData.household_size ?? null,
    city: appData.city ?? null,
    state: appData.state ?? null,
  };

  const preferences: Json = {
    preferred_age: appData.preferred_age ?? null,
    preferred_gender: appData.preferred_gender ?? null,
    activity_level: appData.activity_level ?? null,
    additional_notes: appData.additional_notes ?? null,
  };

  const constraints: Json = {
    conditions: recommendation?.conditions ?? null,
    rent_requires_approval: appData.rent_or_own === "rent",
    no_yard: appData.has_yard === false,
  };

  const conditions: Json = {
    recommendation_conditions: recommendation?.conditions ?? null,
    recommendation_type: recommendation?.recommendation ?? null,
  };

  // Strengths from trust signals
  const trustSignals = (intelligence?.trust_signals as unknown[]) || [];
  const strengths: Json = {
    trust_signal_count: trustSignals.length,
    signals: trustSignals,
  };

  // Risks from risk signals + contradictions
  const riskSignals = (intelligence?.risk_signals as unknown[]) || [];
  const contradictions = (intelligence?.contradictions as unknown[]) || [];
  const risks: Json = {
    risk_signal_count: riskSignals.length,
    contradiction_count: contradictions.length,
    signals: riskSignals,
    contradictions,
  };

  // ── Queue eligibility ──
  const { eligible, tier, tierNotes } = determineQueueEligibility(
    app.status, recommendation, riskSignals.length, contradictions.length,
    !!interview, !!homeCheck
  );

  // ── Summary ──
  const name = appData.full_name || "Unknown";
  const loc = [appData.city, appData.state].filter(Boolean).join(", ");
  const profileSummary = `${name}${loc ? ` (${loc})` : ""}. ${app.type} applicant. ` +
    `Experience: ${appData.experience_with_large_dogs || "not specified"}. ` +
    `Readiness: ${tier}. Queue: ${eligible ? "eligible" : "not eligible"}.`;

  return {
    application_id: applicationId,
    profile_status: "generated",
    queue_eligible: eligible,
    queue_status: eligible ? "ready" : "not_eligible",
    entered_queue_at: eligible ? new Date().toISOString() : null,
    queue_priority: 0,
    active_for_matching: false,
    profile_summary: profileSummary,
    household_profile: household,
    environment_profile: environment,
    experience_profile: experience,
    lifestyle_profile: lifestyle,
    dog_preference_profile: preferences,
    constraints_profile: constraints,
    conditions_profile: conditions,
    strengths_profile: strengths,
    risk_summary: risks,
    readiness_tier: tier,
    readiness_notes: tierNotes,
    source_snapshot: {
      app_status: app.status,
      has_interview: !!interview,
      has_home_check: !!homeCheck,
      has_recommendation: !!recommendation,
      recommendation_type: recommendation?.recommendation ?? null,
      has_intelligence: !!intelligence,
    },
  };
}

// ── Queue eligibility: deterministic, explainable ──

function determineQueueEligibility(
  appStatus: string,
  recommendation: { recommendation: string; conditions?: string } | null,
  riskCount: number,
  contradictionCount: number,
  hasInterview: boolean,
  hasHomeCheck: boolean,
): { eligible: boolean; tier: string; tierNotes: string } {

  // Must be decisioned
  if (appStatus !== "decisioned") {
    return {
      eligible: false,
      tier: "not_queue_eligible",
      tierNotes: `Application status is '${appStatus}', not 'decisioned'`,
    };
  }

  // Must have a recommendation
  if (!recommendation) {
    return {
      eligible: false,
      tier: "not_queue_eligible",
      tierNotes: "No recommendation on record",
    };
  }

  const rec = recommendation.recommendation;

  // Denied = not eligible
  if (rec === "denied" || rec === "denied_with_remediation") {
    return {
      eligible: false,
      tier: "not_queue_eligible",
      tierNotes: `Recommendation is '${rec}'`,
    };
  }

  // Approved with conditions
  if (rec === "recommend_approved_with_conditions") {
    return {
      eligible: true,
      tier: "tier_2_ready_with_conditions",
      tierNotes: `Approved with conditions: ${recommendation.conditions || "see recommendation"}`,
    };
  }

  // Clean approved — check data completeness
  if (rec === "recommend_approved") {
    if (!hasInterview || !hasHomeCheck) {
      return {
        eligible: true,
        tier: "tier_3_hold",
        tierNotes: `Approved but missing: ${!hasInterview ? "interview" : ""}${!hasInterview && !hasHomeCheck ? " + " : ""}${!hasHomeCheck ? "home check" : ""}`,
      };
    }

    if (riskCount > 0 || contradictionCount > 0) {
      return {
        eligible: true,
        tier: "tier_2_ready_with_conditions",
        tierNotes: `Approved but ${riskCount} risk signal(s) and ${contradictionCount} contradiction(s) remain`,
      };
    }

    return {
      eligible: true,
      tier: "tier_1_ready",
      tierNotes: "Fully approved, complete data, no outstanding risks",
    };
  }

  return {
    eligible: false,
    tier: "not_queue_eligible",
    tierNotes: `Unknown recommendation type: '${rec}'`,
  };
}
