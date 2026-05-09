/**
 * RMGDRI Bite Policy — Deterministic Rule Engine
 * Authority: Bite Policy Rev. 03 (06.23.2022)
 * Dr. Ian Dunbar Bite Scale Levels 0–6
 *
 * This module evaluates bite incidents and produces:
 * - acceptance/rejection determination
 * - exception eligibility
 * - required evaluations (vet, behaviorist, bloodwork)
 * - board vote requirements
 * - timeline obligations
 * - addendum triggers
 *
 * All logic is deterministic, explainable, and traceable to policy text.
 */

// ── Types ──

export interface BiteIncident {
  dunbar_level: number;         // 0-6
  context: "incoming" | "foster" | "returned_adoption" | "unknown";
  aimed_at_face_neck: boolean;
  is_defensive: boolean;        // injured/sick dog, no prior history
  is_puppy_play: boolean;       // < 12 months, play or food learning
  is_accidental_breakup: boolean; // human hand in dog fight
  prior_bite_count: number;     // number of prior Level 3+ bites on record
  prior_highest_level: number;  // highest prior Dunbar level
}

export interface PolicyEvaluation {
  accepted: boolean;
  reason: string;
  dunbar_level: number;
  dunbar_label: string;
  exception_met: boolean;
  exception_type: string | null;
  board_vote_required: boolean;
  vet_eval_required: boolean;
  behaviorist_eval_required: boolean;
  bloodwork_required: boolean;
  eval_timeline_hours: number | null;    // 48-72hr requirement if applicable
  euthanasia_review: boolean;
  immediate_removal_from_foster: boolean;
  triggers_behavioral_addendum: boolean;
  policy_references: string[];
}

// ── Dunbar Scale Labels ──

export const DUNBAR_LABELS: Record<number, string> = {
  0: "Level 0 — No known bite history",
  1: "Level 1 — Harassment (barks, growls, lunges, air-snaps, no tooth contact)",
  2: "Level 2 — Tooth contact, no skin puncture (nicks < 1/10 inch, slight bleeding)",
  3: "Level 3 — Single bite & release (1-4 punctures, no deeper than half canine length)",
  4: "Level 4 — Single bite, holds > 3 seconds (rips/tears both directions, deep punctures)",
  5: "Level 5 — Multiple bite incident (at least two Level 4 bites, chomp-chomp-chomp)",
  6: "Level 6 — Attack resulting in mutilation and/or death",
};

export const DUNBAR_PROGNOSIS: Record<number, string> = {
  0: "No concerns",
  1: "Wonderful prognosis — resolve with basic training",
  2: "Wonderful prognosis — resolve with basic training and bite inhibition",
  3: "Fair to good prognosis — requires owner compliance, time-consuming, not without danger",
  4: "Poor prognosis — very dangerous, insufficient bite inhibition, absolute owner compliance rare",
  5: "Extremely dangerous — not safe around people, recommend euthanasia",
  6: "Extremely dangerous — recommend euthanasia",
};

// ── Core Evaluation ──

