/**
 * Canonical field map for the RMGDRI Owner Surrender form.
 *
 * Source of truth: Lori's CR-4 document.
 * Every field is listed in form order with its type, section, options,
 * and required flag so that renderers, validators, and email builders
 * can all derive behaviour from one place.
 */

/* ------------------------------------------------------------------ */
/*  Shared type                                                       */
/* ------------------------------------------------------------------ */

export interface FieldDef {
  key: string;
  label: string;
  required: boolean;
  type:
    | "text"
    | "textarea"
    | "select"
    | "radio"
    | "email"
    | "tel"
    | "checkbox-group"
    | "checkbox"
    | "photos";
  section: string;
  options?: string[];
  placeholder?: string;
}

/* ------------------------------------------------------------------ */
/*  Field map                                                         */
/* ------------------------------------------------------------------ */

export const OWNER_SURRENDER_FIELD_MAP: FieldDef[] = [
  /* ============================================================== */
  /*  Section: Owner's General Information                          */
  /* ============================================================== */
  {
    key: "owner_name",
    label: "Owner's Name",
    required: true,
    type: "text",
    section: "Owner's General Information",
  },
  {
    key: "owner_email",
    label: "Owner's Email",
    required: true,
    type: "email",
    section: "Owner's General Information",
  },
  {
    key: "owner_address",
    label: "Owner's Address",
    required: false,
    type: "text",
    section: "Owner's General Information",
  },
  {
    key: "owner_phone_primary",
    label: "Owner's Preferred Phone Number",
    required: true,
    type: "tel",
    section: "Owner's General Information",
  },

  /* ============================================================== */
  /*  Section: Dog's General Information                            */
  /* ============================================================== */
  {
    key: "dog_name",
    label: "Dog's Name / Nicknames",
    required: true,
    type: "text",
    section: "Dog's General Information",
  },
  {
    key: "dog_dob_age",
    label: "Dog's DOB / Approximate Age",
    required: true,
    type: "text",
    section: "Dog's General Information",
  },
  {
    key: "dog_breed_type",
    label: "Is the dog a Great Dane or Great Dane Mix?",
    required: true,
    type: "radio",
    section: "Dog's General Information",
    options: ["Great Dane", "Great Dane Mix"],
  },
  {
    key: "mix_breed",
    label: "If the dog is a mix, what breed is it mixed with?",
    required: false,
    type: "text",
    section: "Dog's General Information",
  },
  {
    key: "mix_breed_acknowledgment",
    label:
      "I understand that because we are a breed-specific rescue, there are additional steps to determine if they would be considered a mix in our rescue. This may include additional pictures next to common items (chair, counter) for size references.",
    required: false,
    type: "checkbox",
    section: "Dog's General Information",
  },
  {
    key: "dog_weight",
    label: "Dog's Weight",
    required: true,
    type: "text",
    section: "Dog's General Information",
  },
  {
    key: "dog_color",
    label: "Color of Dog",
    required: false,
    type: "text",
    section: "Dog's General Information",
  },
  {
    key: "dog_markings",
    label: "Markings",
    required: false,
    type: "text",
    section: "Dog's General Information",
  },
  {
    key: "dog_sex",
    label: "Gender",
    required: true,
    type: "radio",
    section: "Dog's General Information",
    options: ["Male", "Female"],
  },
  {
    key: "dog_altered",
    label: "Is the dog spayed or neutered?",
    required: true,
    type: "radio",
    section: "Dog's General Information",
    options: ["Yes", "No"],
  },
  {
    key: "dog_gastropexied",
    label: "Has the dog been gastropexied (had stomach tacked)?",
    required: true,
    type: "radio",
    section: "Dog's General Information",
    options: ["Yes", "No", "I am not sure"],
  },
  {
    key: "dog_microchipped",
    label: "Is the dog microchipped?",
    required: false,
    type: "radio",
    section: "Dog's General Information",
    options: ["Yes", "No", "I am not sure"],
  },
  {
    key: "dog_ears",
    label: "Ears",
    required: false,
    type: "radio",
    section: "Dog's General Information",
    options: ["Natural", "Cropped"],
  },

  /* ============================================================== */
  /*  Section: Photos                                               */
  /* ============================================================== */
  {
    key: "photos",
    label: "Please upload pictures of this dog (up to 3)",
    required: false,
    type: "photos",
    section: "Photos",
  },

  /* ============================================================== */
  /*  Section: Dog's History                                        */
  /* ============================================================== */
  {
    key: "surrender_reason",
    label: "Please explain why you are surrendering the dog.",
    required: true,
    type: "textarea",
    section: "Dog's History",
  },
  {
    key: "interested_in_keeping",
    label:
      "If we could help you resolve this issue, would you be interested in keeping this dog?",
    required: false,
    type: "radio",
    section: "Dog's History",
    options: ["Yes", "No"],
  },
  {
    key: "placement_timeline",
    label:
      "When does the dog absolutely need to be placed? Please note- surrendering is not a quick or speedy process- it may take several weeks to several months to place a dog, depending on the circumstances, but we try our best.",
    required: false,
    type: "textarea",
    section: "Dog's History",
  },
  {
    key: "ownership_duration",
    label: "How long have you owned the dog?",
    required: true,
    type: "text",
    section: "Dog's History",
  },
  {
    key: "prior_history",
    label: "What do you know of the dog's history prior to your own?",
    required: true,
    type: "textarea",
    section: "Dog's History",
  },
  {
    key: "acquisition_source",
    label: "Where did you acquire the dog?",
    required: true,
    type: "select",
    section: "Dog's History",
    options: [
      "Breeder",
      "Pet Store",
      "Shelter/Rescue",
      "Private Party",
      "Stray",
      "Other",
    ],
  },
  {
    key: "breeder_contact_info",
    label:
      "If you answered 'Breeder' above please include the Breeder's contact information",
    required: false,
    type: "textarea",
    section: "Dog's History",
  },
  {
    key: "breeder_rescue_contacted",
    label:
      "If you answered 'Breeder' or 'Shelter/Rescue' above have you contacted them?",
    required: false,
    type: "radio",
    section: "Dog's History",
    options: ["Yes", "No", "N/A"],
  },
  {
    key: "breeder_rescue_contacted_details",
    label:
      "If yes, please let us know who you spoke with, the date, and the reason you were given that they were unable to take this dog back?",
    required: false,
    type: "textarea",
    section: "Dog's History",
  },
  {
    key: "rmgdri_adoption_info",
    label:
      "If you adopted the dog from RMGDRI, please list the date of adoption and the dog's name at the time of adoption.",
    required: false,
    type: "text",
    section: "Dog's History",
  },
  {
    key: "rescue_shelter_info",
    label:
      "If you answered Rescue/Shelter \u2014 Name, Address, State and Phone of Rescue/Shelter",
    required: false,
    type: "textarea",
    section: "Dog's History",
  },

  /* ============================================================== */
  /*  Section: Medical                                              */
  /* ============================================================== */
  {
    key: "vet_yearly",
    label: "Has the dog seen a veterinarian at least once a year?",
    required: true,
    type: "radio",
    section: "Medical",
    options: ["Yes", "No"],
  },
  {
    key: "vaccinations_current",
    label:
      "Is the dog current on vaccinations? (rabies and distemper/parvo)",
    required: true,
    type: "radio",
    section: "Medical",
    options: ["Yes", "No"],
  },
  {
    key: "heartworm_prevention",
    label: "Is this dog currently on heartworm prevention?",
    required: true,
    type: "radio",
    section: "Medical",
    options: ["Yes", "No"],
  },
  {
    key: "spay_neuter_age",
    label:
      "If the dog has been spayed or neutered, at what age were they spayed or neutered?",
    required: false,
    type: "text",
    section: "Medical",
  },
  {
    key: "last_heat_cycle",
    label:
      "If the dog is a female and has not been spayed, when was her last heat cycle?",
    required: false,
    type: "text",
    section: "Medical",
  },
  {
    key: "vet_name",
    label: "Veterinarian's name (to obtain vet records)",
    required: false,
    type: "text",
    section: "Medical",
  },
  {
    key: "vet_address",
    label: "Veterinary office address",
    required: true,
    type: "text",
    section: "Medical",
  },
  {
    key: "vet_phone",
    label: "Veterinary office phone number",
    required: true,
    type: "tel",
    section: "Medical",
  },
  {
    key: "additional_vets",
    label:
      "If the pet has been to more than one veterinarian, please include the contact information for the additional veterinarians.",
    required: false,
    type: "textarea",
    section: "Medical",
  },
  {
    key: "surgeries",
    label: "Has the dog ever required any surgeries?",
    required: true,
    type: "radio",
    section: "Medical",
    options: ["Yes", "No", "I am not sure"],
  },
  {
    key: "surgery_details",
    label: "If yes, please explain",
    required: false,
    type: "textarea",
    section: "Medical",
  },
  {
    key: "medical_conditions",
    label:
      "Has the dog ever been diagnosed with, or treated for, any of the following (check all that apply):",
    required: false,
    type: "checkbox-group",
    section: "Medical",
    options: [
      "Allergies",
      "Epilepsy or Seizures",
      "Bloat/GDV",
      "Dilated cardiomyopathy",
      "Wobbler's Syndrome",
      "Hip or elbow dysplasia",
      "Organ failure or dysfunction",
      "Heartworm",
      "Thyroid disease",
      "Broken or fractured bones",
      "Dental disease or broken teeth",
      "Urinary issues, incontinence, or marking",
      "Heart murmur",
      "Hit by a car",
      "Entropion/Ectropion or any eye issues or blindness",
      "More than 1 ear infection",
      "Fecal incontinence",
      "Megacolon or megaesophagus",
      "Any neurological concerns",
      "Hearing impairment or deafness",
      "Other",
    ],
  },
  {
    key: "medical_conditions_details",
    label:
      "If diagnosed with anything medically or any of the above, please use this space to elaborate:",
    required: false,
    type: "textarea",
    section: "Medical",
  },
  {
    key: "lumps_bumps",
    label:
      "Does the dog have any lumps, bumps, wounds, scars, skin tags, or anything abnormal externally?",
    required: false,
    type: "radio",
    section: "Medical",
    options: ["Yes", "No"],
  },
  {
    key: "lumps_bumps_details",
    label:
      "If you answered 'yes' to the above question, please explain the location, size, and any medical diagnosis (if any) related to it.",
    required: false,
    type: "textarea",
    section: "Medical",
  },
  {
    key: "medications_special_diet",
    label:
      "Does the dog need any medications, supplements, or special diets?",
    required: true,
    type: "radio",
    section: "Medical",
    options: ["Yes", "No"],
  },
  {
    key: "current_food",
    label:
      "What are you currently feeding your dog? Please list the brand of the food.",
    required: true,
    type: "text",
    section: "Medical",
  },
  {
    key: "feeding_schedule",
    label:
      "How often do you feed the dog and how much do you feed them per meal?",
    required: true,
    type: "textarea",
    section: "Medical",
  },
  {
    key: "medical_additional",
    label:
      "Is there anything else medically that we, or an adoptive family, should know about the dog?",
    required: false,
    type: "textarea",
    section: "Medical",
  },

  /* ============================================================== */
  /*  Section: Behavior & Temperament                               */
  /* ============================================================== */
  {
    key: "temperament_traits",
    label:
      "How would you describe the dog most of the time? (check all that apply)",
    required: true,
    type: "checkbox-group",
    section: "Behavior & Temperament",
    options: [
      "Very Active",
      "Couch Potato",
      "Talkative",
      "Quiet",
      "Playful",
      "Friendly to Family",
      "Shy to Family",
      "Friendly to Visitors",
      "Shy to Visitors",
      "A Clown",
      "Affectionate",
      "Lap Dog",
      "Fearful",
      "Independent",
      "More Like a Person",
      "Fearless",
      "Aloof",
      "Withdrawn",
      "Solitary",
      "Other",
    ],
  },
  {
    key: "anxiety",
    label:
      "Does the dog have any form of anxiety, such as separation anxiety or anxiety in general?",
    required: false,
    type: "radio",
    section: "Behavior & Temperament",
    options: ["Yes", "No", "Other"],
  },
  {
    key: "play_preferences",
    label: "How does the dog like to play? (check all that apply)",
    required: true,
    type: "checkbox-group",
    section: "Behavior & Temperament",
    options: [
      "Plays gently, does not use teeth or claws",
      "Likes to play rough, may bite or scratch",
      "Likes to play ball",
      "Likes stuffed toys",
      "Likes to learn tricks for treats",
      "Likes to play in or around water",
      "Likes to play with dogs of all sizes",
      "Prefers to play with larger dogs",
      "Prefers to play with smaller dogs",
      "Not much interest in play",
      "Other",
    ],
  },
  {
    key: "favorite_toys",
    label:
      "Does the dog have any favorite toys or activities? If so, please explain.",
    required: false,
    type: "textarea",
    section: "Behavior & Temperament",
  },
  {
    key: "energy_level",
    label: "What level of energy does your dog have?",
    required: true,
    type: "radio",
    section: "Behavior & Temperament",
    options: [
      "High/puppy energy- runs and plays constantly",
      "Moderate energy- runs and plays often",
      "Mild energy- runs and plays occasionally",
      "Low energy- very low energy indoors and outdoors",
    ],
  },
  {
    key: "exercise_type",
    label: "What sort of exercise do you provide your dog?",
    required: true,
    type: "radio",
    section: "Behavior & Temperament",
    options: [
      "None",
      "Mild- a walk once a week or less",
      "Moderate- 2-4 walks per week",
      "High- at least 5 walks per week or more",
      "Other",
    ],
  },
  {
    key: "leash_behavior",
    label: "If taken on walks, how does the dog do on leash?",
    required: true,
    type: "textarea",
    section: "Behavior & Temperament",
  },
  {
    key: "collar_type",
    label: "What type of collar does the dog use for walks?",
    required: false,
    type: "text",
    section: "Behavior & Temperament",
  },
  {
    key: "training_type",
    label: "What type(s) of training has this dog had?",
    required: true,
    type: "checkbox-group",
    section: "Behavior & Temperament",
    options: [
      "Obedience class",
      "Home training",
      "Professional",
      "None",
      "Other",
    ],
  },
  {
    key: "basic_commands",
    label:
      "Does this dog know the basic commands? (check all that apply)",
    required: true,
    type: "checkbox-group",
    section: "Behavior & Temperament",
    options: [
      "Sit",
      "Stay",
      "Come",
      "Lie down",
      "Does not know basic commands",
      "Needs work on basic commands",
      "Other",
    ],
  },
  {
    key: "knows_tricks",
    label: "Does this dog know any tricks?",
    required: false,
    type: "radio",
    section: "Behavior & Temperament",
    options: ["Yes", "No"],
  },

  /* ============================================================== */
  /*  Section: Home Environment                                     */
  /* ============================================================== */
  {
    key: "household_description",
    label: "How would you describe your household?",
    required: true,
    type: "checkbox-group",
    section: "Home Environment",
    options: ["Active", "Noisy", "Quiet", "Average", "Other"],
  },
  {
    key: "home_access",
    label:
      "What areas of your home did the dog have access to? (check all that apply)",
    required: true,
    type: "checkbox-group",
    section: "Home Environment",
    options: [
      "Inside house with access to outside",
      "Inside at night",
      "Indoors in cold weather",
      "Barn or shed",
      "Outdoors only",
      "Garage or basement",
      "Screened Porch",
      "Outdoors in warm weather",
      "Other",
    ],
  },
  {
    key: "where_spends_time",
    label:
      "Where does the dog spend most of his/her time? (check all that apply)",
    required: true,
    type: "checkbox-group",
    section: "Home Environment",
    options: [
      "Bedroom",
      "Kitchen",
      "Living room",
      "Where people are",
      "Outdoors",
      "Barn/shed",
      "Crate",
      "Garage or basement",
      "Other",
    ],
  },
  {
    key: "yard_fenced",
    label: "Is your yard fenced?",
    required: true,
    type: "radio",
    section: "Home Environment",
    options: ["Yes", "No"],
  },
  {
    key: "yard_not_fenced_confinement",
    label:
      "If your yard is not fenced, how have you kept the dog confined to your property?",
    required: false,
    type: "textarea",
    section: "Home Environment",
  },
  {
    key: "escaped_yard",
    label: "Has the dog repeatedly escaped from the yard?",
    required: true,
    type: "radio",
    section: "Home Environment",
    options: ["Yes", "No"],
  },
  {
    key: "escape_method",
    label:
      "If the dog escapes from the yard, how does the dog escape?",
    required: false,
    type: "checkbox-group",
    section: "Home Environment",
    options: [
      "Digs out",
      "Chews through",
      "Jumps fence",
      "Opens gate",
      "Charges gate when open",
      "Other",
    ],
  },
  {
    key: "escape_when",
    label: "When does the dog escape?",
    required: false,
    type: "radio",
    section: "Home Environment",
    options: ["All the time", "When left alone", "Other"],
  },
  {
    key: "crate_trained",
    label: "Is the dog crate trained?",
    required: true,
    type: "radio",
    section: "Home Environment",
    options: ["Yes", "No", "I am not sure"],
  },
  {
    key: "destructive_free_roam",
    label:
      "Is the dog destructive if left alone with free roam of the room/house?",
    required: true,
    type: "radio",
    section: "Home Environment",
    options: ["Yes", "No"],
  },
  {
    key: "left_when_alone",
    label: "Where do you leave the dog when no one was home?",
    required: true,
    type: "text",
    section: "Home Environment",
  },
  {
    key: "hours_unsupervised",
    label:
      "How many hours a day, on average, does the dog spend unsupervised?",
    required: true,
    type: "text",
    section: "Home Environment",
  },
  {
    key: "sleeping_location",
    label: "Where is the dog used to sleeping?",
    required: true,
    type: "checkbox-group",
    section: "Home Environment",
    options: [
      "Owner's room",
      "Owner's bed",
      "Dog house",
      "Garage/basement",
      "Crate",
      "Patio",
      "Outside",
      "Furniture",
      "Other",
    ],
  },

  /* ============================================================== */
  /*  Section: People & Children                                    */
  /* ============================================================== */
  {
    key: "people_lived_with",
    label: "What ages of people lived with the dog?",
    required: true,
    type: "checkbox-group",
    section: "People & Children",
    options: [
      "Adult men",
      "Adult women",
      "Seniors",
      "Children, under 7 years old",
      "Children, over 7 years old",
      "Other",
    ],
  },
  {
    key: "most_comfortable_with",
    label: "Is this dog most comfortable with:",
    required: true,
    type: "checkbox-group",
    section: "People & Children",
    options: [
      "Women",
      "Men",
      "Kids",
      "Teenagers",
      "Seniors",
      "Loves all people",
      "Other",
    ],
  },
  {
    key: "regularly_around_children",
    label: "Has the dog regularly been around children?",
    required: true,
    type: "radio",
    section: "People & Children",
    options: ["Yes", "No", "I am not sure"],
  },
  {
    key: "children_ages",
    label:
      "If the dog lived with children, please provide the age of the children.",
    required: false,
    type: "text",
    section: "People & Children",
  },
  {
    key: "children_under_7_interaction",
    label:
      "If this dog lived with children under age 7, how did they interact? (check all that apply)",
    required: false,
    type: "checkbox-group",
    section: "People & Children",
    options: [
      "Dog actively avoided children",
      "Child could pet the dog",
      "Dog & child played together",
      "Dog growled at child",
      "Ignored each other",
      "Dog was afraid",
      "Mutual adoration",
      "Dog seemed snappy",
      "Dog too much for small children",
      "Other",
    ],
  },
  {
    key: "children_experience_positive",
    label:
      "Has the experiences with the child(ren) always been positive?",
    required: true,
    type: "radio",
    section: "People & Children",
    options: ["Yes", "No"],
  },
  {
    key: "children_experience_negative_details",
    label: "If no, please explain:",
    required: false,
    type: "textarea",
    section: "People & Children",
  },

  /* ============================================================== */
  /*  Section: Other Animals                                        */
  /* ============================================================== */
  {
    key: "lived_with_dogs",
    label:
      "Has the dog ever been exposed to, or lived with, other dogs?",
    required: true,
    type: "radio",
    section: "Other Animals",
    options: ["Yes", "No"],
  },
  {
    key: "dog_interaction",
    label:
      "If the dog lived with other dogs, how did they interact? (check all that apply)",
    required: false,
    type: "checkbox-group",
    section: "Other Animals",
    options: [
      "Adored each other",
      "Played with each other",
      "Slept near each other",
      "Avoided each other",
      "Peacefully coexisted",
      "Sniffed noses",
      "Fought without injuries",
      "Fought with injuries",
      "Ate well together",
      "Groomed each other",
      "Rough with each other",
      "Had to be separated at feeding",
      "Other",
    ],
  },
  {
    key: "dog_experience_positive",
    label:
      "Has the experiences with other dogs always been positive?",
    required: false,
    type: "radio",
    section: "Other Animals",
    options: ["Yes", "No"],
  },
  {
    key: "lived_with_cats",
    label:
      "Has the dog ever been exposed to, or lived with, cats?",
    required: true,
    type: "radio",
    section: "Other Animals",
    options: ["Yes", "No", "I am not sure"],
  },
  {
    key: "cat_interaction",
    label:
      "If the dog lived with cats, how did they interact? (check all that apply)",
    required: false,
    type: "checkbox-group",
    section: "Other Animals",
    options: [
      "Adored each other",
      "Played with each other",
      "Slept near each other",
      "Avoided each other",
      "Peacefully coexisted",
      "Cat rubbed on the dog",
      "Fought without injuries",
      "Fought with injuries",
      "Caused the cat stress",
      "Groomed each other",
      "Rough with the cat",
      "Gentle with the cat",
      "Other",
    ],
  },
  {
    key: "cat_experience_positive",
    label:
      "Has the experiences with cats always been positive?",
    required: false,
    type: "radio",
    section: "Other Animals",
    options: ["Yes", "No"],
  },
  {
    key: "cat_experience_negative_details",
    label: "If no, please explain:",
    required: false,
    type: "textarea",
    section: "Other Animals",
  },
  {
    key: "bitten_animal",
    label: "Has this dog ever bitten another animal?",
    required: true,
    type: "radio",
    section: "Other Animals",
    options: ["Yes", "No"],
  },
  {
    key: "bitten_animal_details",
    label:
      "If yes, please describe the incident(s) and extent of injuries.",
    required: false,
    type: "textarea",
    section: "Other Animals",
  },

  /* ============================================================== */
  /*  Section: Fears & Behaviors                                    */
  /* ============================================================== */
  {
    key: "fears",
    label:
      "Is the dog frightened by anything? (check all that apply)",
    required: true,
    type: "checkbox-group",
    section: "Fears & Behaviors",
    options: [
      "Men",
      "Children",
      "Brooms",
      "Thunder",
      "Fireworks",
      "Hats",
      "Balloons",
      "Vacuums",
      "Large Trucks",
      "Bicycles",
      "Water",
      "Hands",
      "Feet",
      "Appliances",
      "Not Fearful",
      "Other",
    ],
  },
  {
    key: "housetrained",
    label: "Is the dog housetrained?",
    required: true,
    type: "radio",
    section: "Fears & Behaviors",
    options: ["Yes", "No"],
  },
  {
    key: "housetrained_medical_exam",
    label:
      "If no, has the dog been examined to rule out any underlying medical problems?",
    required: false,
    type: "radio",
    section: "Fears & Behaviors",
    options: ["Yes", "No"],
  },
  {
    key: "housetrained_medical_outcome",
    label: "If yes, what was the outcome?",
    required: false,
    type: "textarea",
    section: "Fears & Behaviors",
  },
  {
    key: "accident_frequency",
    label: "How often does the dog have accidents in the house?",
    required: true,
    type: "radio",
    section: "Fears & Behaviors",
    options: [
      "Once a day",
      "Once a week",
      "Never",
      "Every time the dog is inside",
      "Other",
    ],
  },
  {
    key: "accident_handling",
    label:
      "If the dog has accidents in the house how have you dealt with this problem?",
    required: false,
    type: "checkbox-group",
    section: "Fears & Behaviors",
    options: [
      "Dog is only allowed in certain areas",
      "Dog is kept outside only",
      "Other",
    ],
  },
  {
    key: "chases",
    label: "Does this dog chase anything?",
    required: true,
    type: "checkbox-group",
    section: "Fears & Behaviors",
    options: [
      "People",
      "Children",
      "Cats",
      "Livestock",
      "Cars",
      "Bicycles",
      "Skateboards",
      "Wildlife",
      "Other",
    ],
  },
  {
    key: "barker",
    label: "Is this dog a barker?",
    required: true,
    type: "radio",
    section: "Fears & Behaviors",
    options: ["Yes", "No"],
  },
  {
    key: "barker_details",
    label: "If yes, please explain the circumstances",
    required: false,
    type: "textarea",
    section: "Fears & Behaviors",
  },
  {
    key: "other_animals_lived_with",
    label:
      "What other animals has the dog lived with? If they have lived with other dogs or cats, please provide if the other dog or cat is male or female and their age.",
    required: true,
    type: "textarea",
    section: "Fears & Behaviors",
  },
  {
    key: "gets_along_with",
    label:
      "Does the dog get along with other animals? (check all that apply)",
    required: true,
    type: "checkbox-group",
    section: "Fears & Behaviors",
    options: [
      "Dog (male)",
      "Dog (female)",
      "Cats (indoor)",
      "Cats (outdoors)",
      "Birds",
      "Poultry/Livestock",
      "Has not been around other animals",
      "Other",
    ],
  },
  {
    key: "animals_not_along_with",
    label:
      "What types of animals does the dog not get along with?",
    required: false,
    type: "textarea",
    section: "Fears & Behaviors",
  },
  {
    key: "leash_lunge_dogs",
    label: "When leashed does this dog lunge at other dogs?",
    required: true,
    type: "radio",
    section: "Fears & Behaviors",
    options: ["Yes", "No"],
  },
  {
    key: "leash_lunge_people",
    label: "When leashed does this dog lunge at people?",
    required: true,
    type: "radio",
    section: "Fears & Behaviors",
    options: ["Yes", "No"],
  },
  {
    key: "lunging_is_play",
    label: "Is this lunging the dog wanting to play?",
    required: false,
    type: "radio",
    section: "Fears & Behaviors",
    options: ["Yes", "No"],
  },
  {
    key: "overprotective",
    label: "Do you feel the dog is overprotective?",
    required: true,
    type: "radio",
    section: "Fears & Behaviors",
    options: ["Yes", "No"],
  },
  {
    key: "attacked_or_bitten",
    label:
      "Has the dog ever tried to attack or bite a person or animal?",
    required: true,
    type: "radio",
    section: "Fears & Behaviors",
    options: ["Yes", "No"],
  },
  {
    key: "attacked_or_bitten_details",
    label: "If you answered 'yes' above, please explain",
    required: false,
    type: "textarea",
    section: "Fears & Behaviors",
  },
  {
    key: "quirks",
    label:
      "Are there any quirks or habits of the dog that you are not fond of?",
    required: true,
    type: "textarea",
    section: "Fears & Behaviors",
  },
  {
    key: "anything_else",
    label: "Is there anything else we should know about the dog?",
    required: false,
    type: "textarea",
    section: "Fears & Behaviors",
  },
  {
    key: "perfect_home",
    label:
      "Please describe the 'perfect' home for this dog, or what the home has/doesn't have for this dog to thrive.",
    required: true,
    type: "textarea",
    section: "Fears & Behaviors",
  },
  {
    key: "what_you_love",
    label: "Tell us something you truly love about the dog.",
    required: true,
    type: "textarea",
    section: "Fears & Behaviors",
  },

  /* ============================================================== */
  /*  Section: How Did You Hear About Us?                           */
  /* ============================================================== */
  {
    key: "referral_source",
    label: "How did you hear about RMGDRI?",
    required: true,
    type: "checkbox-group",
    section: "How Did You Hear About Us?",
    options: [
      "Internet",
      "Animal Shelter",
      "Pet Directory",
      "Newspaper",
      "Public Appearance",
      "Other",
    ],
  },

  /* ============================================================== */
  /*  Section: Surrender Agreement                                  */
  /* ============================================================== */
  {
    key: "agreement_dog_name",
    label: "Print the name of the dog you are surrendering",
    required: true,
    type: "text",
    section: "Surrender Agreement",
  },
  {
    key: "certify_lawful_owner",
    label:
      "I certify that I am the lawful owner of this dog that I am surrendering",
    required: true,
    type: "radio",
    section: "Surrender Agreement",
    options: ["Yes", "No"],
  },
  {
    key: "certify_over_18",
    label:
      "As of today's date, I certify that I am over 18 years of age.",
    required: true,
    type: "radio",
    section: "Surrender Agreement",
    options: ["Yes", "No"],
  },
  {
    key: "accept_agreement",
    label:
      "I certify by selecting yes that I fully understand and accept the terms and conditions of the RMGDRI Owner Surrender Agreement above.",
    required: true,
    type: "radio",
    section: "Surrender Agreement",
    options: ["Yes", "No"],
  },
  {
    key: "surrendering_owner_signature",
    label: "Surrendering Owner Signature",
    required: true,
    type: "text",
    section: "Surrender Agreement",
    placeholder: "Type your full legal name",
  },
  {
    key: "release_email_to_adopter",
    label:
      "I would like to release my email address to the new owner of this dog and allow the new owner to contact me if they wish to gain further information on this dog.",
    required: true,
    type: "radio",
    section: "Surrender Agreement",
    options: ["Yes", "No"],
  },
  {
    key: "agreement_date",
    label: "Today's Date",
    required: true,
    type: "text",
    section: "Surrender Agreement",
    placeholder: "MM/DD/YYYY",
  },
  {
    key: "agreement_email",
    label: "Email",
    required: true,
    type: "email",
    section: "Surrender Agreement",
    placeholder: "ex: myname@example.com",
  },
  {
    key: "understand_communication",
    label:
      "I understand that I will be communicated via the above provided email. The Incoming Coordinator tries to make contact within 1-3 days of form submission. Sometimes our emails end up in spam/junk boxes, so I will check my spam/junk boxes frequently. If I am having trouble in any way, I can email rehome@rmgreatdane.org.",
    required: true,
    type: "radio",
    section: "Surrender Agreement",
    options: ["Yes, I understand."],
  },
];

