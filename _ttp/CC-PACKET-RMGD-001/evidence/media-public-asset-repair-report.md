# CR-RMGDRI-MEDIA-LEGACY-UPLOADS-002 — Public Asset Repair Report

**Date:** 2026-05-06
**Branch:** `hotfix/legacy-upload-thumbnails` (off `origin/main` @ `c93505c`)
**Scope:** Restore production adoption-success thumbnails by vendoring legacy `/wp-content/uploads/*` images into `public/`, plus a narrow middleware allowlist.
**Strategy:** Option B (optimize before vendoring) — Atlas/Ray-authorized.

---

## 1. Final disposition

# **PASS**

- 210/210 legacy images downloaded from IPM origin, optimized, and placed at preserved public paths.
- Optimized total: **27.69 MB** (within the 35 MB hard threshold; 67.4% reduction from the 85 MB original).
- Middleware allowlist narrowed: `/wp-content/uploads/*` allowed; all other `/wp-*` and `/wp-content/*` surfaces still 410.
- Local verification: 30/30 effective tests pass (25 direct + 5 trailing-slash 308→410 chain).
- Build + typecheck: both exit 0.

---

## 2. Source inventory

| | |
|---|---|
| Inventory file | `_ttp/CC-PACKET-RMGD-001/evidence/wp-content-image-urls.tsv` |
| URL count | **210** unique de-duplicated `https://rmgreatdane.org/wp-content/uploads/...` URLs |
| Source records | `src/data/adoption-successes/successes.normalized.json` (212 records, 211 with `wp-content` `hero_image_ref`, 1 already on `/images/...`) |
| Origin used | `63.135.124.200` (IPM Apache) via `--resolve` with `Host: rmgreatdane.org` SNI; HTTPS, valid cert |
| Downloads attempted | 210 |
| Downloads successful | **210 (100%)** |
| Failures | 0 |

---

## 3. Optimization

### Tool selected

**`sharp 0.34.5`** — already present in `node_modules` (no install required).

Other tools considered and not used:
- ImageMagick `magick` 7.1.2 — installed but not needed (sharp is the simplest API for batch + already in repo)
- `sips` — installed; no PNG quantization
- `cwebp` 1.6.0 — installed; format change out of scope (preserve original extensions)
- `pngquant`, `jpegoptim` — not installed; **no global tools installed**

### Strategy (deterministic per file)

| Format | Pipeline |
|---|---|
| `.jpg`, `.jpeg` | `sharp(src).rotate().resize({width:1200, withoutEnlargement:true}).jpeg({quality:80, mozjpeg:true})` — strips metadata, applies mozjpeg encoder |
| `.png` | Two-pass: produce both palette-quantized (libimagequant via `palette:true, quality:80`) and truecolor (`compressionLevel:9, adaptiveFiltering:true`); pick the smaller result |

### Output budget

| Metric | Value |
|---|---:|
| Original total bytes | **89,133,780** (85.00 MB) |
| Optimized total bytes | **29,033,402** (27.69 MB) |
| Reduction | **67.4%** |
| Files processed | 210 |
| Failures | 0 |
| Mean per file | 138.3 KB optimized (was 414.5 KB) |

### Hard-threshold check

- Target ideal: 15–25 MB
- Hard pause: > 35 MB → **NOT triggered** (27.69 MB)
- Disposition: **proceed without halt**

### Extension distribution (optimized)

| Ext | Count |
|---|---:|
| `.jpg` | 122 |
| `.png` | 62 |
| `.jpeg` | 26 |

(Identical to inventory — no extension changes.)

### Content-type distribution (origin server)

| Content-Type | Count |
|---|---:|
| `image/jpeg` | 148 |
| `image/png` | 62 |

### 10 largest optimized files

| Optimized KB | (was KB) | Relative path |
|---:|---:|---|
| 963.1 | 6,785.1 | `2024/11/Tyr-success-photo.png` |
| 825.1 | 4,273.7 | `2025/10/Oliver-success.png` |
| 790.3 | 3,723.5 | `2025/06/Bolt-success.png` |
| 688.7 | 3,589.4 | `2025/12/Odie-success.png` |
| 443.1 | 1,252.9 | `2025/03/Roxxy-success.png` |
| 441.9 | 1,561.3 | `2025/04/Echo-Success.png` |
| 376.9 | 928.3 | `2025/06/Lady-success-2-scaled.jpeg` |
| 370.4 | 672.7 | `2025/10/Misty-10.jpg` |
| 370.4 | 1,282.2 | `2024/12/Kira-success.jpg` |
| 368.0 | 852.3 | `2024/01/Watson-6.jpeg` |

---

