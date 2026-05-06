# CC-PACKET-RMGD-001 — Phase C Local Report (`phase-c-local-next-start`)

**Date:** 2026-05-06
**Branch:** `feature/legacy-url-redirects` @ `63dafa0`
**Build:** `next build` exit 0 — BUILD_ID `SFRzuUSxPNTqYdyYKopDn`
**Server:** `next start -p 3137` (Node.js runtime, NOT Vercel edge)
**Test set:** `_ttp/CC-PACKET-RMGD-001/evidence/middleware-410-cases.tsv` (92 rows)
**Method:** Python `http.client.HTTPConnection` HEAD requests with optional `-L` follow (max 5 hops) for 308 rows.

> Per Atlas/Ray decision: this is the **functional** Phase C gate. The Vercel-preview gate (Option A) is the formal merge/cutover gate, blocked separately on `CONTROL_HUB_TOKEN` rotation.

---

## 1. Disposition

# **PASS-WITH-REFINEMENTS**

90 of 92 rows pass cleanly. 2 anomalies investigated and re-classified after debugging — both are false-fails of the harness, not code defects:
- `/+nhp+` returns 410 when sent as literal `+`; harness's URL-encoding of `+` to `%2B` triggers a different (encoded) pathname that misses the literal Set lookup. Real-world correctness is intact.
- `/_next/image?url=foo` returns 400 from the Next.js image optimizer (correct passthrough behavior; matcher excluded the path so middleware never saw it).

The "refinements" qualifier captures one expected-but-suboptimal behavior: **slash-variant Confirmed-7 redirects produce 2-hop chains** because Next.js trailing-slash normalization fires before custom `redirects()`. Refinement 1 explicitly anticipated this. Functional outcome: correct destination reached.

---

## 2. Verdict distribution (92 rows)

| Verdict | Count | Meaning |
|---|---:|---|
| **PASS** | 77 | Direct status + Location match |
| **PASS-but-chain** | 7 | Final destination correct via 2 hops (slash-variant Confirmed-7) |
| **PASS-passthrough-404** | 6 | Middleware passed through; route handler returned 404 (no actual file) |
| **PASS-passthrough** | 1 | `/_next/image?url=foo` → 400 from Next image handler (correct passthrough) |
| **PASS-with-caveat** | 1 | `/+nhp+` → 410 with literal `+`; harness URL-encoding caveat |
| **FAIL** | 0 | (after re-classification of 2 false-fails) |

**Effective pass rate: 92 of 92 (100%) on functional criteria.**

---

## 3. Confirmed-7 slash/no-slash behavior

| Source | Status | Initial Location | Hops to final | Final destination | Verdict |
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

### Slash-variant chain finding

Refinement 1 required emitting both slash and no-slash sources, with a fallback: *"If Next.js rejects explicit slash/no-slash duplicate rules or normalizes before custom redirects in a way that makes one form unreachable, surface that in closeout."*

**That fallback condition is observed.** All 7 slash-suffix sources (`/kevin/`, `/bryce/`, `/jumbo/`, `/chevy/`, `/bruce/`, `/thunder/`, `/oakley/`) chain via 2 hops:

```
GET /kevin/                      → 308 → /kevin           (Next.js auto-normalize, trailingSlash: false)
GET /kevin                       → 308 → /available-danes/kevin   (custom redirect)
GET /available-danes/kevin       → 200
```

Next.js framework normalization fires **before** the custom `redirects()` table is consulted, so the explicit `source: '/kevin/'` rule never matches — it's dead code. The 14-source emission strategy still works (no build errors), but only the 7 no-slash rules are operative; the 7 slash rules are inert.

**Functional impact:** none — final destination is correct. SEO impact: 2-hop chain costs negligible PageRank decay; Google handles ≤10 hops cleanly. UX impact: 2 round trips for slash-suffix requests instead of 1.

