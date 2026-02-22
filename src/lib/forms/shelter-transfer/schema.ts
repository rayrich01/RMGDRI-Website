/* ------------------------------------------------------------------ *
 *  Shelter / Rescue Transfer — Zod schema                              *
 *  passthrough + partial keeps forward-compatible with field-map       *
 *  additions (Lori can iterate without breaking validation).           *
 * ------------------------------------------------------------------ */

import { z } from "zod";

const s = () => z.string().trim();
const sOpt = () => z.string().trim().optional().default("");

export const shelterTransferSchema = z
  .object({
    /* ── Organization Information ── */
    org_name:             s(),
    org_street_address:   s(),
    org_street_address_2: sOpt(),
    org_city:             s(),
    org_state:            s(),
    org_zip:              s(),

    /* ── Representative Information ── */
    rep_name:       s(),
    rep_email:      z.string().trim().email("Invalid email address"),
    rep_phone:      s(),
    rep_phone_alt:  sOpt(),

    /* ── Dog Basic Information ── */
    dog_name:           s(),
    dog_dob_age:        s(),
    rescue_deadline:    sOpt(),
    breed_status:       s(),
    mix_breed:          sOpt(),
    dog_color_markings: sOpt(),
    dog_weight:         sOpt(),
    dog_gender:         s(),
    spayed_neutered:    s(),
    microchipped:       s(),
    microchip_number:   sOpt(),
    ears:               s(),

    /* ── Intake History ── */
    intake_reason: s(),
    time_in_care:  s(),

    /* ── Medical Information ── */
    vet_evaluated:            s(),
    vet_name:                 sOpt(),
    vet_address:              sOpt(),
    vet_phone:                sOpt(),
    prior_surgeries:          s(),
    surgery_details:          sOpt(),
    vaccinations_current:     s(),
    heartworm_tested:         s(),
    medical_conditions:       z.union([z.string(), z.array(z.string())]).optional().default(""),
    medical_conditions_other: sOpt(),
    medications_special_diet: s(),
    medications_details:      sOpt(),

    /* ── Housebreaking & Training ── */
    housebroken:           s(),
    accident_frequency:    sOpt(),
    housebreaking_notes:   sOpt(),
    crate_trained:         s(),
    destructive_free_roam: s(),
    leash_behavior:        sOpt(),

    /* ── Behavioral Assessment ── */
    behavioral_eval:       sOpt(),
    resource_guarding:     sOpt(),
    aggression_reactivity: sOpt(),
    temperament_traits:    z.union([z.string(), z.array(z.string())]).optional().default(""),
    temperament_other:     sOpt(),
    play_style:            z.union([z.string(), z.array(z.string())]).optional().default(""),
    play_style_other:      sOpt(),

    /* ── Bite History ── */
    bitten_human:          s(),
    bitten_human_details:  sOpt(),
    bitten_animal:         s(),
    bitten_animal_details: sOpt(),

    /* ── Compatibility ── */
    lived_with_dogs:             s(),
    lived_with_dogs_details:     sOpt(),
    lived_with_cats:             s(),
    lived_with_cats_details:     sOpt(),
    lived_with_children:         s(),
    lived_with_children_details: sOpt(),

    /* ── Fears & Quirks ── */
    fears:           z.union([z.string(), z.array(z.string())]).optional().default(""),
    fears_other:     sOpt(),
    escape_history:  s(),
    escape_details:  sOpt(),
    quirks:          sOpt(),
    what_they_love:  sOpt(),

    /* ── Additional Resources ── */
    additional_resources: sOpt(),

    /* ── Certification & Signature ── */
    agree_statement:          s(),
    representative_signature: s(),
    signature_date:           s(),
    signature_dog_name:       s(),
  })
  .passthrough()
  .partial();

export type ShelterTransferPayload = z.infer<typeof shelterTransferSchema>;
