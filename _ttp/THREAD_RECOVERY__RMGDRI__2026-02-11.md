# THREAD RECOVERY — RMGDRI (local source of truth)
Date: 2026-02-11
Branch: feat/lori-review-fixes-2026-02-11
Purpose: Preserve EOD routine + ops commands + Claude cut/paste bundle approach in case chat is unavailable.

## Key Outcomes Today
- PR #3 prepared for Lori review
- /successes retired via redirect shims to /adoption-successes
- EOD runner created: _ttp/run-eod.sh
- Evidence bundle output: _ttp/evidence/<DATE>__EOD_SNAPSHOT__<HHMMSS>/CLAUDE_CUTPASTE.md
- OPS menu updated to include EOD documentation

## EOD One-Word Command Plan
Goal: minimize manual steps: preflight -> bundle -> optional shutdown prompt

Primary command (from repo root):
  _ttp/run-eod.sh

Fast mode:
  SKIP_BUILD=1 _ttp/run-eod.sh

Expected gates:
- Gate A: preflight prep (repo/sha, merge marker scan, successes shim capture)
- Gate B: optional build (npm run build)
- Gate C: emit CLAUDE_CUTPASTE.md and print to terminal, prompt shutdown

## Verification Snippets
Latest EOD snapshot directory:
  LATEST_DIR="$(ls -1dt _ttp/evidence/*__EOD_SNAPSHOT__* | head -n 1)"
  echo "$LATEST_DIR"

Confirm Build gate section exists in bundle:
  grep -n "## Build gate" "$LATEST_DIR/CLAUDE_CUTPASTE.md" || true

## Policy Reminder (Cut/Paste Minimization)
If a workflow exceeds ~3–4 commands, deliver as a packaged runner/TTP.