/* ------------------------------------------------------------------ */
/*  Derived exports                                                   */
/* ------------------------------------------------------------------ */

/** Ordered, de-duplicated list of section names as they appear in the form. */
export const OWNER_SURRENDER_SECTIONS: string[] = [
  ...new Set(OWNER_SURRENDER_FIELD_MAP.map((f) => f.section)),
];

/** Only the fields marked `required: true`. */
export const OWNER_SURRENDER_REQUIRED_FIELDS = OWNER_SURRENDER_FIELD_MAP.filter(
  (f) => f.required,
);

/**
 * Legal text that must be displayed above the Surrender Agreement fields.
 * Renderers should show this verbatim before field #112 (agreement_dog_name).
 */
export const SURRENDER_AGREEMENT_TEXT =
  "ROCKY MOUNTAIN GREAT DANE RESCUE, INC. OWNER SURRENDER AGREEMENT\n\n" +
  "READ, ACCEPT AND DATE THE FOLLOWING\n\n" +
  "I hereby make available for adoption, the dog named below on this form, to Rocky Mountain Great Dane Rescue, Inc. " +
  "I certify that this dog is not possessed of any dangerous or vicious propensities, and that I have not willfully " +
  "concealed information about the dog that might indicate such propensities. The information I have provided about " +
  "this dog is true and complete. I hereby forever release, discharge and agree to hold harmless and indemnify the " +
  "Rocky Mountain Great Dane Rescue, Inc., its board of directors, its members, officers, and agents from all claims, " +
  "demands, actions, causes of action or liability of any kind whatsoever arising as a result of or in connection " +
  "with the adoption or other disposition of the named dog.";

export default OWNER_SURRENDER_FIELD_MAP;
