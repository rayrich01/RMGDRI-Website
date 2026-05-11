# GSC Coverage Drilldown — 2026-05-11

Source: rmgreatdane.org property in Google Search Console. Operator exported each
"Critical issue" row from Indexing → Pages as a per-issue CSV bundle (7 zips). Raw
exports are preserved under `raw/`.

## Baseline counts (Critical issues — Website source)

Comparison against `_ttp/RMGDRI-POST-CUTOVER-GSC-BASELINE-2026-05-07/`:

| Reason | 2026-05-07 | 2026-05-11 | Δ | URL file |
|---|---:|---:|---:|---|
| Server error (5xx) | 29 | 9 | **−20** | `raw/Server_error_5xx.csv` |
| Not found (404) | 44 | 58 | **+14** | `raw/Not_found_404.csv` |
| Page with redirect | 3 | 15 | +12 | `raw/Page_with_redirect.csv` |
| Excluded by 'noindex' tag | 155 | 148 | −7 | `raw/Excluded_by_noindex_tag.csv` |
| Blocked due to access forbidden (403) | 1 | 1 | +0 | `raw/Blocked_due_to_access_forbidden_403.csv` |
| Redirect error | — | 1 | NEW | `raw/Redirect_error.csv` |
| Duplicate without user-selected canonical | — | 1 | NEW | `raw/Duplicate_without_user-selected_canonical.csv` |

## Triage — live-broken vs. stale (as of 2026-05-11)

Each flagged URL was re-tested live against production. Most are stale (Google
hasn't recrawled since the CR-129/CR-132 redirect block landed) and now return 200
or proper 308. Live-broken set is small:

### Live-broken redirects (CR-A target)

| URL | Current | Proposed redirect target | Reason |
|---|---|---|---|
| `/huey` (no slash + `/`) | 404 | `/adoption-successes/2024/huey-2024` | Bare slug never added; `/2024-huey-has-a-home` already redirects there |
| `/jack` (no slash + `/`) | 404 | `/adoption-successes/2025/jack-2025` | Same pattern |
| `/cowboy-has-a-home` | 404 | `/adoption-successes/2024/cowboy-2024` | Only `/2024-cowboy-has-a-home` mapped |
| `/Manitou` (case + lowercase + `/`) | 404 | `/adoption-successes/2023/manitou-2023` | Case-sensitive miss; no bare-slug entry |
| `/2024-malikai-has-a-home` | 404 | `/adoption-successes/2024` | Typo of "malakai" |
| `/2024-athena-has-a-home` | 404 | `/adoption-successes/2024` | Existing entry is `-athena-harl-`; bare form missing |
| `/2024-millie-ha-a-home` | 404 | `/adoption-successes/2024/millie-2024` | Typo of "has-a-home" |

All 6 unique destinations verified to return HTTP 200.

### Other live findings (deferred — separate CRs if/when prioritized)

- **`https://www.rmgreatdane.org/`** returns 200 with no canonical → apex
  ("Duplicate without user-selected canonical"). Needs Vercel domain config
  change. Not in scope for CR-A.
- **`/rmstore/shoppingcart/products.php?product=Donate`** returns 308 loop
  (old eCommerce). Not in scope for CR-A.
- **`/paris-has-a-home/`** returns 410 (pre-2022 boundary — likely intentional
  per CC-PACKET-RMGD-001 Phase B). Confirm with Lori before any change.
- **`/blog//1000`** returns 404 (double-slash malformed). Low value; defer.
- **~30 pre-2022 URLs** in the 404 list (date archives, category pagination,
  author archives) currently return 404 instead of proper 410. Cleaning
  these up is a separate CR (re-running the CC-PACKET-RMGD-001 Phase B
  classifier with the new GSC-observed slugs, or adding them manually).
- **148 noindex URLs** — most appear to be redirects whose terminal page is
  the dynamic [slug] 404 (which is correctly noindex'd). Sample-audit
  recommended before any code change.

### Stale (Google still flags these — will clear on recrawl)

Most pet-name slug redirects (`/arlo/`, `/bailey/`, `/pharaoh/`, `/lilah/`,
`/casper/`, `/tyson/`, `/asher/`, `/juniper/`, `/bolt/`, `/korben/`) now
return 308 → 200. Many of the 5xx flags now return 200 or proper 404/410.
Google will reclassify on next crawl.

## Files

- `raw/` — 7 GSC drilldown CSVs (one per critical-issue row, matching the
  zip bundle in `~/Downloads/`).
- `README.md` — this file.
