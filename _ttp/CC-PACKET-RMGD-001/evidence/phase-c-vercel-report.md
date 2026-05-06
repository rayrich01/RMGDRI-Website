# CC-PACKET-RMGD-001 — Phase C Vercel-Preview Report (formal merge gate)

**Date:** 2026-05-06
**Branch:** `feature/legacy-url-redirects` @ `b257c70`
**Phase B source commit:** `63dafa0`
**Phase C local evidence commit:** `b257c70`
**Vercel preview deployment:** `dpl_7KHRqVZbhELqQ3a72npuTNCF1nr8`
**Preview URL:** `https://rmgdri-site-hanfq5ixm-ray-richardsons-projects-4591755e.vercel.app`
**Branch alias:** `https://rmgdri-site-git-featur-3e0c9f-ray-richardsons-projects-4591755e.vercel.app`
**Test set:** `_ttp/CC-PACKET-RMGD-001/evidence/middleware-410-cases.tsv` (92 rows, unchanged from Phase B commit)
**Method:** Python `http.client.HTTPSConnection` HEAD over HTTPS; -L follow up to 5 hops for 308 rows; path-revisit loop guard.

---

## 1. Disposition

# **PASS-WITH-REFINEMENTS**

**92 of 92 rows pass.** Behavior on Vercel preview matches local `next start` exactly — including the anticipated 2-hop slash-variant chains (refinement 1 fallback condition).

The single "with-caveat" row from local Phase C (`/+nhp+`) **passes cleanly on Vercel preview** because the harness sends literal `+` over HTTPS and Next.js's edge runtime preserves the literal pathname through `req.nextUrl.pathname`. The local harness had a different URL-encoding path (`safe` charset for `urllib.parse.quote` differed); the production-relevant behavior is the Vercel result.

Recommend merge to `main` after Ray review.

---

## 2. Verdict distribution comparison

| Verdict | Local | Vercel | Δ |
|---|---:|---:|---|
| PASS (clean) | 77 | **78** | +1 (`/+nhp+` resolved without caveat) |
| PASS-but-chain (slash-variants) | 7 | 7 | — |
| PASS-passthrough-404 | 6 | 6 | — |
| PASS-passthrough (handler 400) | 1 | 1 | — |
| PASS-with-caveat (`/+nhp+`) | 1 | 0 | -1 (no caveat needed on Vercel) |
| FAIL | 0 | 0 | — |
| **TOTAL** | **92** | **92** | — |

**Effective pass rate: 92 of 92 (100%).**

---

## 3. Per-row divergence vs. local

**1 rows differ between local and Vercel.** Differences below are all expected due to runtime semantics (`http.client` URL-encoding, response classification by harness):

| Path | Field | Local | Vercel |
|---|---|---|---|
| `/+nhp+` | actual_status | `404` | `410` |
| `/+nhp+` | final_status | `404` | `410` |
| `/+nhp+` | verdict | `PASS-with-caveat` | `PASS` |


The most notable divergence is `/+nhp+`:

| | Local (`next start`) | Vercel preview |
|---|---|---|
| Harness URL-encoding | `+` → `%2B` (decoded path missed Set lookup) | `+` preserved literal (Set hit → 410) |
| Result | 404 (verdict: PASS-with-caveat after curl reproduction) | 410 (verdict: PASS) |

This is a **harness/runtime artifact**, not a code defect. Real-world bots and Google fetch literal `/+nhp+` (per Wayback evidence) and consistently get 410 on both runtimes when sent that way. The local PASS-with-caveat note in the prior report covers this.

---

## 4. Confirmed-7 slash/no-slash behavior on Vercel

