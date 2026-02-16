import { z } from "zod";

/**
 * Owner Surrender payload schema (RMGDRI Owner Surrender Form).
 *
 * Governance notes:
 * - Keys are stable snake_case for DB/event storage.
 * - Strings are trimmed.
 * - Multi-select fields are arrays of strings.
 * - Dates are accepted as strings (ISO or user-entered) to avoid coercion surprises; validate later if needed.
 */

const s = () => z.string().trim();
const sOpt = () => z.string().trim().optional().default("");

const yesNo = z.enum(["yes", "no"]);
const yesNoOpt = z.enum(["yes", "no"]).optional();

export const OwnerSurrenderSchema = z.object({
  // --- Owner info ---
  owner_first_name: s(),
  owner_last_name: s(),
  owner_email: s().email(),
  owner_address_line1: s(),
  owner_address_line2: sOpt(),
  owner_city: s(),
  owner_state: s(),
  owner_postal_code: s(),
  owner_contact_phone_primary: s(),
  owner_contact_phone_secondary: sOpt(),

  // --- Dog basics ---
  dog_name: s(),
  dog_dob_or_age: s(), // DOB or Approx Age (as provided)
  dog_is_great_dane_or_mix: s(), // "Great Dane" | "Great Dane Mix" etc.
  dog_mix_breed_details: sOpt(),
  dog_weight: s(),
  dog_color: s(),
  dog_markings: sOpt(),
  dog_gender: s(), // "male" | "female" (store as provided)
  dog_spayed_neutered: s(), // yes/no/unknown (store as provided)
  dog_gastropexy_tacked: s(), // yes/no/unknown (store as provided)
  dog_microchipped: sOpt(),

  // --- Surrender reason/timing ---
  surrender_reason: s(),
  interested_in_resources_to_keep: s(), // yes/no
  surrender_deadline: s(), // when does dog need to be out
  urgency_notes: sOpt(),
  attachments_note: sOpt(), // placeholder for uploaded docs handling later

  // --- Ownership/history ---
  owned_how_long: s(),
  history_prior_to_owner: s(),
  lived_outside_state: s(),
  lived_outside_state_where: sOpt(),
  acquired_from: s(),
  breeder_name: sOpt(),
  breeder_contact: sOpt(),

  // --- Vet care / preventive ---
  seen_vet_annually: s(),
  current_vaccinations: s(),
  on_heartworm_prevention: s(),
  spay_neuter_age: sOpt(),
  vet_name: s(),
  vet_office_address: s(),
  vet_office_phone: s(),
  multiple_vets_details: sOpt(),

  // --- Medical history ---
  required_surgeries: s(),
  surgeries_details: sOpt(),
  diagnosed_or_treated_conditions: z.array(s()).default([]), // checkbox list
  external_abnormalities: s(),
  external_abnormalities_details: sOpt(),
  meds_supplements_special_diets: s(),
  current_food_brand: s(),
  feeding_schedule_amount: s(),
  other_medical_notes: s(),

  // --- Behavior / temperament ---
  personality_traits: z.array(s()).default([]), // "Very Active", "Couch Potato", etc.
  anxiety_present: s(),
  play_preferences: z.array(s()).default([]),
  favorite_toys_activities: sOpt(),
  energy_level: s(),
  exercise_routine: s(),
  temperament_notes: sOpt(),

  // --- Training / handling ---
  leash_behavior: s(),
  collar_type: sOpt(),
  training_types: z.array(s()).default([]),
  basic_commands: z.array(s()).default([]),
  knows_tricks: sOpt(),

  // --- Household / environment ---
  household_description: s(),
  home_access_areas: z.array(s()).default([]),
  where_dog_spends_time: z.array(s()).default([]),
  yard_fenced: s(),
  yard_not_fenced_management: sOpt(),
  repeated_escapes: s(),
  escape_how: sOpt(),
  crate_trained: s(),
  destructive_if_left_alone: s(),
  where_left_when_alone: s(),
  hours_unsupervised_per_day: s(),
  sleeping_location: s(),
  people_ages_in_home: s(),
  comfort_with: s(), // adults / children / etc (store as provided)

  // --- Kids / other animals ---
  around_children_regularly: s(),
  children_experience_positive: s(),
  children_experience_negative_details: sOpt(),
  exposed_to_other_dogs: s(),
  exposed_to_cats: s(),
  cats_interaction: sOpt(),
  bitten_another_animal: s(),
  bite_animal_details: sOpt(),

  // --- Fears / habits ---
  frightened_by: z.array(s()).default([]),
  housetrained: s(),
  accidents_frequency: s(),
  chase_behavior: s(),
  barker: s(),
  barking_details: sOpt(),

  // --- Reactivity/aggression ---
  gets_along_with_other_animals: z.array(s()).default([]),
  animals_not_along_with: sOpt(),
  leash_lunge_dogs: s(),
  leash_lunge_people: s(),
  lunge_is_play: sOpt(),
  overprotective: s(),
  tried_to_attack_or_bite_person_or_animal: s(),
  attack_bite_details: sOpt(),

  // --- Wrap-up ---
  dislikes_habits: s(),
  other_notes_for_success: s(),
  something_you_love: s(),
  heard_about_rmgdri: s(),

  // --- Certifications/signature (modeled as acknowledgements) ---
  print_dog_name_cert: s(), // “Print the name of the dog you are surrendering”
  certify_lawful_owner: s(),
  certify_over_18: s(),
  certify_accept_surrender_agreement: s(),
  surrendering_owner_signature: sOpt(),
  release_email_to_new_owner: s(),
  todays_date: s(),
  certify_email_communication_ack: s(),
});

export type OwnerSurrenderPayload = z.infer<typeof OwnerSurrenderSchema>;
