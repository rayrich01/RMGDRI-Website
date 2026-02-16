#!/usr/bin/env python3
from __future__ import annotations
from pathlib import Path
import re
import json

REPORT = Path("_ref/forms-txt/owner-surrender-required-labels.report.md")
OUT_FIELD_MAP = Path("src/lib/forms/owner-surrender/field-map.ts")

def die(msg: str) -> None:
    raise SystemExit(f"FAIL: {msg}")

def read_report_candidates(md: str) -> list[str]:
    # We normalize only the "Candidate labels (as extracted)" bullet list.
    m = re.search(r"## Candidate labels \(as extracted\)\n\n(?P<body>(?:- .+\n)+)", md)
    if not m:
        die("Could not find 'Candidate labels (as extracted)' section in report.")
    body = m.group("body")
    labels = []
    for line in body.splitlines():
        line = line.strip()
        if not line.startswith("- "): 
            continue
        labels.append(line[2:].strip())
    return labels

def squash_ws(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()

def strip_required_star(s: str) -> str:
    return squash_ws(s.replace("*", "").strip())

def normalize_label(s: str) -> str:
    s = squash_ws(s)

    # Fix common extraction joins / fragments
    s = s.replace("records) * Veterinary office address *", "Veterinary office address *")
    s = s.replace("vet records) *", "Veterinarian's name (to obtain vet records) *")
    s = s.replace("records) *", "Veterinarian's name (to obtain vet records) *")
    s = s.replace("references. Dog's Weight *", "Dog's Weight *")
    s = s.replace("Dog's Weight * Color of Dog *", "Dog's Weight *")
    s = s.replace("First Name Last Name Owner's E-mail *", "Owner's Name *")
    s = s.replace("Dane or Great Dane Mix? *", "Is the dog a Great Dane or Great Dane Mix? *")
    s = s.replace("vaccinations? (rabies and distemper/parvo) *", "Is the dog current on vaccinations? (rabies and distemper/parvo) *")
    s = s.replace("heartworm prevention? *", "Is this dog currently on heartworm prevention? *")

    # Trim trailing punctuation fragments that appear in middle of sentences
    s = re.sub(r"^[a-z].+\.\s+", "", s)  # remove leading sentence fragments (rare)
    s = squash_ws(s)

    return s

def to_key(label_no_star: str) -> str:
    # stable kebab-case key
    s = label_no_star.lower()
    s = re.sub(r"[’']", "", s)
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"^-+|-+$", "", s)
    return s

