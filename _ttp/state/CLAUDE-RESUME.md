# CLAUDE RESUME STATE — 2026-02-15_185243

## Repo
- path: /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site
- branch: fix/unify-app-router-2026-02-15_180649
- head: cdc68de
- working_tree_changes: 0

## Crash Guard Evidence
- evidence_dir: _ttp/evidence/CrashGuard_2026-02-15_185243/
- log: _ttp/evidence/CrashGuard_2026-02-15_185243/crash_guard.log
- build_status: PASS

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
