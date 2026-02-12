#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(pwd)"
FILE="src/app/(main)/sponsor-a-dane/page.tsx"
URL="https://greatd.mybigcommerce.com/sponsor-a-dane/"
TS="$(date +"%Y-%m-%d__SPONSOR_CTA_BIGCOMMERCE__%H%M%S")"
EVD="$REPO_ROOT/_ttp/evidence/$TS"
mkdir -p "$EVD"
echo "== Fix /sponsor-a-dane CTA to BigCommerce ==" | tee "$EVD/00_header.txt"
echo "Repo: $REPO_ROOT" | tee -a "$EVD/00_header.txt"
echo "Target file: $FILE" | tee -a "$EVD/00_header.txt"
echo "New URL: $URL" | tee -a "$EVD/00_header.txt"
echo "Evidence: $EVD" | tee -a "$EVD/00_header.txt"
echo | tee -a "$EVD/00_header.txt"
echo "== Pre-scan (href lines) ==" | tee "$EVD/01_prescan.txt"
grep -nE 'href=' "$FILE" | rg -n 'sponsor-a-dane|donate-to-rmgdri|Make a Donation|greatd\.mybigcommerce' || true | tee -a "$EVD/01_prescan.txt"
echo | tee -a "$EVD/01_prescan.txt"
echo "== Pre-scan: donate-to-rmgdri refs ==" | tee "$EVD/02_prescan_donate_refs.txt"
grep -nE '/donate-to-rmgdri|donate-to-rmgdri' "$FILE" | tee -a "$EVD/02_prescan_donate_refs.txt" || true
echo
echo "== Replace internal donate route with BigCommerce URL (file-scoped) ==" | tee "$EVD/03_replace.txt"
perl -pi -e "s#href=\\\"/donate-to-rmgdri\\\"#href=\\\"$URL\\\"#g" "$FILE"
perl -pi -e "s#href=\\'/donate-to-rmgdri\\'#href=\\'$URL\\'#g" "$FILE"
echo
echo "== Post-scan: confirm BigCommerce URL present ==" | tee "$EVD/04_postscan_bigcommerce.txt"
grep -n "$URL" "$FILE" | tee -a "$EVD/04_postscan_bigcommerce.txt" || true
echo
echo "== Post-scan: confirm no remaining donate-to-rmgdri refs ==" | tee "$EVD/05_postscan_no_internal_donate.txt"
if grep -nE '/donate-to-rmgdri|donate-to-rmgdri' "$FILE" | tee -a "$EVD/05_postscan_no_internal_donate.txt" ; then
  echo "WARN: still contains /donate-to-rmgdri refs. Review." | tee "$EVD/06_warn.txt"
  exit 2
else
  echo "OK: no /donate-to-rmgdri references remain in sponsor page." | tee "$EVD/06_ok.txt"
fi
echo
echo "== Diffstat ==" | tee "$EVD/07_diffstat.txt"
git diff --stat | tee -a "$EVD/07_diffstat.txt" || true
echo
echo "DONE. Evidence folder: $EVD" | tee "$EVD/99_done.txt"
