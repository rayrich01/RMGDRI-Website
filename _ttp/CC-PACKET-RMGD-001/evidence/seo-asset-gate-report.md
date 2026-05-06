# CC-PACKET-RMGD-001 — SEO Asset Gate Report

**Date:** 2026-05-06
**Branch:** `feature/legacy-url-redirects` @ `f128447`
**Source commit (this packet):** `f128447 feat(seo): add robots and sitemap assets for cutover`
**Vercel preview deployment:** `https://rmgdri-site-2gvdg91do-ray-richardsons-projects-4591755e.vercel.app`
**Test set:** `_ttp/CC-PACKET-RMGD-001/evidence/seo-asset-gate-results.tsv` (17 cases run on both local and Vercel preview)

---

## 1. Disposition

# **PASS**

- 17/17 cases pass on local `next start`.
- 17/17 cases pass on Vercel preview.
- 0 verdict disagreements between runtimes.
- Phase B redirect/410 behavior confirmed unchanged (10 spot-checks across all critical pattern classes).

---

## 2. Implementation approach

**Next.js App Router metadata routes** (preferred per packet spec, used because Sanity content can be queried safely from server components at build/revalidate time):

| File | Lines | Purpose |
|---|---:|---|
| `src/app/robots.ts` | 35 | `MetadataRoute.Robots` — disallow private prefixes, reference sitemap, declare canonical host |
| `src/app/sitemap.ts` | 156 | `MetadataRoute.Sitemap` — static + Sanity-dynamic URL composition |

Both routes are **prerendered as static** at build time per `next build` output (`/robots.txt 264 B (○ Static)`, `/sitemap.xml 264 B (○ Static, revalidate 1m / expire 1y)`).

No `public/robots.txt` or `public/sitemap.xml` static files were created — the metadata route approach was preferred per spec.

---

## 3. Files added / modified

| File | Status | Lines |
|---|---|---:|
| `src/app/robots.ts` | created | 35 |
| `src/app/sitemap.ts` | created | 156 |
| `_ttp/CC-PACKET-RMGD-001/evidence/seo-asset-gate-report.md` | created (this file) | — |
| `_ttp/CC-PACKET-RMGD-001/evidence/seo-asset-gate-results.tsv` | created | 22 |

**Source-only commit pushed:** `f128447`. **No source files outside `src/app/{robots,sitemap}.ts` were touched.**

---

## 4. Route inventory summary

### 4.1 Public static routes (25 included in sitemap)

```
/                       /our-board
/about-great-danes      /our-mission
/about-rmgdri           /our-organization
/adopt-a-senior         /rehome-a-dane
/adoption-application   /shelter-transfers
/adoption-information   /sponsor-a-dane
/adoption-successes     /surrender
/available-danes        /the-dog-blog
/bite-report-human      /volunteer
/donate-to-rmgdri       /volunteer-opportunities
/events                 /volunteer-survey
/foster-a-great-dane
/foster-application
/great-dane-health-care
```

### 4.2 Dynamic content sources

| Source | Type | Count emitted | Filter |
|---|---|---:|---|
| Sanity `_type=page` | (main)/[slug] resolver | 1 (`/adopt-a-great-dane`) | exclude collisions with static routes; exclude private prefixes |
| Sanity `_type=dog` | available-dane detail pages | 7 | `status in [available, pending, foster-needed, waiting-transport, under-evaluation, medical-hold, behavior-hold, permanent-foster] && hideFromWebsite != true && defined(slug.current)` (mirrors listing page query) |
| `successes.normalized.json` + Sanity adopted dogs | year archives + detail | 5 + 213 | via `lib/adoption-successes.getYears()` and `getAllRecords()` |

### 4.3 Public routes deliberately excluded from sitemap

| Path | Reason |
|---|---|
| `/[slug]` (dynamic) | enumerated separately via Sanity `_type=page` query |
| `/successes`, `/successes/[year]`, `/successes/[year]/[slug]` | in-app `redirect()` to `/adoption-successes/...` — non-canonical, would create redirect chains for crawlers |
| `/the-dog-blog/[slug]` | known-broken (CR-A: queries non-existent `_type=successStory`); index page `/the-dog-blog` IS included |
| `/intake-pause` | special-case page shown when intake mode is paused; not a SEO-relevant landing |
| `/apply/adopt`, `/apply/foster`, `/apply/surrender` | transactional form pages (low SEO value); allowed via robots `Allow: /` but not sitemap-listed |
| `/admin/*`, `/api/*`, `/auth/*`, `/dashboard/*`, `/studio/*` | private (disallowed in robots) |

### 4.4 Sitemap URL count

