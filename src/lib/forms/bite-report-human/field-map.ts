/**
 * Bite Report — Human: canonical field map
 * Source: _ref/forms-pdf/Bite Report - Human.pdf
 *
 * Every field the UI renders + the API validates lives here.
 * The field-map drives:
 *   1. UI rendering (label, type, required indicator, section grouping)
 *   2. Server-side raw-required enforcement
 *   3. Zod schema alignment (keys must match 1-to-1)
 */

// ── Types ────────────────────────────────────────────────────────────
export interface FieldDef {
  key: string;
  label: string;
  required: boolean;
  type:
    | "text"
    | "textarea"
    | "email"
    | "tel"
    | "date"
    | "select"
    | "radio"
    | "checkbox"
    | "checkbox-group"
    | "photos";
  section: string;
  options?: string[];
  placeholder?: string;
}

// ── Sections (render order) ──────────────────────────────────────────
export const BITE_REPORT_HUMAN_SECTIONS = [
  "Reporter Information",
  "Dog & Incident Details",
  "Bite Details",
  "Medical & Follow-Up",
  "Certification & Signature",
] as const;

// ── Field Definitions ────────────────────────────────────────────────
export const BITE_REPORT_HUMAN_FIELD_MAP: FieldDef[] = [
  // ── Reporter Information ───────────────────────────────────────────
  {
    key: "reporter_full_name",
    label: "Foster/Owner or Shelter/Rescue Representative's Full Name",
    required: true,
    type: "text",
    section: "Reporter Information",
    placeholder: "First Name Last Name",
  },
  {
    key: "reporter_relation_to_dog",
    label: "Your relation to Dog (i.e. owner, foster, etc.)",
    required: true,
    type: "text",
    section: "Reporter Information",
  },

  // ── Dog & Incident Details ─────────────────────────────────────────
  {
    key: "incident_date",
    label: "Date of Bite Incident",
    required: true,
    type: "date",
    section: "Dog & Incident Details",
  },
  {
    key: "dog_name",
    label: "Dog's Name",
    required: true,
    type: "text",
    section: "Dog & Incident Details",
  },
  {
    key: "dog_markings_color",
    label: "Dog's Markings/Color",
    required: true,
    type: "text",
    section: "Dog & Incident Details",
  },
  {
    key: "dog_age",
    label: "Dog's Age",
    required: false,
    type: "text",
    section: "Dog & Incident Details",
  },
  {
    key: "board_member_contacted",
    label: "Name of RMGDRI Board Member Contacted, if any",
    required: false,
    type: "text",
    section: "Dog & Incident Details",
  },

  // ── Bite Details ───────────────────────────────────────────────────
  {
    key: "bite_description",
    label:
      "Please describe bite/attack as clearly and objectively as possible",
    required: true,
    type: "textarea",
    section: "Bite Details",
  },
  {
    key: "who_was_bitten",
    label: "Who was bitten?",
    required: true,
    type: "text",
    section: "Bite Details",
  },
  {
    key: "bitten_person_contact",
    label:
      "If the bitten person was not the foster/owner or the foster/owner's child, please provide the name and contact information for that individual",
    required: false,
    type: "textarea",
    section: "Bite Details",
  },

  // ── Medical & Follow-Up ────────────────────────────────────────────
  {
    key: "medical_attention_required",
    label:
      "Was medical attention recommended or required as a result of the bite?",
    required: true,
    type: "radio",
    section: "Medical & Follow-Up",
    options: ["Yes", "No"],
  },
  {
    key: "medical_treatment_details",
    label: "If yes, please explain the medical treatment required",
    required: false, // conditionally required in Zod
    type: "textarea",
    section: "Medical & Follow-Up",
  },
  {
    key: "behavioralist_details",
    label:
      "If a behavioralist was consulted, what is the name of the behavioralist, the date of consult, and the outcome of the consult?",
    required: false,
    type: "textarea",
    section: "Medical & Follow-Up",
  },
  {
    key: "animal_control_notified",
    label:
      "Was Animal Control notified and if so, what county/city and state",
    required: true,
    type: "textarea",
    section: "Medical & Follow-Up",
  },

  // ── Certification & Signature ──────────────────────────────────────
  {
    key: "certification_agreement",
    label:
      "I certify that I have given the full and complete details of the bite incident and am not withholding any information",
    required: true,
    type: "checkbox",
    section: "Certification & Signature",
  },
  {
    key: "electronic_signature",
    label: "Signature",
    required: true,
    type: "text",
    section: "Certification & Signature",
    placeholder: "Type your full legal name",
  },
  {
    key: "signer_name",
    label: "Name of the person completing this form",
    required: true,
    type: "text",
    section: "Certification & Signature",
  },
  {
    key: "signer_email",
    label: "Email of person filling out the form",
    required: true,
    type: "email",
    section: "Certification & Signature",
    placeholder: "example@example.com",
  },
  {
    key: "date_signed",
    label: "Date Signed",
    required: true,
    type: "date",
    section: "Certification & Signature",
  },
];

// ── Derived helpers ──────────────────────────────────────────────────
export const BITE_REPORT_HUMAN_REQUIRED_FIELDS =
  BITE_REPORT_HUMAN_FIELD_MAP.filter((f) => f.required).map((f) => f.key);
