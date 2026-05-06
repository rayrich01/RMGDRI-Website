# CC-PACKET-RMGD-001 — Follow-up CR Drafts

**Date:** 2026-05-05
**Source:** Phase A discovery work + due diligence analysis
**Status:** Drafts only — these CRs are NOT executed in this packet. Captured for tracking.

---

## CR-A — `/the-dog-blog/[slug]` route resolution

**Discovered during:** Section C.12 of due-diligence-analysis.md (routing audit).

**Problem:** `src/app/(main)/the-dog-blog/[slug]/page.tsx` line 21 queries Sanity for `*[_type == "successStory" && slug.current == $slug][0]`. The `successStory` type is **declared in the schema but has zero documents in the dataset** (production). Every URL of the form `/the-dog-blog/<anything>` returns 404 today. The `/the-dog-blog/page.tsx` index is fine — it's a static "Stories have moved → /adoption-successes" landing page. Only the `[slug]` dynamic child is broken.

**Confirmed via:**
- `grep "_type" src/app/(main)/the-dog-blog/[slug]/page.tsx` — line 21 shows `successStory`
- Live Sanity GROQ: `count(*[_type=='successStory'])` returned `0`
- `array::unique(*[]._type)` returned `['adoptionSuccess', 'dog', 'event', 'page', 'sanity.imageAsset', 'volunteerOpportunity']` — no `successStory`

**Three resolution options:**

1. **Read from JSON.** Refactor `getStory()` to read from `src/data/adoption-successes/successes.normalized.json` (the same source `/adoption-successes/[year]/[slug]` uses) and resolve by slug regardless of year. Pro: keeps `/the-dog-blog/<slug>` URLs functional. Con: duplicates lookup logic across two routes; may encourage URL fragmentation.

2. **Migrate to Sanity `adoptionSuccess` type.** Change the GROQ query from `successStory` to `adoptionSuccess` so the route reads the 210 imported documents. Pro: minimal code change. Con: `/the-dog-blog/<slug>` would resolve to a different content shape than `/adoption-successes/<year>/<slug>`; URL strategy ambiguity persists.

3. **Remove the route entirely.** Delete `src/app/(main)/the-dog-blog/[slug]/page.tsx`. Update `Footer.tsx` to remove the `/the-dog-blog` link or redirect it to `/adoption-successes`. Pro: eliminates URL ambiguity — `/adoption-successes/<year>/<slug>` becomes the single canonical path for individual stories. Con: any external links or bookmarks to `/the-dog-blog/<slug>` (unlikely given route is broken) would 404.

**Recommendation:** Option 3 (remove). The packet's redirect strategy already routes legacy `/blog/*` and `/category/blog` patterns to `/the-dog-blog` (the index landing page), and the year-keyed success URLs directly to `/adoption-successes/<year>/<slug>`. There's no business reason to maintain two paths to the same content.

**Stakeholder decision required:** Lori (content owner) on whether `/the-dog-blog` is a brand-relevant URL she wants preserved at the index level (it currently is, only the slug page is broken).

**Scope (estimate):** 1 file deletion + Footer update + smoke test. <30 min.

**Coordination with this packet:** safe to defer. The redirect strategy in this packet does NOT depend on `/the-dog-blog/[slug]` working — all blog/category-blog redirects target the index `/the-dog-blog`, not slug pages.

---

## CR-B — Orphan `adoptionSuccess` Sanity documents

**Discovered during:** Section B.5 of due-diligence-analysis.md (Sanity content audit).

**Problem:** Sanity dataset contains **210 documents of `_type: "adoptionSuccess"`** that are **not consumed by any route handler** in the codebase. The runtime pipeline reads from `src/data/adoption-successes/successes.normalized.json` (212 records), not from these Sanity docs.

**Evidence:**
- `grep -r "_type ==? \"adoptionSuccess\"" src/` returns no matches
- All success-story routes (`/adoption-successes/[year]/[slug]`, `/adoption-successes/[year]`) use `src/lib/adoption-successes.ts` which reads JSON + Sanity `dog` documents (status: adopted)
- `_type == "adoptionSuccess"` documents have `source: 'WP NDJSON import'` and `sourceId: 'YYYY_<slug>'` fields → likely an import staging area

