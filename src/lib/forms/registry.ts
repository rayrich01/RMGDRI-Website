/**
 * Polymorphic form registry.
 *
 * Maps a form_type string (stored in Supabase internal_flags / applicant_profile)
 * to the field-map, sections, and title for that form.
 *
 * When a new form is created (e.g. owner-surrender, volunteer), register it here
 * so the admin submissions viewer can render it with labels instead of raw JSON.
 */
import type { FieldDef } from "@/lib/forms/bite-report-human/field-map";
import {
  BITE_REPORT_HUMAN_FIELD_MAP,
  BITE_REPORT_HUMAN_SECTIONS,
} from "@/lib/forms/bite-report-human/field-map";
import { BITE_REPORT_HUMAN_TITLE } from "@/lib/forms/bite-report-human/labels";

export interface FormRegistry {
  title: string;
  sections: readonly string[];
  fields: FieldDef[];
}

const FORM_REGISTRY: Record<string, FormRegistry> = {
  bite_report_human: {
    title: BITE_REPORT_HUMAN_TITLE,
    sections: BITE_REPORT_HUMAN_SECTIONS,
    fields: BITE_REPORT_HUMAN_FIELD_MAP,
  },
  // Future forms go here:
  // owner_surrender: { ... },
  // volunteer: { ... },
};

/** Get the full registry entry for a form type, or null if unregistered. */
export function getFormRegistry(formType: string): FormRegistry | null {
  return FORM_REGISTRY[formType] ?? null;
}

/** Human-readable label for a form type. Falls back to title-cased form_type. */
export function getFormTypeLabel(formType: string): string {
  if (FORM_REGISTRY[formType]) {
    return FORM_REGISTRY[formType].title;
  }
  return formType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
