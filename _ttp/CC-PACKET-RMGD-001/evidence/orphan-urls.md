# Orphan URLs — Operator Decision Packet

**Packet:** CC-PACKET-RMGD-001
**Generated:** 2026-05-04
**Source:** Wayback CDX API (8281 raw rows → 2516 unique content paths) + live WP sitemap (28 URLs)
**Total inventory:** 2516 paths
**Covered by rules:** 1889 (75.1%) — see `redirect-map.tsv`
**No redirect needed (same path on new site):** 12 (0.5%)
**Orphans (need decision below):** 615 (24.4%)

---

## How to use this document

Each section below is a group of legacy URLs with no clear destination on the new site.
For each group, three options are typical:

- **(A) Redirect to closest-match parent page** — preserves some SEO equity, soft-soaks user intent.
- **(B) Redirect to homepage `/`** — last resort, dilutes equity but keeps Google off 404.
- **(C) 410 Gone** — explicit "intentionally removed". Best for spam/duplicate/admin paths. Google de-indexes faster.

Mark your choice next to each group. After your decisions, I will extend `redirect-map.tsv`
and (for 410 cases) add a Next.js route handler that returns 410.

---

## plain_lowercase_slug (430 URLs)

Legacy single-segment slugs — overwhelmingly old WordPress dog/blog post pages (e.g. `/zeus`, `/abby`, `/dante`). No current destination. Most have been off Google's radar for years; many were duplicates of "X-has-a-home" stories.

**Recommended:** **Option (A): catch-all redirect `/:slug` → `/the-dog-blog`** with a denylist for actual current routes (already covered by Next.js routing). Risk: over-broad — will fire for any future slug typo. Alternative: **(C) 410 Gone for the entire group** to signal cleanly to Google that this content is gone.

**Alternative:** (B) Redirect to `/adoption-successes` instead of `/the-dog-blog` — most of these were old success stories.

**Risk:** CATCH-ALL RISK: a `/:slug` redirect fires last, will not interfere with `/about-great-danes` etc. (those resolve first). But it WILL match e.g. `/foo` typos that you may want as 404. Decide based on Google indexing pressure.

**Operator decision:** `[ ] A`  `[ ] B`  `[ ] C`  `[ ] custom: ____________`

<details>
<summary>Sample paths (25 of 430)</summary>

```
/abby
/ace
/ada
/adoption-information-2
/ajax
/angel
/angus
/annabelle
/antero
/aoife
/apollo
/apollo-dane-foster-needed
/app-thank-you
/aries
/arlo
/asa
/asher
/ashley
/astro
/athena
/athena-baby
/athena-harl
/atlas
/auggie
/ava
... +405 more (full list in orphan-groups.tsv)
```
</details>

---

## sanity_dog_slug_collision (4 URLs)

Legacy URLs that share a slug with a CURRENTLY-PUBLISHED Sanity dog. The legacy WP page was likely a *different* dog (or an older dog of the same name). Auto-redirecting `/bruce` → `/available-danes/bruce` may serve the wrong dog's page to Google.

**Recommended:** **Per-dog operator decision required.** If the slug references the same dog: leave alone (Next.js will serve the current dog at the same URL). If different: redirect legacy variant to `/adoption-successes` (dog has likely moved on).

**Alternative:** Block-list these from any catch-all rule.

**Risk:** CONTENT FIDELITY ISSUE per CLAUDE.md Rule 9. Surface to Lori for content match before redirect.

**Operator decision:** `[ ] A`  `[ ] B`  `[ ] C`  `[ ] custom: ____________`

<details>
<summary>Sample paths (4 of 4)</summary>

```
/bruce
/chevy
/kevin
/oakley
```
</details>

---

## dog_color_variant (12 URLs)

Color-variant slugs (`/apollo-fawn`, `/dante-merle`) — these were WP duplicate-name disambiguators. No current destination.

**Recommended:** **Option (A): bulk → `/adoption-successes`** (these were old success stories with color suffixes).

**Alternative:** (C) 410 Gone.

**Risk:** Low — these have no SEO equity worth preserving.

**Operator decision:** `[ ] A`  `[ ] B`  `[ ] C`  `[ ] custom: ____________`

<details>
<summary>Sample paths (12 of 12)</summary>

```
/apollo-fawn
/apollo-merle
/axel-black
/bruno-fawn
/dante-black
/dante-merle
/duke-black
/duke-fawnequin
/harley-brindle
/harper-fawnequin
/luna-blue
/zeus-fawn
```
</details>

---

## old_static_archive_dirs (12 URLs)

Pre-WordPress static HTML/asset archives in `/Events/`, `/Photos/`, `/Sponsor/`, `/MissingPets/`, etc. Already partially covered by the `*.html`/`*.htm` catch-all rules in `redirect-map.tsv`; these are the remaining oddities (URL-encoded spaces, malformed paths, asset files).

**Recommended:** **Option (B): bulk → `/`** (homepage). These are decade-old, low-value.

**Alternative:** (C) 410 Gone.

**Risk:** Trivial.

**Operator decision:** `[ ] A`  `[ ] B`  `[ ] C`  `[ ] custom: ____________`

<details>
<summary>Sample paths (12 of 12)</summary>

```
/Events/2008 events/responsible dog.pdf&
/Events/DaneWalk/html/2.5
/Events/DaneWalk/html/text/css
/Home/polarpups_fan_jp60.jpe
/Our_Successes4x_files/editdata.mso
/Photos/2010 http://www.kodakgallery.com/gallery/sharing/shareRedirectSwitchBoard.jsp
/Photos/Proudofmydane/Makai_11weeks.bmp
/Sponsor/Rosco/Rosco.html 
/Successes 2009/piwik.php
/events/New Baby Classes.doc
/events/calendar/html/2.5
/events/calendar/html/text/css
```
</details>