| Source | Status | Initial Location | Hops | Final destination | Verdict |
|---|---:|---|---:|---|---|
| `/kevin` | 308 | `/available-danes/kevin` | 1 | `/available-danes/kevin` | PASS |
| `/kevin/` | 308 | `/kevin` | 2 | `/available-danes/kevin` | PASS-but-chain |
| `/bryce` | 308 | `/available-danes/bryce` | 1 | `/available-danes/bryce` | PASS |
| `/bryce/` | 308 | `/bryce` | 2 | `/available-danes/bryce` | PASS-but-chain |
| `/jumbo` | 308 | `/available-danes/jumbo-jet` | 1 | `/available-danes/jumbo-jet` | PASS |
| `/jumbo/` | 308 | `/jumbo` | 2 | `/available-danes/jumbo-jet` | PASS-but-chain |
| `/chevy` | 308 | `/available-danes/chevy` | 1 | `/available-danes/chevy` | PASS |
| `/chevy/` | 308 | `/chevy` | 2 | `/available-danes/chevy` | PASS-but-chain |
| `/bruce` | 308 | `/available-danes/bruce` | 1 | `/available-danes/bruce` | PASS |
| `/bruce/` | 308 | `/bruce` | 2 | `/available-danes/bruce` | PASS-but-chain |
| `/thunder` | 308 | `/available-danes/thunder` | 1 | `/available-danes/thunder` | PASS |
| `/thunder/` | 308 | `/thunder` | 2 | `/available-danes/thunder` | PASS-but-chain |
| `/oakley` | 308 | `/available-danes/oakley` | 1 | `/available-danes/oakley` | PASS |
| `/oakley/` | 308 | `/oakley` | 2 | `/available-danes/oakley` | PASS-but-chain |

**Vercel edge behavior matches local.** The slash-variant chains are produced by Vercel's edge layer normalizing trailing slashes before consulting custom redirects, identically to the Node.js `next start` runtime. No edge-vs-Node divergence on this front.

Independent curl confirmation:
```
$ curl -sIL https://<preview>/kevin/
HTTP/2 308 — location: /kevin
HTTP/2 308 — location: /available-danes/kevin
HTTP/2 200
$ curl -sIL -w "%{num_redirects} %{url_effective}\n" https://<preview>/kevin/
2 https://<preview>/available-danes/kevin
```

---

## 5. Jumbo verification on Vercel

| Source | Status | Initial → Final | Hops |
|---|---:|---|---:|
| `/jumbo` | 308 | `/available-danes/jumbo-jet` | 1 |
| `/jumbo/` | 308 | `/jumbo` → `/available-danes/jumbo-jet` | 2 |

Decision 2 destination (Sanity slug divergence resolved by destination rewrite) verified working on Vercel preview for both source forms.

---

## 6. `.html` / `.htm` 410 verification on Vercel

All 6 `.html`/`.htm` test rows returned **410** on Vercel preview:

- `/ www.duitse-doggen-deense-deutsche-duitse-dog-dogues-allemands.be/paginas/pict_jewels.html` → 410 ✓
- `/2001Donations.html` → 410 ✓
- `/Adoptable_Grea.html` → 410 ✓
- `/Adoptable_Grex.html` → 410 ✓
- `/Events/2012 Picnic/HTML/img_0003.htm` → 410 ✓
- (additional `.html` from spot sample) → 410 ✓

Refinement 2 confirmed in production-shape edge runtime: `.html`/`.htm` legacy paths reach the 410 branch. Vercel does NOT silently route them to a static-asset handler before middleware sees them.

Edge-runtime spot check (outside the 92-row set):
- Curl `/Photos/foo` → 410 (GONE_REGEXES catch-all `^/(Photos|Events|...)/` working in edge runtime) ✓

---

## 7. Pass-through verification on Vercel

