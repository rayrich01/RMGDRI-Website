#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TS="$(date +"%Y-%m-%d_%H%M%S")"
EVID_DIR="_ttp/evidence/${TS}"
mkdir -p "$EVID_DIR"

echo "== RMGDRI EOD Preflight =="
echo "Root: $ROOT"
echo "Evidence: $EVID_DIR"

# --- Evidence: environment + toolchain (no secrets printed) ---
{
  echo "## date"
  date
  echo
  echo "## node"
  node -v 2>/dev/null || true
  echo "## npm"
  npm -v 2>/dev/null || true
  echo "## git"
  git --version 2>/dev/null || true
  echo
  echo "## branch"
  git branch --show-current || true
  echo
  echo "## head"
  git rev-parse --short HEAD || true
  echo
  echo "## status --porcelain"
  git status --porcelain || true
} > "$EVID_DIR/preflight.md"

# --- Security scan (focused, macOS-safe) ---
{
  echo "## token scan (excluding node_modules/.git/.next/.sanity/_ttp)"
  find . \
    -path './.git' -prune -o \
    -path './node_modules' -prune -o \
    -path './.next' -prune -o \
    -path './.sanity' -prune -o \
    -path './_ttp' -prune -o \
    -type f \( -name '*.js' -o -name '*.ts' -o -name '*.tsx' -o -name '*.json' -o -name '*.md' -o -name '*.env*' -o -name '*.yml' -o -name '*.yaml' \) \
    -print0 \
  | xargs -0 grep -nE "sk[A-Za-z0-9]{20,}|SANITY_(AUTH|API)_TOKEN\s*=|Bearer[[:space:]]+|token[[:space:]]*:" \
  || echo "✅ No token-like strings found in scanned files"
  echo
  echo "## .env.local presence (should be ignored)"
  ls -la .env.local 2>/dev/null || echo "✅ .env.local not found"
} > "$EVID_DIR/security-scan.md"

# --- Dependency audit (no fixes, just report) ---
npm audit --omit=dev > "$EVID_DIR/npm-audit.txt" 2>&1 || true

# --- Build sanity check (optional but recommended) ---
npm run -s lint > "$EVID_DIR/lint.txt" 2>&1 || true

echo "✅ Preflight complete."
echo "Evidence written to: $EVID_DIR"
