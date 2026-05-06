# CC-PACKET-RMGD-001 — Due Diligence Analysis

**Prepared by:** Claude Code (Opus 4.7)
**Date:** 2026-05-05
**Status:** Phase B paused. Awaiting Atlas (ChatGPT) strategy validation.
**New constraint received:** Pre-2022 content was not migrated. Legacy URLs that resolve to pre-2022 content must return **410 Gone**, not 308 redirects.

---

## TL;DR — what changed and what to do

1. **Sanity content audit found 212 adoption successes** in the live data layer — not zero. They are stored in `src/data/adoption-successes/successes.normalized.json` (used by `/adoption-successes/[year]/[slug]`) plus a parallel set of 210 `_type: "adoptionSuccess"` documents in Sanity that are **not currently consumed** by any route handler (orphan import artifact). The `/the-dog-blog/[slug]` route queries `_type == "successStory"`, which has **0 documents** in the dataset — that route is effectively broken and 404s for any slug. This is a **pre-existing bug**, independent of redirect work. Flag for separate CR.
2. **Year coverage of migrated content:** 2022 (45) · 2023 (45) · 2024 (67) · 2025 (54) · 2026 (1). **Earliest content is 2022.** No pre-2022 stories exist on the new site. The new constraint is consistent with what was migrated.
3. **Under the 2022+ boundary, the action mix flips:** Phase A produced 75% 308 redirects + 25% orphans. Re-classified, the recommended mix is **2,047 × 410 (81.4%) and 451 × 308 (17.9%)**. The re-classification is in `inventory-classification.tsv`.
4. **Slug match rate for 2022+ legacy URLs:** of 233 legacy URLs with extractable years ≥ 2022, **214 match a known Sanity/JSON slug** (91.8%) → 308 to specific story page; **19 unmatched** (8.2%) → 308 to year archive `/adoption-successes/<year>` index.
5. **Of Phase A's 430 plain-lowercase-slug "orphans":** none are year-prefixed (Q1–Q3 all 0). **128 of 434 (29.5%) match a Sanity 2022+ slug** by base-name lookup → recommend 308 to `/adoption-successes/<year>/<slug>-<year>`. **306 (70.5%) have no Sanity match** → 410 Gone.
6. **`/bruce` is the only slug-collision case** that names a 2022+ adopted dog (matched to 2025). All four (`/bruce`, `/chevy`, `/kevin`, `/oakley`) also collide with current available-dane slugs in Sanity. This is the only group that genuinely needs per-dog operator review.
7. **Routing chain risk: low.** Existing redirects: only `/utah-events → /events` already on main. No middleware redirects on content paths. `/successes → /adoption-successes` is an in-app `redirect()` call, NOT a `next.config` redirect — it would create a 1-hop chain when combined with our new redirects, but the chain depth stays ≤ 2 hops.

---

## Section A — Re-classification of 430 plain_lowercase_slug orphans

The 430 orphans from Phase A are classified by question:

| Q | Pattern | Count | Notes |
|---|---|---:|---|
| Q1 | `/<year>-<word>-has-a-home/` | **0** | These were captured by `success_year_prefixed` in Phase A and never reached the `plain_lowercase_slug` bucket. |
| Q2 | `/<year>-successes/` | **0** | These were captured by `year_archive_alias` in Phase A. |
| Q3 | Other year-keyed (any `\d{4}` in path) | **0** | Plain-lowercase orphans by definition contain no digits. |
| Q4 | Not year-keyed at all | **434** | All of them. |

> **Note on the count:** Phase A reported 430 "plain_lowercase_slug" — re-running with consistent filters yielded 434. The 4-row delta is the four `sanity_dog_slug_collision` paths I split out into a dedicated bucket (`/bruce`, `/chevy`, `/kevin`, `/oakley`). Numbers reconcile: 430 + 4 = 434.

### Q4 sub-classification (434 paths) — the operative work

