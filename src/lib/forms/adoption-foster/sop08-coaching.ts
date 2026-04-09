/**
 * SOP_08 Coaching Map — Applications & Screening
 *
 * Maps form field keys to screening guidance, severity levels,
 * and SOP references. Used by the admin submission detail page
 * to display coaching hovers on key screening elements.
 *
 * Source: RMGDRI_SOP_08_Applications_Screening_WORKING_REVIEW_v0.5
 */

export interface CoachingEntry {
  tip: string;
  sopRef: string;
  severity: "info" | "critical" | "flag";
}

export const SOP08_COACHING: Record<string, CoachingEntry> = {
  // === APPLICATION TYPE — determines home check method ===
  application_type: {
    tip: "Application type determines home check method: Adoption = virtual permitted. Foster or Both = in-home required (PACFA). Verify this matches the applicant's stated intent throughout the application.",
    sopRef: "SOP_08 §5.2 — Home Check Method by Application Type",
    severity: "critical",
  },

  // === ACKNOWLEDGEMENTS — must all be affirmative ===
  ack_wait_time: {
    tip: "Applicant must understand 3-6+ month wait. If 'no' — flag for interview discussion. Impatient applicants may not be suitable for rescue placement timelines.",
    sopRef: "SOP_08 §4.1 — Eligibility Assessment",
    severity: "flag",
  },
  ack_behavioral_work: {
    tip: "Critical screening element. Applicant must acknowledge behavioral work is expected. 'No' answer is a significant concern — discuss in phone interview.",
    sopRef: "SOP_08 §4.2 — Applicant Phone Interview",
    severity: "critical",
  },
  ack_dane_capabilities: {
    tip: "Applicant must acknowledge Great Danes are capable of reactivity and aggression. 'No' suggests unrealistic expectations — must be addressed in interview.",
    sopRef: "SOP_08 §4.2 — Applicant Phone Interview",
    severity: "critical",
  },
  ack_transparency: {
    tip: "Applicant acknowledges that additional information about dogs (including bite history) may not be on the website. Essential for informed consent.",
    sopRef: "SOP_08 §4.1 — Eligibility Assessment",
    severity: "flag",
  },

  // === REFERENCES — always required per SOP ===
  reference_1_name: {
    tip: "Reference checks are ALWAYS required per SOP_08. Both references must be contacted. Document all reference conversations in the applicant record.",
    sopRef: "SOP_08 §4.1 — Reference checks — always required",
    severity: "critical",
  },
  reference_2_name: {
    tip: "Second reference required. Must be a different person than reference 1. Contact and document before approval.",
    sopRef: "SOP_08 §4.1 — Reference checks — always required",
    severity: "critical",
  },
  reference_1_email: {
    tip: "Inform references to check spam folders. Reference delays are a common screening bottleneck.",
    sopRef: "SOP_08 §4.1 — Initial Screening",
    severity: "info",
  },
  reference_2_email: {
    tip: "Inform references to check spam folders. Reference delays are a common screening bottleneck.",
    sopRef: "SOP_08 §4.1 — Initial Screening",
    severity: "info",
  },

  // === HOME INFORMATION — home check preparation ===
  own_or_rent: {
    tip: "If renting: landlord permission is required. Verify landlord name and phone are provided. Must confirm breed restrictions allow Great Danes.",
    sopRef: "SOP_08 §5 — Home Check Requirements",
    severity: "flag",
  },
  landlord_name: {
    tip: "Required if renting. Contact landlord to verify pet policy allows Great Danes (giant breed, 100-200 lbs). No landlord verification = cannot approve.",
    sopRef: "SOP_08 §5 — Home Check Requirements",
    severity: "critical",
  },

  // === VETERINARIAN — critical screening ===
  vet_name: {
    tip: "Veterinarian reference is part of screening. Confirm the applicant has an established vet relationship, not just a name from a search.",
    sopRef: "SOP_08 §4.1 — Eligibility Assessment",
    severity: "flag",
  },
  er_vet_name: {
    tip: "Emergency vet is critical for Great Danes due to GDV/bloat risk. Applicant must have an identified emergency vet BEFORE placement.",
    sopRef: "SOP_08 §4.1 — Eligibility Assessment",
    severity: "critical",
  },
  gdv_knowledge: {
    tip: "GDV (bloat) is the #1 emergency for Great Danes. Applicant's understanding of GDV is a critical screening element. Insufficient knowledge must be addressed in interview.",
    sopRef: "SOP_08 §4.2 — Applicant Phone Interview",
    severity: "critical",
  },
  gdv_cost_ability: {
    tip: "GDV surgery costs $3,000-$10,000+. Financial ability to handle emergency vet costs is a screening requirement. Address honestly in interview.",
    sopRef: "SOP_08 §4.2 — Applicant Phone Interview",
    severity: "critical",
  },
  willing_medical_conditions: {
    tip: "Review which medical conditions the applicant is willing to consider. This directly affects matching. Document for the Adoption Director.",
    sopRef: "SOP_08 §6.1 — Approval Authority",
    severity: "flag",
  },

  // === YARD & FENCING — home check critical ===
  yard_fenced: {
    tip: "Fencing status is verified during home check. If no fence, review the no-fence exercise plan carefully. Great Danes should not be off-leash in unfenced areas.",
    sopRef: "SOP_08 §5.3 — Home Check Documentation",
    severity: "flag",
  },
  yard_completely_fenced: {
    tip: "Partial fencing is a concern. Home check must verify fence completeness, height, and gate security. Minimum recommended: 5-6 foot fence.",
    sopRef: "SOP_08 §5.3 — Home Check Documentation — Observations and findings",
    severity: "flag",
  },

  // === BEHAVIORAL PREFERENCES — matching critical ===
  unwilling_behaviors: {
    tip: "Document carefully — this determines which dogs can be matched. Cross-reference with available dogs' behavioral profiles.",
    sopRef: "SOP_08 §6.1 — Approval Authority (matching considerations)",
    severity: "flag",
  },
  willing_bite_history: {
    tip: "Critical matching element. If 'No' — applicant cannot be matched with dogs that have bite history. If 'Depends' — clarify specifics in interview.",
    sopRef: "SOP_08 §4.2 — Applicant Phone Interview",
    severity: "critical",
  },
  all_members_want_dane: {
    tip: "ALL household members must want the dog. If 'No' — this is a significant concern. A household member who doesn't want the dog creates placement failure risk.",
    sopRef: "SOP_08 §4.2 — Applicant Phone Interview",
    severity: "critical",
  },
  hesitations_concerns: {
    tip: "If 'Yes' — review hesitations_details carefully. Unresolved hesitations should be addressed in the phone interview before advancing.",
    sopRef: "SOP_08 §4.2 — Applicant Phone Interview",
    severity: "flag",
  },

  // === HOUSEHOLD — screening elements ===
  allergies_in_household: {
    tip: "If 'Yes' — review allergies_handling field. Great Danes are not hypoallergenic. Allergies are a common return reason.",
    sopRef: "SOP_08 §4.1 — Eligibility Assessment",
    severity: "flag",
  },
  hours_alone_per_day: {
    tip: "Great Danes should not be alone for extended periods. More than 8 hours daily is a concern. Review where the dog stays when alone.",
    sopRef: "SOP_08 §4.2 — Applicant Phone Interview",
    severity: "flag",
  },

  // === CRATE & TRAINING ===
  own_dane_sized_crate: {
    tip: "A Dane-sized crate (54\" or larger) is strongly recommended. If 'No' — discuss crate acquisition plan in interview. Crate training aids in adjustment period.",
    sopRef: "SOP_08 §4.2 — Applicant Phone Interview",
    severity: "info",
  },
  collar_leash_type: {
    tip: "RMGDRI does not condone shock, pinch, or choke collars. If applicant mentions these — must be addressed. Recommend martingale or front-clip harness.",
    sopRef: "SOP_08 §4.2 — Applicant Phone Interview",
    severity: "flag",
  },

  // === ADJUSTMENT & EXPECTATIONS ===
  willing_one_month_trial: {
    tip: "Willingness to do a trial period indicates realistic expectations. If 'No' — explore why in interview. Trial periods reduce return rates.",
    sopRef: "SOP_08 §4.2 — Applicant Phone Interview",
    severity: "flag",
  },
  animal_control_contact: {
    tip: "If 'Yes' — this requires detailed follow-up in the interview. Document the circumstances. May require Adoption Director review.",
    sopRef: "SOP_08 §6.4 — Conditional Approvals",
    severity: "critical",
  },

  // === CERTIFICATION — must be affirmative ===
  certify_info_true: {
    tip: "Applicant must certify all information is true. This is the legal basis for the application. Must be 'Yes' to proceed.",
    sopRef: "SOP_08 §3.2 — Intake Controls",
    severity: "critical",
  },
  certify_over_21: {
    tip: "Applicant must be 21 or over. This is a hard requirement. Must be 'Yes' to proceed.",
    sopRef: "SOP_08 §3.2 — Intake Controls",
    severity: "critical",
  },
  electronic_signature: {
    tip: "Electronic signature is part of the applicant record. Becomes part of the canonical Adoption/Foster Application document.",
    sopRef: "SOP_08 §7.1 — Canonical Applicant Documents",
    severity: "info",
  },

  // === NEIGHBORS — home check preparation ===
  neighbor_conflicts: {
    tip: "If 'Yes' — this is a risk factor for noise complaints about a Great Dane. Discuss in interview and note for home check volunteer.",
    sopRef: "SOP_08 §5.3 — Home Check Documentation",
    severity: "flag",
  },

  // === BREED EXPERIENCE ===
  owned_great_dane_before: {
    tip: "Prior Dane experience is positive but not required. If 'No' — review dane_knowledge and giant_breed_details carefully to assess preparedness.",
    sopRef: "SOP_08 §4.1 — Eligibility Assessment",
    severity: "info",
  },
  dane_knowledge: {
    tip: "Screening element: applicant should demonstrate basic understanding of Dane temperament, health needs (GDV, joint issues), and daily requirements (exercise, space, food costs).",
    sopRef: "SOP_08 §4.1 — Eligibility Assessment",
    severity: "flag",
  },

  // === FOSTER-SPECIFIC ===
  foster_experience: {
    tip: "Foster experience is noted but not required. If no experience — ensure applicant understands temporary nature, potential behavioral challenges, and transport expectations.",
    sopRef: "SOP_08 §2 — Additional controls based on application type",
    severity: "info",
  },
};