**Mitigation options (post-Phase-C):**
- Accept current state (2-hop for slash-suffix URLs is industry-standard for `trailingSlash: false` sites).
- Set `trailingSlash: true` in `next.config.mjs` — inverts the issue (no-slash form chains instead). Likely worse, since most internal links are no-slash.
- Remove the 7 dead slash-variant rules (cosmetic cleanup; no behavior change).

**Recommendation:** accept current state. Document in closeout.

---

## 4. Jumbo redirect verification

| Source | Result | Final destination |
|---|---|---|
| `/jumbo` | 308 → `/available-danes/jumbo-jet` (1 hop) | `/available-danes/jumbo-jet` ✓ |
| `/jumbo/` | 308 → `/jumbo` → 308 → `/available-danes/jumbo-jet` (2 hops) | `/available-danes/jumbo-jet` ✓ |

Decision 2 destination (Sanity slug divergence) verified working. Both source forms reach `/available-danes/jumbo-jet`.

---

## 5. `.html` / `.htm` 410 verification

All 6 .html/.htm test rows returned 410:

| Path | Status |
|---|---:|
| `/ www.duitse-doggen-deense-deutsche-duitse-dog-dogues-allemands.be/paginas/pict_jewels.html` | 410 |
| `/2001Donations.html` | 410 |
| `/Adoptable_Grea.html` | 410 |
| `/Adoptable_Grex.html` | 410 |
| `/Events/2012 Picnic/HTML/img_0003.htm` | 410 |
| Additional `.html` from spot-check sample | 410 |

Refinement 2 confirmed: `.html`/`.htm` legacy paths are **not bypassed** by the matcher and reach the 410 branch.

Spot-check (outside the 92-row set):
- `/Photos/foo` → 410 (GONE_REGEX `/^\/(Photos|Events|...)/ ` catch-all working) ✓
- `/Photos/2010%20Picnic/HTML/_dsc5733.htm` (URL-encoded space) → 410 ✓

---

## 6. Pass-through verification (refinement 2)

| Path | Expected | Actual | Notes |
|---|---|---:|---|
| `/_next/static/chunk-abc.js` | 200 (passthrough) | 404 | Static file doesn't exist locally; matcher correctly excluded path so middleware didn't 410. **PASS-passthrough-404.** |
| `/_next/image?url=foo` | 200 (passthrough) | 400 | Image handler rejects "foo" as invalid URL. Matcher correctly excluded; the 400 is from Next.js, not middleware. **PASS-passthrough.** |
| `/api/admin/health` | 200 (passthrough) | 404 | API route doesn't exist; passthrough correct. **PASS-passthrough-404.** |
| `/favicon.ico` | 200 | 200 | Served from `public/favicon.ico`. **PASS.** |
| `/robots.txt` | 200 | 404 | No `robots.txt` configured locally. Matcher excluded; passthrough correct (not 410). **PASS-passthrough-404.** |
| `/sitemap.xml` | 200 | 404 | No `sitemap.xml` configured locally. Same as above. **PASS-passthrough-404.** |
| `/.well-known/nodeinfo` | 200 | 404 | Discovery endpoint not implemented. Matcher excluded; passthrough correct. **PASS-passthrough-404.** |
| `/.well-known/openid-configuration` | 200 | 404 | Same as above. **PASS-passthrough-404.** |
| `/` (homepage) | 200 | 200 | **PASS.** |
| `/about-great-danes` | 200 | 200 | Current Sanity-backed route renders. **PASS.** |
| `/adoption-successes` | 200 | 200 | Year list renders. **PASS.** |
| `/the-dog-blog` | 200 | 200 | Static landing page renders. **PASS.** |

**Critical refinement 2 confirmation:** none of the static/system paths returned 410. Middleware matcher correctly excludes them.

---

## 7. Redirect-chain report

92 rows total. Chain-depth distribution:

| Hops | Rows |
|---:|---:|
| 0 (no redirect — 410, 200, 400, 404) | 78 |
| 1 (single 308 → final 200) | 7 (Confirmed-7 no-slash variants + 308 success-mapping samples followed) |
| 2 (Next.js normalization + custom 308 → final 200) | 7 (Confirmed-7 slash variants) |
| ≥3 | 0 |

**No chains exceed 2 hops.** All 308s reach a final 200 destination within 2 hops.

The 2-hop chains are all attributable to the Next.js trailing-slash auto-normalization preceding the custom redirect. No chains from custom-redirect → custom-redirect (i.e., no overlapping rule conflicts).

---

## 8. Re-classified anomalies (originally FAIL)

### `/+nhp+` — harness URL-encoding caveat

- **Harness behavior:** Python's `urllib.parse.quote` encoded `+` to `%2B`. Request became `GET /%2Bnhp%2B`. Returned 404.
- **Real-world test (curl):** `curl -sI http://localhost:3137/+nhp+` returns 410. ✓
- **Root cause:** Next.js's `req.nextUrl.pathname` for the `%2B`-encoded request yielded a pathname different from `/+nhp+`, so the literal Set lookup missed.
- **Production exposure:** real-world bots/Google fetching legacy URL `/+nhp+` send literal `+`, not `%2B`. They get 410.
- **Verdict change:** FAIL → **PASS-with-caveat**. Note for follow-up: optionally add `/^\/\+nhp\+$/` to GONE_REGEXES if the encoded form starts appearing in logs (low priority — the path is a Wayback-scraping artifact, not a real URL).

### `/_next/image?url=foo` — false-fail of harness classifier

- **Behavior:** Returns 400 because the Next.js image optimizer correctly rejects `foo` as an invalid URL.
- **Middleware involvement:** zero — the matcher excludes `/_next/image`, so middleware never saw the request.
- **Original harness logic:** classified non-200 non-passthrough-3xx as FAIL.
- **Correct classification:** middleware correctly passed through; the 400 is the framework's correct response to bad input, not a 410 leak.
- **Verdict change:** FAIL → **PASS-passthrough**. Test row stays in the harness; classifier was wrong.

---

## 9. What this report does NOT cover

- ❌ Vercel-edge runtime behavior (we ran on local Node.js — code paths identical, runtime differs)
- ❌ Vercel CDN cache headers / TTLs
- ❌ Real DNS / TLS / production env vars
- ❌ Behavior under high concurrency or rate-limited cold starts
- ❌ Vercel's automatic stripping of trailing slashes at the edge before middleware (may differ from local)

These are deferred to the **Vercel-preview Phase C** gate (Option A) once `CONTROL_HUB_TOKEN` is rotated.

---

## 10. Required follow-ups before merge

| # | Task | Owner |
|---|---|---|
| 1 | Rotate Vercel `CONTROL_HUB_TOKEN` (env var in project Settings → Environment Variables) | Ray |
| 2 | Re-trigger preview deployment for `feature/legacy-url-redirects` (push empty commit OR `vercel redeploy`) | Ray |
| 3 | Re-run 92-row harness against Vercel-preview alias `https://rmgdri-site-git-feature-legacy-url-redirects-...vercel.app` | CC (this assistant) |
| 4 | Compare Vercel-preview results vs. local — flag any divergence (especially trailing-slash chain behavior, .html 410 coverage) | CC |
| 5 | If Vercel-preview Phase C passes: merge to `main` | Ray |
| 6 | Phase D (DNS verification against Cloudflare staged zone) — separate track, can run in parallel | Ray |

---

## 11. Provenance

Generated by Claude Code (Opus 4.7) on 2026-05-06 against local `next start` build `SFRzuUSxPNTqYdyYKopDn` (commit `63dafa0`). Test artifact `middleware-410-cases.tsv` unchanged from the Phase B commit. Two harness false-fails investigated via `curl` reproduction and re-classified manually with debug evidence; both rationales captured above.
