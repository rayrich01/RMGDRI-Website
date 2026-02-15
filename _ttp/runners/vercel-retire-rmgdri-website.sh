#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
TS="$(date +"%Y-%m-%d__VERCEL_RETIRE_RMGDRI_WEBSITE__%H%M%S")"
EVD="$ROOT/_ttp/evidence/$TS"
LOG="$EVD/run.log"
mkdir -p "$EVD"

exec > >(tee -a "$LOG") 2>&1

echo "== TTP: Retire rmgdri-website Vercel Project =="
echo "Repo: $ROOT"
echo "Evidence: $EVD"
echo "Timestamp: $(date)"
echo

echo "== Gate A: Evidence Capture =="
echo

echo "--- Vercel CLI Version ---"
npx vercel --version | tee "$EVD/00_vercel_version.txt"
echo

echo "--- Current Project Link ---"
if [[ -f ".vercel/project.json" ]]; then
  cat .vercel/project.json | tee "$EVD/01_current_project.txt"
else
  echo "No .vercel/project.json found" | tee "$EVD/01_current_project.txt"
fi
echo

echo "--- List All Projects ---"
npx vercel projects ls | tee "$EVD/02_projects_ls.txt"
echo

echo "--- Current Deployments (rmgdri-site) ---"
npx vercel ls --yes | head -20 | tee "$EVD/03_current_deployments.txt" || true
echo

echo "== Gate A Complete =="
echo "Evidence folder: $EVD"
echo
echo "Next Steps:"
echo "1. Review evidence files"
echo "2. Go to Vercel UI for manual steps (Gates B & C)"
echo "3. Archive rmgdri-website project"
echo

cat > "$EVD/NEXT_STEPS.md" << 'STEPS'
# Next Steps: Archive rmgdri-website

## Gate B: Pre-Archive Safety Checks (Vercel UI)

### B1) Check Domains
1. Go to: Vercel → rmgdri-website → Settings → Domains
2. Remove any important domains (move to rmgdri-site if needed)
3. Preview domains (*.vercel.app) are safe to let die

### B2) Disconnect Git
1. Go to: Vercel → rmgdri-website → Settings → Git
2. Click "Disconnect" to stop webhook builds
3. Verify: No git integration shown

## Gate C: Archive Project

1. Go to: Vercel → rmgdri-website → Settings → General
2. Scroll to: Danger Zone
3. Click: "Archive Project"
4. Confirm archive

## Gate D: Verify Canonical Path

After archiving, push a commit and verify:
- New deployments show: rmgdri-site-git-...
- NOT: rmgdri-website-git-...

## 24-Hour Hold

Wait 24 hours to ensure stability.
If all good, permanently delete rmgdri-website.
STEPS

echo "Instructions written to: $EVD/NEXT_STEPS.md"
