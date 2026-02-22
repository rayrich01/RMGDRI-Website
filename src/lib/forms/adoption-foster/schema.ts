import { z } from "zod";

/**
 * Adoption / Foster Application payload schema (RMGDRI).
 *
 * Derived from the 24-page "Adoption_Foster Application.txt" reference form.
 * Keys are stable snake_case for DB/event storage.
 */

const s = () => z.string().trim();
const sOpt = () => z.string().trim().optional().default("");

export const AdoptionFosterSchema = z.object({
  // --- Application type ---
  application_type: z.enum(["adopt", "foster", "both"]),

  // --- Acknowledgements (top of form) ---
  ack_application_fee: z.enum(["yes", "no"]),
  ack_adoption_fee: z.enum(["yes", "no"]),
  ack_wait_time: z.enum(["yes", "no"]),
  ack_behavioral_work: z.enum(["yes", "no"]),
  ack_dane_capabilities: z.enum(["yes", "no"]),
  ack_transparency: z.enum(["yes", "no"]),

  // --- Applicant info ---
  applicant_first_name: s(),
  applicant_last_name: s(),
  spouse_first_name: sOpt(),
  spouse_last_name: sOpt(),
  address_street: s(),
  address_street2: sOpt(),
  address_city: s(),
  address_state: s(),
  address_zip: s(),
  phone_primary: s(),
  phone_additional: sOpt(),
  email: s(),

  // --- Home info ---
  home_type: s(), // Single Family Home, Apartment, Condo/Townhome, Mobile Home, Other
  own_or_rent: s(), // Own, Rent/Lease
  landlord_name: sOpt(),
  landlord_phone: sOpt(),
  landlord_letter: sOpt(), // description of permission letter

  // --- How heard / breed experience ---
  how_heard_about_us: sOpt(),
  owned_great_dane_before: z.enum(["yes", "no"]),
  owned_giant_breed: sOpt(),
  giant_breed_details: sOpt(),
  dane_experience_if_none: sOpt(),
  dane_knowledge: s(), // temperament, health, daily requirements
  why_interested_in_dane: s(),

  // --- Daily life ---
  daily_life_with_dane: s(),
  vacation_pet_care: s(),
  aware_kenneling_expensive: z.enum(["yes", "no"]),

  // --- Household members ---
  household_member_1_name: s(),
  household_member_1_age: s(),
  household_member_1_relationship: s(),
  household_member_2_name: sOpt(),
  household_member_2_age: sOpt(),
  household_member_2_relationship: sOpt(),
  household_member_3_name: sOpt(),
  household_member_3_age: sOpt(),
  household_member_3_relationship: sOpt(),
  household_member_4_name: sOpt(),
  household_member_4_age: sOpt(),
  household_member_4_relationship: sOpt(),
  household_member_5_name: sOpt(),
  household_member_5_age: sOpt(),
  household_member_5_relationship: sOpt(),
  additional_household_members: sOpt(),

  // --- Children / guests exposure ---
  exposed_to_guests_children: sOpt(),
  children_ages_outside_family: sOpt(),

  // --- Allergies ---
  allergies_in_household: z.enum(["yes", "no"]),
  allergies_handling: sOpt(),

  // --- Behavioral preferences ---
  unwilling_behaviors: s(), // behaviors not willing to consider
  age_gender_preferences: sOpt(),
  willing_bite_history: s(), // Yes / No / Depends
  all_members_want_dane: z.enum(["yes", "no"]),
  hesitations_concerns: z.enum(["yes", "no"]),
  hesitations_details: sOpt(),

  // --- Daily schedule ---
  hours_alone_per_day: s(),
  anyone_home_during_day: z.enum(["yes", "no"]),
  where_dog_stays_when_alone: s(),
  leave_dog_outside_alone: sOpt(),

  // --- Crate ---
  crated_before: z.enum(["yes", "no"]),
  own_dane_sized_crate: z.enum(["yes", "no"]),
  plan_to_crate: sOpt(),

  // --- Training / exercise ---
  collar_leash_type: s(), // RMGDRI does not condone shock/pinch/choke
  exercise_plan: s(),

  // --- Current pets ---
  pet_1_name: sOpt(),
  pet_1_type: sOpt(),
  pet_1_breed: sOpt(),
  pet_1_gender: sOpt(),
  pet_1_altered: sOpt(),
  pet_1_age: sOpt(),
  pet_1_temperament: sOpt(),
  pet_2_name: sOpt(),
  pet_2_type: sOpt(),
  pet_2_breed: sOpt(),
  pet_2_gender: sOpt(),
  pet_2_altered: sOpt(),
  pet_2_age: sOpt(),
  pet_2_temperament: sOpt(),
  pet_3_name: sOpt(),
  pet_3_type: sOpt(),
  pet_3_breed: sOpt(),
  pet_3_gender: sOpt(),
  pet_3_altered: sOpt(),
  pet_3_age: sOpt(),
  pet_3_temperament: sOpt(),
  additional_pets: sOpt(),

  // --- Vet info ---
  vet_name: s(),
  vet_phone: s(),
  vet_address: sOpt(),

  // --- Past pet history ---
  past_pet_not_kept: sOpt(),
  past_pet_reason: sOpt(),
  past_pet_surrendered_to_rescue: sOpt(),

  // --- Yard / fencing ---
  yard_fenced: z.enum(["yes", "no"]),
  fence_type: sOpt(),
  fence_height: sOpt(),
  no_fence_exercise_plan: sOpt(),

  // --- Specific dog interest ---
  specific_dog_interest: sOpt(), // name of dog if any
  why_this_dog: sOpt(),

  // --- Foster-specific questions ---
  foster_experience: sOpt(),
  foster_duration_comfortable: sOpt(),
  foster_willing_to_transport: sOpt(),

  // --- References ---
  reference_1_name: s(),
  reference_1_phone: s(),
  reference_1_relationship: s(),
  reference_2_name: sOpt(),
  reference_2_phone: sOpt(),
  reference_2_relationship: sOpt(),
  reference_3_name: sOpt(),
  reference_3_phone: sOpt(),
  reference_3_relationship: sOpt(),

  // --- Agreement / signature ---
  certify_info_true: z.enum(["yes"]),
  certify_over_21: z.enum(["yes"]),
  electronic_signature: s(),
  todays_date: sOpt(),

  // --- Additional notes ---
  additional_notes: sOpt(),
});

export type AdoptionFosterPayload = z.infer<typeof AdoptionFosterSchema>;