| Sub-bucket | Count | Recommended action | Confidence |
|---|---:|---|---|
| Matches a Sanity 2022+ slug base name | **128** | 308 → `/adoption-successes/<year>/<slug>-<year>` | medium |
| No Sanity match (assumed pre-2022 / lost content) | **306** | **410 Gone** | medium |

**Year distribution of the 128 matched (which year does the slug map to?):**

| Year | Matched count | Sample slugs |
|---:|---:|---|
| 2022 | 17 | `/atlas`, `/brandi`, `/daisy`, `/duke-fawnequin`, `/gabby`, `/max`, `/poppy`, `/tigs`, ... |
| 2023 | 22 | `/antero`, `/babe`, `/bently`, `/brady`, `/charlee`, `/dakota`, `/manitou`, `/orvis`, `/rocky`, `/salida`, ... |
| 2024 | 51 | `/ada`, `/apollo`, `/asher`, `/athena`, `/bela`, `/belle`, `/big-mac`, `/claire`, `/lu`, `/romeo`, `/zeus`, ... |
| 2025 | 38 | `/arlo`, `/bailey`, `/bee`, `/bella`, `/bentley`, `/blue`, `/bolt`, `/bruce`, `/journey`, `/oliver`, `/toby`, ... |

**Sample of 306 unmatched (recommend 410):**

`/abby`, `/ace`, `/adoption-information-2`, `/ajax`, `/angel`, `/angus`, `/annabelle`, `/aoife`, `/apollo-dane-foster-needed`, `/app-thank-you`, `/aries`, `/asa`, `/ashley`, `/astro`, `/athena-baby`, ... +291 more

**Risk on 128-matched 308s:** the legacy WP URL `/atlas` (for example) was the original *blog post* about Atlas. Atlas is now a 2022 adopted-dane card at `/adoption-successes/2022/atlas-2022`. The redirect *destination is correct in spirit* — but the *page content has changed*: the legacy post likely had narrative and photos the new card lacks. Google preserved the URL's authority via the 308 (we get SEO equity), but a returning user will see a thinner page. **Operator decision:** is partial-content preservation acceptable, or prefer 410 for cleanliness?

---

## Section B — Sanity content audit

### B.5 — Count of published successStory documents per year (2022–2026)

The schema declares `successStory` (in `sanity/schemaTypes/index.ts`) but the dataset contains **zero `successStory` documents**, published or draft.

The runtime pipeline uses `src/data/adoption-successes/successes.normalized.json` (212 records) merged with Sanity `dog` documents whose `status == "adopted"` (currently 0). The 210 `_type: "adoptionSuccess"` documents in Sanity (imported from WP NDJSON) are **not consumed by any route handler** — confirmed by grep across `src/app` and `src/lib`. This is a separate cleanup item.

**Effective year coverage from `successes.normalized.json`:**

| Year | Records | With blog_text | Sample slug |
|---:|---:|---:|---|
| 2022 | 45 | 45 | `daisy-2022`, `gabby-2022`, `poppy-2022`, `duke-fawnequin-2022`, `tigs-2022` |
| 2023 | 45 | 44 | `rocky-2023`, `antero-2023`, `dakota-2023`, `manitou-2023`, `orvis-2023` |
| 2024 | 67 | 66 | `lu-2024`, `asher-2024`, `zeus-2024`, `claire-2024`, `romeo-2024`, `big-mac-2024` |
| 2025 | 54 | 54 | `journey-2025`, `bentley-2025`, `oliver-2025`, `toby-2025`, `kara-2025` |
| 2026 | 1 | 1 | `chloe-2026` |
| **Total** | **212** | **210** | |

### B.6 — Slug pattern across years

**Pattern is consistent:** `<dogname>-<year>` for all years. Multi-dog stories use hyphenated joins (`mav-and-millie-2024`). Disambiguators when two dogs of the same name appear: `-2` suffix (`athena-2022-2`, `charlee-2023-2`). Slug field (`slug`) and `original_slug` field are identical except for those disambiguator cases (where `original_slug` carries the pre-disambiguator form or `None`).