| Path | Result | Verdict |
|---|---:|---|
| `/_next/static/chunk-abc.js` | 404 | passthrough OK (matcher excluded) |
| `/_next/image?url=foo` | 400 | passthrough OK (image handler rejected `foo` — correct) |
| `/api/admin/health` | 404 | passthrough OK (route doesn't exist) |
| `/favicon.ico` | 200 | served from public/ |
| `/robots.txt` | 404 | passthrough OK (no file configured) |
| `/sitemap.xml` | 404 | passthrough OK (no file configured) |
| `/.well-known/nodeinfo` | 404 | passthrough OK (matcher excluded) |
| `/.well-known/openid-configuration` | 404 | passthrough OK (matcher excluded) |
| `/` | 200 | homepage |
| `/about-great-danes` | 200 | Sanity-backed route renders |
| `/adoption-successes` | 200 | year list renders |
| `/the-dog-blog` | 200 | static landing page renders |

**No system/static path returned 410 on Vercel.** Refinement 2 matcher correctly excludes all required prefixes in the Vercel edge runtime.

---

## 8. Redirect-chain report (Vercel preview)

| Hops | Rows |
|---:|---:|
| 0 (direct response: 410 / 200 / 400 / 404) | 78 |
| 1 (single 308 → final 200) | 7 (Confirmed-7 no-slash + 308 success-mapping samples) |
| 2 (Vercel auto-normalize + custom 308 → final 200) | 7 (Confirmed-7 slash variants) |
| ≥3 | **0** |

**Maximum chain depth: 2 hops.** No chains from custom-redirect → custom-redirect (no overlapping rule conflicts in production). All 308 paths reach a final 200 destination within at most 2 hops.

---

## 9. Local vs. Vercel — runtime equivalence summary

| Aspect | Local `next start` | Vercel preview | Equivalent? |
|---|---|---|:---:|
| Custom 308 redirects from `next.config.mjs` | fire | fire | ✅ |
| Custom 308 destinations | correct | correct | ✅ |
| Trailing-slash auto-normalization → 308 | fires before custom redirects | fires before custom redirects | ✅ |
| Slash-variant chain depth | 2 hops | 2 hops | ✅ |
| Middleware 410 via `GONE_LITERALS` Set lookup | works | works | ✅ |
| Middleware 410 via `GONE_REGEXES` catch-alls (e.g. `/Photos/foo`) | works | works | ✅ |
| `.html` / `.htm` 410 (refinement 2) | works | works | ✅ |
| Matcher exclusions (`_next/static`, `api`, `.well-known`, etc.) | correctly skip middleware | correctly skip middleware | ✅ |
| `/+nhp+` literal | 410 (caveat: harness encoded `+`) | 410 (no caveat) | ✅ functional |

**No production-relevant divergence between runtimes.**

---

## 10. Failures or surprises requiring code changes

**None.** All 92 rows pass. No unexpected status codes, no chain-depth violations, no matcher leaks, no 410-on-static-asset surprises.

---

## 11. Recommended next actions

| # | Action | Owner |
|---|---|---|
| 1 | Review this report and the per-row TSV (`phase-c-vercel-results.tsv`) | Ray |
| 2 | Approve merge of `feature/legacy-url-redirects` to `main` | Ray |
| 3 | Merge to `main` (squash or merge commit per project convention) | Ray |
| 4 | Vercel auto-deploys to production once `main` updates | (automatic) |
| 5 | Monitor production for unexpected 410s in first 24h (Vercel logs) | Ray |
| 6 | Phase D — pre-NS-flip DNS verification against Cloudflare staged zone | Ray (separate track) |
| 7 | Reconcile `stash@{{0}}` Supabase-auth WIP middleware with Phase B 410 branch on a separate branch | Ray (post-Phase-B task) |
| 8 | File CR-A / CR-B / CR-C as GitHub Issues per CLAUDE.md governance | Ray |

---

## 12. Provenance

Generated by Claude Code (Opus 4.7) on 2026-05-06 against Vercel preview deployment `dpl_7KHRqVZbhELqQ3a72npuTNCF1nr8` (commit `b257c70`). Test artifact `middleware-410-cases.tsv` unchanged from Phase B commit. Harness was iterated once: an over-aggressive same-host loop guard was replaced with a path-revisit guard mid-run, after curl reproduction confirmed the 7 slash-variant chains were legitimate 2-hop redirects rather than infinite loops. The corrected harness output is the basis for this report.
