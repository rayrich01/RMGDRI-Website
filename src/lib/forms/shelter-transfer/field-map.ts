/* ------------------------------------------------------------------ *
 *  Shelter / Rescue Transfer — field-map (drives form UI + validation) *
 *  Derived from the 11-page RMGDRI JotForm PDF reference               *
 * ------------------------------------------------------------------ */

export interface FieldDef {
  key: string;
  label: string;
  required: boolean;
  type: "text" | "textarea" | "select" | "radio" | "email" | "checkbox-group";
  section: string;
  options?: string[];
  placeholder?: string;
}

export const SHELTER_TRANSFER_FIELD_MAP: FieldDef[] = [
  /* ── Section 1: Organization Information ── */
  { key: "org_name", label: "Name of Your Rescue or Shelter", required: true, type: "text", section: "Organization Information" },
  { key: "org_street_address", label: "Street Address", required: true, type: "text", section: "Organization Information" },
  { key: "org_street_address_2", label: "Street Address Line 2", required: false, type: "text", section: "Organization Information" },
  { key: "org_city", label: "City", required: true, type: "text", section: "Organization Information" },
  { key: "org_state", label: "State / Province", required: true, type: "text", section: "Organization Information" },
  { key: "org_zip", label: "Postal / Zip Code", required: true, type: "text", section: "Organization Information" },

  /* ── Section 2: Representative Information ── */
  { key: "rep_name", label: "Name of Rescue or Shelter Representative", required: true, type: "text", section: "Representative Information" },
  { key: "rep_email", label: "Representative's Email", required: true, type: "email", section: "Representative Information", placeholder: "example@example.com" },
  { key: "rep_phone", label: "Representative's Phone Number", required: true, type: "text", section: "Representative Information" },
  { key: "rep_phone_alt", label: "Additional Phone Number", required: false, type: "text", section: "Representative Information" },

  /* ── Section 3: Dog Basic Information ── */
  { key: "dog_name", label: "Dog's Name/Nicknames", required: true, type: "text", section: "Dog Basic Information", placeholder: "Please only include ONE dog per form" },
  { key: "dog_dob_age", label: "Dog's DOB/Approximate Age", required: true, type: "text", section: "Dog Basic Information" },
  { key: "rescue_deadline", label: "Is there a date that the dog needs to be rescued by, i.e. euthanasia date?", required: false, type: "text", section: "Dog Basic Information" },
  { key: "breed_status", label: "Is the dog a purebred Great Dane or a Great Dane Mix?", required: true, type: "radio", section: "Dog Basic Information", options: ["Dog is purebred Great Dane", "Dog is a Great Dane Mix"] },
  { key: "mix_breed", label: "If the dog is a mix, what breed is it mixed with?", required: false, type: "text", section: "Dog Basic Information" },
  { key: "dog_color_markings", label: "Dog's Color and Markings", required: false, type: "text", section: "Dog Basic Information" },
  { key: "dog_weight", label: "Dog's Current Weight", required: false, type: "text", section: "Dog Basic Information" },
  { key: "dog_gender", label: "Gender", required: true, type: "radio", section: "Dog Basic Information", options: ["Male", "Female", "I am not sure"] },
  { key: "spayed_neutered", label: "Is the dog spayed or neutered?", required: true, type: "radio", section: "Dog Basic Information", options: ["Yes", "No", "I am not sure"] },
  { key: "microchipped", label: "Is the dog microchipped?", required: true, type: "radio", section: "Dog Basic Information", options: ["Yes", "No", "I am not sure"] },
  { key: "microchip_number", label: "If microchipped, please provide microchip number here:", required: false, type: "text", section: "Dog Basic Information" },
  { key: "ears", label: "Ears", required: true, type: "radio", section: "Dog Basic Information", options: ["Natural", "Cropped", "I am not sure"] },

  /* ── Section 4: Intake History ── */
  { key: "intake_reason", label: "Please explain how this dog came into your care, i.e. why the previous owner surrendered the dog.", required: true, type: "textarea", section: "Intake History" },
  { key: "time_in_care", label: "How long has the dog been in your care?", required: true, type: "text", section: "Intake History" },

  /* ── Section 5: Medical Information ── */
  { key: "vet_evaluated", label: "Has the dog been medically evaluated by a veterinarian within the last year?", required: true, type: "radio", section: "Medical Information", options: ["Yes", "No", "I am not sure"] },
  { key: "vet_name", label: "Veterinarian's Name", required: false, type: "text", section: "Medical Information" },
  { key: "vet_address", label: "Veterinarian's Address", required: false, type: "text", section: "Medical Information" },
  { key: "vet_phone", label: "Veterinarian's Phone Number", required: false, type: "text", section: "Medical Information" },
  { key: "prior_surgeries", label: "Has this dog ever required any surgeries?", required: true, type: "radio", section: "Medical Information", options: ["Yes", "No", "I am not sure"] },
  { key: "surgery_details", label: "If yes, please explain the required surgery/surgeries.", required: false, type: "textarea", section: "Medical Information" },
  { key: "vaccinations_current", label: "Is this dog up to date on vaccinations?", required: true, type: "radio", section: "Medical Information", options: ["Yes", "No", "I am not sure"] },
  { key: "heartworm_tested", label: "Has this dog been tested for heartworm in the last year?", required: true, type: "radio", section: "Medical Information", options: ["Yes", "No", "I am not sure"] },
  { key: "medical_conditions", label: "Has this dog ever been diagnosed with, or treated for any of the following? (Check all that apply)", required: false, type: "checkbox-group", section: "Medical Information", options: ["Allergies", "Bloat/GDV", "Wobbler's Syndrome", "Organ Failure", "Thyroid Disease", "Epilepsy/Seizures", "DCM", "Hip Dysplasia", "Elbow Dysplasia", "Heartworm", "None", "Other"] },
  { key: "medical_conditions_other", label: "If Other, please specify:", required: false, type: "text", section: "Medical Information" },
  { key: "medications_special_diet", label: "Does the dog need any medications or special diet?", required: true, type: "radio", section: "Medical Information", options: ["Yes", "No"] },
  { key: "medications_details", label: "If yes, please describe medications or special diet:", required: false, type: "textarea", section: "Medical Information" },

  /* ── Section 6: Housebreaking & Training ── */
  { key: "housebroken", label: "Is the dog housebroken?", required: true, type: "radio", section: "Housebreaking & Training", options: ["Yes", "No", "I am not sure"] },
  { key: "accident_frequency", label: "If the dog is NOT housebroken, how often do they have accidents?", required: false, type: "radio", section: "Housebreaking & Training", options: ["Once a day", "Once a week", "Every time the dog is inside"] },
  { key: "housebreaking_notes", label: "If the dog is NOT housebroken, please explain. Has the dog ever been seen by a veterinarian for this problem?", required: false, type: "textarea", section: "Housebreaking & Training" },
  { key: "crate_trained", label: "Is the dog crate trained?", required: true, type: "radio", section: "Housebreaking & Training", options: ["Yes", "No", "I am not sure"] },
  { key: "destructive_free_roam", label: "Is the dog destructive with free roam?", required: true, type: "radio", section: "Housebreaking & Training", options: ["Yes", "No", "I am not sure"] },
  { key: "leash_behavior", label: "How does the dog walk on a leash? What sort of collar/leash is being used?", required: false, type: "textarea", section: "Housebreaking & Training" },

  /* ── Section 7: Behavioral Assessment ── */
  { key: "behavioral_eval", label: "Has this dog been behaviorally evaluated? If so, when was the evaluation and please explain the behavior evaluation and outcomes.", required: false, type: "textarea", section: "Behavioral Assessment" },
  { key: "resource_guarding", label: "Does the dog exhibit any resource guarding or food aggression?", required: false, type: "textarea", section: "Behavioral Assessment" },
  { key: "aggression_reactivity", label: "Does the dog exhibit any form of aggression or reactivity, such as leash aggression/reactivity, kennel aggression, dog aggression/reactivity, human aggression/reactivity, etc?", required: false, type: "textarea", section: "Behavioral Assessment" },
  { key: "temperament_traits", label: "How would you explain the dog most of the time? (Check all that apply)", required: false, type: "checkbox-group", section: "Behavioral Assessment", options: ["Very active", "Couch potato", "Talkative", "Quiet", "Playful", "Friendly to family", "Shy to family", "Friendly to visitors", "Shy to visitors", "Affectionate", "Lap dog", "Fearful", "Independent", "Fearless", "Aloof", "Withdrawn", "Other"] },
  { key: "temperament_other", label: "If Other temperament, please specify:", required: false, type: "text", section: "Behavioral Assessment" },
  { key: "play_style", label: "How does the dog like to play? (Check all that apply)", required: false, type: "checkbox-group", section: "Behavioral Assessment", options: ["Plays gently, does not use teeth or claws", "Likes to play rough, may bite or scratch", "Likes to play ball", "Likes stuffed toys", "Likes to learn tricks for treats", "Likes to play in or around water", "Likes to play with dogs of all sizes", "Prefers to play with larger dogs", "Prefers to play with smaller dogs", "Not interested in play", "Other"] },
  { key: "play_style_other", label: "If Other play style, please specify:", required: false, type: "text", section: "Behavioral Assessment" },

  /* ── Section 8: Bite History ── */
  { key: "bitten_human", label: "Has the dog ever bitten a human?", required: true, type: "radio", section: "Bite History", options: ["Yes", "No"] },
  { key: "bitten_human_details", label: "If the dog has bitten a human, where on the body and what were the circumstances?", required: false, type: "textarea", section: "Bite History" },
  { key: "bitten_animal", label: "Has the dog ever bitten another animal?", required: true, type: "radio", section: "Bite History", options: ["Yes", "No"] },
  { key: "bitten_animal_details", label: "If the dog has bitten another animal, what kind of animal and what were the circumstances?", required: false, type: "textarea", section: "Bite History" },

  /* ── Section 9: Compatibility ── */
  { key: "lived_with_dogs", label: "Has the dog ever lived with other dogs?", required: true, type: "radio", section: "Compatibility", options: ["Yes", "No", "I am not sure"] },
  { key: "lived_with_dogs_details", label: "If yes, please explain how the dogs got along living together, the age, sex, and breed of each dog the Dane has lived with, if known.", required: false, type: "textarea", section: "Compatibility" },
  { key: "lived_with_cats", label: "Has the dog ever lived with cats?", required: true, type: "radio", section: "Compatibility", options: ["Yes", "No", "I am not sure"] },
  { key: "lived_with_cats_details", label: "If yes, please explain how the dog and cat got along.", required: false, type: "textarea", section: "Compatibility" },
  { key: "lived_with_children", label: "Has the dog ever lived with children (under the age of 18)?", required: true, type: "radio", section: "Compatibility", options: ["Yes", "No", "I am not sure"] },
  { key: "lived_with_children_details", label: "If the dog has lived with children, what were the ages of the children and how was their relationship?", required: false, type: "textarea", section: "Compatibility" },

  /* ── Section 10: Fears & Quirks ── */
  { key: "fears", label: "Is the dog afraid of anything? (Check all that apply)", required: false, type: "checkbox-group", section: "Fears & Quirks", options: ["Men", "Women", "Children", "Hats", "Balloons", "Brooms", "Vacuums", "Large trucks", "Sudden loud sounds", "Water", "Fireworks", "Hands", "Feet", "Bicycles", "Other"] },
  { key: "fears_other", label: "If Other fears, please specify:", required: false, type: "text", section: "Fears & Quirks" },
  { key: "escape_history", label: "Did the dog ever repeatedly escape from a yard?", required: true, type: "radio", section: "Fears & Quirks", options: ["Yes", "No"] },
  { key: "escape_details", label: "If yes, please explain the type of fencing, if known, and how the dog escaped.", required: false, type: "textarea", section: "Fears & Quirks" },
  { key: "quirks", label: "Does the dog have any quirks or anything the previous owners or current caretakers are not fond of?", required: false, type: "textarea", section: "Fears & Quirks" },
  { key: "what_they_love", label: "Is there anything the previous owners or current caretakers truly love(d) about the dog?", required: false, type: "textarea", section: "Fears & Quirks" },

  /* ── Section 11: Additional Resources ── */
  { key: "additional_resources", label: "If RMGDRI is able to accept this dog, are there any additional resources you may be able to provide for this dog (i.e. transport, food, veterinary care, etc)?", required: false, type: "textarea", section: "Additional Resources", placeholder: "Additional resources are not required but always appreciated." },

  /* ── Section 12: Certification & Signature ── */
  { key: "agree_statement", label: "Do you agree with the above statement?", required: true, type: "radio", section: "Certification & Signature", options: ["Yes", "No"] },
  { key: "representative_signature", label: "Representative's Signature (type full name)", required: true, type: "text", section: "Certification & Signature" },
  { key: "signature_date", label: "Today's Date", required: true, type: "text", section: "Certification & Signature", placeholder: "MM/DD/YYYY" },
  { key: "signature_dog_name", label: "Dog's Name", required: true, type: "text", section: "Certification & Signature" },
];

/** Unique ordered section names */
export const SHELTER_TRANSFER_SECTIONS: string[] = [
  ...new Set(SHELTER_TRANSFER_FIELD_MAP.map((f) => f.section)),
];