This means a legacy URL `/zeus-has-a-home` for a 2024 adoption can be deterministically rewritten to `/adoption-successes/2024/zeus-2024`. The mapping is mechanical, not heuristic.

### B.7 — Unmatched 2022+ legacy URLs (content gaps)

Of 233 legacy URLs with year ≥ 2022 in path:

- **214 (91.8%) matched** to a JSON slug → `match_status: matched_to_sanity_slug`
- **19 (8.2%) unmatched** to a slug but year-archive matches → `match_status: unmatched_slug_to_year`

The 19 unmatched are legacy URLs of the form `/2024-zeus-has-a-home-2` where the WP post had a `-2` suffix that doesn't appear in our JSON. These will 308 to `/adoption-successes/<year>` (year index page) and confidence is medium. Sample list in `inventory-classification.tsv` (filter `match_status == unmatched_slug_to_year`).

### B.8 — Match rate summary

```
total 2022+ legacy URLs:   233
matched to specific slug:  214 (91.8%)
matched to year only:       19 ( 8.2%)
```

Match rate for legacy URLs is high — the WP slug-to-Sanity slug correspondence is reliable.

---

## Section C — New site routing audit

### C.9 — Does `/adoption-successes/<year>` resolve with empty content?

**Code path:** `src/app/(main)/adoption-successes/[year]/page.tsx:30` checks `year < 2020 || year > new Date().getFullYear()` and 404s otherwise. So `/adoption-successes/2018` returns 404 (good — pre-2020 boundary). `/adoption-successes/2020` and `/adoption-successes/2021` would render with `successes.length === 0` (empty grid + "0 Great Danes found forever homes in 2020"). **This is a UX issue if we 308 anything to those years.**

**Recommendation:** keep the lower boundary at 2022 in our 308s. Never 308 to `/adoption-successes/2020` or `/adoption-successes/2021` even though the route doesn't 404. Anything mapped to those years should 410 instead. The classifier already enforces this (year < 2022 → 410).

### C.10 — Internal navigation: `/adoption-successes` vs `/the-dog-blog`

Audit results:

| File | Line | Link |
|---|---:|---|
| `src/components/Header.tsx` | 84 | `/adoption-successes` ✅ canonical |
| `src/components/Footer.tsx` | 19 | `/successes` ⚠️ in-app redirect (1 hop to `/adoption-successes`) |
| `src/components/Footer.tsx` | 42 | `/the-dog-blog` ⚠️ links to broken-slug landing page |
| `src/app/(main)/the-dog-blog/[slug]/page.tsx` | 66, 156 | `/successes` ⚠️ in-app redirect |
| `src/app/(main)/the-dog-blog/page.tsx` | 30 | `/adoption-successes` ✅ canonical |
| `src/app/(main)/adoption-successes/[year]/page.tsx` | 45, 77 | `/adoption-successes` ✅ canonical |

**Chain risk:**
- `Footer.tsx:19` `/successes` → in-app redirects to `/adoption-successes`. If we 308 anything to `/successes`, total chain = 308 → 200 internal redirect → 200 final = **2 hops**, acceptable but suboptimal.
- **Mitigation already taken:** Phase A's redirect-map.tsv targets `/adoption-successes` directly, NOT `/successes`. No extra hops introduced.
- **Recommend follow-up CR:** clean up `Footer.tsx:19` (`/successes` → `/adoption-successes`) and `the-dog-blog/[slug]/page.tsx:66,156` (same). Outside this packet's scope.

### C.11 — Existing redirects in next.config.mjs / middleware.ts / Vercel

- **`next.config.mjs`** already has one redirect: `/utah-events → /events` (`permanent: true`, added in CR-129 merge `23aef18`). Phase B must **extend** this array, not replace.
- **`src/middleware.ts`** matches only `/admin/*`, `/apply/*`, `/dashboard/*` — no content-path interference.
- **`vercel.json`** contains only `buildCommand` and `framework: nextjs` — no redirects/rewrites.

