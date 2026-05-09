/**
 * Decision Intelligence Engine — Deterministic Synthesis
 * TTP-RMGDRI-DECISION-INTELLIGENCE-001
 *
 * Aggregates application + interview + home check data.
 * Produces structured, explainable, advisory intelligence.
 * Never auto-applies to application_recommendations.
 */
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  extractTrustSignals,
  extractRiskSignals,
  extractContradictions,
  extractDenialFactors,
  suggestRecommendation,
} from "./decision-rules";

export interface DecisionIntelligence {
  application_id: string;
  source: string;
  applicant_summary: string;
  validation_zones: string[];
  trust_signals: { id: string; label: string; source: string; detail: string }[];
  risk_signals: { id: string; label: string; source: string; detail: string }[];
  contradictions: { id: string; label: string; source: string; detail: string }[];
  acceptance_factors: string[];
  risk_factors: string[];
  denial_factors: { id: string; label: string; source: string; detail: string }[];
  recommended_prompts: string[];
  rationale_summary: string;
  suggested_recommendation: string;
  confidence_score: number;
  status_snapshot: string;
  input_snapshot: Record<string, unknown>;
}

export async function generateDecisionIntelligence(
  applicationId: string
): Promise<DecisionIntelligence> {
  const supabase = createAdminSupabaseClient();

  // Fetch application
  const { data: app } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (!app) throw new Error("Application not found");

  const appData = (app.data || {}) as Record<string, unknown>;

  // Fetch latest interview
  const { data: interviews } = await supabase
    .from("application_interviews")
    .select("*")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false })
    .limit(1);

  const interview = interviews?.[0] || null;

  // Fetch latest home check
  const { data: homeChecks } = await supabase
    .from("application_home_checks")
    .select("*")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false })
    .limit(1);

  const homeCheck = homeChecks?.[0] || null;

  // ── Signal extraction ──
  const trustSignals = extractTrustSignals(appData, interview, homeCheck);
  const riskSignals = extractRiskSignals(appData, interview, homeCheck);
  const contradictions = extractContradictions(appData, interview, homeCheck);
  const denialFactors = extractDenialFactors(riskSignals, contradictions, homeCheck);

  // ── Recommendation ──
  const suggestion = suggestRecommendation(trustSignals, riskSignals, contradictions, denialFactors);

  // ── Build summary ──
  const name = appData.full_name || "Unknown applicant";
  const city = appData.city || "";
  const state = appData.state || "";
  const location = [city, state].filter(Boolean).join(", ");
  const experience = appData.experience_with_large_dogs || "not specified";

  const applicantSummary = `${name}${location ? ` from ${location}` : ""}. Large dog experience: ${experience}. Application type: ${app.type}.`;

  // Validation zones: which data sources contributed
  const zones: string[] = ["application"];
  if (interview) zones.push("interview");
  if (homeCheck) zones.push("home_check");

  // Missing input prompts
  const prompts: string[] = [];
  if (!interview) prompts.push("Phone interview has not been completed");
  if (!homeCheck) prompts.push("Home check has not been completed");
  if (riskSignals.length > 0 && !interview) prompts.push("Interview recommended to clarify risk signals");

  return {
    application_id: applicationId,
    source: "deterministic_engine",
    applicant_summary: applicantSummary,
    validation_zones: zones,
    trust_signals: trustSignals,
    risk_signals: riskSignals,
    contradictions,
    acceptance_factors: trustSignals.map(s => s.label),
    risk_factors: riskSignals.map(s => s.label),
    denial_factors: denialFactors,
    recommended_prompts: prompts,
    rationale_summary: suggestion.rationale,
    suggested_recommendation: suggestion.recommendation,
    confidence_score: suggestion.confidence,
    status_snapshot: app.status,
    input_snapshot: {
      application: appData,
      interview: interview ? { interviewer: interview.interviewer, assessment: interview.assessment, date: interview.interview_date } : null,
      home_check: homeCheck ? { checker: homeCheck.home_checker, assessment: homeCheck.assessment, date: homeCheck.check_date } : null,
    },
  };
}
