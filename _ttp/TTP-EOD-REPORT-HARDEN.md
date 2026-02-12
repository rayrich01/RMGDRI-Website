# TTP: EOD Report Hardening (Evidence-Based)

## Purpose
Generate an evidence bundle for an accurate EOD status report:
- authoritative diff vs origin/main
- A/M/D counts
- /successes redirect shim existence
- merge-marker scan
- theme + sanity config facts
- optional build gate

## Run
From repo root:
  DATE=2026-02-11 _ttp/TTP-EOD-REPORT-HARDEN__RUNNER.sh

Skip build:
  SKIP_BUILD=1 _ttp/TTP-EOD-REPORT-HARDEN__RUNNER.sh

## Output
Writes to:
  _ttp/evidence/<DATE>__EOD-REPORT-HARDEN__<HHMMSS>/

Key file to paste into Claude:
  CLAUDE_INPUT.md