**Conclusion:** safe to add Next.js redirects without conflicting with framework-level routing. Order matters within the array — specific patterns must precede general (see Section D.14).

### C.12 — Bonus finding: `/the-dog-blog/[slug]` is broken

Code at `src/app/(main)/the-dog-blog/[slug]/page.tsx:21` queries `*[_type == "successStory" && slug.current == $slug][0]`. Sanity has **zero documents of type `successStory`**. Every slug under `/the-dog-blog/<x>` returns 404 today. The index page `/the-dog-blog/page.tsx` is fine — it's a static "Stories have moved → /adoption-successes" landing page. Recommend a follow-up CR to either remove the `[slug]` route or fix the type to `adoptionSuccess`.

---

## Section D — Edge cases

### D.12 — Sanity dog-slug collisions: are any 2022+ stories?

| Slug | Current status (Sanity dog) | In adoption-successes JSON? | 2022+? | Risk |
|---|---|---|---|---|
| `/bruce` | available | **YES — 2025** | YES | **Conflict.** Legacy `/bruce` likely a different Bruce. If we 308 → `/adoption-successes/2025/bruce-2025`, returning visitor sees adopted Bruce instead of currently-available Bruce. Operator decision required. |
| `/chevy` | available | NO | n/a | No 2022+ match. Recommend 410 (legacy `/chevy` was a different Chevy). Current available-dane Chevy is at `/available-danes/chevy`, untouched. |
| `/kevin` | available | NO | n/a | Same as `/chevy`. |
| `/oakley` | available | NO | n/a | Same as `/chevy`. |

**Recommendation:** for `/bruce`, surface to operator. For the other three, 410 Gone — don't create a redirect that competes with the available-dane URL stability.

### D.13 — URL normalization

| Issue | Count | Mitigation |
|---|---:|---|
| Case-sensitive collisions (`/RMGDRI` vs `/rmgdri`, `/Store` vs `/store`, `/RMGDRI/index.php` vs `/rmgdri/index.php`) | 3 | All three pairs land on 410 anyway — no conflict. Vercel/Next.js are case-sensitive by default; both forms would hit the same 410. |
| Spaces / `%`-encoded / `+` characters (mostly `/Documents/*.doc`, `/Photos/*.htm`, `/Events/*.htm`) | 774 | All land on 410 via pattern rules. No issue. |
| Non-ASCII (`/🎬-when-hollywood-meets...`) | 1 | Caught by `plain_slug_unmatched` → 410. No issue. |
| Trailing-slash variants | 0 | Inventory was normalized to no trailing slash. Next.js redirects use `:path*` and exact-match by default — both `/foo` and `/foo/` would match per Next's default behavior. |

### D.14 — Double-match risk in pattern ordering

Four overlap pairs require strict ordering in the Next.js redirects array (specific BEFORE general):

| Specific | General |
|---|---|
| `/category/successes/:year-successes` | `/category/successes` |
| `/:year-:slug-has-a-home` | `/:slug-has-a-home` |
| `/:year/:month/:slug` | `/:year/:month` |
| `/category/:slug/page/:n` | `/category/:slug` |

**Mitigation:** Phase B sorts the redirects array specific-first. Confirmed by ordered-iteration tests in `inventory-classification.tsv` — every path matches exactly one rule under specific-first traversal.

---

## Section E — Top-50 highest-traffic legacy URLs

