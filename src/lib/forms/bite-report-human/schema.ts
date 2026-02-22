/**
 * Bite Report — Human: Zod validation schema
 *
 * Keys align 1-to-1 with field-map.ts.
 * Uses .passthrough().partial() for forward compatibility.
 */

import { z } from "zod";

const s = () => z.string().trim();
const sOpt = () => z.string().trim().optional().default("");

export const biteReportHumanSchema = z
  .object({
    // Reporter Information
    reporter_full_name: s(),
    reporter_relation_to_dog: s(),

    // Dog & Incident Details
    incident_date: s(),
    dog_name: s(),
    dog_markings_color: s(),
    dog_age: sOpt(),
    board_member_contacted: sOpt(),

    // Bite Details
    bite_description: s(),
    who_was_bitten: s(),
    bitten_person_contact: sOpt(),

    // Medical & Follow-Up
    medical_attention_required: z.enum(["Yes", "No"]),
    medical_treatment_details: sOpt(),
    behavioralist_details: sOpt(),
    animal_control_notified: s(),

    // Certification & Signature
    certification_agreement: z.union([
      z.literal("yes"),
      z.literal("on"),
      z.literal(true),
    ]),
    electronic_signature: s(),
    signer_name: s(),
    signer_email: z.string().trim().email("Invalid email address"),
    date_signed: s(),
  })
  .passthrough()
  .partial()
  .superRefine((data, ctx) => {
    // Conditional: if medical attention was required, treatment details are required
    if (
      data.medical_attention_required === "Yes" &&
      !String(data.medical_treatment_details ?? "").trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Please explain the medical treatment required when medical attention was needed",
        path: ["medical_treatment_details"],
      });
    }
  });

/** Backward-compatible alias */
export const BiteReportHumanSchema = biteReportHumanSchema;