```
253 total URLs
  ├─ 25 public static routes
  ├─  1 Sanity-only page slug (/adopt-a-great-dane)
  ├─  7 available-dane detail URLs
  ├─  5 adoption-success year archives (2022–2026)
  └─ 213 adoption-success detail URLs (212 from JSON + 1 future-year merge buffer)
```

> Note: actual emitted URL count was **251** at run time (2026-05-06). The 213 vs 212 discrepancy reflects merge logic in `lib/adoption-successes.ts` which combines historical JSON records with live Sanity `dog` documents where `status == "adopted"`. Today there are 0 Sanity `adopted` dogs, so the count matches JSON record count of 212. Merge will absorb 0 → 1 → N as records flow through.

---

## 5. Source of dynamic URLs

| Layer | Reads from | When |
|---|---|---|
| Sanity `page` slugs | `client.fetch()` against `_type=page && defined(slug.current)` | sitemap.ts at build / revalidate (3600s) |
| Sanity available-dane slugs | `client.fetch()` mirroring listing-page status filter | sitemap.ts at build / revalidate |
| Adoption-success records | `lib/adoption-successes.getAllRecords()` (JSON file + Sanity `dog` status='adopted' merge) | sitemap.ts at build / revalidate |
| Static route list | hardcoded `PUBLIC_STATIC_ROUTES` array in `sitemap.ts` | constant |

Sanity reads use the public read-only client; no token required. All three Sanity calls are wrapped in try/catch with `console.warn` on failure — sitemap composition continues with static + remaining dynamic sources if any one Sanity call fails.

---

## 6. Canonical host confirmation

All emitted URLs use `https://rmgreatdane.org` as base. Verified at build, locally, and on Vercel preview:

```
$ curl -s http://localhost:3137/sitemap.xml | grep -c "https://rmgreatdane.org"
251

$ curl -s http://localhost:3137/sitemap.xml | grep -c "vercel.app"
0

$ curl -s http://localhost:3137/sitemap.xml | grep -c "localhost"
0
```

Same on Vercel preview (`rmgdri-site-2gvdg91do-...vercel.app`):

```
$ curl -s https://<preview>/sitemap.xml | grep -c "https://rmgreatdane.org"
251

$ curl -s https://<preview>/sitemap.xml | grep -c "vercel.app"
0
```

**The Vercel preview alias does not appear anywhere in the sitemap content despite the response being served from a `*.vercel.app` host.** Override mechanism: `NEXT_PUBLIC_SITE_URL` env var. Fallback: hard-coded `https://rmgreatdane.org` so previews and local builds emit production URLs even if env var is unset.

`/robots.txt` declares both `Host: https://rmgreatdane.org` and `Sitemap: https://rmgreatdane.org/sitemap.xml`.

---

## 7. Local test results (next start, port 3137)

Test set: 17 cases. Output: `seo-asset-gate-results.tsv` (local_status + local_verdict columns).

| Category | Path | Method | Expected | Actual | Verdict |
|---|---|---|---:|---:|:---:|
| spec test 1+3 (robots references sitemap) | `/robots.txt` | GET | 200 + contains `Sitemap: https://rmgreatdane.org/sitemap.xml` | 200 + ✓ | PASS |
| spec test 2 (sitemap reachable) | `/sitemap.xml` | HEAD | 200 | 200 | PASS |
| spec test 4 (canonical host) | `/sitemap.xml` | GET | contains `https://rmgreatdane.org`, no `vercel.app` | ✓ | PASS |
| spec test 4 (no localhost) | `/sitemap.xml` | GET | no `localhost` | ✓ | PASS |
| representative available-dane URL present | `/sitemap.xml` | GET | contains `/available-danes/` | ✓ | PASS |
| representative adoption-success URL present | `/sitemap.xml` | GET | contains `/adoption-successes/2024/` | ✓ | PASS |
| admin not in sitemap | `/sitemap.xml` | GET | no `/admin` | ✓ | PASS |
| api not in sitemap | `/sitemap.xml` | GET | no `/api/` | ✓ | PASS |
| dashboard not in sitemap | `/sitemap.xml` | GET | no `/dashboard` | ✓ | PASS |
| Phase B non-regression: Confirmed-7 308 | `/kevin` | HEAD | 308 | 308 → /available-danes/kevin | PASS |
| Phase B non-regression: Jumbo 308 | `/jumbo` | HEAD | 308 | 308 → /available-danes/jumbo-jet | PASS |
| Phase B non-regression: pre-2022 year-archive 410 | `/2017-adoptions` | HEAD | 410 | 410 | PASS |
| Phase B non-regression: plain-slug 410 | `/axel` | HEAD | 410 | 410 | PASS |
| Phase B non-regression: .html legacy 410 | `/2001Donations.html` | HEAD | 410 | 410 | PASS |
| Phase B non-regression: GONE_REGEX catch-all | `/Photos/foo` | HEAD | 410 | 410 | PASS |
| Phase B non-regression: section 308 | `/donate` | HEAD | 308 | 308 → /donate-to-rmgdri | PASS |
| Phase B non-regression: plain-slug success-mapping | `/zeus` | HEAD | 308 | 308 → /adoption-successes/2024/zeus-2024 | PASS |

