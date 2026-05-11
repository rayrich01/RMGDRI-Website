# CR-A — DRAFT — Add 7 missing/typo redirects for GSC 404 cleanup

**Status:** DRAFT — awaiting Ray's approval to file as a GitHub issue.

---

## Title

`Add missing 308 redirects for GSC-flagged 404 URLs (2026-05-11 drilldown)`

## Labels

`cr-pending`, `bug`, `priority:normal`

## Body

### Page URL or name

Multiple legacy adoption-success slugs returning 404 instead of redirecting to
their canonical Sanity destination on `/adoption-successes/<year>/<slug>-<year>`.

### What needs to change

The 2026-05-11 GSC Coverage drilldown (filed under
`_ttp/RMGDRI-POST-CUTOVER-GSC-DRILLDOWN-2026-05-11/`) identified 7 URLs that
return 404 in production today and have a known canonical destination that
already exists in `next.config.mjs`. Add redirect entries so these surface as
clean 308 → 200 chains for both crawlers and humans.

| Source URL | Destination | Status |
|---|---|---|
| `/huey` | `/adoption-successes/2024/huey-2024` | dest 200 ✓ |
| `/huey/` | `/adoption-successes/2024/huey-2024` | dest 200 ✓ |
| `/jack` | `/adoption-successes/2025/jack-2025` | dest 200 ✓ |
| `/jack/` | `/adoption-successes/2025/jack-2025` | dest 200 ✓ |
| `/cowboy-has-a-home` | `/adoption-successes/2024/cowboy-2024` | dest 200 ✓ |
| `/cowboy-has-a-home/` | `/adoption-successes/2024/cowboy-2024` | dest 200 ✓ |
| `/Manitou` | `/adoption-successes/2023/manitou-2023` | dest 200 ✓ |
| `/Manitou/` | `/adoption-successes/2023/manitou-2023` | dest 200 ✓ |
| `/manitou-has-a-home` | `/adoption-successes/2023/manitou-2023` | dest 200 ✓ |
| `/manitou-has-a-home/` | `/adoption-successes/2023/manitou-2023` | dest 200 ✓ |
| `/2024-malikai-has-a-home` | `/adoption-successes/2024` | dest 200 ✓ |
| `/2024-malikai-has-a-home/` | `/adoption-successes/2024` | dest 200 ✓ |
| `/2024-athena-has-a-home` | `/adoption-successes/2024` | dest 200 ✓ |
| `/2024-athena-has-a-home/` | `/adoption-successes/2024` | dest 200 ✓ |
| `/2024-millie-ha-a-home` | `/adoption-successes/2024/millie-2024` | dest 200 ✓ |
| `/2024-millie-ha-a-home/` | `/adoption-successes/2024/millie-2024` | dest 200 ✓ |

Pattern matches the existing CR-129 Confirmed-7 redirect block style:
both slash and no-slash source variants, `permanent: true` (308).

### New content / correct information

Add the 16 redirect entries above to the `async redirects()` block in
`next.config.mjs`, immediately after the Phase-B success-story redirect block
and before the closing `]`. Group as a labeled section with a comment:

```
// ── GSC 404 cleanup (2026-05-11 drilldown — see _ttp/RMGDRI-POST-CUTOVER-GSC-DRILLDOWN-2026-05-11/) ──
```

No other file changes. No content changes. No env changes.

### Acceptance criteria (validation)

After deploy:

1. `curl -sL -o /dev/null -w "%{http_code}\n" https://rmgreatdane.org/<source>` returns
   `200` for **every** source URL listed above (both slash and no-slash variants).
2. `curl -sI https://rmgreatdane.org/<source>` returns `308` for **every** source
   URL listed above (raw, not followed).
3. Final destination is the matching `/adoption-successes/...` URL in each row.
4. No regression on existing redirects: spot-check 3 from the Confirmed-7 block
   (e.g., `/kevin`, `/bryce`, `/chevy`) still return 308 → 200.

### Priority

Normal — these are real 404s impacting SEO recovery, but volume is small (7
unique slugs, 16 entries with slash variants). No user-facing impact beyond the
small set of visitors arriving on old links.

### Evidence

- Drilldown CSVs: `_ttp/RMGDRI-POST-CUTOVER-GSC-DRILLDOWN-2026-05-11/raw/`
- Triage README: `_ttp/RMGDRI-POST-CUTOVER-GSC-DRILLDOWN-2026-05-11/README.md`
- Live-broken vs. stale analysis: same README

---

## Notes for Atlas / Ray (not part of issue body)

- This CR is intentionally narrow. Other GSC findings (www→apex canonical, old
  eCommerce 308 loop, ~30 pre-2022 URLs that should be 410 rather than 404, the
  148-URL noindex audit) are listed in the drilldown README as "deferred —
  separate CRs if/when prioritized." Per session this turn, Ray chose only
  scope A.
- The `/2024-malikai-` and `/2024-millie-ha-` typo redirects are bets that
  Google indexed these slugs from a mis-link somewhere; we lose nothing by
  catching them. If Lori objects to blessing typos, drop those 4 entries —
  the remaining 12 still close the high-value gap.
- File diff is single-file (`next.config.mjs`), purely additive. Minimum
  viable fix per CR-Governance §4.
