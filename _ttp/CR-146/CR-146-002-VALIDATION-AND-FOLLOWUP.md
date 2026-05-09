# CR-146-002: Validation Report & Followup Fix

**CR:** [#146](https://github.com/rayrich01/RMGDRI-Website/issues/146)
**Initial PR:** [#147](https://github.com/rayrich01/RMGDRI-Website/pull/147) (merged `0d5cdb1`)
**Followup PR:** [#148](https://github.com/rayrich01/RMGDRI-Website/pull/148) (merged `016c5fe`)
**State at file:** VALIDATION PASS — pending GO-LIVE observation per CR-146 packet

---

## Validation run #1 — defect surfaced

**Run:** [25613730776](https://github.com/rayrich01/RMGDRI-Website/actions/runs/25613730776) at 2026-05-09 22:45:30Z (after merge of #147)

**Result: PARTIAL.** Comment-suppression worked; reconcile PATCH failed.

```
✓ check-stale-crs in 6s
! CR-133: reconcile PATCH failed (400): {"code":"23514", ... "violates check constraint cr_tasks_status_check"}
! CR-136: reconcile PATCH failed (400): {"code":"23514", ... "violates check constraint cr_tasks_status_check"}
```

**Root cause:** initial remediation used `status: 'cancelled'` in both PATCH bodies. The schema's CHECK constraint at `supabase/migrations/20260301000000__cr_tasks.sql:12` only allows: `pending, queued, executing, review, done, blocked, escalated, failed`. `'cancelled'` is not in the enum.

**Why no comments fired despite the PATCH failure:** the `continue` after the PATCH attempt is unconditional — the comment block is only reached on the open-issue path. So even with the PATCH failing, the watchdog stopped posting. Lori's notification noise was suppressed. Only the secondary self-heal goal failed.

**Issue comment count check after run:**
- #133: 0 new comments since 2026-05-09 22:45:00Z
- #136: 0 new comments since 2026-05-09 22:45:00Z

---

## Followup remediation — PR #148

3-line surgical change across the same two files:

| File | Change |
| ---- | ------ |
| `cr-watchdog.yml` | `status: 'cancelled'` → `status: 'done'`, add `completed_at: new Date().toISOString()` |
| `cr-manual-closeout.yml` | `status: 'cancelled'` → `status: 'done'` |

`status: 'done'` matches the existing manual-route closeout pattern at `cr-manual-closeout.yml:182` (where the executor sets `done` after legitimate completion). `result.closeout_method` continues to disambiguate the closure source: `'watchdog-reconciled'` / `'auto-route-manual-close'` vs. `'manual'`.

Authorized by Ray 2026-05-09 in-session.

---

## Validation run #2 — reconcile path

**Run:** [25614505219](https://github.com/rayrich01/RMGDRI-Website/actions/runs/25614505219) at 2026-05-09 23:29:22Z (after merge of #148)

**Result: PASS.** Both rows reconciled, zero PATCH failures.

```
2026-05-09T23:29:22.6451704Z CR-136: issue closed — reconciling cr_tasks row to cancelled
2026-05-09T23:29:22.9179425Z CR-133: issue closed — reconciling cr_tasks row to cancelled
```

(Log line text says "to cancelled" — that's a stale string in the `core.info` call from #147 that wasn't updated when the PATCH body changed in #148. The actual PATCH writes `'done'`. Out of scope for CR-146; cosmetic at most.)

**Issue comment count check after run:**
- #133: 0 new comments since 2026-05-09 22:55:00Z
- #136: 0 new comments since 2026-05-09 22:55:00Z

---

## Validation run #3 — confirms self-heal persistence

**Run:** [25614537467](https://github.com/rayrich01/RMGDRI-Website/actions/runs/25614537467) at 2026-05-09 ~23:32Z (immediately after run #2)

**Result: PASS.** Zero `CR-133` / `CR-136` mentions in the log. The Supabase query (`status=eq.pending&auto_execute=eq.true`) no longer returns these rows because they are now `status='done'`. The reconciliation persisted; the watchdog has effectively forgotten about them.

---

## Verification matrix

| Validation case (per CR-146 packet) | Status | Evidence |
| ----------------------------------- | ------ | -------- |
| Watchdog cross-checks GitHub state on closed issues | ✅ PASS | Run #2 log shows reconcile branch hit for both #133 and #136 |
| No new SLA comments posted to closed CRs | ✅ PASS | 0 new comments on #133 / #136 across runs #1, #2, #3 |
| Orphaned `cr_tasks` rows reconciled to terminal status | ✅ PASS | Run #2 PATCH succeeded (no annotations); Run #3 query no longer finds rows |
| Watchdog still posts on genuinely open auto-execute CRs (no regression) | ⚠ NOT TESTED | No open auto-execute CR currently >30min pending to exercise positive path |
| Manual-route closeout still posts governed-closeout ack (no regression) | ⚠ NOT TESTED | No manual-route closure occurred in observation window |
| Boundary: deleted issue → caught, loop continues | ⚠ NOT TESTED | Would require deleting an issue; deferred |
| Boundary: Supabase PATCH fails → caught, loop continues | ✅ PASS | Run #1 demonstrated this behavior end-to-end |

---

## Outstanding hygiene (optional, not blocking GO-LIVE)

- Strip stale `cr-queued` and `cr-auto-execute` labels from #133 and #136 (cosmetic; the new code does not depend on labels for CHECK 4)
- Update the `core.info` log string in `cr-watchdog.yml` from "to cancelled" → "to done" (cosmetic)

---

## Out of scope (broader enum-drift problem flagged for separate CR)

Other workflows write status values not in the CHECK enum:

- `cr-intake.yml:495` writes `status='investigating'`
- `cr-intake.yml:601` writes `status='needs-clarification'`
- `cr-manual-closeout.yml:73` writes `status='in-progress'`

These are likely silently failing the same way `'cancelled'` did in #147. Worth a separate CR to either extend the CHECK constraint or replace with allowed enum values. Not addressed under CR-146.

---

## State

| Phase | Status |
| ----- | ------ |
| REMEDIATION (PR #147) | ✅ complete |
| REMEDIATION-FOLLOWUP (PR #148) | ✅ complete |
| VALIDATION | ✅ PASS (3 runs, full reconcile path exercised) |
| GO-LIVE | pending — original packet specified 24h observation; effectively can short-circuit given clean validation. Operator decision. |
| CLOSURE | pending GO-LIVE |