def canonicalize(labels: list[str]) -> list[dict]:
    # Minimal canonical set for required fields v1.
    # We explicitly map known required labels (from the 78 list) into stable keys.
    # Anything unmapped is emitted under "unmapped" for human review.
    wanted = {
        "Owner's Name *": "owner-name",
        "Owner's E-mail * ex: myname@example.com": "owner-email",
        "Owner's Address *": "owner-address",
        "Owner's Preferred Contact Number *": "owner-phone-primary",
        "Dog's Name / Nicknames *": "dog-name",
        "Dog's DOB /Approximate Age *": "dog-age",
        "Is the dog a Great Dane or Great Dane Mix? *": "dog-breed-type",
        "Dog's Weight *": "dog-weight",
        "Color of Dog *": "dog-color",
        "Gender * Male Female": "dog-sex",
        "Is the dog spayed or neutered *": "dog-altered",
        "its stomach tacked? *": "dog-gastropexied",
        "Please explain why you are surrendering the dog. *": "surrender-reason",
        "would you be interested in keeping this dog? *": "would-you-keep",
        "depending on the circumstances, but we try our best. *": "urgent-situation",
        "How long have you owned the dog? *": "ownership-duration",
        "What do you know of the dog's history prior to your own? *": "prior-history",
        "state of residence? If so, where? *": "other-states",
        "Where did you acquire the dog? *": "acquisition-source",
        "Has the dog seen a veterinarian at least once a year? *": "vet-yearly",
        "Is the dog current on vaccinations? (rabies and distemper/parvo) *": "vaccinations-current",
        "Is this dog currently on heartworm prevention? *": "heartworm-prevention",
        "Veterinarian's name (to obtain vet records) *": "vet-name",
        "Veterinary office address *": "vet-address",
        "Veterinary office phone number *": "vet-phone",
        "Has the dog ever required any surgeries? *": "surgeries",
        "Has the dog ever been diagnosed with, or treated for, any of the following (check all that apply): *": "diagnoses-checklist",
        "abnormal externally? *": "external-abnormalities",
        "Does the dog need any medications, supplements, or special diets? *": "meds-supplements-diet",
        "brand of the food. *": "food-brand",
        "How often do you feed the dog and how much do you feed them per meal? *": "feeding-schedule",
        "the dog? *": "medical-other",
        "(check all that apply) *        Shy to Family Friendly to": "temperament-checklist",
        "anxiety or anxiety in general? *": "anxiety",
        "How does the dog like to play? (check all that apply) *": "play-preferences",
        "What level of energy does your dog have? *": "energy-level",
        "need) *": "exercise-provided",
        "If taken on walks, how does the dog do on leash? *": "leash-behavior",
        "training has this dog had? *": "training-history",
        "apply) *": "commands-known",
        "How would you describe your household? *": "household-description",
        "(check all that         apply) *": "indoors-outdoors",
        "Where does the dog spend most of his/her time? (check all that apply) *": "where-spends-time",
        "Is your yard fenced? *": "yard-fenced",
        "repeatedly escaped from the yard? *": "escape-history",
        "Is the dog crate trained? *": "crate-trained",
        "of the room/house? *": "destructive",
        "Where do you leave the dog when no one was home? *": "left-when-alone",
        "does the dog spend unsupervised? *": "hours-unsupervised",
        "Where is the dog used to sleeping? *": "sleeping-location",
        "dog? *": "people-ages-in-home",
        "Is this dog most comfortable with : *": "comfortable-with",
        "children? *": "around-children",
        "positive? *": "children-positive",
        "dogs? *": "around-dogs",
        "cats? *": "around-cats",
        "animal? *": "bitten-animal",
        "anything? (check all that apply) *": "fears",
        "housetrained? *": "housetrained",
        "accidents in the house? *": "accidents-frequency",
        "Does this dog chase anything? *": "chases",
        "Is this dog a barker? *": "barks",
        "animals? (click all that apply) *": "gets-along-with",
        "lunge at other dogs? *": "lunges-at-dogs",
        "lunge at people? *": "lunges-at-people",
        "overprotective *": "overprotective",
        "animal? *": "attacked-or-bit-person-animal",
        "of? *": "dislikes",
        "thrive. *": "needs-to-thrive",
        "the dog. *": "love-about-dog",
        "How did you hear about RMGDRI? *": "referral-source",
        "surrendering *": "certify-owner",
        "age. *": "certify-over-18",
        "above. *": "accept-agreement",
        "information on this dog. *": "release-email-to-adopter",
        "e.org. *": "understand-email-comms",
    }

    normalized = []
    unmapped = []

    seen = set()
    for raw in labels:
        n = normalize_label(raw)
        if not n:
            continue
        if n in seen:
            continue
        seen.add(n)

        key = wanted.get(n)
        if key:
            normalized.append({"key": key, "label": strip_required_star(n), "required": True})
        else:
            unmapped.append({"raw": raw, "normalized": n})

    normalized.sort(key=lambda x: x["key"])
    return normalized, unmapped

def patch_report(md: str, normalized: list[dict], unmapped: list[dict]) -> str:
    block = ["\n---\n\n## Normalized required labels (canonicalized)\n"]
    for item in normalized:
        block.append(f"- `{item['key']}` — {item['label']}")
    block.append("\n\n### Unmapped / needs review\n")
    if not unmapped:
        block.append("- (none)\n")
    else:
        for u in unmapped[:60]:
            block.append(f"- raw: `{u['raw']}` → normalized: `{u['normalized']}`")
        if len(unmapped) > 60:
            block.append(f"- …and {len(unmapped) - 60} more\n")

    # Replace existing normalized section if present, else append at end.
    if "## Normalized required labels (canonicalized)" in md:
        md = re.sub(r"\n---\n\n## Normalized required labels \(canonicalized\).*?\Z",
                    "\n".join(block).rstrip() + "\n",
                    md, flags=re.S)
        return md
    return md.rstrip() + "\n" + "\n".join(block).rstrip() + "\n"

def write_field_map_ts(normalized: list[dict]) -> None:
    OUT_FIELD_MAP.parent.mkdir(parents=True, exist_ok=True)

    rows = []
    for it in normalized:
        label_escaped = it["label"].replace('"', '\"')
        rows.append(f'  {{ key: "{it["key"]}", label: "{label_escaped}", required: true }},')
    ts = f"""// Canonical field map for Owner Surrender (required fields v1)
// Auto-generated by scripts/forms/normalize_required_labels_owner_surrender.py
export type OwnerSurrenderField = {{
  key: string;
  label: string;
  required: boolean;
}};

export const OWNER_SURRENDER_REQUIRED_FIELDS: OwnerSurrenderField[] = [
{chr(10).join(rows)}
];
"""
    OUT_FIELD_MAP.write_text(ts, encoding="utf-8")

def main():
    md = REPORT.read_text(encoding="utf-8")
    labels = read_report_candidates(md)
    normalized, unmapped = canonicalize(labels)

    md2 = patch_report(md, normalized, unmapped)
    REPORT.write_text(md2, encoding="utf-8")

    write_field_map_ts(normalized)

    print(f"OK: normalized required fields: {len(normalized)}")
    print(f"OK: unmapped candidates: {len(unmapped)}")
    print(f"OK: updated report: {REPORT}")
    print(f"OK: wrote field-map: {OUT_FIELD_MAP}")

if __name__ == "__main__":
    main()
