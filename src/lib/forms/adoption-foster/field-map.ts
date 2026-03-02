/**
 * Adoption / Foster Application field map.
 *
 * Drives dynamic form rendering + required enforcement.
 * Derived from the 24-page RMGDRI Adoption_Foster Application PDF.
 */

export type FieldType = "text" | "textarea" | "select" | "radio" | "email" | "checkbox-group";

export interface FieldDef {
  key: string;
  label: string;
  required: boolean;
  type: FieldType;
  section: string;
  options?: string[];
  placeholder?: string;
}

export const ADOPTION_FOSTER_FIELD_MAP: FieldDef[] = [
  // --- Section: Application Type ---
  { key: "application_type", label: "I am applying to", required: true, type: "radio", section: "Application Type", options: ["adopt", "foster", "both"] },

  // --- Section: Acknowledgements ---
  { key: "ack_wait_time", label: "I understand that this application does not guarantee me a Great Dane and that I may have to wait 3-6+ months to be matched with a Dane for my family.", required: true, type: "radio", section: "Acknowledgements", options: ["yes", "no"] },
  { key: "ack_behavioral_work", label: "I understand I will likely have to work with your Dane after adoption to help them meet their full potential. This includes separation anxiety, leash reactivity, dog/cat/human reactions/aggressions, destructive when left alone, need slow introductions, etc. (Perfect dogs - meaning those who are laid back and fit right into the home- will rarely be available).", required: true, type: "radio", section: "Acknowledgements", options: ["yes", "no"] },
  { key: "ack_dane_capabilities", label: "I understand that while Great Danes have been called Gentle Giants, that they are capable of things like reactivity, aggression, and other behavioral issues despite the best upbringing?", required: true, type: "radio", section: "Acknowledgements", options: ["yes", "no"] },
  { key: "ack_transparency", label: "Our rescue is very transparent with the information we have about the Danes in our care. After approval and when speaking with the Adoption Director about a specific dog, you will be able to review all the information we have about that dog. There may be items about the dog that are not displayed on the website, like a bite history or tendency to eat/ingest toys, socks, etc.", required: true, type: "radio", section: "Acknowledgements", options: ["Great! Let's get started", "Other"] },

  // --- Section: Your Information ---
  { key: "applicant_first_name", label: "First Name", required: true, type: "text", section: "Your Information" },
  { key: "applicant_last_name", label: "Last Name", required: true, type: "text", section: "Your Information" },
  { key: "email", label: "Email Address", required: true, type: "email", section: "Your Information" },
  { key: "spouse_first_name", label: "Spouse's First Name (if applicable)", required: false, type: "text", section: "Your Information" },
  { key: "spouse_last_name", label: "Spouse's Last Name", required: false, type: "text", section: "Your Information" },
  { key: "address_street", label: "Street Address", required: true, type: "text", section: "Your Information" },
  { key: "address_street2", label: "Street Address Line 2", required: false, type: "text", section: "Your Information" },
  { key: "address_city", label: "City", required: true, type: "text", section: "Your Information" },
  { key: "address_state", label: "State", required: true, type: "text", section: "Your Information" },
  { key: "address_zip", label: "Zip Code", required: true, type: "text", section: "Your Information" },
  { key: "phone_primary", label: "Phone Number", required: true, type: "text", section: "Your Information" },
  { key: "phone_additional", label: "Additional Phone Number", required: false, type: "text", section: "Your Information" },

  // --- Section: Home Information ---
  { key: "home_type", label: "What type of home do you have?", required: true, type: "select", section: "Home Information", options: ["Single Family Home", "Apartment", "Condo/Townhome", "Mobile Home", "Other"] },
  { key: "own_or_rent", label: "Do you own or rent/lease?", required: true, type: "radio", section: "Home Information", options: ["Own", "Rent/Lease"] },
  { key: "landlord_name", label: "Landlord's Name (if renting)", required: false, type: "text", section: "Home Information" },
  { key: "landlord_phone", label: "Landlord's Phone Number", required: false, type: "text", section: "Home Information" },
  { key: "landlord_letter", label: "Landlord Permission Letter Details", required: false, type: "textarea", section: "Home Information" },

  // --- Section: Breed Experience ---
  { key: "how_heard_about_us", label: "How did you hear about us?", required: false, type: "text", section: "Breed Experience" },
  { key: "owned_great_dane_before", label: "Have you ever owned a Great Dane?", required: true, type: "radio", section: "Breed Experience", options: ["yes", "no"] },
  { key: "owned_giant_breed", label: "Have you owned a Giant Breed?", required: false, type: "text", section: "Breed Experience" },
  { key: "giant_breed_details", label: "What giant breed(s) did you own?", required: false, type: "text", section: "Breed Experience" },
  { key: "dane_experience_if_none", label: "If no Dane/Giant Breed experience, what experience do you have?", required: false, type: "textarea", section: "Breed Experience" },
  { key: "dane_knowledge", label: "Tell us what you know about Great Danes (temperament, health, daily requirements)", required: true, type: "textarea", section: "Breed Experience" },
  { key: "why_interested_in_dane", label: "Why are you interested in adding a Great Dane to your life?", required: true, type: "textarea", section: "Breed Experience" },

  // --- Section: Daily Life ---
  { key: "daily_life_with_dane", label: "Tell us about your daily life and how a new Dane will be incorporated", required: true, type: "textarea", section: "Daily Life" },
  { key: "vacation_pet_care", label: "What do you do with your pets when you go on vacation?", required: true, type: "textarea", section: "Daily Life" },
  { key: "aware_kenneling_expensive", label: "Are you aware that kenneling is more expensive for a Great Dane?", required: true, type: "radio", section: "Daily Life", options: ["yes", "no"] },

  // --- Section: Household Members ---
  { key: "household_member_1_name", label: "Member 1: Name", required: true, type: "text", section: "Household Members" },
  { key: "household_member_1_age", label: "Member 1: Age", required: true, type: "text", section: "Household Members" },
  { key: "household_member_1_relationship", label: "Member 1: Relationship to Applicant", required: true, type: "text", section: "Household Members" },
  { key: "household_member_2_name", label: "Member 2: Name", required: false, type: "text", section: "Household Members" },
  { key: "household_member_2_age", label: "Member 2: Age", required: false, type: "text", section: "Household Members" },
  { key: "household_member_2_relationship", label: "Member 2: Relationship", required: false, type: "text", section: "Household Members" },
  { key: "household_member_3_name", label: "Member 3: Name", required: false, type: "text", section: "Household Members" },
  { key: "household_member_3_age", label: "Member 3: Age", required: false, type: "text", section: "Household Members" },
  { key: "household_member_3_relationship", label: "Member 3: Relationship", required: false, type: "text", section: "Household Members" },
  { key: "household_member_4_name", label: "Member 4: Name", required: false, type: "text", section: "Household Members" },
  { key: "household_member_4_age", label: "Member 4: Age", required: false, type: "text", section: "Household Members" },
  { key: "household_member_4_relationship", label: "Member 4: Relationship", required: false, type: "text", section: "Household Members" },
  { key: "household_member_5_name", label: "Member 5: Name", required: false, type: "text", section: "Household Members" },
  { key: "household_member_5_age", label: "Member 5: Age", required: false, type: "text", section: "Household Members" },
  { key: "household_member_5_relationship", label: "Member 5: Relationship", required: false, type: "text", section: "Household Members" },
  { key: "additional_household_members", label: "If more than 5 members, please add them here", required: false, type: "textarea", section: "Household Members" },
  { key: "exposed_to_guests_children", label: "Will the Dane be exposed to guests/family/friends/children? How often?", required: false, type: "textarea", section: "Household Members" },
  { key: "children_ages_outside_family", label: "Ages of children outside the core family the Dane will be exposed to", required: false, type: "text", section: "Household Members" },
  { key: "allergies_in_household", label: "Any asthma or allergies in household to dogs or cats?", required: true, type: "radio", section: "Household Members", options: ["yes", "no"] },
  { key: "allergies_handling", label: "If allergies, how are they handled?", required: false, type: "textarea", section: "Household Members" },

  // --- Section: Behavioral Preferences ---
  { key: "unwilling_behaviors", label: "What types of behaviors are you NOT willing to consider?", required: true, type: "textarea", section: "Behavioral Preferences" },
  { key: "age_gender_preferences", label: "Do you have any preferences on age range or gender?", required: false, type: "text", section: "Behavioral Preferences" },
  { key: "willing_bite_history", label: "Are you willing to adopt a dog with a bite history?", required: true, type: "select", section: "Behavioral Preferences", options: ["Yes", "No", "Depends on the information about the bite"] },
  { key: "all_members_want_dane", label: "Do all members of the household want to adopt or foster a Great Dane?", required: true, type: "radio", section: "Behavioral Preferences", options: ["yes", "no"] },
  { key: "hesitations_concerns", label: "Does anyone in the home have hesitations or concerns?", required: true, type: "radio", section: "Behavioral Preferences", options: ["yes", "no"] },
  { key: "hesitations_details", label: "If yes, please explain", required: false, type: "textarea", section: "Behavioral Preferences" },

  // --- Section: Daily Schedule ---
  { key: "hours_alone_per_day", label: "How many hours per day, on average, will the dog be alone?", required: true, type: "text", section: "Daily Schedule" },
  { key: "anyone_home_during_day", label: "Is there anyone home during the day?", required: true, type: "radio", section: "Daily Schedule", options: ["yes", "no"] },
  { key: "where_dog_stays_when_alone", label: "Where will the dog stay during the day when alone?", required: true, type: "textarea", section: "Daily Schedule" },
  { key: "leave_dog_outside_alone", label: "Do you plan on leaving your dog alone outside while you are gone?", required: false, type: "text", section: "Daily Schedule" },

  // --- Section: Crate & Training ---
  { key: "crated_before", label: "Have you ever crated a dog before?", required: true, type: "radio", section: "Crate & Training", options: ["yes", "no"] },
  { key: "own_dane_sized_crate", label: "Do you own a Dane-sized crate (54\"L x 36\"W x 45\"H)?", required: true, type: "radio", section: "Crate & Training", options: ["yes", "no"] },
  { key: "plan_to_crate", label: "Do you plan on crating the dog when alone?", required: false, type: "text", section: "Crate & Training" },
  { key: "collar_leash_type", label: "What collars/leash do you use? (RMGDRI does not condone shock, pinch, or choke collars)", required: true, type: "text", section: "Crate & Training" },
  { key: "exercise_plan", label: "What type of exercise do you plan on providing? How often?", required: true, type: "textarea", section: "Crate & Training" },

  // --- Section: Current Pets ---
  { key: "pet_1_name", label: "Pet 1: Name", required: false, type: "text", section: "Current Pets" },
  { key: "pet_1_type", label: "Pet 1: Type (cat/dog/etc)", required: false, type: "text", section: "Current Pets" },
  { key: "pet_1_breed", label: "Pet 1: Breed", required: false, type: "text", section: "Current Pets" },
  { key: "pet_1_gender", label: "Pet 1: Gender", required: false, type: "text", section: "Current Pets" },
  { key: "pet_1_altered", label: "Pet 1: Spayed/Neutered?", required: false, type: "text", section: "Current Pets" },
  { key: "pet_1_age", label: "Pet 1: Age", required: false, type: "text", section: "Current Pets" },
  { key: "pet_1_temperament", label: "Pet 1: Temperament", required: false, type: "text", section: "Current Pets" },
  { key: "pet_2_name", label: "Pet 2: Name", required: false, type: "text", section: "Current Pets" },
  { key: "pet_2_type", label: "Pet 2: Type", required: false, type: "text", section: "Current Pets" },
  { key: "pet_2_breed", label: "Pet 2: Breed", required: false, type: "text", section: "Current Pets" },
  { key: "pet_2_gender", label: "Pet 2: Gender", required: false, type: "text", section: "Current Pets" },
  { key: "pet_2_altered", label: "Pet 2: Spayed/Neutered?", required: false, type: "text", section: "Current Pets" },
  { key: "pet_2_age", label: "Pet 2: Age", required: false, type: "text", section: "Current Pets" },
  { key: "pet_2_temperament", label: "Pet 2: Temperament", required: false, type: "text", section: "Current Pets" },
  { key: "pet_3_name", label: "Pet 3: Name", required: false, type: "text", section: "Current Pets" },
  { key: "pet_3_type", label: "Pet 3: Type", required: false, type: "text", section: "Current Pets" },
  { key: "pet_3_breed", label: "Pet 3: Breed", required: false, type: "text", section: "Current Pets" },
  { key: "pet_3_gender", label: "Pet 3: Gender", required: false, type: "text", section: "Current Pets" },
  { key: "pet_3_altered", label: "Pet 3: Spayed/Neutered?", required: false, type: "text", section: "Current Pets" },
  { key: "pet_3_age", label: "Pet 3: Age", required: false, type: "text", section: "Current Pets" },
  { key: "pet_3_temperament", label: "Pet 3: Temperament", required: false, type: "text", section: "Current Pets" },
  { key: "additional_pets", label: "Additional pets not listed above", required: false, type: "textarea", section: "Current Pets" },

  // --- Section: Veterinarian ---
  { key: "vet_name", label: "Veterinarian Name / Clinic", required: true, type: "text", section: "Veterinarian" },
  { key: "vet_phone", label: "Vet Phone Number", required: true, type: "text", section: "Veterinarian" },
  { key: "vet_address", label: "Vet Address", required: false, type: "text", section: "Veterinarian" },
  { key: "er_vet_name", label: "Name of the nearest 24-hour, emergency veterinary clinic/hospital to you", required: true, type: "text", section: "Veterinarian" },
  { key: "er_vet_street", label: "Emergency Vet Street Address", required: true, type: "text", section: "Veterinarian" },
  { key: "er_vet_street2", label: "Emergency Vet Street Address Line 2", required: false, type: "text", section: "Veterinarian" },
  { key: "er_vet_city", label: "Emergency Vet City", required: true, type: "text", section: "Veterinarian" },
  { key: "er_vet_state", label: "Emergency Vet State", required: true, type: "text", section: "Veterinarian" },
  { key: "er_vet_zip", label: "Emergency Vet Zip Code", required: true, type: "text", section: "Veterinarian" },
  { key: "er_vet_phone", label: "Phone Number of the nearest 24-hour, emergency veterinary clinic/hospital to you", required: true, type: "text", section: "Veterinarian" },
  { key: "gdv_knowledge", label: "Please tell us what you know about Gastric Dilatation Volvulus (GDV), or bloat. What are the causes, symptoms, and treatments for GDV?", required: true, type: "textarea", section: "Veterinarian" },
  { key: "gdv_cost_ability", label: "Please tell us what you think the cost of an emergency surgery to fix GDV would be. Would you have the ability to pay for an emergency visit/surgery like that?", required: true, type: "textarea", section: "Veterinarian" },
  { key: "dane_health_knowledge", label: "Please tell us what you know about other health concerns that may affect Great Danes at a higher rate than other breeds", required: true, type: "textarea", section: "Veterinarian" },
  { key: "medical_vet_experience", label: "What medical/veterinary experience do you have from previous pets? (i.e. insulin injections for diabetes, eye drops, sling walking, etc.)", required: true, type: "textarea", section: "Veterinarian" },
  { key: "willing_medical_conditions", label: "Which of the following medical conditions are you willing to consider?", required: true, type: "checkbox-group", section: "Veterinarian", options: ["Heart Disease", "Arthritis/joint disease", "Blind/deaf", "Seizures", "History of eating objects such as socks, toys, etc.", "Kidney or liver disease", "Eye issues", "Allergies", "History of cancer", "Lipomas (non-cancerous fatty tumors)", "Wobblers Syndrome", "None of the above", "Other"] },
  { key: "willing_medical_conditions_other", label: "If Other, please specify", required: false, type: "text", section: "Veterinarian" },

  // --- Section: Past Pet History ---
  { key: "past_pet_not_kept", label: "Have you ever had a pet you could not keep?", required: false, type: "text", section: "Past Pet History" },
  { key: "past_pet_reason", label: "If yes, what happened?", required: false, type: "textarea", section: "Past Pet History" },
  { key: "past_pet_surrendered_to_rescue", label: "Have you ever surrendered a pet to a rescue or shelter?", required: false, type: "text", section: "Past Pet History" },

  // --- Section: Yard & Fencing ---
  { key: "yard_fenced", label: "Is your yard fenced?", required: true, type: "radio", section: "Yard & Fencing", options: ["yes", "no"] },
  { key: "fence_type", label: "Fence type (wood, chain link, vinyl, etc.)", required: false, type: "text", section: "Yard & Fencing" },
  { key: "fence_height", label: "Fence height", required: false, type: "text", section: "Yard & Fencing" },
  { key: "yard_completely_fenced", label: "Is the yard completely fenced?", required: true, type: "select", section: "Yard & Fencing", options: ["Yes", "No", "Other"] },
  { key: "yard_enclosure_attached", label: "Is the yard enclosure attached to the house?", required: true, type: "select", section: "Yard & Fencing", options: ["Yes", "No", "Other"] },
  { key: "yard_size", label: "Yard Size", required: true, type: "select", section: "Yard & Fencing", options: ["No Yard", "Small", "Medium", "Large", "Other"] },
  { key: "yard_description", label: "Please describe your yard/area the dog will frequent for elimination", required: false, type: "textarea", section: "Yard & Fencing" },
  { key: "hours_outside_per_day", label: "How many hours per day will the dog be outside?", required: true, type: "select", section: "Yard & Fencing", options: ["1-3", "4-6", "7-10", "More than 10", "Other"] },
  { key: "no_fence_exercise_plan", label: "If no fence, how will you exercise your Dane?", required: false, type: "textarea", section: "Yard & Fencing" },

  // --- Section: Neighbors ---
  { key: "neighbors_description", label: "Please describe neighbors that the Dane will have contact with", required: true, type: "textarea", section: "Neighbors" },
  { key: "neighbors_have_pets", label: "Do your neighbors have dogs or cats?", required: true, type: "radio", section: "Neighbors", options: ["Yes", "No"] },
  { key: "neighbors_pets_details", label: "If yes, please explain the pets they have", required: false, type: "textarea", section: "Neighbors" },
  { key: "neighbors_have_children", label: "Do your neighbors have children?", required: true, type: "radio", section: "Neighbors", options: ["Yes", "No"] },
  { key: "neighbors_children_ages", label: "If yes, what are the ages of children?", required: false, type: "text", section: "Neighbors" },
  { key: "neighbor_conflicts", label: "Have there ever been, or are there currently, any issues/conflicts with your current neighbors?", required: true, type: "radio", section: "Neighbors", options: ["Yes", "No"] },

  // --- Section: Adjustment & Expectations ---
  { key: "willing_one_month_trial", label: "Are you willing to give the new dog at least one (1) month trial to ensure proper adjustment?", required: true, type: "radio", section: "Adjustment & Expectations", options: ["Yes", "No"] },
  { key: "pet_introduction_plan", label: "How have you introduced new pets in the past? If you have not introduced pets, how do you plan on introducing them?", required: true, type: "textarea", section: "Adjustment & Expectations" },
  { key: "breed_questions", label: "Are there any questions about the Great Dane breed, health, temperament, etc., or about our rescue or rescues in general, that we can answer?", required: true, type: "textarea", section: "Adjustment & Expectations" },
  { key: "surrender_conditions", label: "In your opinion, what is a situation, behavior, or condition that would constitute surrendering/rehoming a dog or pet?", required: false, type: "textarea", section: "Adjustment & Expectations" },
  { key: "animal_control_contact", label: "Have you ever been contacted by or had problems with Animal Control?", required: true, type: "radio", section: "Adjustment & Expectations", options: ["Yes", "No"] },

  // --- Section: Specific Dog Interest ---
  { key: "specific_dog_interest", label: "Is there a specific dog you are interested in?", required: false, type: "text", section: "Specific Dog Interest" },
  { key: "why_this_dog", label: "Why are you interested in this specific dog?", required: false, type: "textarea", section: "Specific Dog Interest" },

  // --- Section: Foster-Specific (shown if foster or both) ---
  { key: "foster_experience", label: "Do you have any foster experience?", required: false, type: "textarea", section: "Foster-Specific Questions" },
  { key: "foster_duration_comfortable", label: "How long are you comfortable fostering?", required: false, type: "text", section: "Foster-Specific Questions" },
  { key: "foster_willing_to_transport", label: "Are you willing to transport the foster dog to vet appointments?", required: false, type: "text", section: "Foster-Specific Questions" },

  // --- Section: References ---
  { key: "reference_1_name", label: "Reference 1: Name", required: true, type: "text", section: "References" },
  { key: "reference_1_phone", label: "Reference 1: Phone", required: true, type: "text", section: "References" },
  { key: "reference_1_email", label: "Reference 1: Email", required: true, type: "email", section: "References" },
  { key: "reference_1_relationship", label: "Reference 1: How do you know this reference?", required: true, type: "text", section: "References" },
  { key: "reference_2_name", label: "Reference 2: Name", required: true, type: "text", section: "References" },
  { key: "reference_2_phone", label: "Reference 2: Phone", required: true, type: "text", section: "References" },
  { key: "reference_2_email", label: "Reference 2: Email", required: true, type: "email", section: "References" },
  { key: "reference_2_relationship", label: "Reference 2: How do you know this reference?", required: true, type: "text", section: "References" },

  // --- Section: Certification & Signature ---
  { key: "certify_info_true", label: "I certify that all information provided is true and accurate", required: true, type: "radio", section: "Certification & Signature", options: ["yes"] },
  { key: "certify_over_21", label: "I certify that I am at least 21 years of age", required: true, type: "radio", section: "Certification & Signature", options: ["yes"] },
  { key: "electronic_signature", label: "Electronic Signature (type your full name)", required: true, type: "text", section: "Certification & Signature" },
  { key: "todays_date", label: "Today's Date", required: false, type: "text", section: "Certification & Signature", placeholder: "MM/DD/YYYY" },
  { key: "additional_notes", label: "Anything else you would like us to know?", required: false, type: "textarea", section: "Certification & Signature" },
];

/** Unique ordered section names */
export const ADOPTION_FOSTER_SECTIONS = [
  ...new Set(ADOPTION_FOSTER_FIELD_MAP.map((f) => f.section)),
];
