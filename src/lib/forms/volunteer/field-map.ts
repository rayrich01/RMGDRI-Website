/* ------------------------------------------------------------------ *
 *  Volunteer Application — field map (drives form UI + validation)     *
 *  Merged: current draft + PDF reference form (Issue #21)              *
 * ------------------------------------------------------------------ */

export interface FieldDef {
  key: string;
  label: string;
  required: boolean;
  type:
    | "text"
    | "textarea"
    | "select"
    | "radio"
    | "email"
    | "tel"
    | "checkbox-group"
    | "checkbox"
    | "roles"
    | "info";
  section: string;
  options?: string[];
  placeholder?: string;
  /** Short explanatory text displayed in italic below the label, before the input. */
  hint?: string;
  /** Longer static content displayed as a styled text block (no input rendered). */
  textBlock?: string;
}

export const VOLUNTEER_FIELD_MAP: FieldDef[] = [

  /* ═══════════════════════════════════════════════════════════════
   * Section 1: Applicant Information
   * ═══════════════════════════════════════════════════════════════ */
  { key: "applicant_first_name", label: "First Name",    required: true,  type: "text",  section: "Applicant Information" },
  { key: "applicant_last_name",  label: "Last Name",     required: true,  type: "text",  section: "Applicant Information" },
  { key: "address_street",       label: "Street Address", required: true,  type: "text",  section: "Applicant Information", placeholder: "123 Main St" },
  { key: "address_street2",      label: "Street Line 2", required: false, type: "text",  section: "Applicant Information", placeholder: "Apt, Suite, etc. (optional)" },
  { key: "address_city",         label: "City",          required: true,  type: "text",  section: "Applicant Information" },
  { key: "address_state",        label: "State",         required: true,  type: "text",  section: "Applicant Information", placeholder: "e.g. CO" },
  { key: "address_zip",          label: "Zip Code",      required: true,  type: "text",  section: "Applicant Information", placeholder: "e.g. 80202" },
  { key: "email",                label: "Email",         required: true,  type: "email", section: "Applicant Information", placeholder: "you@example.com" },
  { key: "phone_primary",        label: "Home Phone",    required: true,  type: "tel",   section: "Applicant Information" },
  { key: "phone_mobile",         label: "Mobile Phone",  required: true,  type: "tel",   section: "Applicant Information" },
  { key: "age",                  label: "Age",           required: true,  type: "text",  section: "Applicant Information", placeholder: "e.g. 28" },

  /* ═══════════════════════════════════════════════════════════════
   * Section 2: Employment & Insurance
   * ═══════════════════════════════════════════════════════════════ */
  {
    key: "employment_status",
    label: "I work",
    required: true,
    type: "radio",
    section: "Employment & Insurance",
    options: ["Full Time Job", "Part Time Job", "Other"],
  },
  {
    key: "hours_per_week",
    label: "I can realistically help ___ hours per week",
    required: true,
    type: "select",
    section: "Employment & Insurance",
    options: ["1-2", "3-5", "6-10", "11-15", "16-20", "20+"],
  },
  {
    key: "has_health_insurance",
    label: "I have health insurance",
    required: true,
    type: "radio",
    section: "Employment & Insurance",
    options: ["Yes", "No"],
  },
  {
    key: "insurance_company",
    label: "If you have health insurance, please note insurance company",
    required: false,
    type: "text",
    section: "Employment & Insurance",
    hint: "If you do not have health insurance coverage, please understand that all expenses from possible injury will be paid for by you personally and not by RMGDRI.",
  },

  /* ═══════════════════════════════════════════════════════════════
   * Section 3: Background Check
   * ═══════════════════════════════════════════════════════════════ */
  {
    key: "investigated_by_animal_control",
    label: "Have you ever been investigated by Animal Control?",
    required: true,
    type: "radio",
    section: "Background Check",
    options: ["Yes", "No"],
  },
  {
    key: "convicted_animal_abuse",
    label: "Have you been convicted of any animal abuse law?",
    required: true,
    type: "radio",
    section: "Background Check",
    options: ["Yes", "No"],
  },
  {
    key: "animal_abuse_explanation",
    label: "If yes, please explain.",
    required: false,
    type: "textarea",
    section: "Background Check",
  },
  {
    key: "worked_with_shelter",
    label: "Have you worked/volunteered with a humane society, shelter, or animal care?",
    required: true,
    type: "radio",
    section: "Background Check",
    options: ["Yes", "No"],
  },
  {
    key: "shelter_involvement_current",
    label: "Is your involvement with the organization(s) current?",
    required: false,
    type: "radio",
    section: "Background Check",
    options: ["Yes", "No"],
  },
  {
    key: "volunteered_with_rmgdri",
    label: "Have you volunteered with Rocky Mountain Great Dane Rescue in the past? (adoption, volunteer, foster, surrender, etc)",
    required: true,
    type: "radio",
    section: "Background Check",
    options: ["Yes", "No"],
  },
  {
    key: "prior_organizations",
    label: "If yes, please list organization(s)",
    required: false,
    type: "text",
    section: "Background Check",
  },

  /* ═══════════════════════════════════════════════════════════════
   * Section 4: Experience & Skills
   * ═══════════════════════════════════════════════════════════════ */
  {
    key: "identify_great_dane",
    label: "Do you feel competent to identify a Great Dane, its color and markings, whether it is a purebred or mixed breed Dane?",
    required: true,
    type: "radio",
    section: "Experience & Skills",
    options: ["Yes", "No"],
  },
  {
    key: "trained_evaluating_temperament",
    label: "Have you been trained in evaluating a dog\u2019s personality and/or temperament?",
    required: true,
    type: "radio",
    section: "Experience & Skills",
    options: ["Yes", "No"],
  },
  {
    key: "completed_obedience_course",
    label: "Have you completed obedience course(s), competed in dog sport or been involved in any public dog activities?",
    required: true,
    type: "radio",
    section: "Experience & Skills",
    options: ["Yes", "No"],
  },
  {
    key: "obedience_course_details",
    label: "If yes, please describe.",
    required: false,
    type: "textarea",
    section: "Experience & Skills",
  },
  {
    key: "dog_experience",
    label: "Describe your experience with dogs",
    required: true,
    type: "textarea",
    section: "Experience & Skills",
  },
  {
    key: "giant_breed_experience",
    label: "Do you have experience with giant breed dogs?",
    required: true,
    type: "radio",
    section: "Experience & Skills",
    options: ["Yes", "No"],
  },
  {
    key: "giant_breed_details",
    label: "If yes, please describe your giant breed experience",
    required: false,
    type: "textarea",
    section: "Experience & Skills",
  },

  /* ═══════════════════════════════════════════════════════════════
   * Section 5: Availability
   * ═══════════════════════════════════════════════════════════════ */
  { key: "availability_weekdays", label: "Available on weekdays?",  required: true, type: "radio", section: "Availability", options: ["Yes", "No"] },
  { key: "availability_weekends", label: "Available on weekends?",  required: true, type: "radio", section: "Availability", options: ["Yes", "No"] },
  { key: "hours_per_month",       label: "How many hours per month can you realistically volunteer?", required: true, type: "text", section: "Availability", placeholder: "e.g. 10" },

  /* ═══════════════════════════════════════════════════════════════
   * Section 6: Volunteer Roles
   * ═══════════════════════════════════════════════════════════════ */
  {
    key: "roles",
    label: "Which volunteer roles interest you? (select at least one)",
    required: true,
    type: "roles",
    section: "Volunteer Roles",
  },

  /* ═══════════════════════════════════════════════════════════════
   * Section 7: About Yourself
   * ═══════════════════════════════════════════════════════════════ */
  {
    key: "occupation",
    label: "What do you do for a living?",
    required: false,
    type: "textarea",
    section: "About Yourself",
  },
  {
    key: "has_color_copier",
    label: "Do you have access to a color copier?",
    required: true,
    type: "radio",
    section: "About Yourself",
    options: ["Yes", "No"],
  },
  {
    key: "other_experience_education",
    label: "Do you have experience/education in a field other than your current profession?",
    required: false,
    type: "textarea",
    section: "About Yourself",
  },
  {
    key: "company_matching_program",
    label: "Does your company have a charitable employee matching program?",
    required: true,
    type: "radio",
    section: "About Yourself",
    options: ["Yes", "No"],
  },
  {
    key: "promo_product_contacts",
    label: "Do you have any contacts with promotional product companies?",
    required: true,
    type: "radio",
    section: "About Yourself",
    options: ["Yes", "No"],
  },
  {
    key: "auction_donor_contacts",
    label: "Do you know any business owners, artists, etc, who may be willing to donate something for our silent auction fundraisers?",
    required: true,
    type: "radio",
    section: "About Yourself",
    options: ["Yes", "No"],
  },
  {
    key: "website_design_experience",
    label: "Do you have experience with website design or trafficking?",
    required: true,
    type: "radio",
    section: "About Yourself",
    options: ["Yes", "No"],
  },
  {
    key: "media_connections",
    label: "Do you have any connections with the media (print, TV, Internet)?",
    required: true,
    type: "radio",
    section: "About Yourself",
    options: ["Yes", "No"],
  },
  {
    key: "writing_experience",
    label: "Do you have any experience writing? Would you be interested in helping with our newsletter?",
    required: true,
    type: "radio",
    section: "About Yourself",
    options: ["Yes", "No"],
  },
  {
    key: "venue_connections",
    label: "Do you have any connections with large venues that may be willing to host upcoming events?",
    required: true,
    type: "radio",
    section: "About Yourself",
    options: ["Yes", "No"],
  },
  {
    key: "animal_rights_background",
    label: "Do you have any background in animal rights?",
    required: true,
    type: "radio",
    section: "About Yourself",
    options: ["Yes", "No"],
  },
  {
    key: "dog_training_experience",
    label: "Do you have any dog training experience?",
    required: true,
    type: "radio",
    section: "About Yourself",
    options: ["Yes", "No"],
  },

  /* ═══════════════════════════════════════════════════════════════
   * Section 8: Great Dane Transportation
   * ═══════════════════════════════════════════════════════════════ */
  {
    key: "transport_distance",
    label: "If you can transport a Great Dane, how far are you willing to travel?",
    required: false,
    type: "radio",
    section: "Great Dane Transportation",
    options: ["0 - 10 miles", "11 - 25 miles", "26 - 50 miles", "Over 50 miles"],
  },
  {
    key: "transport_vehicle_type",
    label: "What type of vehicle would you use to transport a Great Dane?",
    required: false,
    type: "checkbox-group",
    section: "Great Dane Transportation",
    options: ["Car", "SUV", "Other"],
  },
  {
    key: "transport_vehicle_other",
    label: "If you answered \u2018Other\u2019 above please elaborate on the type of vehicle you own.",
    required: false,
    type: "textarea",
    section: "Great Dane Transportation",
  },
  {
    key: "sign_code_of_ethics",
    label: "Are you willing to sign and abide by the Rocky Mountain Great Dane Rescue, Inc. Code of Ethics?",
    required: false,
    type: "radio",
    section: "Great Dane Transportation",
    options: ["Yes", "No"],
  },

  /* ═══════════════════════════════════════════════════════════════
   * Section 9: References
   * ═══════════════════════════════════════════════════════════════ */
  { key: "reference1_name",  label: "Reference 1: Name",  required: true, type: "text", section: "References" },
  { key: "reference1_phone", label: "Reference 1: Phone", required: true, type: "tel",  section: "References" },
  { key: "reference2_name",  label: "Reference 2: Name",  required: true, type: "text", section: "References" },
  { key: "reference2_phone", label: "Reference 2: Phone", required: true, type: "tel",  section: "References" },

  /* ═══════════════════════════════════════════════════════════════
   * Section 10: Volunteer Liability Release
   * ═══════════════════════════════════════════════════════════════ */
  {
    key: "_liability_intro",
    label: "",
    required: false,
    type: "info",
    section: "Volunteer Liability Release",
    textBlock:
      "Volunteers are an important part of RMGDRI and we welcome those who wish to participate in our programs.\n\nSteps to becoming a volunteer at RMGDRI:\n1. You must have an application on file and have attended any RMGDRI sanctioned event.\n2. Anyone that will be volunteering must willingly sign this form.",
  },
  {
    key: "certify_over_18",
    label: "I certify that as of today\u2019s date, I am over 18 years of age",
    required: true,
    type: "radio",
    section: "Volunteer Liability Release",
    options: ["Yes", "No"],
  },
  {
    key: "guardian_present_if_minor",
    label: "If between 16\u201318 years old: I certify that my guardian will be with me at all times while I am volunteering for RMGDRI",
    required: false,
    type: "radio",
    section: "Volunteer Liability Release",
    options: ["Yes", "No"],
  },
  {
    key: "guardian_name",
    label: "Guardian\u2019s Name",
    required: false,
    type: "text",
    section: "Volunteer Liability Release",
    placeholder: "First Last",
  },
  {
    key: "guardian_phone",
    label: "Guardian\u2019s Phone",
    required: false,
    type: "tel",
    section: "Volunteer Liability Release",
  },
  {
    key: "guardian_email",
    label: "Guardian\u2019s Email Address",
    required: false,
    type: "email",
    section: "Volunteer Liability Release",
  },

  /* ═══════════════════════════════════════════════════════════════
   * Section 11: Waiver & Agreement
   * ═══════════════════════════════════════════════════════════════ */
  {
    key: "_waiver_text",
    label: "",
    required: false,
    type: "info",
    section: "Waiver & Agreement",
    textBlock:
      "I also understand that behavior of domestic animals is at times unpredictable and that some domestic animals are capable of inflicting property damage, serious personal injury and even death. I am well aware of the risk of handling domestic animals, and with such understanding, I hereby waive, release and forever discharge RMGDRI and its employees/volunteers, agents or trainers from any and all claims (whether present or future) arising out of the participation in the Volunteer Program.",
  },
  {
    key: "agree_to_policies",
    label: "If I am accepted into the volunteer program, I agree to adhere to RMGDRI procedures and policies",
    required: true,
    type: "radio",
    section: "Waiver & Agreement",
    options: ["Yes", "No"],
  },

  /* ═══════════════════════════════════════════════════════════════
   * Section 12: Code of Conduct
   * ═══════════════════════════════════════════════════════════════ */
  {
    key: "_code_of_conduct_text",
    label: "",
    required: false,
    type: "info",
    section: "Code of Conduct",
    textBlock:
      "RESPECT AND COURTESY\nAll members are expected to treat other members, fosters, adopters, donors, volunteers, and the general public with respect and courtesy. Disagreements happen, but rudeness, personal attacks, and disrespectful language are never acceptable.\n\nPRIVACY\nMembers must respect the privacy of others. Do not share personal information about individuals (addresses, phone numbers, financial details, medical information) without explicit consent.\n\nDISRUPTIVE POSTS\nPosts that disrupt the harmony of the group, create unnecessary drama, or spread negativity are prohibited. This includes inflammatory statements, excessive venting, or content designed to provoke others.\n\nPROBLEMS AND ABUSE REPORTING\nIf you witness misconduct, abuse, or a violation of these standards, report it to leadership immediately. Do not attempt to handle the situation publicly on social media or within group forums.\n\nBASELESS ALLEGATIONS\nMaking baseless or unsubstantiated allegations against individuals, organizations, or RMGDRI itself is a serious violation. If you have concerns, bring them through proper channels.\n\nINVESTIGATION\nAll reported violations will be investigated fairly and confidentially. Members found in violation of the Code of Conduct may be removed from volunteer service.\n\nPlease contact Tracy Corwin (tlcorwin@rmgreatdane.org) with any misconduct issues.",
  },

  /* ═══════════════════════════════════════════════════════════════
   * Section 13: Volunteer Agreement
   * ═══════════════════════════════════════════════════════════════ */
  {
    key: "_volunteer_agreement_text",
    label: "",
    required: false,
    type: "info",
    section: "Volunteer Agreement",
    textBlock:
      "I, in consideration of being accepted as a volunteer for Rocky Mountain Great Dane Rescue, Inc. (RMGDRI), agree to abide by all the rules and regulations set forth by RMGDRI and to conduct myself in a professional and courteous manner at all times while volunteering.\n\nI understand that RMGDRI reserves the right to reassign or dismiss any volunteer for just cause, including but not limited to: failure to follow RMGDRI policies and procedures, conduct unbecoming a volunteer, or any action deemed detrimental to RMGDRI, its animals, or its reputation.\n\nI agree to maintain strict confidentiality regarding all adopter, foster, donor, and applicant information I may encounter during my volunteer service. I understand that unauthorized disclosure of confidential information may result in immediate dismissal and potential legal action.\n\nI agree to handle all animals in my care with compassion, patience, and in accordance with RMGDRI\u2019s animal handling guidelines. I will immediately report any animal health concerns, injuries, or behavioral issues to the appropriate RMGDRI coordinator.\n\nI understand that RMGDRI may use photographs or videos taken during volunteer activities for promotional and educational purposes. I grant RMGDRI permission to use my likeness in such materials without compensation.",
  },

  /* ═══════════════════════════════════════════════════════════════
   * Section 14: Final Acceptance & Signature
   * ═══════════════════════════════════════════════════════════════ */
  {
    key: "accept_code_conduct_agreement",
    label: "I accept the Code of Conduct, Volunteer Agreement and Photography Release. Consider acceptance as my signature",
    required: true,
    type: "radio",
    section: "Final Acceptance & Signature",
    options: ["Yes", "No"],
  },
  {
    key: "electronic_signature",
    label: "Electronic Signature (type your full name)",
    required: true,
    type: "text",
    section: "Final Acceptance & Signature",
    placeholder: "Your full legal name",
  },
];

/** Derive unique ordered section names from the field map. */
export const VOLUNTEER_SECTIONS: string[] = [
  ...new Set(VOLUNTEER_FIELD_MAP.map((f) => f.section)),
];
