/**
 * Compatibility Engine — Deterministic Matching
 * TTP-RMGDRI-MATCHING-SYSTEM-001
 *
 * Compares applicant profile dimensions against dane profile dimensions.
 * Produces: strengths, cautions, hard stops, missing info.
 * No scoring. No ranking. No auto-placement.
 */

type Json = Record<string, unknown>;

export interface CompatibilitySignal {
  dimension: string;
  label: string;
  detail: string;
}

export type Disposition =
  | "strong_candidate"
  | "candidate_with_cautions"
  | "hold_needs_review"
  | "not_recommended"
  | "insufficient_data";

export interface CompatibilityResult {
  compatibility_summary: string;
  fit_strengths: CompatibilitySignal[];
  fit_cautions: CompatibilitySignal[];
  hard_stops: CompatibilitySignal[];
  missing_information: CompatibilitySignal[];
  suggested_disposition: Disposition;
}

export function evaluateCompatibility(
  applicant: {
    household_profile: Json;
    environment_profile: Json;
    experience_profile: Json;
    lifestyle_profile: Json;
    dog_preference_profile: Json;
    constraints_profile: Json;
  },
  dane: {
    name: string;
    age: string | null;
    sex: string | null;
    size: string | null;
    energy_level: string | null;
    environment_needs: Json;
    household_fit: Json;
    constraints: Json;
    behavior_profile: Json;
    training_profile: Json;
  },
): CompatibilityResult {
  const strengths: CompatibilitySignal[] = [];
  const cautions: CompatibilitySignal[] = [];
  const hardStops: CompatibilitySignal[] = [];
  const missing: CompatibilitySignal[] = [];

  // ── Household compatibility ──
  evaluateHousehold(applicant.household_profile, dane.household_fit, strengths, cautions, hardStops, missing);

  // ── Environment compatibility ──
  evaluateEnvironment(applicant.environment_profile, dane.environment_needs, strengths, cautions, hardStops, missing);

  // ── Experience compatibility ──
  evaluateExperience(applicant.experience_profile, dane.behavior_profile, dane.training_profile, strengths, cautions, missing);

  // ── Lifestyle / Energy ──
  evaluateLifestyle(applicant.lifestyle_profile, dane.energy_level, strengths, cautions, missing);

  // ── Preference alignment ──
  evaluatePreferences(applicant.dog_preference_profile, dane, strengths, cautions);

  // ── Constraint conflicts ──
  evaluateConstraints(applicant.constraints_profile, dane.constraints, hardStops);

  // ── Disposition ──
  const disposition = determineDisposition(strengths, cautions, hardStops, missing);

  const summary = `${dane.name}: ${strengths.length} strength(s), ${cautions.length} caution(s), ` +
    `${hardStops.length} hard stop(s), ${missing.length} missing. Disposition: ${disposition}.`;

  return {
    compatibility_summary: summary,
    fit_strengths: strengths,
    fit_cautions: cautions,
    hard_stops: hardStops,
    missing_information: missing,
    suggested_disposition: disposition,
  };
}

// ── Dimension evaluators ──

function evaluateHousehold(
  applicant: Json, dane: Json,
  s: CompatibilitySignal[], c: CompatibilitySignal[],
  h: CompatibilitySignal[], m: CompatibilitySignal[]
) {
  const daneKids = dane.good_with_kids;
  const appSize = applicant.size as number | undefined;

  if (daneKids === false && appSize && appSize > 2) {
    h.push({ dimension: "household", label: "Not good with kids + large household", detail: "Dane not recommended for households with children; applicant household size > 2" });
  }

  if (dane.requires_only_pet === true && applicant.other_pets === true) {
    h.push({ dimension: "household", label: "Must be only pet", detail: "Dane requires being the only pet; applicant has other pets" });
  }

  if (applicant.home_type === "apartment" && dane.needs_space === true) {
    c.push({ dimension: "household", label: "Apartment + space needs", detail: "Dane needs space; applicant lives in apartment" });
  }

  if (applicant.rent_or_own === "own") {
    s.push({ dimension: "household", label: "Homeowner", detail: "Stable housing — no landlord restrictions" });
  }
}

