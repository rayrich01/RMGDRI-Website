#!/usr/bin/env bash
set -euo pipefail

ROOT="$HOME/ControlHub/RMGDRI_Website/rmgdri-site"
TS="$(date +"%Y-%m-%d__RECOVER_SUCCESSES_HISTORY__%H%M%S")"
EVD="$ROOT/_ttp/evidence/$TS"
mkdir -p "$EVD"

cd "$ROOT"

echo "== Snapshot ==" | tee "$EVD/00_snapshot.txt"
echo "Repo: $ROOT" | tee -a "$EVD/00_snapshot.txt"
echo "Branch: $(git branch --show-current)" | tee -a "$EVD/00_snapshot.txt"
echo "HEAD: $(git rev-parse --short HEAD) - $(git log -1 --pretty=%s)" | tee -a "$EVD/00_snapshot.txt"

echo -e "\n== Current route folders (success/adoption) ==" | tee "$EVD/01_routes_fs.txt"
find src/app -maxdepth 4 -type d \( -iname "*success*" -o -iname "*adoption*" \) -print | sort | tee -a "$EVD/01_routes_fs.txt"

echo -e "\n== Current route files (page/layout/route) ==" | tee "$EVD/02_routes_files.txt"
find src/app -maxdepth 6 -type f \( -name "page.tsx" -o -name "layout.tsx" -o -name "route.ts" \) \
  | rg -n "success|adoption" || true | tee -a "$EVD/02_routes_files.txt"

echo -e "\n== Grep for route strings in code ==" | tee "$EVD/03_rg_strings.txt"
rg -n --hidden "adoption-successes|/adoption-successes|successes|/successes" src/app next.config.* package.json || true \
  | tee -a "$EVD/03_rg_strings.txt"

echo -e "\n== Commit search (last 200, filtered) ==" | tee "$EVD/04_git_search.txt"
git log -n 200 --pretty=format:"%h %ad %an %s" --date=short \
  | rg -n "success|adoption" || true | tee -a "$EVD/04_git_search.txt"

echo -e "\n== File-level history (routes) ==" | tee "$EVD/05_git_file_history.txt"
git log -n 50 --name-status -- src/app \
  | rg -n "success|adoption|src/app" || true | tee -a "$EVD/05_git_file_history.txt"

echo -e "\n== If redirects exist (next.config) ==" | tee "$EVD/06_next_config_redirects.txt"
if ls next.config.* >/dev/null 2>&1; then
  rg -n "redirects|/successes|/adoption-successes" next.config.* || true
else
  echo "No next.config.* found"
fi | tee -a "$EVD/06_next_config_redirects.txt"

echo -e "\n== Recent _ttp evidence referencing successes ==" | tee "$EVD/07_ttp_evidence_hits.txt"
find _ttp/evidence -maxdepth 3 -type f \( -iname "*.md" -o -iname "*.txt" \) -print \
  | rg -n "EOD|snapshot|success|adoption" || true | tee -a "$EVD/07_ttp_evidence_hits.txt"

echo -e "\n== DONE ==" | tee "$EVD/99_done.txt"
echo "Evidence folder: $EVD" | tee -a "$EVD/99_done.txt"