## 4. Path safety + URL preservation

| Check | Result |
|---|:---:|
| Path traversal (`..` or `\x00`) | 0 found |
| Unexpected file types | 0 found |
| All 210 URLs map to `public/wp-content/uploads/<original-rel-path>` | ✅ |
| All 210 public paths exist on disk | ✅ |
| Original URL paths preserved (no JSON updates needed) | ✅ |
| Original filenames preserved | ✅ |
| Original extensions preserved | ✅ |

Sample mapping:
```
URL:  https://rmgreatdane.org/wp-content/uploads/2021/05/Mera-Black-pic-8.jpg
Repo: public/wp-content/uploads/2021/05/Mera-Black-pic-8.jpg
```

---

## 5. Middleware change

### Before (origin/main @ c93505c, line 2065)
```js
new RegExp("^/wp-(admin|includes|content|json|cron|login|signup)\\b"), // WP internal
```

### After (this packet)
```js
new RegExp("^/wp-(admin|includes|json|cron|login|signup)\\b"), // WP internal (non-content)
// /wp-content/* still 410 EXCEPT /wp-content/uploads/* — legacy media library
// is vendored under public/wp-content/uploads/ by CR-RMGDRI-MEDIA-LEGACY-UPLOADS-002.
// /wp-content/plugins, /wp-content/themes, /wp-content/cache, etc. continue to 410.
new RegExp("^/wp-content(?:$|/(?!uploads/))"),
```

### Coverage matrix

| Path | Behavior | Reason |
|---|:---:|---|
| `/wp-admin/...` | 410 | first regex `wp-(admin\|...)` |
| `/wp-includes/...` | 410 | first regex |
| `/wp-json/...` | 410 | first regex |
| `/wp-cron.php` | 410 | first regex |
| `/wp-login.php` | 410 | first regex |
| `/wp-signup.php` | 410 | first regex |
| `/wp-content` (bare) | 410 | second regex matches `^/wp-content$` |
| `/wp-content/plugins/...` | 410 | second regex `(?!uploads/)` succeeds (negative lookahead) |
| `/wp-content/themes/...` | 410 | second regex |
| `/wp-content/cache/...` | 410 | second regex |
| `/wp-content/uploads` (bare) | 410 | second regex (lookahead requires literal `uploads/`) |
| `/wp-content/uploads/2024/...jpg` | passes through to `public/` static asset | second regex lookahead `(?!uploads/)` fails → middleware doesn't 410 → static file served |

**Allowlist scope: ONLY `/wp-content/uploads/...`**. No broader weakening.

---

## 6. Local verification results

Server: `next start -p 3137` against this branch's build.

| # | Test | Path | Expected | Actual | Verdict |
|---:|---|---|:---:|:---:|:---:|
| 1 | jpg representative | `/wp-content/uploads/2021/05/Mera-Black-pic-8.jpg` | 200 | 200 | PASS |
| 2 | png representative | `/wp-content/uploads/2022/06/Lilo-Black-incoming-pic.png` | 200 | 200 | PASS |
| 3.1–3.10 | 10 sampled legacy URLs | various | 200 | 200 | 10/10 PASS |
| 5 | `/wp-admin/` | (trailing-slash) | 410 | 308→410 (chain) | PASS-but-chain |
| 5b | `/wp-admin/admin-ajax.php` | | 410 | 410 | PASS |
| 6 | `/wp-includes/` | (trailing-slash) | 410 | 308→410 (chain) | PASS-but-chain |
| 6b | `/wp-includes/css/style.css` | | 410 | 410 | PASS |
| 7 | `/wp-json/` | (trailing-slash) | 410 | 308→410 (chain) | PASS-but-chain |
| 7b | `/wp-json/wp/v2/posts` | | 410 | 410 | PASS |
| 8 | `/wp-login.php` | | 410 | 410 | PASS |
| 9 | `/wp-content/plugins/` | (trailing-slash) | 410 | 308→410 (chain) | PASS-but-chain |
| 9b | `/wp-content/plugins/foo.php` | | 410 | 410 | PASS |
| 9c | `/wp-content/themes/` | (trailing-slash) | 410 | 308→410 (chain) | PASS-but-chain |
| 9d | `/wp-content/cache/x` | | 410 | 410 | PASS |
| 9e | `/wp-content` (bare, no slash) | | 410 | 410 | PASS |
| 10 | `/jumbo` → `/available-danes/jumbo-jet` | | 308 | 308 | PASS |
| 11 | `/2017-adoptions` still 410 | | 410 | 410 | PASS |
| 11b | `/Photos/foo` regex 410 | | 410 | 410 | PASS |
| 11c | `/2001Donations.html` still 410 | | 410 | 410 | PASS |
| 12 | `/robots.txt` | | 200 | 200 | PASS |
| 13 | `/sitemap.xml` | | 200 | 200 | PASS |

