#!/usr/bin/env bash
set -euo pipefail

# =============================
# RMGDRI Restore Validation TTP
# Gates: A (Host/Toolchain), B (Repo/Build), C (Sanity/R2)
# Evidence: _ttp/evidence/EnvValidate_YYYY-MM-DD_HHMMSS/
# =============================

REPO="${HOME}/ControlHub/RMGDRI_Website/rmgdri-site"
TS="$(date +%Y-%m-%d_%H%M%S)"
EV_ROOT="${REPO}/_ttp/evidence"
EV_DIR="${EV_ROOT}/EnvValidate_${TS}"
TRANSCRIPT="${EV_DIR}/transcript.log"
ENV_SNAP="${EV_DIR}/env.snapshot.txt"
NET_SNAP="${EV_DIR}/net.snapshot.txt"
REPO_SNAP="${EV_DIR}/repo.snapshot.txt"
SANITY_SNAP="${EV_DIR}/sanity.snapshot.txt"
R2_SNAP="${EV_DIR}/r2.snapshot.txt"
PREFLIGHT_BUILD_LOG="${EV_DIR}/next.build.log"
SUMMARY_JSON="${EV_DIR}/summary.json"

mkdir -p "${EV_DIR}"

# Start transcript capture
exec > >(tee -a "${TRANSCRIPT}") 2>&1

echo "=== RMGDRI RESTORE VALIDATION TTP ==="
echo "timestamp=${TS}"
echo "repo=${REPO}"
echo "evidence_dir=${EV_DIR}"
echo ""

fail() {
  local code="${1:-1}"
  local msg="${2:-Unknown failure}"
  echo ""
  echo "❌ FAIL: ${msg}"
  echo ""
  exit "${code}"
}

note() { echo "• $*"; }
ok() { echo "✅ $*"; }

# -------------------------------------
# Gate A: Host + Toolchain Baseline
# -------------------------------------
echo "=== GATE A: Host + Toolchain ==="

{
  echo "== OS =="
  sw_vers || true
  uname -a || true
  echo ""

  echo "== Time =="
  date || true
  systemsetup -gettimezone 2>/dev/null || true
  echo ""

  echo "== Disk =="
  df -h || true
  echo ""

  echo "== Toolchain =="
  which node || true
  node -v || true
  npm -v || true
  which git || true
  git --version || true
  xcode-select -p 2>/dev/null || true
  python3 --version 2>/dev/null || true
  echo ""
} | tee -a "${ENV_SNAP}"

{
  echo "== DNS (partial) =="
  scutil --dns | head -n 120 || true
  echo ""
  echo "== Network reachability =="
  ping -c 2 1.1.1.1 || true
  ping -c 2 google.com || true
  echo ""
} | tee -a "${NET_SNAP}"

ok "Gate A completed (host/toolchain snapshots captured)."
echo ""

# -------------------------------------
# Gate B: Repo + Deterministic Build
# -------------------------------------
echo "=== GATE B: Repo + Build ==="
cd "${REPO}" || fail 2 "Repo not found at ${REPO}"

{
  echo "== Git =="
  echo "pwd=$(pwd)"
  git status || true
  echo "branch=$(git branch --show-current || true)"
  echo "HEAD=$(git rev-parse --short HEAD 2>/dev/null || true) $(git log -1 --oneline 2>/dev/null || true)"
  echo ""
  echo "== Remotes =="
  git remote -v || true
  echo ""
  echo "== Recent commits =="
  git log --oneline -n 12 || true
  echo ""
} | tee -a "${REPO_SNAP}"

# Require clean working tree for auditable restore
if [[ -n "$(git status --porcelain)" ]]; then
  echo ""
  git status --porcelain
  fail 3 "Working tree is NOT clean. Commit/stash before certifying restore."
fi
ok "Working tree clean."

# Install deps deterministically if package-lock exists
if [[ -f package-lock.json ]]; then
  note "npm ci (deterministic install)"
  npm ci
else
  note "package-lock.json not found; running npm install"
  npm install
fi

note "Cold production build (clearing .next)"
rm -rf .next || true
NODE_ENV=production npx next build > "${PREFLIGHT_BUILD_LOG}" 2>&1 || {
  echo "---- tail of build log ----"
  tail -80 "${PREFLIGHT_BUILD_LOG}" || true
  fail 4 "next build failed"
}
ok "next build PASS (log saved)."
tail -30 "${PREFLIGHT_BUILD_LOG}" || true
echo ""

# -------------------------------------
# Gate C: Sanity + R2 Probes (no secrets printed)
# -------------------------------------
echo "=== GATE C: Sanity + R2 ==="

# Load env locally (presence only; do not echo values)
if [[ -f .env.local ]]; then
  set -a
  source .env.local >/dev/null 2>&1 || true
  set +a
  ok ".env.local loaded (values not printed)."
else
  note "No .env.local found (skipping env load)."
fi

