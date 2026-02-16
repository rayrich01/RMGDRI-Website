from __future__ import annotations

import re
from pathlib import Path
from collections import OrderedDict

SRC = Path("_ref/forms-txt/RMGDRI Owner Surrender (2).txt")
OUT = Path("_ref/forms-txt/owner-surrender-required-labels.report.md")

t = SRC.read_text(encoding="utf-8", errors="replace")
lines = t.splitlines()

# Heuristic:
# - required markers appear as lines containing "*"
# - but the PDF extraction often breaks labels across multiple lines
# We'll build candidate labels by:
#   1) capturing the line containing "*"
#   2) also capturing the previous line if it looks like a continuation (not page markers, not blank)
#   3) joining wrapped label fragments into a single label where possible

def is_noise(s: str) -> bool:
    s = s.strip()
    if not s:
        return True
    if s.startswith("-- ") and " of " in s:
        return True
    if s in {"Yes", "No", "Male", "Female", "Other", "Clear", "Save", "Submit"}:
        return True
    return False

def clean_label(s: str) -> str:
    # normalize whitespace, keep *, remove trailing examples
    s = re.sub(r"\s+", " ", s).strip()
    # remove inline example hints after required marker
    s = re.sub(r"\*\s+ex:\s+.*$", "*", s, flags=re.I)
    return s

def canonicalize_key(label: str) -> str:
    # remove required marker then slugify
    base = label.replace("*", "").strip().lower()
    base = re.sub(r"[()\[\]]", "", base)
    base = re.sub(r"[^a-z0-9]+", "-", base).strip("-")
    return base[:80]  # keep keys readable

candidates: list[str] = []

for i, line in enumerate(lines):
    if "*" not in line:
        continue
    if len(line.strip()) > 120:
        continue

    prev = lines[i-1] if i-1 >= 0 else ""
    cur = line

    # If previous line is likely part of the same label (wrapped), join it.
    # Ex: "Owner's Preferred" + "Contact Number *"
    if prev and not is_noise(prev) and not prev.strip().endswith(":") and not prev.strip().endswith("?"):
        # join when prev is short-ish and current looks like continuation
        if len(prev.strip()) <= 40 and len(cur.strip()) <= 80:
            joined = f"{prev.strip()} {cur.strip()}"
            candidates.append(clean_label(joined))
            continue

    candidates.append(clean_label(cur))

# Deduplicate while preserving order
dedup = OrderedDict()
for c in candidates:
    if is_noise(c):
        continue
    dedup.setdefault(c, None)

# Emit report
out_lines = []
out_lines.append("# Owner Surrender — Required Label Candidates\n")
out_lines.append(f"Source: `{SRC.as_posix()}`\n")
out_lines.append(f"Total lines scanned: `{len(lines)}`\n")
out_lines.append(f"Required candidates found (deduped): `{len(dedup)}`\n")
out_lines.append("\n---\n")
out_lines.append("## Candidate labels (as extracted)\n")
for lbl in dedup.keys():
    out_lines.append(f"- {lbl}")

out_lines.append("\n---\n")
out_lines.append("## Suggested canonical keys (heuristic)\n")
out_lines.append("> These keys are **NOT authoritative**. They are a starting point for the canonical `field-map.ts`.\n")
for lbl in dedup.keys():
    out_lines.append(f"- `{canonicalize_key(lbl)}`  ←  {lbl}")

OUT.write_text("\n".join(out_lines) + "\n", encoding="utf-8")
print(f"OK: wrote {OUT} ({OUT.stat().st_size} bytes)")