/**
 * Sections that need a section-level coaching header in the review view.
 */
export const SOP08_SECTION_COACHING: Record<string, CoachingEntry> = {
  "Acknowledgements": {
    tip: "All acknowledgements must be reviewed during screening. Any 'No' answer requires phone interview follow-up before advancing. These establish informed consent.",
    sopRef: "SOP_08 §4.1 — Initial Screening",
    severity: "flag",
  },
  "References": {
    tip: "Reference checks are ALWAYS required. Both references must be contacted and documented. This is a non-negotiable screening control.",
    sopRef: "SOP_08 §4.1 — Reference checks — always required",
    severity: "critical",
  },
  "Veterinarian": {
    tip: "Vet information is critical for GDV/bloat risk assessment. Emergency vet must be identified. GDV knowledge and financial ability are key screening elements.",
    sopRef: "SOP_08 §4.1 — Eligibility Assessment",
    severity: "critical",
  },
  "Yard & Fencing": {
    tip: "Fencing is verified during home check. Document fence type, height, completeness, and gate security. No fence requires a detailed exercise plan.",
    sopRef: "SOP_08 §5.3 — Home Check Documentation",
    severity: "flag",
  },
  "Certification & Signature": {
    tip: "Both certifications must be 'Yes'. Electronic signature becomes part of the canonical applicant record. Records are never deleted (SOP_08 §7.2).",
    sopRef: "SOP_08 §7.1 — Canonical Applicant Documents",
    severity: "critical",
  },
};