export function evaluateBitePolicy(incident: BiteIncident): PolicyEvaluation {
  const label = DUNBAR_LABELS[incident.dunbar_level] || `Level ${incident.dunbar_level} — Unknown`;
  const refs: string[] = [];
  let accepted = true;
  let reason = "";
  let exceptionMet = false;
  let exceptionType: string | null = null;
  let boardVote = false;
  let vetEval = false;
  let behavioristEval = false;
  let bloodwork = false;
  let evalTimeline: number | null = null;
  let euthanasiaReview = false;
  let immediateRemoval = false;
  let triggersAddendum = false;

  // ── Rule: Any bite triggers behavioral addendum ──
  if (incident.dunbar_level >= 1) {
    triggersAddendum = true;
    refs.push("Addendum trigger: any bite history");
  }

  // ── INCOMING DOGS ──
  if (incident.context === "incoming") {
    // Level 0-2: Accept
    if (incident.dunbar_level <= 2) {
      accepted = true;
      reason = "Level 0-2 incoming: accepted without restriction";
      refs.push("Policy: Levels 1-2 comprise well over 99% of incidents");
    }

    // Level 3+: Reject unless exception
    else if (incident.dunbar_level >= 3) {
      accepted = false;
      reason = `Level ${incident.dunbar_level} incoming: not accepted (Level 3+ policy)`;
      refs.push("Policy: RMGDRI will not accept NEW dogs Level 3 or higher");

      // Face/neck: reject regardless
      if (incident.aimed_at_face_neck) {
        accepted = false;
        reason = `Level ${incident.dunbar_level} aimed at face/neck: not accepted`;
        refs.push("Policy: ANY bite intentionally aimed at face, head or neck rejected");
      }

      // Check exceptions (Level 3-4 only)
      if (incident.dunbar_level <= 4 && !incident.aimed_at_face_neck) {
        if (incident.is_defensive) {
          exceptionMet = true;
          exceptionType = "defensive";
          accepted = true;
          boardVote = true;
          reason = "Level 3-4 exception: defensive bite (injured/sick, no prior history)";
          refs.push("Exception: defensive bite from injured/sick dog with no previous history");
        } else if (incident.is_puppy_play) {
          exceptionMet = true;
          exceptionType = "puppy_play";
          accepted = true;
          boardVote = true;
          reason = "Level 3-4 exception: puppy (< 12 months) play/food learning";
          refs.push("Exception: puppy < 12 months causing Level 3 in play or food/treats");
        } else if (incident.is_accidental_breakup) {
          exceptionMet = true;
          exceptionType = "accidental_breakup";
          accepted = true;
          boardVote = true;
          reason = "Level 3-4 exception: accidental bite during dog fight breakup";
          refs.push("Exception: accidental bite to human breaking up dog fight");
        }

        // No standard exception but possible with resources + board vote
        if (!exceptionMet) {
          refs.push("Policy: may still be accepted if adequate resources, experienced foster, majority board agreement");
          boardVote = true;
        }
      }

      // Level 3-4 incoming requires vet exam + behaviorist before acceptance
      if (incident.dunbar_level >= 3 && incident.dunbar_level <= 4) {
        vetEval = true;
        behavioristEval = true;
        bloodwork = true;
        refs.push("Policy: Level 3-4 acceptance requires vet exam (full blood panel + thyroid), behaviorist evaluation");
        refs.push("Policy: second-hand information from owners not accepted");
      }

      // Level 5-6: reject, no exceptions
      if (incident.dunbar_level >= 5) {
        accepted = false;
        exceptionMet = false;
        reason = `Level ${incident.dunbar_level} incoming: not accepted, no exceptions`;
        euthanasiaReview = true;
        refs.push("Policy: Level 5-6 — extremely dangerous, recommend euthanasia");
      }
    }

    // Unknown level incoming: may accept with board vote + immediate eval
    if (incident.context === "incoming" && incident.dunbar_level < 0) {
      boardVote = true;
      vetEval = true;
      behavioristEval = true;
      refs.push("Policy: unknown bite level may be accepted with majority board vote + immediate evaluation");
    }
  }

  // ── FOSTER DOGS ──
  else if (incident.context === "foster") {
    refs.push("Policy: foster home should call Board immediately, Bite Report Form required");

    // Level 2-3: requires vet + behaviorist eval
    if (incident.dunbar_level >= 2) {
      vetEval = true;
      behavioristEval = true;
      bloodwork = true;
      evalTimeline = 72; // 48-72 hours
      refs.push("Policy: foster Level 2-3 requires vet and behaviorist within 48-72 hours");
      refs.push("Policy: bloodwork includes T3 & T4 Thyroid panels");
    }

    // Level 3+: immediate removal from foster
    if (incident.dunbar_level >= 3) {
      immediateRemoval = true;
      euthanasiaReview = true;
      boardVote = true;
      refs.push("Policy: Level 3+ foster — immediate removal from foster home");
      refs.push("Policy: Level 3+ foster — board vote on euthanasia within 48 hours after evaluation");
    }

    // Level 4+: or face/neck
    if (incident.dunbar_level >= 4 || incident.aimed_at_face_neck) {
      euthanasiaReview = true;
      refs.push("Policy: Level 4+ or face/neck — dog will be euthanized unless exception met");
    }

    accepted = true; // foster dogs are already in system
    reason = `Level ${incident.dunbar_level} foster: evaluation required`;
  }

  // ── RETURNED ADOPTION ──
  else if (incident.context === "returned_adoption") {
    refs.push("Policy: returned adoption bite — Bite Report Form initiated by Intake Coordinator");
    vetEval = true;
    behavioristEval = true;

    if (incident.dunbar_level >= 3) {
      euthanasiaReview = true;
      boardVote = true;
    }

    accepted = true; // already in system via return
    reason = `Level ${incident.dunbar_level} returned adoption: evaluation required`;
  }

  // ── REPEAT OFFENDER RULE ──
  // Two Level 3+ bites on separate occasions = euthanize unless exception
  if (incident.prior_bite_count >= 1 && incident.prior_highest_level >= 3 && incident.dunbar_level >= 3) {
    euthanasiaReview = true;
    refs.push("Policy: two Level 3+ bites on separate occasions — dog will be euthanized unless exception met");
    reason += " | REPEAT OFFENDER: two Level 3+ bites on separate occasions";
  }

  return {
    accepted,
    reason,
    dunbar_level: incident.dunbar_level,
    dunbar_label: label,
    exception_met: exceptionMet,
    exception_type: exceptionType,
    board_vote_required: boardVote,
    vet_eval_required: vetEval,
    behaviorist_eval_required: behavioristEval,
    bloodwork_required: bloodwork,
    eval_timeline_hours: evalTimeline,
    euthanasia_review: euthanasiaReview,
    immediate_removal_from_foster: immediateRemoval,
    triggers_behavioral_addendum: triggersAddendum,
    policy_references: refs,
  };
}

