#!/usr/bin/env bash
set -euo pipefail

REPO="$HOME/ControlHub/RMGDRI_Website/rmgdri-site"
DATE="2026-02-11"
TTP_DIR="$REPO/_ttp"
TRANS_DIR="$TTP_DIR/transcripts"
EVID_DIR="$TTP_DIR/evidence"

mkdir -p "$TRANS_DIR" "$EVID_DIR"

TRANSCRIPT="$TRANS_DIR/${DATE}__TP0-daily-status-preflight.transcript.log"
STATUS_SNAPSHOT="$EVID_DIR/${DATE}__daily-status.snapshot.txt"
PREFLIGHT_OUT="$EVID_DIR/${DATE}__preflight.output.txt"

cd "$REPO"

{
  echo "=== TP0 DAILY STATUS + PREFLIGHT ==="
  echo "DATE: $DATE"
  echo "REPO: $REPO"
  echo

  echo "## git status"
  git status
  echo

  echo "## branch"
  git branch --show-current
  echo

  echo "## remotes"
  git remote -v
  echo

  echo "## last commits (10)"
  git log --oneline -n 10
  echo

  echo "## node + npm"
  node -v || true
  npm -v || true
  echo

  echo "## install state (package lock present?)"
  ls -la package.json package-lock.json 2>/dev/null || true
  echo

  echo "## npm audit (summary)"
  npm audit --audit-level=high || true
  echo

  echo "## run EOD preflight (governed)"
  if [ -f "./_ttp/run-eod-preflight.sh" ]; then
    bash "./_ttp/run-eod-preflight.sh" | tee "$PREFLIGHT_OUT"
  else
    echo "ERROR: ./_ttp/run-eod-preflight.sh not found"
    exit 2
  fi

  echo
  echo "=== TP0 COMPLETE ==="
  echo "Transcript: $TRANSCRIPT"
  echo "Daily Snapshot: $STATUS_SNAPSHOT"
  echo "Preflight Output: $PREFLIGHT_OUT"
} | tee "$TRANSCRIPT" > "$STATUS_SNAPSHOT"
