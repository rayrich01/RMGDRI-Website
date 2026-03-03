/* ------------------------------------------------------------------ *
 *  Volunteer Application — form key + canonical role labels            *
 * ------------------------------------------------------------------ */

export const VOLUNTEER_FORM_KEY = "volunteer-v1";

/**
 * Canonical volunteer roles.
 * `id` values are stable identifiers persisted to the database.
 * `label` values are human-friendly display strings for the UI.
 */
export const VOLUNTEER_ROLES = [
  { id: "application_processor", label: "Application Processor" },
  { id: "home_checker",          label: "Home Checker" },
  { id: "transport_volunteer",   label: "Transport Volunteer" },
  { id: "social_media",          label: "Social Media" },
  { id: "marketing",             label: "Marketing" },
  { id: "fundraising",           label: "Fundraising" },
  { id: "blog_writer",           label: "Blog Writer" },
  { id: "followup_specialist",   label: "Follow-up Specialist" },
  { id: "foster_coordinator",    label: "Foster Coordinator" },
  { id: "event_coordinator",     label: "Event Coordinator" },
  { id: "medical_director",      label: "Medical Director" },
  { id: "adoption_director",     label: "Adoption Director" },
  { id: "intake_director",       label: "Intake Director" },
  { id: "supplies_coordinator",  label: "Supplies Coordinator" },
  { id: "transport_coordinator", label: "Transport Coordinator" },
  { id: "bookkeeper",            label: "Bookkeeper" },
] as const;

export const VOLUNTEER_ROLE_IDS = VOLUNTEER_ROLES.map((r) => r.id);
export type VolunteerRoleId = (typeof VOLUNTEER_ROLES)[number]["id"];
