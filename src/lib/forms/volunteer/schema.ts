/* ------------------------------------------------------------------ *
 *  Volunteer Application — Zod schema                                  *
 *  passthrough + partial keeps forward-compatible with field-map       *
 *  additions (Lori can iterate without breaking validation).           *
 *  Merged: current draft + PDF reference form (Issue #21)             *
 * ------------------------------------------------------------------ */

import { z } from "zod";

const s = () => z.string().trim();
const sOpt = () => z.string().trim().optional().default("");

export const volunteerSchema = z
  .object({
    /* ── Section 1: Applicant Information ── */
    applicant_first_name: s(),
    applicant_last_name:  s(),
    address_street:       s(),
    address_street2:      sOpt(),
    address_city:         s(),
    address_state:        s(),
    address_zip:          s(),
    email:                z.string().trim().email("Invalid email address"),
    phone_primary:        sOpt(),
    phone_mobile:         s(),
    age:                  s(),

    /* ── Section 2: Employment & Insurance ── */
    employment_status:    s(),
    hours_per_week:       s(),
    has_health_insurance: s(),
    insurance_company:    sOpt(),

    /* ── Section 3: Background Check ── */
    investigated_by_animal_control: s(),
    convicted_animal_abuse:         s(),
    animal_abuse_explanation:       sOpt(),
    worked_with_shelter:            s(),
    shelter_involvement_current:    sOpt(),
    volunteered_with_rmgdri:        s(),
    prior_organizations:            sOpt(),

    /* ── Section 4: Experience & Skills ── */
    identify_great_dane:            s(),
    trained_evaluating_temperament: s(),
    completed_obedience_course:     s(),
    obedience_course_details:       sOpt(),
    dog_experience:                 s(),
    giant_breed_experience:         s(),
    giant_breed_details:            sOpt(),

    /* ── Section 5: Availability ── */
    availability_weekdays: s(),
    availability_weekends: s(),
    hours_per_month:       s(),

    /* ── Section 6: Volunteer Roles ── */
    roles: z.array(z.string()).min(1, "At least one volunteer role is required"),

    /* ── Section 7: About Yourself ── */
    occupation:                  sOpt(),
    has_color_copier:            s(),
    other_experience_education:  sOpt(),
    company_matching_program:    s(),
    promo_product_contacts:      s(),
    auction_donor_contacts:      s(),
    website_design_experience:   s(),
    media_connections:           s(),
    writing_experience:          s(),
    venue_connections:           s(),
    animal_rights_background:    s(),
    dog_training_experience:     s(),

    /* ── Section 8: Great Dane Transportation ── */
    transport_distance:      sOpt(),
    transport_vehicle_type:  z.array(z.string()).optional().default([]),
    transport_vehicle_other: sOpt(),
    sign_code_of_ethics:     sOpt(),

    /* ── Section 9: References ── */
    reference1_name:  s(),
    reference1_phone: s(),
    reference2_name:  s(),
    reference2_phone: s(),

    /* ── Section 10: Volunteer Liability Release ── */
    certify_over_18:            s(),
    guardian_present_if_minor:  sOpt(),
    guardian_name:              sOpt(),
    guardian_phone:             sOpt(),
    guardian_email:             sOpt(),

    /* ── Section 11: Waiver & Agreement ── */
    agree_to_policies: s(),

    /* ── Section 14: Final Acceptance & Signature ── */
    accept_code_conduct_agreement: s(),
    electronic_signature:          s(),
  })
  .passthrough()
  .partial();

export type VolunteerPayload = z.infer<typeof volunteerSchema>;
