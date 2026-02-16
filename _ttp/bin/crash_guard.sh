#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

ts="$(date +%Y-%m-%d_%H%M%S)"
EVID_DIR="$REPO_ROOT/_ttp/evidence/CrashGuard_${ts}"
STATE_DIR="$REPO_ROOT/_ttp/state"
STATE_FILE="$STATE_DIR/CLAUDE-RESUME.md"
LOG_FILE="$EVID_DIR/crash_guard.log"

mkdir -p "$EVID_DIR" "$STATE_DIR"

log() { echo "[$(date +%H:%M:%S)] $*" | tee -a "$LOG_FILE" ; }

FORMS_PDF_DIR="$REPO_ROOT/_ref/forms-pdf"
FORMS_TXT_DIR="$REPO_ROOT/_ref/forms-txt"

log "=== Crash Guard start ==="
log "repo=$REPO_ROOT"
log "evidence_dir=$EVID_DIR"

# 1) Verify reference folders
if [[ ! -d "$FORMS_PDF_DIR" ]]; then
  log "WARN: Missing $FORMS_PDF_DIR (PDF refs not found)."
else
  log "OK: Found PDF refs: $FORMS_PDF_DIR"
fi

mkdir -p "$FORMS_TXT_DIR"

# 2) Convert PDFs -> TXT if TXT folder empty or missing expected files
if [[ -d "$FORMS_PDF_DIR" ]]; then
  pdf_count="$(ls -1 "$FORMS_PDF_DIR"/*.pdf 2>/dev/null | wc -l | tr -d ' ')"
  txt_count="$(ls -1 "$FORMS_TXT_DIR"/*.txt 2>/dev/null | wc -l | tr -d ' ')"
  log "pdf_count=$pdf_count txt_count=$txt_count"

  if [[ "$pdf_count" -gt 0 && "$txt_count" -eq 0 ]]; then
    log "Converting PDFs -> TXT using textutil (best-effort)..."
    for f in "$FORMS_PDF_DIR"/*.pdf; do
      base="$(basename "$f" .pdf)"
      out="$FORMS_TXT_DIR/${base}.txt"
      # textutil returns nonzero sometimes; don't hard-fail conversion
      /usr/bin/textutil -convert txt -output "$out" "$f" >/dev/null 2>&1 || true
      if [[ -s "$out" ]]; then
        log "Wrote: _ref/forms-txt/${base}.txt"
      else
        log "WARN: textutil produced empty TXT for: $f"
      fi
    done
  else
    log "TXT conversion skipped (either already present or no PDFs)."
  fi
fi

# 3) De-dupe warning for Shelter Transfer
if [[ -f "$FORMS_PDF_DIR/Rescue or Shelter Transfer.pdf" && -f "$FORMS_PDF_DIR/Rescue or Shelter Transfer (1).pdf" ]]; then
  log "WARN: Duplicate Shelter Transfer PDFs detected."
  log "      Choose ONE canonical and rename the other to __DUPLICATE_DO_NOT_USE.pdf to prevent Claude drift."
fi

# 4) Quick health checks: env + build
log "Checking .env.local presence..."
if [[ -f "$REPO_ROOT/.env.local" ]]; then
  log "OK: .env.local present (values not printed)."
else
  log "WARN: .env.local missing (local dev/build may fail for Sanity/Supabase)."
fi

log "Running npm build (captures postbuild Tailwind verification)..."
if npm run build >>"$LOG_FILE" 2>&1; then
  log "OK: npm run build PASS"
  build_status="PASS"
else
  log "FAIL: npm run build failed (see log)."
  build_status="FAIL"
fi

# 5) Write resume state for Claude (small + deterministic)
branch="$(git branch --show-current 2>/dev/null || echo "unknown")"
head_commit="$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")"
dirty="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"

cat > "$STATE_FILE" <<RESUME
# CLAUDE RESUME STATE — ${ts}

## Repo
- path: ${REPO_ROOT}
- branch: ${branch}
- head: ${head_commit}
- working_tree_changes: ${dirty}

## Crash Guard Evidence
- evidence_dir: _ttp/evidence/CrashGuard_${ts}/
- log: _ttp/evidence/CrashGuard_${ts}/crash_guard.log
- build_status: ${build_status}

## Canonical References
- PDFs: _ref/forms-pdf/
- TXT extracts: _ref/forms-txt/

### IMPORTANT RULES
1) Do NOT open PDFs unless TXT is missing/empty. Prefer _ref/forms-txt/*.txt
2) Implement ONE form per batch; after each batch run:
   - npm run build
   - git commit -m "feat(forms): <form_key> v1"
3) Do not refactor unrelated files.

## Form keys (canonical)
Public:
- adopt-foster  -> /apply/adopt-foster
- owner-surrender -> /apply/surrender
- volunteer -> /apply/volunteer

Ops:
- homecheck -> /ops/homecheck
- approval -> /ops/approval
- phone-interview -> /ops/phone-interview
- foster-medical -> /ops/foster-medical
- bite-report-human -> /ops/bite-report-human
- shelter-transfer -> /ops/shelter-transfer
- adoption-followup -> /ops/adoption-followup

## Next action for Claude
Read TXT files for the current form key being implemented, extract fields + required flags + enums + conditional logic, then implement:
- /lib/forms/schemas/<formKey>.ts (Zod)
- /app/api/forms/<formKey>/submit/route.ts (POST only)
- /app/(apply|ops)/.../page.tsx (multi-step UI mirroring PDF headings)
RESUME

log "Wrote resume state: $STATE_FILE"
log "=== Crash Guard complete ==="

echo
echo "✅ Crash Guard complete."
echo "Resume file for Claude: $STATE_FILE"
echo "Evidence log: $LOG_FILE"
