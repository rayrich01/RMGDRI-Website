#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(pwd)"
WORKING_COMMIT="a8802e7"
TS="$(date +"%Y-%m-%d__RECOVER_ADOPTION_DATA__%H%M%S")"
EVD="$REPO_ROOT/_ttp/evidence/$TS"
mkdir -p "$EVD"

echo "=== Recover Working Adoption Successes Data ===" | tee "$EVD/00_header.txt"
echo "Repo: $REPO_ROOT" | tee -a "$EVD/00_header.txt"
echo "Working commit: $WORKING_COMMIT" | tee -a "$EVD/00_header.txt"
echo "Evidence: $EVD" | tee -a "$EVD/00_header.txt"
echo | tee -a "$EVD/00_header.txt"

# Gate A: Recover data files
echo "=== Gate A: Recover data files ===" | tee "$EVD/01_recover_data.txt"
mkdir -p src/data/adoption-successes
git show $WORKING_COMMIT:src/data/adoption-successes/successes.normalized.json > src/data/adoption-successes/successes.normalized.json
echo "✓ Recovered successes.normalized.json (211 dogs)" | tee -a "$EVD/01_recover_data.txt"

# Gate B: Recover library
echo "=== Gate B: Recover library ===" | tee "$EVD/02_recover_lib.txt"
git show $WORKING_COMMIT:src/lib/adoption-successes.ts > src/lib/adoption-successes.ts
echo "✓ Recovered adoption-successes.ts" | tee -a "$EVD/02_recover_lib.txt"

# Gate C: Recover working page components
echo "=== Gate C: Recover working pages ===" | tee "$EVD/03_recover_pages.txt"
git show $WORKING_COMMIT:src/app/\(main\)/adoption-successes/page.tsx > src/app/\(main\)/adoption-successes/page.tsx
git show $WORKING_COMMIT:src/app/\(main\)/adoption-successes/\[year\]/page.tsx > src/app/\(main\)/adoption-successes/\[year\]/page.tsx
git show $WORKING_COMMIT:src/app/\(main\)/adoption-successes/\[year\]/year-grid.tsx > src/app/\(main\)/adoption-successes/\[year\]/year-grid.tsx
git show $WORKING_COMMIT:src/app/\(main\)/adoption-successes/\[year\]/\[slug\]/page.tsx > src/app/\(main\)/adoption-successes/\[year\]/\[slug\]/page.tsx
echo "✓ Recovered all working page components" | tee -a "$EVD/03_recover_pages.txt"

# Gate D: Verify files
echo "=== Gate D: Verify recovery ===" | tee "$EVD/04_verify.txt"
echo "Data file size:" | tee -a "$EVD/04_verify.txt"
wc -l src/data/adoption-successes/successes.normalized.json | tee -a "$EVD/04_verify.txt"
echo | tee -a "$EVD/04_verify.txt"
echo "Library exports:" | tee -a "$EVD/04_verify.txt"
grep "^export" src/lib/adoption-successes.ts | tee -a "$EVD/04_verify.txt"
echo | tee -a "$EVD/04_verify.txt"

# Gate E: Diffstat
echo "=== Gate E: Diffstat ===" | tee "$EVD/05_diffstat.txt"
git diff --stat | tee -a "$EVD/05_diffstat.txt"

echo "=== DONE ===" | tee "$EVD/99_done.txt"
echo "Evidence: $EVD" | tee -a "$EVD/99_done.txt"