---

## wp_dup_post_id (5 URLs)

WordPress auto-generated duplicate-post slugs (`/3927-2`, `/4435-2`, etc.) — internal artifacts, not user-facing.

**Recommended:** **Option (C): 410 Gone.**

**Alternative:** (B) Redirect to `/`.

**Risk:** Trivial.

**Operator decision:** `[ ] A`  `[ ] B`  `[ ] C`  `[ ] custom: ____________`

<details>
<summary>Sample paths (5 of 5)</summary>

```
/10001-2
/3927-2
/4435-2
/5355-2
/6516-2
```
</details>

---

## legacy_section_root (6 URLs)

Capitalized/legacy section roots: `/RMGDRI`, `/CHLOE`, `/Store`, `/MissingPets`, `/rmgdri-visa`. Old WP pages with no clear successor.

**Recommended:** **Option (A) per path:** `/RMGDRI` `/rmgdri` → `/about-rmgdri`; `/Store` → 410 (no longer sells merch); `/MissingPets` → 410; `/CHLOE` → `/adoption-successes` (was a success story).

**Alternative:** Bulk (C) 410 Gone.

**Risk:** Low.

**Operator decision:** `[ ] A`  `[ ] B`  `[ ] C`  `[ ] custom: ____________`

<details>
<summary>Sample paths (6 of 6)</summary>

```
/CHLOE
/MissingPets
/RMGDRI
/Store
/rmgdri
/rmgdri-visa
```
</details>

---

## caps_paths (4 URLs)

Capitalized paths Google may still hold (`/Great_Dane_Rescue_links`, `/Signs of Bloat`).

**Recommended:** **Option (B): bulk → `/`** unless a clear semantic match exists.

**Alternative:** (C) 410 Gone.

**Risk:** URL-encoded spaces in paths may need explicit handling — flag if any.

**Operator decision:** `[ ] A`  `[ ] B`  `[ ] C`  `[ ] custom: ____________`

<details>
<summary>Sample paths (4 of 4)</summary>

```
/Great_Dane_Rescue_links
/RMGDRI Adoption Application.doc
/RMGDRI Application for Adoption v1-1.doc
/Signs of Bloat
```
</details>

---

## well_known (2 URLs)

`/.well-known/nodeinfo`, `/.well-known/openid-configuration` — these are usually framework-handled or not present. Wayback may have observed 404s.

**Recommended:** **Leave alone** — do not redirect. Vercel/Next.js will return 404 if not implemented, which is correct.

**Alternative:** N/A.

**Risk:** None — these are not SEO-relevant.

**Operator decision:** `[ ] A`  `[ ] B`  `[ ] C`  `[ ] custom: ____________`

<details>
<summary>Sample paths (2 of 2)</summary>

```
/.well-known/nodeinfo
/.well-known/openid-configuration
```
</details>

---

## malformed (2 URLs)

Malformed paths from CDX scraping artifacts — `/+nhp+`, `/==========================================================REASON`. Not real URLs.

**Recommended:** **Skip — no rule needed.**

**Alternative:** N/A.

**Risk:** None.

**Operator decision:** `[ ] A`  `[ ] B`  `[ ] C`  `[ ] custom: ____________`

<details>
<summary>Sample paths (2 of 2)</summary>

```
/+nhp+
/==========================================================REASON
```
</details>

---

## other (138 URLs)

Residual ungrouped paths.

**Recommended:** **Per-path review** below.

**Alternative:** N/A.

**Risk:** Mixed.

**Operator decision:** `[ ] A`  `[ ] B`  `[ ] C`  `[ ] custom: ____________`

<details>
<summary>Sample paths (25 of 138)</summary>

```
/10-things-might-not-know-great-danes
/admin-ajax.php
/adoptable_grea/RMGDRI Adoption Application.doc
/btAppFee.swf
/btApplication.swf
/btBusinessPartner.swf
/btContactUs.swf
/btDonate.swf
/btEmail.swf
/btEventBlog.swf
/btFAQ.swf
/btFosterCosts.swf
/btFostering.swf
/btGuidelines.swf
/btHome.swf
/btRequirements.swf
/btShopping.swf
/btSponsorADane.swf
/btTurnIn.swf
/butter_braids
/button 3.swf
/button10.swf
/button11.swf
/button19.swf
/button2.swf
... +113 more (full list in orphan-groups.tsv)
```
</details>

---

## Per-dog content fidelity check (CLAUDE.md Rule 9)

The following legacy URLs match a slug currently published in Sanity as an available dog:

| Legacy URL | Current Sanity dog | Same dog? | Action |
|-----------|---------------------|----------|--------|
| `/bruce` | `/available-danes/bruce` | `[ ] yes / [ ] no`  | `[ ] no-op / [ ] redirect to /adoption-successes / [ ] custom` |
| `/chevy` | `/available-danes/chevy` | `[ ] yes / [ ] no`  | `[ ] no-op / [ ] redirect to /adoption-successes / [ ] custom` |
| `/kevin` | `/available-danes/kevin` | `[ ] yes / [ ] no`  | `[ ] no-op / [ ] redirect to /adoption-successes / [ ] custom` |
| `/oakley` | `/available-danes/oakley` | `[ ] yes / [ ] no`  | `[ ] no-op / [ ] redirect to /adoption-successes / [ ] custom` |

---

## Provenance

Generated by Claude Code (Opus 4.7) executing CC-PACKET-RMGD-001 on 2026-05-04.
Source artifacts: `evidence/a2-wayback-raw.json`, `evidence/a1-raw-*.xml`, `evidence/sanity-slugs.tsv`.
Coverage analysis: `evidence/wayback-classified.tsv`. Full grouped list: `evidence/orphan-groups.tsv`.