function evaluateEnvironment(
  applicant: Json, dane: Json,
  s: CompatibilitySignal[], c: CompatibilitySignal[],
  h: CompatibilitySignal[], m: CompatibilitySignal[]
) {
  if (dane.requires_fenced_yard === true) {
    if (applicant.has_yard === true && applicant.yard_fence_gate && !String(applicant.yard_fence_gate).toLowerCase().includes("no fence")) {
      s.push({ dimension: "environment", label: "Fenced yard available", detail: "Dane requires fenced yard; applicant has one" });
    } else if (applicant.has_yard === false) {
      h.push({ dimension: "environment", label: "No yard — fenced yard required", detail: "Dane requires fenced yard; applicant has no yard" });
    } else {
      m.push({ dimension: "environment", label: "Fence status unclear", detail: "Dane requires fenced yard; applicant yard/fence status not confirmed" });
    }
  }

  if (applicant.safety_concerns) {
    c.push({ dimension: "environment", label: "Safety concerns noted", detail: String(applicant.safety_concerns).slice(0, 200) });
  }
}

function evaluateExperience(
  applicant: Json, daneBehavior: Json, daneTraining: Json,
  s: CompatibilitySignal[], c: CompatibilitySignal[],
  m: CompatibilitySignal[]
) {
  const exp = applicant.large_dog_experience as string | undefined;

  if (daneBehavior.requires_experienced_owner === true) {
    if (exp === "breed_specific" || exp === "experienced") {
      s.push({ dimension: "experience", label: "Experienced owner for demanding dog", detail: `Applicant: ${exp}; dane requires experienced owner` });
    } else if (exp === "none") {
      c.push({ dimension: "experience", label: "No experience — experienced owner needed", detail: "Dane requires experienced owner; applicant has no large dog experience" });
    } else {
      m.push({ dimension: "experience", label: "Experience level unclear", detail: "Dane requires experienced owner; applicant experience not specified" });
    }
  }

  if (exp === "breed_specific") {
    s.push({ dimension: "experience", label: "Great Dane experience", detail: "Applicant has breed-specific experience" });
  }
}

function evaluateLifestyle(
  applicant: Json, daneEnergy: string | null,
  s: CompatibilitySignal[], c: CompatibilitySignal[],
  m: CompatibilitySignal[]
) {
  if (!daneEnergy) {
    m.push({ dimension: "lifestyle", label: "Dane energy level unknown", detail: "Cannot evaluate lifestyle compatibility without energy data" });
    return;
  }

  const appActivity = applicant.activity_level as string | undefined;
  if (!appActivity) {
    m.push({ dimension: "lifestyle", label: "Applicant activity level unknown", detail: "Cannot evaluate energy match" });
    return;
  }

  const highEnergy = ["high", "very_high"].includes(daneEnergy);
  const lowActivity = ["sedentary", "low"].includes(appActivity);

  if (highEnergy && lowActivity) {
    c.push({ dimension: "lifestyle", label: "Energy mismatch", detail: `Dane energy: ${daneEnergy}; applicant activity: ${appActivity}` });
  } else if (!highEnergy && !lowActivity) {
    s.push({ dimension: "lifestyle", label: "Energy alignment", detail: `Dane energy: ${daneEnergy}; applicant activity: ${appActivity}` });
  }
}

function evaluatePreferences(
  prefs: Json, dane: { age: string | null; sex: string | null; size: string | null },
  s: CompatibilitySignal[], c: CompatibilitySignal[]
) {
  if (prefs.preferred_age && dane.age) {
    // Simple alignment check
    s.push({ dimension: "preferences", label: "Age preference noted", detail: `Applicant prefers: ${prefs.preferred_age}; dane age: ${dane.age}` });
  }

  if (prefs.preferred_gender && dane.sex && prefs.preferred_gender !== dane.sex) {
    c.push({ dimension: "preferences", label: "Gender preference mismatch", detail: `Applicant prefers: ${prefs.preferred_gender}; dane: ${dane.sex}` });
  }
}

function evaluateConstraints(
  applicantConstraints: Json, daneConstraints: Json,
  h: CompatibilitySignal[]
) {
  if (applicantConstraints.rent_requires_approval === true && daneConstraints.no_rentals === true) {
    h.push({ dimension: "constraints", label: "Rental restriction conflict", detail: "Dane not placed in rentals; applicant is a renter" });
  }
}

// ── Disposition ──

function determineDisposition(
  strengths: CompatibilitySignal[],
  cautions: CompatibilitySignal[],
  hardStops: CompatibilitySignal[],
  missing: CompatibilitySignal[],
): Disposition {
  if (hardStops.length > 0) return "not_recommended";
  if (missing.length >= 3) return "insufficient_data";
  if (cautions.length >= 3) return "hold_needs_review";
  if (cautions.length > 0) return "candidate_with_cautions";
  return "strong_candidate";
}
