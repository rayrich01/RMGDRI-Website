// Normalization boundary: field-map (raw, hyphenated keys) -> canonical OwnerSurrenderSchema keys
// Best practice: keep this deterministic + versioned.
// NOTE: expand mapping over time as UI form parity grows.

export const OWNER_SURRENDER_NORMALIZATION_VERSION = "owner-surrender-normalize@1";

// Raw is whatever the client posts (currently field-map keys like "dog-age", etc.)
export type OwnerSurrenderRawPayload = Record<string, unknown>;

// Canonical is the object we validate with OwnerSurrenderSchema and persist as `payload`
export type OwnerSurrenderCanonicalPayload = Record<string, unknown>;

const MAP: Record<string, string | ((raw: any) => [string, unknown][])> = {
  // Owner
  "owner-name": (raw) => {
    const full = String(raw["owner-name"] ?? "").trim();
    if (!full) return [];
    const parts = full.split(/\s+/).filter(Boolean);
    const first = parts[0] ?? "";
    const last = parts.length > 1 ? parts.slice(1).join(" ") : "";
    return [
      ["owner_first_name", first],
      ["owner_last_name", last],
    ];
  },
  "owner-phone-primary": "owner_contact_phone_primary",

  // Dog
  "dog-name": "dog_name",
  "dog-age": "dog_dob_or_age",
  "dog-breed-type": "dog_is_great_dane_or_mix",
  "dog-weight": "dog_weight",
  "dog-sex": "dog_gender",
  "dog-altered": "dog_spayed_neutered",
  "dog-gastropexied": "dog_gastropexy_tacked",

  // History / context
  "ownership-duration": "owned_how_long",
  "prior-history": "history_prior_to_owner",
  "other-states": "lived_outside_state",
  "acquisition-source": "acquired_from",
  "referral-source": "heard_about_rmgdri",

  // Medical
  "vet-yearly": "seen_vet_annually",
  "vaccinations-current": "current_vaccinations",
  "heartworm-prevention": "on_heartworm_prevention",
  "vet-address": "vet_office_address",
  "vet-phone": "vet_office_phone",
  "surgeries": "required_surgeries",

  // Behavior / care
  "energy-level": "energy_level",
  "feeding-schedule": "feeding_schedule_amount",
  "leash-behavior": "leash_behavior",
  "crate-trained": "crate_trained",
  "left-when-alone": "where_left_when_alone",

  // Photos (URLs stored by client after R2 upload)
  "photo-headshot": "photo_headshot_url",
  "photo-additional": "photo_additional_urls",

  // These currently do not have confirmed canonical destinations (keep raw-only until parity confirms):
  // "play-preferences": ???,
  // "where-spends-time": ???,
  // "chases": ???,
};

export function normalizeOwnerSurrenderPayload(
  raw: OwnerSurrenderRawPayload
): { canonical: OwnerSurrenderCanonicalPayload; warnings: string[] } {
  const canonical: OwnerSurrenderCanonicalPayload = {};
  const warnings: string[] = [];

  for (const [k, v] of Object.entries(raw ?? {})) {
    const mapper = MAP[k];
    if (!mapper) continue;

    if (typeof mapper === "string") {
      canonical[mapper] = v;
      continue;
    }

    if (typeof mapper === "function") {
      try {
        for (const [ck, cv] of mapper(raw)) canonical[ck] = cv;
      } catch (e: any) {
        warnings.push(`normalize: mapper for ${k} threw: ${e?.message ?? String(e)}`);
      }
    }
  }

  // v1: map raw owner-email -> canonical owner_email (required by schema vs raw field-map)
  // Accept a few common raw variants just in case (hyphen, underscore, camel)
  const __ownerEmailRaw =
    (raw as any)?.["owner-email"] ??
    (raw as any)?.["owner_email"] ??
    (raw as any)?.["ownerEmail"];

  if (typeof __ownerEmailRaw !== "undefined" && __ownerEmailRaw !== null) {
    (canonical as any).owner_email = String(__ownerEmailRaw).trim();
  }


  return { canonical, warnings };
}
