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
  owner_address_line1: sOpt(),
  owner_address_line2: sOpt(),
  owner_city: sOpt(),
  owner_state: sOpt(),
  owner_postal_code: sOpt(),
  owner_contact_phone_primary: s(),
  owner_contact_phone_secondary: sOpt(),

  // --- Dog basics ---
  dog_name: s(),
  dog_dob_or_age: s(), // DOB or Approx Age (as provided)
  dog_is_great_dane_or_mix: s(), // "Great Dane" | "Great Dane Mix" etc.
  dog_mix_breed_details: sOpt(),
  dog_weight: s(),
  dog_color: sOpt(),
  dog_markings: sOpt(),
  dog_gender: s(), // "male" | "female" (store as provided)
  dog_spayed_neutered: s(), // yes/no/unknown (store as provided)
  dog_gastropexy_tacked: s(), // yes/no/unknown (store as provided)
  dog_microchipped: sOpt(),

  // --- Surrender reason/timing ---
  surrender_reason: sOpt(),
  interested_in_resources_to_keep: sOpt(), // yes/no
  surrender_deadline: sOpt(), // when does dog need to be out
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
  vet_name: sOpt(),
  vet_office_address: s(),
  vet_office_phone: s(),
  multiple_vets_details: sOpt(),

  // --- Medical history ---
  required_surgeries: s(),
  surgeries_details: sOpt(),
  diagnosed_or_treated_conditions: z.array(s()).default([]), // checkbox list
  external_abnormalities: sOpt(),
  external_abnormalities_details: sOpt(),
  meds_supplements_special_diets: sOpt(),
  current_food_brand: sOpt(),
  feeding_schedule_amount: s(),
  other_medical_notes: sOpt(),

  // --- Behavior / temperament ---
  personality_traits: z.array(s()).default([]), // "Very Active", "Couch Potato", etc.
  anxiety_present: sOpt(),
  play_preferences: z.array(s()).default([]),
  favorite_toys_activities: sOpt(),
  energy_level: s(),
  exercise_routine: sOpt(),
  temperament_notes: sOpt(),

  // --- Training / handling ---
  leash_behavior: s(),
  collar_type: sOpt(),
  training_types: z.array(s()).default([]),
  basic_commands: z.array(s()).default([]),
  knows_tricks: sOpt(),

  // --- Household / environment ---
  household_description: sOpt(),
  home_access_areas: z.array(s()).default([]),
  where_dog_spends_time: z.array(s()).default([]),
  yard_fenced: sOpt(),
  yard_not_fenced_management: sOpt(),
  repeated_escapes: sOpt(),
  escape_how: sOpt(),
  crate_trained: s(),
  destructive_if_left_alone: sOpt(),
  where_left_when_alone: s(),
  hours_unsupervised_per_day: sOpt(),
  sleeping_location: sOpt(),
  people_ages_in_home: sOpt(),
  comfort_with: sOpt(), // adults / children / etc (store as provided)

  // --- Kids / other animals ---
  around_children_regularly: sOpt(),
  children_experience_positive: sOpt(),
  children_experience_negative_details: sOpt(),
  exposed_to_other_dogs: sOpt(),
  exposed_to_cats: sOpt(),
  cats_interaction: sOpt(),
  bitten_another_animal: sOpt(),
  bite_animal_details: sOpt(),

  // --- Fears / habits ---
  frightened_by: z.array(s()).default([]),
  housetrained: sOpt(),
  accidents_frequency: sOpt(),
  chase_behavior: sOpt(),
  barker: sOpt(),
  barking_details: sOpt(),

  // --- Reactivity/aggression ---
  gets_along_with_other_animals: z.array(s()).default([]),
  animals_not_along_with: sOpt(),
  leash_lunge_dogs: sOpt(),
  leash_lunge_people: sOpt(),
  lunge_is_play: sOpt(),
  overprotective: sOpt(),
  tried_to_attack_or_bite_person_or_animal: sOpt(),
  attack_bite_details: sOpt(),

  // --- Wrap-up ---
  dislikes_habits: sOpt(),
  other_notes_for_success: sOpt(),
  something_you_love: sOpt(),
  heard_about_rmgdri: s(),

  // --- Certifications/signature (modeled as acknowledgements) ---
  print_dog_name_cert: sOpt(), // “Print the name of the dog you are surrendering”
  certify_lawful_owner: sOpt(),
  certify_over_18: sOpt(),
  certify_accept_surrender_agreement: sOpt(),
  surrendering_owner_signature: sOpt(),
  release_email_to_new_owner: sOpt(),
  todays_date: sOpt(),
  certify_email_communication_ack: sOpt(),
});

export type OwnerSurrenderPayload = z.infer<typeof OwnerSurrenderSchema>;
