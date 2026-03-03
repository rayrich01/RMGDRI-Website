/* ------------------------------------------------------------------ *
 *  Volunteer Application — field map (drives form UI + validation)     *
 *  Derived from Lori's canonical volunteer roles + PDF reference        *
 * ------------------------------------------------------------------ */

export interface FieldDef {
  key: string;
  label: string;
  required: boolean;
  type: "text" | "textarea" | "select" | "radio" | "email" | "tel" | "checkbox-group" | "checkbox" | "roles";
  section: string;
  options?: string[];
  placeholder?: string;
}

export const VOLUNTEER_FIELD_MAP: FieldDef[] = [
  /* ── Section 1: Applicant Information ── */
  { key: "applicant_first_name", label: "First Name", required: true, type: "text", section: "Applicant Information" },
  { key: "applicant_last_name",  label: "Last Name",  required: true, type: "text", section: "Applicant Information" },
  { key: "email",                label: "Email",       required: true, type: "email", section: "Applicant Information", placeholder: "you@example.com" },
  { key: "phone_primary",       label: "Phone",       required: true, type: "tel",   section: "Applicant Information" },
  { key: "city",                 label: "City",        required: true, type: "text",  section: "Applicant Information" },
  { key: "state",                label: "State",       required: true, type: "text",  section: "Applicant Information", placeholder: "e.g. CO" },

  /* ── Section 2: Availability ── */
  { key: "availability_weekdays", label: "Available on weekdays?",  required: true, type: "radio", section: "Availability", options: ["Yes", "No"] },
  { key: "availability_weekends", label: "Available on weekends?",  required: true, type: "radio", section: "Availability", options: ["Yes", "No"] },
  { key: "hours_per_month",       label: "How many hours per month can you realistically volunteer?", required: true, type: "text", section: "Availability", placeholder: "e.g. 10" },

  /* ── Section 3: Volunteer Roles ── */
  // Rendered by the form component using VOLUNTEER_ROLES from labels.ts
  // The "roles" type signals the form to render the canonical role checkboxes
  { key: "roles", label: "Which volunteer roles interest you? (select at least one)", required: true, type: "roles", section: "Volunteer Roles" },

  /* ── Section 4: Experience ── */
  { key: "dog_experience",          label: "Describe your experience with dogs",                          required: true,  type: "textarea", section: "Experience" },
  { key: "giant_breed_experience",  label: "Do you have experience with giant breed dogs?",               required: true,  type: "radio",    section: "Experience", options: ["Yes", "No"] },
  { key: "giant_breed_details",     label: "If yes, please describe your giant breed experience",         required: false, type: "textarea", section: "Experience" },

  /* ── Section 5: Consent & Signature ── */
  { key: "certify_info_true",      label: "I certify that the information provided in this application is truthful and complete.", required: true, type: "checkbox", section: "Consent & Signature" },
  { key: "electronic_signature",   label: "Electronic Signature (type your full name)",                    required: true, type: "text",     section: "Consent & Signature", placeholder: "Your full legal name" },

  /* ── Optional ── */
  { key: "additional_notes", label: "Anything else you'd like us to know?", required: false, type: "textarea", section: "Additional Notes" },
];

/** Derive unique ordered section names from the field map. */
export const VOLUNTEER_SECTIONS: string[] = [
  ...new Set(VOLUNTEER_FIELD_MAP.map((f) => f.section)),
];