# Sanity: verify required public vars exist (presence only)
SANITY_PROJECT_ID="${NEXT_PUBLIC_SANITY_PROJECT_ID:-}"
SANITY_DATASET="${NEXT_PUBLIC_SANITY_DATASET:-}"
{
  echo "== Sanity env presence (no values printed except safe identifiers) =="
  echo "NEXT_PUBLIC_SANITY_PROJECT_ID_present=$([[ -n "${SANITY_PROJECT_ID}" ]] && echo true || echo false)"
  echo "NEXT_PUBLIC_SANITY_DATASET_present=$([[ -n "${SANITY_DATASET}" ]] && echo true || echo false)"
  echo "projectId_safe=${SANITY_PROJECT_ID:-null}"
  echo "dataset_safe=${SANITY_DATASET:-null}"
  echo ""
} | tee -a "${SANITY_SNAP}"

if [[ -z "${SANITY_PROJECT_ID}" || -z "${SANITY_DATASET}" ]]; then
  fail 5 "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET (required for build/runtime)."
fi

# Studio health (build already covers a lot, but we also check sanity CLI presence)
{
  echo "== Sanity CLI =="
  npx sanity --version 2>/dev/null || echo "npx sanity not available (ok if not used)"
  echo ""
} | tee -a "${SANITY_SNAP}"

ok "Sanity baseline checks complete."
echo ""

# R2 Probe (optional, requires aws sdk dependency already present)
# We only do HeadBucket + ListObjects(MaxKeys=1). No uploads/deletes.
R2_ENDPOINT="${R2_ENDPOINT:-}"
R2_BUCKET="${R2_BUCKET_NAME:-}"
R2_AK="${R2_ACCESS_KEY_ID:-}"
R2_SK="${R2_SECRET_ACCESS_KEY:-}"

{
  echo "== R2 env presence (no values printed except safe endpoint/bucket) =="
  echo "R2_ACCESS_KEY_ID_present=$([[ -n "${R2_AK}" ]] && echo true || echo false)"
  echo "R2_SECRET_ACCESS_KEY_present=$([[ -n "${R2_SK}" ]] && echo true || echo false)"
  echo "R2_ENDPOINT_present=$([[ -n "${R2_ENDPOINT}" ]] && echo true || echo false)"
  echo "R2_BUCKET_NAME=${R2_BUCKET:-null}"
  echo "R2_ENDPOINT=${R2_ENDPOINT:-null}"
  echo ""
} | tee -a "${R2_SNAP}"

if [[ -n "${R2_ENDPOINT}" && -n "${R2_BUCKET}" && -n "${R2_AK}" && -n "${R2_SK}" ]]; then
  note "Running R2 HeadBucket/ListObjects probe (no writes)"
  cat > "${EV_DIR}/r2-probe.mjs" <<'NODE'
import { S3Client, HeadBucketCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

function req(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const endpoint = req("R2_ENDPOINT");
const bucket = req("R2_BUCKET_NAME");

const s3 = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId: req("R2_ACCESS_KEY_ID"),
    secretAccessKey: req("R2_SECRET_ACCESS_KEY"),
  },
  forcePathStyle: true,
});

(async () => {
  console.log(`R2_PROBE_START ${new Date().toISOString()}`);
  console.log(`endpoint=${endpoint}`);
  console.log(`bucket=${bucket}`);

  await s3.send(new HeadBucketCommand({ Bucket: bucket }));
  console.log("✅ HeadBucket OK");

  const r = await s3.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1 }));
  const firstKey = r.Contents?.[0]?.Key ?? null;
  const count = r.KeyCount ?? (r.Contents?.length ?? 0);
  console.log(`✅ ListObjects OK count>=${count} firstKey=${firstKey}`);
  console.log("R2_PROBE_PASS ✅");
})();
NODE

  node "${EV_DIR}/r2-probe.mjs" | tee -a "${R2_SNAP}"
  ok "R2 probe PASS."
else
  note "R2 probe skipped (missing one or more R2_* env vars)."
fi

echo ""
ok "Gate C completed."
echo ""

# -------------------------------------
# Summary JSON (minimal, deterministic)
# -------------------------------------
cat > "${SUMMARY_JSON}" <<JSON
{
  "timestamp": "${TS}",
  "repo": "${REPO}",
  "evidence_dir": "${EV_DIR}",
  "gates": {
    "A_host_toolchain": "PASS",
    "B_repo_build": "PASS",
    "C_sanity_r2": "PASS"
  },
  "notes": {
    "restoration_level": "dev+cms",
    "prod_deploy_domain": "UNKNOWN (verify in Vercel dashboard)",
    "r2_probe": "$( [[ -n "${R2_ENDPOINT}" && -n "${R2_BUCKET}" && -n "${R2_AK}" && -n "${R2_SK}" ]] && echo "ATTEMPTED" || echo "SKIPPED" )"
  }
}
JSON

echo "=== RESTORE VALIDATION COMPLETE ✅ ==="
echo "Evidence folder: ${EV_DIR}"
echo "Summary: ${SUMMARY_JSON}"
