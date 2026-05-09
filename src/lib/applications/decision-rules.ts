/**
 * Decision Rules — Deterministic Signal Classification
 * TTP-RMGDRI-DECISION-INTELLIGENCE-001
 *
 * All rules are:
 * - explicit and inspectable
 * - deterministic (same input → same output)
 * - traceable (each signal cites its source)
 *
 * Extend by adding entries to the arrays below.
 */

export interface Signal {
  id: string;
  label: string;
  source: string;
  detail: string;
}

export type RecommendationType =
  | "recommend_approved"
  | "recommend_approved_with_conditions"
  | "denied_with_remediation"
  | "denied";

// ── Trust signals: positive indicators ──

export function extractTrustSignals(
  app: Record<string, unknown>,
  interview: Record<string, unknown> | null,
  homeCheck: Record<string, unknown> | null,
): Signal[] {
  const signals: Signal[] = [];

  // Application-derived
  if (app.experience_with_large_dogs === "breed_specific") {
    signals.push({ id: "T01", label: "Great Dane experience", source: "application", detail: "Applicant has breed-specific experience" });
  }
  if (app.experience_with_large_dogs === "experienced") {
    signals.push({ id: "T02", label: "Large dog experience", source: "application", detail: "Applicant is an experienced large dog owner" });
  }
  if (app.has_yard === true) {
    signals.push({ id: "T03", label: "Has yard", source: "application", detail: "Property includes a yard" });
  }
  if (app.rent_or_own === "own") {
    signals.push({ id: "T04", label: "Homeowner", source: "application", detail: "Applicant owns their home" });
  }

  // Interview-derived
  if (interview) {
    if (interview.assessment && String(interview.assessment).toLowerCase().includes("positive")) {
      signals.push({ id: "T10", label: "Positive interview", source: "interview", detail: String(interview.assessment) });
    }
    if (interview.trust_observations) {
      signals.push({ id: "T11", label: "Trust observations noted", source: "interview", detail: String(interview.trust_observations).slice(0, 200) });
    }
  }

  // Home check-derived
  if (homeCheck) {
    if (homeCheck.assessment && String(homeCheck.assessment).toLowerCase().includes("pass")) {
      signals.push({ id: "T20", label: "Home check passed", source: "home_check", detail: String(homeCheck.assessment) });
    }
    if (homeCheck.yard_fence_gate && !String(homeCheck.yard_fence_gate).toLowerCase().includes("concern")) {
      signals.push({ id: "T21", label: "Yard/fence adequate", source: "home_check", detail: String(homeCheck.yard_fence_gate).slice(0, 200) });
    }
  }

  return signals;
}

// ── Risk signals: concerns requiring evaluation ──

export function extractRiskSignals(
  app: Record<string, unknown>,
  interview: Record<string, unknown> | null,
  homeCheck: Record<string, unknown> | null,
): Signal[] {
  const signals: Signal[] = [];

  if (app.experience_with_large_dogs === "none") {
    signals.push({ id: "R01", label: "No large dog experience", source: "application", detail: "Applicant has no experience with large dogs" });
  }
  if (app.rent_or_own === "rent") {
    signals.push({ id: "R02", label: "Renter", source: "application", detail: "Applicant rents — landlord approval may be needed" });
  }
  if (app.has_yard === false) {
    signals.push({ id: "R03", label: "No yard", source: "application", detail: "Property has no yard — exercise plan needed" });
  }

  if (interview?.contradictions) {
    signals.push({ id: "R10", label: "Interview contradictions", source: "interview", detail: String(interview.contradictions).slice(0, 200) });
  }

  if (homeCheck?.safety_concerns) {
    signals.push({ id: "R20", label: "Safety concerns", source: "home_check", detail: String(homeCheck.safety_concerns).slice(0, 200) });
  }

  return signals;
}

// ── Contradictions: cross-source inconsistencies ──

export function extractContradictions(
  app: Record<string, unknown>,
  interview: Record<string, unknown> | null,
  homeCheck: Record<string, unknown> | null,
): Signal[] {
  const signals: Signal[] = [];

  // Yard claimed in app but not confirmed in home check
  if (app.has_yard === true && homeCheck?.yard_fence_gate &&
      String(homeCheck.yard_fence_gate).toLowerCase().includes("no yard")) {
    signals.push({
      id: "C01", label: "Yard discrepancy",
      source: "application vs home_check",
      detail: "Application claims yard; home check indicates no yard",
    });
  }

  // Interview contradictions field
  if (interview?.contradictions && String(interview.contradictions).trim().length > 0) {
    signals.push({
      id: "C10", label: "Interviewer-noted contradictions",
      source: "interview",
      detail: String(interview.contradictions).slice(0, 300),
    });
  }

  return signals;
}

// ── Denial factors: disqualifying conditions ──

export function extractDenialFactors(
  riskSignals: Signal[],
  contradictions: Signal[],
  homeCheck: Record<string, unknown> | null,
): Signal[] {
  const factors: Signal[] = [];

  if (homeCheck?.assessment && String(homeCheck.assessment).toLowerCase().includes("fail")) {
    factors.push({ id: "D01", label: "Home check failed", source: "home_check", detail: String(homeCheck.assessment) });
  }

  if (contradictions.length >= 3) {
    factors.push({ id: "D02", label: "Multiple contradictions", source: "cross_source", detail: `${contradictions.length} contradictions detected across sources` });
  }

  return factors;
}

// ── Recommendation logic: deterministic, explainable ──

export function suggestRecommendation(
  trustSignals: Signal[],
  riskSignals: Signal[],
  contradictions: Signal[],
  denialFactors: Signal[],
): { recommendation: RecommendationType; confidence: number; rationale: string } {

  // Hard denial
  if (denialFactors.length > 0) {
    return {
      recommendation: "denied",
      confidence: 0.9,
      rationale: `Denial factors present: ${denialFactors.map(d => d.label).join(", ")}`,
    };
  }

  // Significant risk without denial
  if (riskSignals.length >= 3 || contradictions.length >= 2) {
    return {
      recommendation: "denied_with_remediation",
      confidence: 0.7,
      rationale: `${riskSignals.length} risk signals and ${contradictions.length} contradictions — remediation recommended before approval`,
    };
  }

  // Moderate risk
  if (riskSignals.length >= 1) {
    return {
      recommendation: "recommend_approved_with_conditions",
      confidence: 0.65,
      rationale: `${trustSignals.length} trust signals with ${riskSignals.length} risk signal(s) — conditional approval suggested`,
    };
  }

  // Clean
  return {
    recommendation: "recommend_approved",
    confidence: Math.min(0.5 + trustSignals.length * 0.1, 0.95),
    rationale: `${trustSignals.length} trust signals, no risk signals, no contradictions`,
  };
}
