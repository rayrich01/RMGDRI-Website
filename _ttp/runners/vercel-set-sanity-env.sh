#!/usr/bin/env bash
set -euo pipefail

ROOT="$HOME/ControlHub/RMGDRI_Website/rmgdri-site"
TS="$(date +"%Y-%m-%d__VERCEL_SET_SANITY_ENV__%H%M%S")"
EVD="$ROOT/_ttp/evidence/$TS"
LOG="$EVD/run.log"

mkdir -p "$EVD"
exec > >(tee -a "$LOG") 2>&1

cd "$ROOT"

echo "== Vercel: set Sanity env vars =="
echo "Root: $ROOT"
echo "TS:   $TS"
echo

# prefer local vercel binary, fall back to npx
if command -v vercel >/dev/null 2>&1; then
  VERCEL="vercel"
else
  VERCEL="npx vercel"
fi

# Load env from .env.local if present (simple export parser)
if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

REQ_PID="${NEXT_PUBLIC_SANITY_PROJECT_ID:-}"
REQ_DS="${NEXT_PUBLIC_SANITY_DATASET:-}"
OPT_TOKEN="${SANITY_API_TOKEN:-}"

echo "Found NEXT_PUBLIC_SANITY_PROJECT_ID: ${REQ_PID:+(yes)}${REQ_PID:-(NO)}"
echo "Found NEXT_PUBLIC_SANITY_DATASET:    ${REQ_DS:+(yes)}${REQ_DS:-(NO)}"
echo "Found SANITY_API_TOKEN:             ${OPT_TOKEN:+(yes)}${OPT_TOKEN:-(NO)}"
echo

if [[ -z "${REQ_PID:-}" ]]; then
  echo "ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID missing. Add it to .env.local then rerun."
  exit 2
fi
if [[ -z "${REQ_DS:-}" ]]; then
  echo "WARN: NEXT_PUBLIC_SANITY_DATASET missing. Recommended to set; proceeding anyway."
fi

echo "== Ensure Vercel link =="
if [[ ! -f .vercel/project.json ]]; then
  echo "No .vercel/project.json; running 'vercel link' (may prompt once)"
  $VERCEL link
else
  echo "Already linked: .vercel/project.json present"
fi
echo

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

writefile () { local n="$1"; local v="$2"; printf "%s" "$v" > "$tmpdir/$n.txt"; echo "$tmpdir/$n.txt"; }

set_env () {
  local name="$1"; local env="$2"; local val="$3";
  local f; f="$(writefile "$name-$env" "$val")"
  echo "--> setting $name ($env)"
  $VERCEL env rm "$name" "$env" --yes >/dev/null 2>&1 || true
  $VERCEL env add "$name" "$env" < "$f"
}

echo "== Set public vars (Preview + Production) =="
set_env "NEXT_PUBLIC_SANITY_PROJECT_ID" "preview" "$REQ_PID"
set_env "NEXT_PUBLIC_SANITY_PROJECT_ID" "production" "$REQ_PID"

if [[ -n "${REQ_DS:-}" ]]; then
  set_env "NEXT_PUBLIC_SANITY_DATASET" "preview" "$REQ_DS"
  set_env "NEXT_PUBLIC_SANITY_DATASET" "production" "$REQ_DS"
fi

# Only set token if present locally and you explicitly want it on Vercel
if [[ -n "${OPT_TOKEN:-}" ]]; then
  echo
  echo "== Set secret token (Preview + Production) =="
  set_env "SANITY_API_TOKEN" "preview" "$OPT_TOKEN"
  set_env "SANITY_API_TOKEN" "production" "$OPT_TOKEN"
else
  echo
  echo "NOTE: SANITY_API_TOKEN not set locally; skipping token push to Vercel."
  echo "If you need server-side Sanity mutations on Vercel, add SANITY_API_TOKEN in Vercel UI or .env.local then rerun."
fi

echo
echo "== vercel env ls (evidence) =="
$VERCEL env ls | tee "$EVD/vercel_env_ls.txt"

cat > "$EVD/next_steps.md" <<'MD'
## Next steps
1) In Vercel Deployments, click Redeploy on the latest Preview for the branch.
2) Confirm the build passes "Collecting page data".
3) If it fails again, paste the first error block — it will usually be the next missing var (dataset) or a route-level config guard.
MD

echo
echo "DONE. Evidence folder: $EVD"
