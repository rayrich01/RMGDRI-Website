/**
 * Normalize Owner Surrender payload from field-map (hyphenated) keys
 * into canonical OwnerSurrenderSchema keys.
 *
 * Strategy:
 * - Maintain an explicit mapping table (deterministic, auditable).
 * - Special-case certain composite fields (owner-name).
 * - Preserve raw payload separately at insert-time if desired.
 */

export const OWNER_SURRENDER_HYPHEN_TO_CANONICAL: Record<string, string> = {
  // Dog
  "dog-name": "dog_name",
  "dog-age": "dog_dob_or_age",
  "dog-weight": "dog_weight",
  "dog-sex": "dog_gender",
  "dog-altered": "dog_spayed_neutered",
  "dog-gastropexied": "dog_gastropexy_tacked",
  "dog-breed-type": "dog_is_great_dane_or_mix",

  // Owner
  "owner-phone-primary": "owner_contact_phone_primary",
  "owner-name": "__SPLIT_OWNER_NAME__",

  // Vet + misc (these are already in your schema list)
  "vet-address": "vet_office_address",
  "vet-phone": "vet_office_phone",
  "vet-yearly": "seen_vet_annually",
  "vaccinations-current": "current_vaccinations",
  "heartworm-prevention": "on_heartworm_prevention",
  "referral-source": "heard_about_rmgdri",

  // Surrender history equivalents (match your schema keys seen in curl)
  "ownership-duration": "owned_how_long",
  "prior-history": "history_prior_to_owner",
  "other-states": "lived_outside_state",
  "acquisition-source": "acquired_from",

  // These remain hyphenated for now until we map to canonical schema keys
  // "feeding-schedule": ??? -> feeding_schedule_amount maybe
  // "leash-behavior": ??? -> leash_behavior (likely)
  // etc...
};

function splitName(full: string): { first: string; last: string } {
  const t = String(full ?? "").trim();
  if (!t) return { first: "", last: "" };
  const parts = t.split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
}

export function normalizeOwnerSurrenderPayload(raw: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};

  // Copy through any non-string keys safely
  for (const [k, v] of Object.entries(raw ?? {})) {
    const mapped = OWNER_SURRENDER_HYPHEN_TO_CANONICAL[k];
    if (!mapped) {
      // unknown key — drop into out as-is for now (or omit if you prefer strict)
      out[k] = v;
      continue;
    }

    if (mapped === "__SPLIT_OWNER_NAME__") {
      const { first, last } = splitName(String(v ?? ""));
      // Only fill if not already present
      if (out.owner_first_name == null) out.owner_first_name = first;
      if (out.owner_last_name == null) out.owner_last_name = last;
      continue;
    }

    out[mapped] = v;
  }

  return out;
}