**Caveat:** Wayback CDX hit-count reflects *crawler probe frequency*, not real user traffic. URLs with high counts are typically sentinel paths Wayback re-checks repeatedly (e.g., `/RMGDRI/index.php` 143 hits — that's Wayback hammering an old admin URL, not human users). Treat this as a *weak* signal, useful only for prioritizing manual review of the top-tier outliers.

| # | Hits | Path | Action | Pattern |
|---:|---:|---|---|---|
| 1 | 143 | `/RMGDRI/index.php` | 410 | wp_internal |
| 2 | 86 | `/` | no_op | same_path_on_new_site |
| 3 | 31 | `/rmstore/shoppingcart/products.php` | 410 | uncategorized |
| 4 | 20 | `/rmstore/shoppingcart/rss.php` | 410 | uncategorized |
| 5 | 17 | `/rmstore/shoppingcart/cart.php` | 410 | uncategorized |
| 6 | 15 | `/rmstore/shoppingcart/categories.php` | 410 | uncategorized |
| 7 | 11 | `/wordpress` | 410 | plain_slug_unmatched |
| 8 | 9 | `/wordpress/wp-login.php` | 410 | uncategorized |
| 9 | 7 | `/rmstore/shoppingcart/login.php` | 410 | uncategorized |
| 10 | 6 | `/rmgdri/index.php` | 410 | uncategorized |
| 11 | 4 | `/store` | 410 | plain_slug_unmatched |
| 12 | 3 | `/rmstore/shoppingcart/search.php` | 410 | uncategorized |
| 13–20 | 2 each | `/Store`, `/Store/index2.htm`, `/index.html`, `/rmgdri`, `/rmgdri-visa`, `/rmstore/shoppingcart/{account,checkout,pages}.php`, `/wordpress/xmlrpc.php` | 410 | various |
| 21–50 | 1 each | mostly date archives, single dog names, calendar pages | 410 majority | various |

**Observation:** the top-50 contains **zero high-value content URLs**. No dog success stories, no donate page, no foster-application — these all have hit count = 1 in CDX. The top-tier is dominated by attack-bait sentinel paths (`/rmstore`, `/wordpress`, `/wp-login`). 410 across the top-tier is unambiguously the right call.

**Stakeholder priority:** if Lori or Ray want to recover any specific pre-2022 stories, the candidates would be the dog names matching base-name lookups (Section A, Q4 unmatched 306). None of those rank high in CDX hit counts.

Full list: filter `inventory-classification.tsv` and sort by `wayback_hits` descending.

---

## Section F — Quantitative summary dashboard

```
═══════════════════════════════════════════════════════════════════
  CC-PACKET-RMGD-001 DUE DILIGENCE — QUANTITATIVE SUMMARY
═══════════════════════════════════════════════════════════════════

  Total unique legacy URLs                    2,516
  Sources                                     Wayback (8,281 → 2,506) + sitemap (28)
  Sanity content boundary                     2022-01-01 onward
  Sanity records (effective)                  212 (2022:45 / 2023:45 / 2024:67 / 2025:54 / 2026:1)

  ─── ACTION DISTRIBUTION ────────────────────────────────────────
    410 Gone                                  2,047  (81.4%)
    308 Permanent Redirect                      451  (17.9%)
    no-op (same path on new site)                12  ( 0.5%)
    hold (operator review needed)                 4  ( 0.2%)
    skip (framework-handled)                      2  ( 0.1%)

  ─── YEAR BOUNDARY SPLIT ────────────────────────────────────────
    pre-2022 (extractable year)                438  (17.4%)
    2022+ (extractable year)                   233  ( 9.3%)
    no extractable year                      1,845  (73.3%)

  ─── 2022+ MATCH RATE (of 233 with year ≥ 2022) ─────────────────
    matched to specific Sanity slug             214  (91.8%)
    matched to year archive only                 19  ( 8.2%)

  ─── PHASE A "PLAIN SLUG ORPHAN" RE-CLASSIFICATION (434 paths) ──
    Q1 year-prefixed has-a-home                   0
    Q2 year-suffix successes                      0
    Q3 other year-keyed                           0
    Q4 not year-keyed                           434
        ├── matches Sanity 2022+ slug base      128  ( 29.5%) → 308
        └── no Sanity match                     306  ( 70.5%) → 410

  ─── CONFIDENCE DISTRIBUTION ────────────────────────────────────
    high                                      1,585  (63.0%)
    medium                                      776  (30.8%)
    low                                         155  ( 6.2%)

  ─── SLUG-COLLISION RESOLUTION ──────────────────────────────────
    /bruce  → 2022+ adoption (2025)             ⚠️ conflict — operator decision
    /chevy  → no 2022+ match                    410 (current /available-danes/chevy untouched)
    /kevin  → no 2022+ match                    410
    /oakley → no 2022+ match                    410

  ─── ROUTING CHAIN RISK ─────────────────────────────────────────
    next.config.mjs existing redirects            1   (/utah-events → /events)
    middleware content-path matchers              0
    vercel.json redirects/rewrites                0
    in-app redirect() calls (1-hop chains)        4   (/successes/* family)
    max chain depth introduced by Phase B         2   (acceptable)

  ─── KNOWN PRE-EXISTING BUGS (out of scope) ─────────────────────
    /the-dog-blog/[slug]                       BROKEN — queries _type "successStory" (0 docs)
    Sanity adoptionSuccess imports             ORPHAN — 210 docs not consumed by any route
    Footer.tsx /successes link                 1-hop chain to /adoption-successes
═══════════════════════════════════════════════════════════════════
```

---

## Open questions for Atlas + Ray

1. **`/bruce` resolution:** redirect to 2025 success page, leave as-is (current available Bruce wins via Next.js dynamic routing), or 410?
2. **128 plain-slug 308s with content thinness risk:** acceptable to 308 to a thinner adoption-successes card, or prefer 410 for cleanliness when the legacy WP page presumably had richer content (photos, narrative)?
3. **Slug-disambiguator paths (`/2022-athena-has-a-home-2`):** 19 of these. They 308 to `/adoption-successes/<year>` (year index) under medium confidence. Acceptable, or prefer 410?
4. **410 implementation:** add a Next.js route handler that returns 410 for matched orphan patterns, or use `next.config.mjs` redirects with a synthetic `/gone` 410-page destination, or rely on absence-of-redirect (default 404 from Next.js)? 410 ≠ 404 in Google's eyes — 410 is "intentionally gone, deindex faster"; 404 is "transient or unknown."
5. **Pre-existing bugs:** open separate CRs for the broken `/the-dog-blog/[slug]` and orphan `adoptionSuccess` imports?

---

## Artifacts

| File | Rows / Bytes | Purpose |
|---|---:|---|
| `inventory-classification.tsv` | 2,516 / 460 KB | Per-URL classification table |
| `redirect-map.tsv` (from Phase A) | 100 / 8.7 KB | Phase A's pattern rules — needs revision under new boundary |
| `orphan-urls.md` (from Phase A) | 352 / 9.7 KB | Phase A's decision packet — superseded by this DD analysis |
| `wayback-classified.tsv` | 2,517 / 277 KB | Phase A's first-pass classification |
| `adoption-successes-json.tsv` | 213 / 14 KB | Sanity/JSON slug inventory by year |
| `sanity-slugs.tsv` | 19 / 1.8 KB | Live Sanity dog/event/page slugs |
| `sanity-success-stories.tsv` | 211 / ~30 KB | adoptionSuccess type inventory (orphan from runtime POV) |
| `phase-a-q4-matched.tsv` | 128 / ~3 KB | Plain-slug orphans matched to 2022+ Sanity slugs |
| `a1-locs.tsv` | 30 / 1.8 KB | Live sitemap content URLs |
| `a2-wayback-paths.tsv` | 2,506 / 106 KB | Wayback unique paths with hit counts |
| `a2-wayback-raw.json` | 8,281 entries / 870 KB | Raw CDX response |

---

## Provenance

Generated by Claude Code (Opus 4.7) executing CC-PACKET-RMGD-001 on 2026-05-05 in branch `feature/legacy-url-redirects` (off `origin/main` @ `23aef18`). No code changes made. Sanity reads were read-only against `production` dataset using `NEXT_PUBLIC_SANITY_PROJECT_ID=17o8qiin`. Wayback CDX accessed anonymously over HTTP. No production-impacting actions taken.
