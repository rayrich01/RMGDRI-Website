/**
 * Placement Readiness Gate
 * TTP-RMGDRI-PLACEMENT-GOVERNANCE-EXECUTION-001
 *
 * Validates all prerequisites before placement can be approved.
 * Returns explicit pass/fail with reasons.
 */
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface ReadinessCheck {
  check: string;
  passed: boolean;
  reason: string;
}

export interface ReadinessResult {
  ready: boolean;
  checks: ReadinessCheck[];
}

export async function validatePlacementReadiness(
  applicationId: string,
  matchCandidateId: string,
): Promise<ReadinessResult> {
  const supabase = createAdminSupabaseClient();
  const checks: ReadinessCheck[] = [];

  // 1. Applicant profile exists with eligible readiness tier
  const { data: profile } = await supabase
    .from("applicant_profiles")
    .select("readiness_tier, queue_eligible")
    .eq("application_id", applicationId)
    .single();

  if (!profile) {
    checks.push({ check: "applicant_profile", passed: false, reason: "No applicant profile found" });
  } else if (!profile.queue_eligible) {
    checks.push({ check: "queue_eligible", passed: false, reason: "Applicant is not queue-eligible" });
  } else if (profile.readiness_tier === "not_queue_eligible" || profile.readiness_tier === "tier_3_hold") {
    checks.push({ check: "readiness_tier", passed: false, reason: `Readiness tier is '${profile.readiness_tier}' — must be tier_1 or tier_2` });
  } else {
    checks.push({ check: "readiness_tier", passed: true, reason: `Readiness tier: ${profile.readiness_tier}` });
  }

  // 2. No unresolved hard stops on match candidate
  const { data: match } = await supabase
    .from("match_candidates")
    .select("hard_stops, suggested_disposition")
    .eq("id", matchCandidateId)
    .single();

  if (!match) {
    checks.push({ check: "match_candidate", passed: false, reason: "Match candidate not found" });
  } else {
    const hardStops = (match.hard_stops as unknown[]) || [];
    if (hardStops.length > 0) {
      checks.push({ check: "hard_stops", passed: false, reason: `${hardStops.length} unresolved hard stop(s)` });
    } else {
      checks.push({ check: "hard_stops", passed: true, reason: "No hard stops" });
    }
  }

  // 3. Interview exists
  const { count: interviewCount } = await supabase
    .from("application_interviews")
    .select("id", { count: "exact", head: true })
    .eq("application_id", applicationId);

  if (!interviewCount || interviewCount === 0) {
    checks.push({ check: "interview", passed: false, reason: "No interview on record" });
  } else {
    checks.push({ check: "interview", passed: true, reason: `${interviewCount} interview(s) on record` });
  }

  // 4. Home check exists
  const { count: homeCheckCount } = await supabase
    .from("application_home_checks")
    .select("id", { count: "exact", head: true })
    .eq("application_id", applicationId);

  if (!homeCheckCount || homeCheckCount === 0) {
    checks.push({ check: "home_check", passed: false, reason: "No home check on record" });
  } else {
    checks.push({ check: "home_check", passed: true, reason: `${homeCheckCount} home check(s) on record` });
  }

  // 5. Recommendation exists and is approved type
  const { data: rec } = await supabase
    .from("application_recommendations")
    .select("recommendation")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!rec) {
    checks.push({ check: "recommendation", passed: false, reason: "No recommendation on record" });
  } else if (rec.recommendation === "denied" || rec.recommendation === "denied_with_remediation") {
    checks.push({ check: "recommendation", passed: false, reason: `Recommendation is '${rec.recommendation}'` });
  } else {
    checks.push({ check: "recommendation", passed: true, reason: `Recommendation: ${rec.recommendation}` });
  }

  const ready = checks.every(c => c.passed);
  return { ready, checks };
}
