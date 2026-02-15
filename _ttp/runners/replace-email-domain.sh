#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
TS="$(date +"%Y-%m-%d__REPLACE_EMAIL_DOMAIN__%H%M%S")"
EVD="$ROOT/_ttp/evidence/$TS"
LOG="$EVD/run.log"
mkdir -p "$EVD"

exec > >(tee -a "$LOG") 2>&1

echo "== Replace email domain =="
echo "Repo: $ROOT"
echo "Evidence: $EVD"
echo

OLD='@rmgdri.org'
NEW='@rmgreatdane.org'

echo "== Pre-scan (hits) =="
# grep is deterministic and available; exclude build outputs + deps
grep -RIn --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next --exclude-dir=_ttp \
  "$OLD" . | tee "$EVD/01_hits_before.txt" || true

BEFORE_COUNT="$(wc -l < "$EVD/01_hits_before.txt" | tr -d ' ')"
echo "Hits before: $BEFORE_COUNT"
echo

if [[ "$BEFORE_COUNT" == "0" ]]; then
  echo "No occurrences of $OLD found. Nothing to change."
  echo "DONE" | tee "$EVD/99_done.txt"
  exit 0
fi

echo "== Replace (safe in-place) =="
# macOS-compatible perl in-place
perl -pi -e "s/\Q$OLD\E/$NEW/g" $(awk -F: '{print $1}' "$EVD/01_hits_before.txt" | sort -u)

echo "== Post-scan (ensure none remain) =="
grep -RIn --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next --exclude-dir=_ttp \
  "$OLD" . | tee "$EVD/02_hits_after.txt" || true

AFTER_COUNT="$(wc -l < "$EVD/02_hits_after.txt" | tr -d ' ')"
echo "Hits after: $AFTER_COUNT"
echo

echo "== Show changed files =="
git status --porcelain | tee "$EVD/03_git_status.txt" || true
git diff --stat | tee "$EVD/04_diffstat.txt" || true

cat > "$EVD/next_steps.md" <<'MD'
## Next steps
1) Review diff quickly:
   - git diff
2) Commit + push:
   - git add -A
   - git commit -m "chore: replace @rmgdri.org emails with @rmgreatdane.org across site"
   - git push
3) In PR #3: reply on Lori’s comment with the commit hash and ask her to re-check via PR → Checks → View deployment.
MD

echo
echo "DONE. Evidence folder: $EVD" | tee "$EVD/99_done.txt"