**Two resolution options:**

1. **Delete the orphan documents.** They are not the canonical source. Delete via Sanity API: `*[_type == "adoptionSuccess"]` → unpublish/delete batch. Pro: cleanup. Con: loses re-import audit trail unless backed up first.

2. **Canonicalize on Sanity (long-term).** Refactor `lib/adoption-successes.ts` to read from `_type == "adoptionSuccess"` documents instead of the JSON file. Pro: single source of truth in CMS, easier for Lori to edit. Con: requires UX work for Sanity Studio fields, content review per document, and URL slug stability check (Sanity-internal slugs vs. JSON slugs).

**Recommendation:** Option 1 short-term (delete with backup), Option 2 as a strategic CMS migration in a future cycle. The deletion is reversible from the NDJSON archive at the source if needed.

**Coordination with this packet:** completely independent. The redirect strategy targets URLs (`/adoption-successes/<year>/<slug>`), which resolve via the JSON pipeline regardless of whether the orphan Sanity docs exist.

**Scope (estimate):** 30 min for Option 1 (export → delete via npx sanity@latest dataset export + script). Option 2 is multi-day.

---

---

## CR-C — Stable Available-Dane URL Identity

**Discovered during:** Phase B addendum review (2026-05-05). Atlas refinement.

**Problem:** Available-dane URLs use bare human-readable slugs (e.g. `/available-danes/bruce/`). When the same name reappears years later for a different dog, the slug becomes ambiguous. The Plain-Slug Lifecycle Rule we just adopted formalizes that plain `/<dogname>/` URLs always represent the *current* dog of that name — so when Bruce 2026 is adopted, his URL becomes orphaned, and a future Bruce arriving in 2028 would inherit the same URL with no continuity guarantee.

**Evidence triggering this CR:**
- Lori's Confirmed-7 list includes 7 dogs with bare-name slugs (`bruce`, `chevy`, `kevin`, `oakley`, `bryce`, `jumbo`, `thunder`).
- Sanity already has slug-collision history: `chloe` (adopted) coexists with prior dog references; `bruce-sept-2022` and `bruce-2025` both exist in adoption-successes JSON, distinguished only by date suffix.
- The current redirect strategy hardcodes `/available-danes/<bare-slug>/` destinations — these become permanent 308s but the destination semantics are mutable.

**Three options:**

1. **Add Dog ID suffix:** `/available-danes/bruce-rmgdri-2026-003/`. Pro: globally unique forever. Con: ugly URL.
2. **Add intake-year suffix:** `/available-danes/bruce-2026/`. Pro: human-readable, year-disambiguated. Con: still collides if two dogs of the same name arrive in the same year.
3. **Keep bare slugs, manage lifecycle in Sanity:** add a "previous holders of this slug" relation in Sanity schema. Redirects stay simple; collisions handled at content layer. Con: doesn't help when crawlers cache the URL pointing to a stale dog.

**Recommendation:** Option 2 (intake-year suffix). Aligns with the existing adoption-success URL pattern (`/adoption-successes/2025/bruce-2025`) and provides reasonable disambiguation without ugly IDs. Rare same-year-same-name collisions can fall back to Option 1 ad-hoc.

**Coordination with this packet:** completely independent. The 7 explicit available-dane redirects in this packet use bare-name slugs as authorized by Lori. CR-C would, in a future cycle, migrate Sanity slugs to the suffixed form and update the redirects accordingly.

**Scope (estimate):** Sanity schema change + slug migration + redirect refresh + Studio editor UX update. ~half-day.

---

## Provenance

Drafted by Claude Code (Opus 4.7) on 2026-05-05 during CC-PACKET-RMGD-001. Not yet filed as GitHub issues. Awaiting Ray's filing decision. CR-C added 2026-05-05 per Atlas refinement.
