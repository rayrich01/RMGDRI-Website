#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────
# daily-status.sh — Generate a daily git status summary for the project
#
# Usage:
#   ./scripts/daily-status.sh            # today's status
#   ./scripts/daily-status.sh 2026-02-05 # specific date
#   ./scripts/daily-status.sh | pbcopy   # copy to clipboard (macOS)
# ──────────────────────────────────────────────────────────────────────

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

DATE="${1:-$(date +%Y-%m-%d)}"
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
BRANCH=$(git branch --show-current)
HEAD=$(git rev-parse --short HEAD)

echo "# ${REPO_NAME} — Daily Status"
echo "## Date: ${DATE}"
echo ""

# ── Commits ───────────────────────────────────────────────────────────
COMMITS=$(git log --oneline --since="${DATE}T00:00:00" --until="${DATE}T23:59:59" --all 2>/dev/null || true)
COMMIT_COUNT=$(echo "$COMMITS" | grep -c . 2>/dev/null || echo "0")

echo "### Branch: \`${BRANCH}\` at \`${HEAD}\`"
echo ""
echo "### Commits (${COMMIT_COUNT})"
if [ "$COMMIT_COUNT" -gt 0 ]; then
  echo "$COMMITS" | while IFS= read -r line; do
    echo "- \`${line}\`"
  done
else
  echo "_No commits on ${DATE}_"
fi
echo ""

# ── Diff stats ────────────────────────────────────────────────────────
echo "### Changes"
FIRST_COMMIT=$(git log --oneline --since="${DATE}T00:00:00" --until="${DATE}T23:59:59" --all --reverse --format="%H" 2>/dev/null | head -1)
if [ -n "$FIRST_COMMIT" ]; then
  SHORTSTAT=$(git diff --shortstat "${FIRST_COMMIT}^..HEAD" 2>/dev/null || echo "unable to compute")
  echo "$SHORTSTAT"
else
  echo "_No changes to summarize_"
fi
echo ""

# ── Audit ─────────────────────────────────────────────────────────────
echo "### npm audit"
if command -v npm &>/dev/null && [ -f package.json ]; then
  AUDIT_OUTPUT=$(npm audit --omit=dev 2>&1 || true)
  if echo "$AUDIT_OUTPUT" | grep -q "found 0 vulnerabilities"; then
    echo "0 vulnerabilities"
  else
    echo "$AUDIT_OUTPUT" | grep -E "(Severity:|vulnerabilities)" | tail -3
  fi
else
  echo "_npm not available or no package.json_"
fi
echo ""

# ── Working tree ──────────────────────────────────────────────────────
echo "### Working Tree"
DIRTY=$(git status --porcelain 2>/dev/null | head -20)
if [ -z "$DIRTY" ]; then
  echo "Clean"
else
  echo "\`\`\`"
  echo "$DIRTY"
  echo "\`\`\`"
fi
echo ""

echo "---"
echo "_Generated $(date '+%Y-%m-%d %H:%M:%S') by daily-status.sh_"
