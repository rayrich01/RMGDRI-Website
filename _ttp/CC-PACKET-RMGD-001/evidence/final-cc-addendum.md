# CC Phase B Addendum — Final (post-Atlas concurrence, post-Ray updates)

**Issued:** 2026-05-05
**Issued by:** Ray (Architect) after Atlas (orchestrator) concurrence
**Supersedes:** prior 130-row plain-slug success-story mapping strategy and prior `/bruce/` hold disposition.

---

## Atlas validation marker

Atlas concurs with final CC Phase B addendum after Lori clarification and Ray update. Prior 130-row plain-slug success-story mapping is superseded. Plain `/<dogname>/` URLs are available-dog profile URLs, not success-story URLs. Seven confirmed current available-Dane redirects are authorized, including `/oakley/` → `/available-danes/oakley/`. Phase B may proceed only after `plain-slug-reclassification.tsv` and revised `collision-check.tsv` are surfaced cleanly.

---

## Stakeholder clarification (Lori)

- Legacy URLs of the form `/<dogname>/` represent **dogs currently in rescue / available Danes**, not success stories.
- Legacy adopted/success-story URLs contain a year and adoption-success phrase, e.g. `/YYYY-dogname-has-a-home/`.
- Therefore, plain `/<dogname>/` must **not** redirect to `/adoption-successes/...`.

## Required explicit available-dog 308 redirects

| Source | Dog ID | Destination |
|---|---|---|
| `/kevin/` | RMGDRI-2024-057 | `/available-danes/kevin/` |
| `/bryce/` | RMGDRI-2026-002 | `/available-danes/bryce/` |
| `/jumbo/` | RMGDRI-2025-045 | `/available-danes/jumbo/` |
| `/chevy/` | RMGDRI-2025-011 | `/available-danes/chevy/` |
| `/bruce/` | RMGDRI-2026-003 | `/available-danes/bruce/` |
| `/thunder/` | RMGDRI-2026-004 | `/available-danes/thunder/` |
| `/oakley/` | RMGDRI-2026-005 | `/available-danes/oakley/` |

Use **relative production destinations**. Capture Dog IDs in artifact provenance.

## Plain-Slug Lifecycle Rule

For each path in the reclassification cohort:

- `confirmed_current_available` — on Lori's confirmed list, redirect to `/available-danes/<name>/`
- `not_current_available_no_destination` — not on confirmed list, no current destination, default 410
- `hold_pending_stakeholder_review` — ambiguous case requiring Lori review
- `explicit_success_redirect_authorized` — only if stakeholder evidence directly authorizes a specific success-story redirect

**No plain `/<dogname>/` URL may be routed to `/adoption-successes/...` using base-name matching alone.**

## Mandatory artifact updates

- `plain-slug-mappings.tsv` → mark SUPERSEDED
- `plain-slug-reclassification.tsv` → new, with rationale column
- `hold-paths.tsv` → remove `/bruce/` and `/oakley/`
- `collision-check.tsv` → re-run after re-classification
- `middleware-410-cases.tsv` → expand for 7 new 308s and sample 410s
- `phase-b-closeout.md` → must explicitly document supersession

## CR-C — Stable Available-Dane URL Identity (follow-up)

Evaluate adding Dog ID or intake-year/ID suffix to available-dog URLs to prevent name-collision drift. Out of scope for Phase B.

## Updated execution sequence (Phase B)

1. Re-classify the 130 plain-slug paths per the Lifecycle Rule. Surface `plain-slug-reclassification.tsv`.
2. Re-run collision check on revised inputs. Surface `collision-check.tsv`. Halt if non-empty.
3. Generate `gone-patterns.ts`.
4. Edit `next.config.mjs` with 308 rules + 7 new available-dog redirects.
5. Edit `src/middleware.ts` with 410 branch.
6. Generate `middleware-410-cases.tsv` for verification.
7. Update `hold-paths.tsv`.
8. Generate `phase-b-closeout.md`.
9. Stage commit on `feature/legacy-url-redirects`. Do not push.
10. Surface diff + closeout for Ray review.

## Stop conditions (additional)

- Plain `/<dogname>/` source emitted as success-story redirect via base-name lookup → halt
- 7 confirmed available-dog redirects use absolute URLs → halt
- `/oakley/` remains in 410/hold/collision bucket → halt
- Re-classification produces unexpected counts (e.g., zero 410s) → halt
- Re-classification missing rationale column → halt

## Next CC surface expected

1. `plain-slug-reclassification.tsv` (rationale column, 7 confirmed_current_available rows)
2. Revised `collision-check.tsv`
3. Halt if any plain dog-name URL still maps to a success page by base-name lookup alone
