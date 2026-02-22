import { z } from "zod";

/**
 * Owner Surrender payload schema (RMGDRI Owner Surrender Form).
 *
 * Governance notes:
 * - Keys are stable snake_case for DB/event storage.
 * - Strings are trimmed.
 * - Checkbox-group fields accept string | string[] for single/multi-select.
 * - .passthrough().partial() at the end for forward compatibility.
 */

const s = () => z.string().trim();
const sOpt = () => z.string().trim().optional().default("");

/** Checkbox-group: may arrive as a single string or an array of strings. */
const checkboxGroup = () =>
  z.union([z.string(), z.array(z.string())]).optional().default("");

export const ownerSurrenderSchema = z
  .object({
    // ── Owner info ──────────────────────────────────────────────────────
    owner_name: s(),
    owner_email: z.string().trim().email("Invalid email address"),
    owner_address: sOpt(),
    owner_phone_primary: s(),

    // ── Dog basics ──────────────────────────────────────────────────────
    dog_name: s(),
    dog_dob_age: s(),
    dog_breed_type: s(),
    mix_breed: sOpt(),
    mix_breed_acknowledgment: z
      .union([z.literal(true), z.literal("true"), z.literal("Yes")])
      .optional(),
    dog_weight: s(),
    dog_color: sOpt(),
    dog_markings: sOpt(),
    dog_sex: s(),
    dog_altered: s(),
    dog_gastropexied: s(),
    dog_microchipped: sOpt(),
    dog_ears: sOpt(),

    // ── Surrender reason / timing ───────────────────────────────────────
    surrender_reason: s(),
    interested_in_keeping: sOpt(),
    placement_timeline: sOpt(),
    ownership_duration: s(),
    prior_history: s(),
    acquisition_source: s(),
    breeder_contact_info: sOpt(),
    breeder_rescue_contacted: sOpt(),
    breeder_rescue_contacted_details: sOpt(),
    rmgdri_adoption_info: sOpt(),
    rescue_shelter_info: sOpt(),

    // ── Vet care / preventive ───────────────────────────────────────────
    vet_yearly: s(),
    vaccinations_current: s(),
    heartworm_prevention: s(),
    spay_neuter_age: sOpt(),
    last_heat_cycle: sOpt(),
    vet_name: sOpt(),
    vet_address: s(),
    vet_phone: s(),
    additional_vets: sOpt(),

    // ── Medical history ─────────────────────────────────────────────────
    surgeries: s(),
    surgery_details: sOpt(),
    medical_conditions: checkboxGroup(),
    medical_conditions_details: sOpt(),
    lumps_bumps: sOpt(),
    lumps_bumps_details: sOpt(),
    medications_special_diet: s(),
    current_food: s(),
    feeding_schedule: s(),
    medical_additional: sOpt(),

    // ── Behavior / temperament ──────────────────────────────────────────
    temperament_traits: checkboxGroup(),
    anxiety: sOpt(),
    play_preferences: checkboxGroup(),
    favorite_toys: sOpt(),
    energy_level: s(),
    exercise_type: s(),

    // ── Training / handling ─────────────────────────────────────────────
    leash_behavior: s(),
    collar_type: sOpt(),
    training_type: checkboxGroup(),
    basic_commands: checkboxGroup(),
    knows_tricks: sOpt(),

    // ── Household / environment ─────────────────────────────────────────
    household_description: checkboxGroup(),
    home_access: checkboxGroup(),
    where_spends_time: checkboxGroup(),
    sleeping_location: checkboxGroup(),
    crate_trained: s(),
    destructive_free_roam: s(),
    left_when_alone: s(),
    hours_unsupervised: s(),
    yard_fenced: s(),
    yard_not_fenced_confinement: sOpt(),
    escaped_yard: s(),
    escape_method: checkboxGroup(),
    escape_when: sOpt(),
    people_lived_with: checkboxGroup(),
    most_comfortable_with: checkboxGroup(),

    // ── Children / other animals ────────────────────────────────────────
    regularly_around_children: s(),
    children_ages: sOpt(),
    children_under_7_interaction: checkboxGroup(),
    children_experience_positive: s(),
    children_experience_negative_details: sOpt(),
    lived_with_dogs: s(),
    dog_interaction: checkboxGroup(),
    dog_experience_positive: sOpt(),
    lived_with_cats: s(),
    cat_interaction: checkboxGroup(),
    cat_experience_positive: sOpt(),
    cat_experience_negative_details: sOpt(),
    bitten_animal: s(),
    bitten_animal_details: sOpt(),

    // ── Fears / habits ──────────────────────────────────────────────────
    fears: checkboxGroup(),
    housetrained: s(),
    housetrained_medical_exam: sOpt(),
    housetrained_medical_outcome: sOpt(),
    accident_frequency: s(),
    accident_handling: checkboxGroup(),
    chases: checkboxGroup(),
    barker: s(),
    barker_details: sOpt(),
    other_animals_lived_with: s(),
    animals_not_along_with: sOpt(),
    gets_along_with: checkboxGroup(),

    // ── Reactivity / aggression ─────────────────────────────────────────
    leash_lunge_dogs: s(),
    leash_lunge_people: s(),
    lunging_is_play: sOpt(),
    overprotective: s(),
    attacked_or_bitten: s(),
    attacked_or_bitten_details: sOpt(),

    // ── Wrap-up ─────────────────────────────────────────────────────────
    quirks: s(),
    perfect_home: s(),
    what_you_love: s(),
    anything_else: sOpt(),
    referral_source: checkboxGroup(),

    // ── Photos ──────────────────────────────────────────────────────────
    photos: z.array(z.string()).optional().default([]),

    // ── Agreement / certification ───────────────────────────────────────
    agreement_dog_name: s(),
    agreement_email: z.string().trim().email("Invalid email address"),
    certify_lawful_owner: s(),
    certify_over_18: s(),
    accept_agreement: s(),
    surrendering_owner_signature: s(),
    release_email_to_adopter: s(),
    agreement_date: s(),
    understand_communication: s(),
  })
  .passthrough()
  .partial();

export type OwnerSurrenderPayload = z.infer<typeof ownerSurrenderSchema>;

/** Backward-compatible alias. */
export const OwnerSurrenderSchema = ownerSurrenderSchema;
