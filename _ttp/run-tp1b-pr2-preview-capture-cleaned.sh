#!/usr/bin/env bash
set -euo pipefail

REPO="$HOME/ControlHub/RMGDRI_Website/rmgdri-site"
DATE="2026-02-11"
EVID="$REPO/_ttp/evidence/${DATE}__PR2-vercel-preview.cleaned.txt"
TRANS="$REPO/_ttp/transcripts/${DATE}__TP1b-pr2-preview-capture.cleaned.transcript.log"

mkdir -p "$(dirname "$EVID")" "$(dirname "$TRANS")"
cd "$REPO"

{
  echo "=== TP1b: PR #2 Vercel Preview Capture (CLEANED) ==="
  echo "DATE: $DATE"
  echo "REPO: $REPO"
  echo

  echo "## Guardrails"
  echo "- No git add / commit / push in TP1b"
  echo

  echo "## Current branch + status (context only)"
  git branch --show-current
  git status --porcelain=v1
  echo

  echo "## PR #2 metadata"
  gh pr view 2 --json url,state,headRefName,baseRefName,updatedAt,title --jq '{
    url:.url,
    state:.state,
    title:.title,
    head:.headRefName,
    base:.baseRefName,
    updatedAt:.updatedAt
  }'
  echo

  echo "## Status checks rollup (extract possible Vercel URLs)"
  # Try multiple URL fields because providers differ
  gh pr view 2 --json statusCheckRollup --jq '
    (.statusCheckRollup // [])
    | map({
        name: (.name // ""),
        conclusion: (.conclusion // ""),
        status: (.status // ""),
        detailsUrl: (.detailsUrl // ""),
        targetUrl: (.targetUrl // "")
      })
    | .[]' 2>/dev/null || true
  echo

  echo "## Candidate vercel.app URLs"
  gh pr view 2 --json statusCheckRollup --jq '
    (.statusCheckRollup // [])
    | map(.detailsUrl // empty)
    | . + ((.statusCheckRollup // []) | map(.targetUrl // empty))
    | map(select(type=="string" and test("vercel\\.app")))
    | unique
    | .[]?' 2>/dev/null || true
  echo

  echo "## If no URLs above, manual capture steps"
  echo "1) Open PR #2 in browser: gh pr view 2 --web"
  echo "2) In PR page, look for 'Checks' or 'Deployments' section"
  echo "3) Copy the Vercel Preview URL (usually *.vercel.app) and paste into this evidence file"
  echo
  echo "=== TP1b COMPLETE ==="
  echo "EVIDENCE: $EVID"
  echo "TRANSCRIPT: $TRANS"
} | tee "$TRANS" > "$EVID"

echo "WROTE: $EVID"