**Local: 17 / 17 PASS.**

---

## 8. Vercel-preview test results

Same 17 cases re-run against `https://rmgdri-site-2gvdg91do-ray-richardsons-projects-4591755e.vercel.app` (commit `f128447`).

**Preview: 17 / 17 PASS.**

| Local-vs-preview verdict disagreements | 0 |
|---|---|

Spot-check curl evidence on preview:

```
$ curl -s https://<preview>/robots.txt
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /auth
Disallow: /dashboard
Disallow: /studio

Host: https://rmgreatdane.org
Sitemap: https://rmgreatdane.org/sitemap.xml

$ curl -sI https://<preview>/sitemap.xml | head -3
HTTP/2 200
accept-ranges: bytes
access-control-allow-origin: *

$ curl -s https://<preview>/sitemap.xml | grep -c "<loc>"
251
```

---

## 9. Confirmation: redirect/410 behavior unchanged

10 non-regression spot-checks, all green:

| Test path | Expected (per Phase B + C) | Local | Vercel preview |
|---|---|:---:|:---:|
| `/kevin` (Confirmed-7 no-slash) | 308 → `/available-danes/kevin` | ✅ | ✅ |
| `/jumbo` (Confirmed-7 + Decision 2) | 308 → `/available-danes/jumbo-jet` | ✅ | ✅ |
| `/donate` (section 308) | 308 → `/donate-to-rmgdri` | ✅ | ✅ |
| `/zeus` (plain-slug success-mapping) | 308 → `/adoption-successes/2024/zeus-2024` | ✅ | ✅ |
| `/2017-adoptions` (pre-2022 year archive) | 410 | ✅ | ✅ |
| `/2021-axel-black-has-a-home` (pre-2022 success URL) | 410 | ✅ | ✅ |
| `/axel` (plain-slug 410) | 410 | ✅ | ✅ |
| `/2001Donations.html` (.html catch-all) | 410 | ✅ | ✅ |
| `/Photos/foo` (GONE_REGEXES catch-all) | 410 | ✅ | ✅ |
| `/the-dog-blog` (static landing page) | 200 | ✅ | ✅ |

**No regression in Phase B redirect/410 behavior.**

---

## 10. Stop conditions — none triggered

| Stop condition | Triggered? |
|---|:---:|
| Sitemap generation requires uncertain content-model assumptions | ❌ no — Sanity schema documents (`dog`, `page`, `successStory`/`adoptionSuccess`) and `lib/adoption-successes` already encode the canonical query shape |
| Robots blocks public adoption / donation / foster / success pages | ❌ no — only `/admin`, `/api`, `/auth`, `/dashboard`, `/studio` disallowed |
| Sitemap contains preview or localhost URLs | ❌ no — 0 occurrences of `vercel.app` or `localhost` |
| Sitemap includes 410 legacy URLs | ❌ no — sitemap composes from current Sanity / static routes, never from inventory |
| `/robots.txt` or `/sitemap.xml` returns 404 after implementation | ❌ no — both 200 on local AND preview |
| Build or typecheck fails | ❌ no — both exit 0 |
| Redirect/410 behavior regresses | ❌ no — 10/10 spot-checks pass on both runtimes |

---

## 11. Final disposition

| | |
|---|---|
| **SEO asset gate** | **PASS** |
| **Phase B redirect/410** | **non-regression confirmed** |
| **Source commit** | `f128447` (pushed) |
| **Branch tip** | `f128447` |
| **Merge gate (per Atlas)** | satisfied (Phase C 92/92 + SEO 17/17 + non-regression 10/10) |

---

## 12. Provenance

Generated by Claude Code (Opus 4.7) on 2026-05-06. Local tests run against `next start -p 3137` of build `SFRzuUSxPNTqYdyYKopDn` post-`f128447`. Preview tests run against Vercel deployment serving commit `f128447` at alias `rmgdri-site-2gvdg91do-ray-richardsons-projects-4591755e.vercel.app`. No source files modified outside `src/app/robots.ts` and `src/app/sitemap.ts`. Sanity reads are read-only against `production` dataset.