// ── Behavioral Addendum Triggers ──

export interface BehavioralAddendumCheck {
  required: boolean;
  triggers: string[];
}

export function checkBehavioralAddendum(dog: {
  has_bite_history: boolean;
  is_reactive: boolean;
  must_be_only_dog: boolean;
  requires_training: boolean;
  eats_non_edible: boolean;   // pica
  behavior_notes?: string;
}): BehavioralAddendumCheck {
  const triggers: string[] = [];

  if (dog.has_bite_history) triggers.push("Bite history on record");
  if (dog.is_reactive) triggers.push("Reactive behavior");
  if (dog.must_be_only_dog) triggers.push("Must be only dog");
  if (dog.requires_training) triggers.push("Requires training or further training at adoption");
  if (dog.eats_non_edible) triggers.push("Tendency to eat non-edible items (pica)");

  return {
    required: triggers.length > 0,
    triggers,
  };
}

// ── Medical Addendum Triggers ──

export interface MedicalAddendumCheck {
  required: boolean;
  triggers: string[];
}

export function checkMedicalAddendum(dog: {
  has_heart_condition: boolean;
  has_wobblers: boolean;
  has_structural_issues: boolean;   // cannot be corrected
  has_ongoing_treatment: boolean;   // still being treated at adoption
  has_lifelong_medication: boolean;
  medical_notes?: string;
}): MedicalAddendumCheck {
  const triggers: string[] = [];

  if (dog.has_heart_condition) triggers.push("Heart condition");
  if (dog.has_wobblers) triggers.push("Wobblers syndrome");
  if (dog.has_structural_issues) triggers.push("Structural issues that cannot be corrected");
  if (dog.has_ongoing_treatment) triggers.push("Medical needs still being treated at time of adoption");
  if (dog.has_lifelong_medication) triggers.push("Long-term or lifelong medication required");

  return {
    required: triggers.length > 0,
    triggers,
  };
}