**Summary: 25 direct PASS + 5 PASS-but-chain = 30/30 effective pass.**

The 5 "PASS-but-chain" cases are `trailing-slash` requests that Next.js auto-normalizes via 308 to no-slash, then middleware fires 410 on the no-slash form. Final user-visible status is **410** in all 5 cases. Same `trailingSlash: false` framework behavior documented in Phase C for the Confirmed-7 redirects.

### Spot-check content-type on uploads

```
/wp-content/uploads/2024/11/Tyr-success-photo.png  →  200  image/png
/wp-content/uploads/2025/06/Tux-8.jpg              →  200  image/jpeg
/wp-content/uploads/2022/06/Lilo-Black-incoming-pic.png  →  200  image/png
```

Files served as static assets from `public/` with correct MIME.

### Public path mapping

```
URLs expected:        210
Public files mapped:  210/210
Missing:              0
Unsafe paths:         0
Disk usage:           28 MB (du -sh public/wp-content)
```

---

## 7. Build + typecheck

| Command | Exit code |
|---|:---:|
| `npx tsc --noEmit -p tsconfig.json` | **0** |
| `npx next build` | **0** |

Middleware bundle size unchanged: **44.9 kB** (regex-only edit).

`/wp-content/uploads/*` files are NOT in the Next.js route graph — they're served directly as static assets from `public/`. No build-time enumeration or memory cost.

---

## 8. Vercel preview verification plan

After commit + push:
1. Wait for Vercel preview deployment Ready for `hotfix/legacy-upload-thumbnails`.
2. Re-run the 30 local test cases against the preview alias:
   - 12 `/wp-content/uploads/*` cases expect 200 with `image/jpeg` or `image/png`
   - 8 dangerous WP path cases expect 410 (with PASS-but-chain on trailing-slash variants)
   - 4 non-regression cases (`/jumbo`, `/2017-adoptions`, `/Photos/foo`, `/2001Donations.html`) expect existing behavior
   - 2 SEO cases (`/robots.txt`, `/sitemap.xml`) expect 200
3. Surface comparison report. Halt before merge if any divergence.
4. Live-domain spot-check after merge (since cutover is live): the same 12 sample URLs on `https://rmgreatdane.org/wp-content/uploads/...` should flip from 410 → 200.

---

## 9. Files modified / created in this packet

| Path | Type | Lines / Bytes |
|---|---|---:|
| `src/data/gone-patterns.ts` | modified | regex line replaced (1 line → 5 lines incl. comment) |
| `public/wp-content/uploads/**/*.{jpg,jpeg,png}` | created | 210 files / 27.69 MB total |
| `_ttp/CC-PACKET-RMGD-001/evidence/media-public-asset-repair-report.md` | created (this file) | — |
| `_ttp/CC-PACKET-RMGD-001/evidence/media-public-asset-repair-results.tsv` | created | per-file optimization results + local verification rows |

**Source files NOT touched** (unrelated WIP from `fix/jotform-link-enforcement` carryover): `package.json`, `package-lock.json`, `src/middleware.ts`, several `src/app/admin/*` and `src/app/api/admin/*` files, and Supabase migration SQL files. Per instruction.

---

## 10. Stop conditions held

| Stop condition | Triggered? |
|---|:---:|
| Any image download fails | ❌ no — 210/210 success |
| Any path is unsafe | ❌ no — 0 traversals/null bytes |
| Any unexpected file type appears | ❌ no — only jpg/jpeg/png |
| Optimized total > 35 MB | ❌ no — 27.69 MB |
| Original URL paths cannot be preserved | ❌ no — all 210 preserved |
| Middleware allowlist weakens non-upload WP 410 protections | ❌ no — verified by 8 dangerous-path tests |
| Build/typecheck fails | ❌ no — both exit 0 |
| Any required local test fails | ❌ no — 30/30 effective |

---

## 11. Provenance

Generated by Claude Code (Opus 4.7) on 2026-05-06. All 210 optimized files are derived directly from origin downloads (verified `200 OK image/jpeg|image/png` from IPM `63.135.124.200` via `Host: rmgreatdane.org` HTTPS). Tool: sharp 0.34.5 (already in `node_modules`). No global tools installed. No DNS changes. No unrelated WIP files modified.

Branch base: `origin/main @ c93505c` (squash merge of CC-PACKET-RMGD-001 Phase B + Phase C + SEO). Branch is one commit ahead of `origin/main` after the pending commit lands.
