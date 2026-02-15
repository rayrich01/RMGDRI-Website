#!/usr/bin/env bash
set -euo pipefail

ROOT="$HOME/ControlHub/RMGDRI_Website/rmgdri-site"
TS="$(date +"%Y-%m-%d__SYS_PERF_SNAPSHOT__%H%M%S")"
EVD="$ROOT/_ttp/evidence/$TS"
mkdir -p "$EVD"

LOG="$EVD/run.log"
exec > >(tee -a "$LOG") 2>&1

echo "== System Performance Snapshot =="
echo "Repo: $ROOT"
echo "Evidence: $EVD"
echo "Timestamp: $TS"
echo

cd "$ROOT"

# --- Basic host + OS ---
echo "== Host / OS =="
hostname | tee "$EVD/01_hostname.txt"
sw_vers | tee "$EVD/02_sw_vers.txt" || true
uname -a | tee "$EVD/03_uname.txt"
echo

# --- CPU / Memory quick view ---
echo "== CPU / Memory (top snapshot) =="
top -l 1 -n 0 | tee "$EVD/04_top.txt" || true
echo

# --- Disk / Filesystem ---
echo "== Disk (df) =="
df -h | tee "$EVD/05_df.txt"
echo

echo "== Disk (local root & repo dir stats) =="
du -sh "$ROOT" | tee "$EVD/06_du_repo.txt" || true
echo

# --- Network snapshot (non-invasive) ---
echo "== Network (ifconfig summary) =="
ifconfig | rg -n "status:|inet " 2>/dev/null | tee "$EVD/07_ifconfig_filtered.txt" || ifconfig | tee "$EVD/07_ifconfig_full.txt"
echo

# --- Repo health ---
echo "== Git state =="
git rev-parse --abbrev-ref HEAD | tee "$EVD/08_git_branch.txt"
git rev-parse HEAD | tee "$EVD/09_git_head.txt"
git status --porcelain | tee "$EVD/10_git_status_porcelain.txt" || true
git log -n 10 --pretty=format:"%h %ad %an %s" --date=short | tee "$EVD/11_git_log_10.txt"
echo

# --- Node / toolchain ---
echo "== Node / npm / deps =="
node -v | tee "$EVD/12_node_version.txt" || true
npm -v | tee "$EVD/13_npm_version.txt" || true
if [[ -f package.json ]]; then
  node -e "const p=require('./package.json'); console.log('name:',p.name); console.log('next:',(p.dependencies&&p.dependencies.next)||(p.devDependencies&&p.devDependencies.next));" \
    | tee "$EVD/14_pkg_summary.txt" || true
fi
echo

# --- Env sanity (do NOT print secrets) ---
echo "== Env presence check (no secrets) =="
if [[ -f .env.local ]]; then
  echo "Found .env.local: yes" | tee "$EVD/15_envlocal_present.txt"
else
  echo "Found .env.local: no" | tee "$EVD/15_envlocal_present.txt"
fi

# Load env if present (for presence checks only)
if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

node - <<'NODE' | tee "$EVD/16_env_presence.json" || true
const keys = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_TOKEN",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_VERCEL_URL",
];
const out = {};
for (const k of keys) out[k] = !!process.env[k];
console.log(JSON.stringify(out, null, 2));
NODE
echo

# --- Build smoke (optional but useful) ---
echo "== Local build smoke (next build) =="
# Keep it simple; if it fails, we still capture error in log.
npm run -s build | tee "$EVD/17_local_build_output.txt" || echo "Local build failed (see run.log)" | tee "$EVD/17_local_build_failed.txt"
echo

# --- Notes ---
cat > "$EVD/99_summary.md" <<MD
# System Performance Snapshot

Evidence folder: \`$EVD\`

Includes:
- Host/OS info
- CPU/memory top snapshot
- Disk usage
- Repo state + last commits
- Node/npm/Next version
- Env var presence (no secret values)
- Local build smoke output

Use this for:
- diagnosing sudden slowdowns
- verifying toolchain drift
- capturing baseline before/after major changes
MD

echo "DONE. Evidence folder: $EVD"
