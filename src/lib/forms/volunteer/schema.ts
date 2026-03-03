/* ------------------------------------------------------------------ *
 *  Volunteer Application — Zod schema                                  *
 *  passthrough + partial keeps forward-compatible with field-map       *
 *  additions (Lori can iterate without breaking validation).           *
 * ------------------------------------------------------------------ */

import { z } from "zod";

const s = () => z.string().trim();
const sOpt = () => z.string().trim().optional().default("");

export const volunteerSchema = z
  .object({
    /* ── Applicant Information ── */
    applicant_first_name: s(),
    applicant_last_name:  s(),
    email:                z.string().trim().email("Invalid email address"),
    phone_primary:        s(),
    city:                 s(),
    state:                s(),

    /* ── Availability ── */
    availability_weekdays: s(),
    availability_weekends: s(),
    hours_per_month:       s(),

    /* ── Volunteer Roles ── */
    roles: z.array(z.string()).min(1, "At least one volunteer role is required"),

    /* ── Experience ── */
    dog_experience:         s(),
    giant_breed_experience: s(),
    giant_breed_details:    sOpt(),

    /* ── Consent & Signature ── */
    certify_info_true:    z.union([z.literal(true), z.literal("true"), z.literal("Yes")]),
    electronic_signature: s(),

    /* ── Optional ── */
    additional_notes: sOpt(),
  })
  .passthrough()
  .partial();

export type VolunteerPayload = z.infer<typeof volunteerSchema>;
