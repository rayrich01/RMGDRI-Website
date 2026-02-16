import type { z } from "zod";

/**
 * All form keys — kebab-case, stable.
 * Public forms are submitted by external applicants.
 * Ops forms are submitted by RMGDRI volunteers/staff.
 */
export const FORM_KEYS = [
  "adopt-foster",
  "owner-surrender",
  "volunteer",
  "approval",
  "homecheck",
  "phone-interview",
  "foster-medical",
  "bite-report-human",
  "shelter-transfer",
  "adoption-followup",
] as const;

export type FormKey = (typeof FORM_KEYS)[number];

export const PUBLIC_FORM_KEYS: FormKey[] = [
  "adopt-foster",
  "owner-surrender",
  "volunteer",
];

export const OPS_FORM_KEYS: FormKey[] = [
  "approval",
  "homecheck",
  "phone-interview",
  "foster-medical",
  "bite-report-human",
  "shelter-transfer",
  "adoption-followup",
];

/** Workflow statuses for form_submissions.current_status */
export const WORKFLOW_STATUSES = [
  "submitted",
  "triage",
  "in_review",
  "approved",
  "rejected",
  "needs_more_info",
  "closed",
] as const;

export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];

/** Shape of a step definition for multi-step forms */
export interface FormStep {
  id: string;
  title: string;
  /** Field keys that belong to this step */
  fields: string[];
}

/** Metadata for a registered form */
export interface FormDefinition {
  key: FormKey;
  title: string;
  version: number;
  isPublic: boolean;
  schema: z.ZodType<any>;
  steps: FormStep[];
}

/** API response from submit route */
export interface SubmitResponse {
  submission_id: string;
}

/** API error response */
export interface SubmitErrorResponse {
  error: string;
  issues?: Array<{ path: (string | number)[]; message: string }>;
}

/** Field descriptor for rendering */
export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "date"
  | "number"
  | "radio"
  | "checkbox"
  | "select"
  | "file"
  | "signature"
  | "address"
  | "initials"
  | "repeating-table"
  | "checkbox-matrix"
  | "rating-scale";

export interface FieldDescriptor {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  /** Field key that controls visibility */
  conditionalOn?: string;
  /** Value(s) that make this field visible */
  conditionalValues?: string[];
  /** For repeating tables: column definitions */
  columns?: Array<{ key: string; label: string; type: FieldType }>;
  /** Max number of rows for repeating tables */
  maxRows?: number;
  /** For file fields: accepted MIME types */
  accept?: string;
  /** For file fields: max count */
  maxFiles?: number;
  /** For rating scale: min/max labels */
  scaleMin?: string;
  scaleMax?: string;
  scaleRange?: [number, number];
}
