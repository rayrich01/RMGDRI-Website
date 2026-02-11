#!/usr/bin/env bash
set -euo pipefail

REPO="$HOME/ControlHub/RMGDRI_Website/rmgdri-site"
DATE="2026-02-11"
EVID="$REPO/_ttp/evidence/${DATE}__PR2-vercel-preview.txt"
TRANS="$REPO/_ttp/transcripts/${DATE}__TP1-pr2-preview-capture.transcript.log"

mkdir -p "$(dirname "$EVID")" "$(dirname "$TRANS")"
cd "$REPO"

{
  echo "=== TP1: PR #2 Vercel Preview Capture ==="
  echo "DATE: $DATE"
  echo "REPO: $REPO"
  echo

  echo "## Guardrails"
  echo "- No git add / commit / push in TP1"
  echo

  echo "## Current branch + status (for context only)"
  git branch --show-current
  git status --porcelain=v1
  echo

  echo "## Locate PRs (prefers gh CLI)"
  if command -v gh >/dev/null 2>&1; then
    echo "gh version:"
    gh --version || true
    echo

    echo "PR list (target: PR #2):"
    gh pr list --limit 10
    echo

    echo "PR #2 view (url + checks):"
    gh pr view 2 --json url,state,headRefName,baseRefName,createdAt,updatedAt,commits,checks,latestReviews --jq '{
      url:.url,
      state:.state,
      head:.headRefName,
      base:.baseRefName,
      updatedAt:.updatedAt,
      checks:(.checks | map({name:.name, state:.state, link:.link}) )
    }'
    echo

    echo "Attempt to extract Vercel preview URLs from PR checks:"
    gh pr view 2 --json checks --jq '
      .checks
      | map(select(.link != null))
      | map(.link)
      | map(select(test("vercel\\.app")))
      | unique
      | .[]?'
    echo

  else
    echo "NOTE: gh (GitHub CLI) not found. Fallback: provide manual steps."
    echo "Manual: open PR #2 in browser and copy Vercel Preview URL from checks/deployments."
  fi

  echo
  echo "=== OUTPUT CONTRACT ==="
  echo "Record in this file:"
  echo "- PR URL"
  echo "- Preview URL(s) (vercel.app)"
  echo "- Timestamp"
} | tee "$TRANS" > "$EVID"

echo "WROTE: $EVID"
echo "TRANSCRIPT: $TRANS"
