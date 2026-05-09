# CR-146-001: Implementation Report

**CR:** [#146](https://github.com/rayrich01/RMGDRI-Website/issues/146) — Service Watchdog spams closed auto-execute CRs
**PR:** [#147](https://github.com/rayrich01/RMGDRI-Website/pull/147)
**Branch:** `fix/cr-146-watchdog-closed-issues` (off `origin/main` at `9e371e0`)
**Commit:** `47b2e90`
**Authorized by:** Ray Richardson, 2026-05-09 (in-session, "Execute CR-146. I authorize this work")
**Classification:** WORKFLOW_GOVERNANCE_GAP / REMEDIATION
**State:** READY WITH RESTRICTIONS (pending merge + 24h observation)

---

## Diagnosis

Closed auto-execute CRs (#133 closed 2026-05-06 18:16Z, #136 closed 2026-05-06 19:21Z) continued receiving "⏳ Service Watchdog — pending beyond SLA" comments every 6 hours, latest reporting 4382 / 4340 minutes pending. Lori reported the noise via email forward 2026-05-09.

Two compounding gaps:

1. **`cr-watchdog.yml` CHECK 4 (lines 302–337)** queried Supabase `cr_tasks` directly for `status=eq.pending&auto_execute=eq.true` and posted the SLA comment to whatever GitHub issue number it returned — without checking whether that issue was open or closed. The four other checks in the same workflow filter via `listForRepo({ state: 'open' })`, so this was the only check that leaked.

2. **`cr-manual-closeout.yml`** had an `issues.closed` handler that PATCHed the Supabase row to a terminal status — but it explicitly excluded auto-route CRs (lines 27–29, 104–107). When an auto-execute CR was closed manually before executor pickup, the `cr_tasks` row was never reconciled. It stayed `status='pending'` forever, and CHECK 4 kept finding it.

Both #133 and #136 confirmed: CLOSED on GitHub but still labeled `cr-queued` + `cr-auto-execute`, and (inferred from watchdog behavior) corresponding `cr_tasks` rows still `status='pending'`.

---

## Files changed

```
.github/workflows/cr-watchdog.yml        | 39 +++++++++++++++++++++++++++++++
.github/workflows/cr-manual-closeout.yml | 35 +++++++++++++++++++++++++++-
2 files changed, 73 insertions(+), 1 deletion(-)
```

### Change 1 — `cr-watchdog.yml` CHECK 4

Inside the existing `for (const task of pendingTasks)` loop, added a GitHub-state cross-check. If `github.rest.issues.get` returns `state === 'closed'`, PATCH the orphaned `cr_tasks` row to `status='cancelled'` and `continue` to the next task. Existing comment-posting path is unchanged for genuinely open issues.

Errors on either the `issues.get` lookup or the reconcile PATCH are logged via `core.warning` and the loop continues — matches the surrounding workflow's error-handling style.

### Change 2 — `cr-manual-closeout.yml` AUTO-ROUTE CLOSEOUT

Replaced the bare early-return for non-manual-route CRs with a branch that:

- If the closed issue carries `cr-auto-execute` AND Supabase headers are configured, PATCH `cr_tasks` to `status='cancelled'` with `completed_at` set and `result.closeout_method='auto-route-manual-close'`.
- Status filter `in.(pending,executing,review)` ensures terminal states (`done` / `failed`) the executor may have set are not overwritten.
- Otherwise, log the existing skip message and return.

---

## Pre-flight & validation evidence

- **Pre-flight (1st run):** FAILED — was on `hotfix/legacy-upload-thumbnails` with significant unrelated WIP in working tree. Stopped per RMGDRI CLAUDE.md rule 4 and reported to Ray.
- **Pre-flight (2nd run):** PASSED — Ray moved WIP to `wip/applications-dashboard` (Option 3). Branch created off `origin/main` with clean tree.
- **YAML syntax:** PASS — `python3 -c "import yaml; yaml.safe_load(...)"` clean on both files.
- **TypeScript:** N/A — change is YAML/CI workflows, no TS surface.
- **Smoke test (live):** Deferred to post-merge. Requires `gh workflow run cr-watchdog.yml` against main and 24h observation per CR-Governance-Pattern-001 GO-LIVE step.
- **Diff verified:** `git diff --stat` shows only the two intended files; no collateral changes.

---

## Outstanding go-live actions

1. PR #147 merged to `main`.
2. **Pre-deployment data backfill (one-time, manual, requires Supabase service-role key):**
   ```bash
   curl -X PATCH "$SUPABASE_URL/rest/v1/cr_tasks?cr_number=in.(133,136)&tenant=eq.rmgdri&status=eq.pending" \
     -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
     -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     -H "Content-Type: application/json" \
     -d '{"status":"cancelled","result":{"closeout_method":"manual-backfill","cr":"CR-146"}}'
   ```
   Without this, the new watchdog code will reconcile the rows on its next 6h tick anyway, but the manual backfill stops the symptom immediately.
3. **Stale label cleanup on closed issues:**
   ```bash
   gh issue edit 133 --repo rayrich01/RMGDRI-Website --remove-label cr-queued --remove-label cr-auto-execute
   gh issue edit 136 --repo rayrich01/RMGDRI-Website --remove-label cr-queued --remove-label cr-auto-execute
   ```
4. **24h observation window** — zero spurious watchdog comments on closed CRs. State transitions to LIVE on pass.

---

## State

**REMEDIATION:** complete (PR open).
**VALIDATION:** pending (post-merge workflow_dispatch + 24h observation).
**GO-LIVE:** pending VALIDATION pass.
**CLOSURE:** pending GO-LIVE.
