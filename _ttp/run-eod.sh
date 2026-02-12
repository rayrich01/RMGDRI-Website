#!/usr/bin/env bash
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATE="${DATE:-$(date +%F)}"
TTP_DIR="$REPO/_ttp"
EVID_ROOT="$TTP_DIR/evidence"
TS="$(date +%H%M%S)"
OUT_DIR="$EVID_ROOT/${DATE}__EOD_SNAPSHOT__${TS}"
BUILD_LOG="$OUT_DIR/build.log"
OUT_MD="$OUT_DIR/CLAUDE_CUTPASTE.md"

mkdir -p "$OUT_DIR"

echo "== EOD Runner =="
echo "Repo: $REPO"
echo "Out:  $OUT_DIR"
echo

cd "$REPO"

# -----------------------------
# Gate A: Preflight prep
# -----------------------------
echo "== Gate A: Preflight prep =="

BRANCH="$(git branch --show-current || true)"
SHA="$(git rev-parse --short HEAD || true)"

{
  echo "# Claude Cut/Paste Bundle"
  echo
  echo "## Repo"
  echo '```'
  echo "$REPO"
  echo "$BRANCH"
  echo "$SHA"
  echo '```'
  echo
  echo "## Merge-marker scan"
  echo '```'
  git grep -n '<<<<<<<\|=======\|>>>>>>>' -- src || true
  echo '```'
  echo
  echo "## successes shims (contents)"
  for f in \
    "src/app/(main)/successes/page.tsx" \
    "src/app/(main)/successes/[year]/page.tsx" \
    "src/app/(main)/successes/[year]/[slug]/page.tsx"
  do
    echo
    echo "### $f"
    echo '```tsx'
    if [[ -f "$f" ]]; then
      sed -n '1,160p' "$f"
    else
      echo "(missing)"
    fi
    echo '```'
  done
} > "$OUT_MD"

echo "Gate A complete ✅"
echo

# -----------------------------
# Gate B: Preflight execution (build)
# -----------------------------
if [[ "${SKIP_BUILD:-0}" == "1" ]]; then
  echo "== Gate B: Build (SKIPPED via SKIP_BUILD=1) =="
  {
    echo
    echo "## Build gate (skipped)"
    echo '```'
    echo "SKIP_BUILD=1 set — build gate intentionally skipped."
    echo "Timestamp: $(date -Iseconds 2>/dev/null || date +"%Y-%m-%dT%H:%M:%S%z")"
    echo '```'
  } >> "$OUT_MD"
  echo "Gate B skipped ✅"
else
  echo "== Gate B: Build gate =="
  {
    echo
    echo "## Build gate (captured)"
    echo '```'
  } >> "$OUT_MD"

  # Capture build output to log + bundle
  (npm run build 2>&1 | tee "$BUILD_LOG") || true

  {
    echo
    tail -n 260 "$BUILD_LOG" || true
    echo '```'
  } >> "$OUT_MD"

  echo "Gate B complete ✅ (see build.log)"
fi
echo

# -----------------------------
# Gate C: Present evidence + optional shutdown
# -----------------------------
echo "== Gate C: Evidence bundle =="
echo "Wrote: $OUT_MD"
echo
echo "---- BEGIN CLAUDE_CUTPASTE ----"
cat "$OUT_MD"
echo "---- END CLAUDE_CUTPASTE ----"
echo

read -r -p "Shutdown now? (y/N): " ans
if [[ "${ans}" == "y" || "${ans}" == "Y" ]]; then
  echo "Shutting down..."
  sudo shutdown -h now
else
  echo "Shutdown skipped."
fi
