# Gate A — Discovery Report

**CR:** CR-C / Issue #141 — RMGDRI Supabase Auth Middleware Reconciliation
**Generated:** 2026-05-06 UTC
**Operator:** Claude Code, read-only inspection
**Mode:** Gate A only — discovery / evidence
**Source of truth:** primary worktree at `/Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site` on branch `hotfix/legacy-upload-thumbnails` (which carries the WIP)

## Working-tree posture

| Metric | Value |
|---|---|
| Modified tracked files | 20 |
| Untracked items | 38 |
| Stash count | 19 (unchanged from session start) |
| Current branch | `hotfix/legacy-upload-thumbnails` |
| Branch HEAD | `6413bb3` (Ray's earlier merge of origin/main into the branch) |
| origin/main HEAD | `f8e8132` (post CR-A + CR-B + CR-137 + CR-138) |

## 10 Gate A questions answered

### 1. Which stash or files contain Supabase-auth middleware work?

**`stash@{0}`** is the canonical Supabase-auth middleware stash. Subject:

> `On feature/legacy-url-redirects: CC-PACKET-RMGD-001 Phase B — preserving WIP middleware.ts (Supabase auth extension) before Phase B 410 logic`

It contains a single modified file: `src/middleware.ts`.

Two other stashes mention auth/middleware/Supabase keywords but are unrelated:
- `stash@{13}` — pre-CR-64 intent-form middleware passphrase gate cleanup (not Supabase)
- `stash@{17}` — adoption-foster Supabase **type values** for a form (not middleware)

The primary worktree also contains untracked Supabase library files and pages that are **complementary to** the stash but were not in the stash itself (because they were added after the stash was created).

### 2. Which files are middleware/auth/admin related?

| Category | Path(s) |
|---|---|
| **MIDDLEWARE** | `src/middleware.ts` (in stash@{0}), `src/lib/supabase/middleware.ts`, `src/lib/supabase/browser.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/admin.ts` |
| **AUTH_ROUTE** | `src/app/auth/login/`, `src/app/auth/register/`, `src/app/auth/callback/` |
| **ADMIN_ROUTE** | `src/app/admin/dogs/`, `src/app/admin/people/`, `src/app/admin/vets/` |
| **ADMIN_UI** | `src/app/admin/submissions/[id]/{Intelligence,Match,Placement,Profile,Screening}Panel.tsx` (5 untracked) + `ReviewPanel.tsx` + `page.tsx` (modified) |
| **API_ROUTE** | `src/app/api/admin/{applications,auth,danes,dogs,logout,matches,people,placements,queue,review,vets}/` and `src/app/api/applications/`; `src/app/api/admin/review/[id]/route.ts` (modified) |
| **APP_ROUTE** | `src/app/dashboard/page.tsx`, `src/app/dashboard/applications/[id]/confirmation/page.tsx`, `src/app/apply/adopt/page.tsx` (modified) |
| **APP_LIB** | `src/lib/applications/`, `src/lib/hooks/`, `src/lib/matching/` |
| **SUPABASE_MIGRATION** | 9 files at `supabase/migrations/2026042{0,1,3}*.sql` |
| **ENV_REQUIRED** | `package.json`, `package-lock.json` (adds `@supabase/ssr ^0.10.2`) |

Full inventory in `wip-file-inventory.tsv`.

### 3. Which files are unrelated and must remain untouched?

Files in the WIP that are **NOT in scope** for CR-C:

- `.github/workflows/cr-executor.yml.bak` — workflow backup (UNRELATED)
- `src/app/(main)/{rehome-a-dane,shelter-transfers,surrender}/page.original.tsx.bak` — page snapshots (BAK_SNAPSHOT, separate concern)
- `supabase/.temp/cli-latest` — local Supabase CLI cache (should be gitignored)
- `tsconfig.tsbuildinfo` — TS incremental cache (should be gitignored)

Per packet rule: do not touch unrelated WIP. These will not be modified, staged, or removed.

### 4. Does the Supabase WIP modify `src/middleware.ts`?

**Yes — only via `stash@{0}`.** The primary worktree's working-tree `src/middleware.ts` is **NOT modified** (it matches the branch HEAD `6413bb3`, which itself merged origin/main where the post-cutover middleware lives).

Critical detail: the stash diff is computed against an **older base** (pre-cutover, before PR #131 added 410 logic). Direct apply of `stash@{0}` would overwrite the post-cutover production middleware with pre-cutover middleware + Supabase auth, **removing the 410 isGone() check and narrowing the matcher** — a regression. See `middleware-diff-analysis.md`.

### 5. Does it modify `next.config.mjs`?

**No.** Neither `stash@{0}` nor any working-tree modification touches `next.config.mjs`. The legacy redirects (added by PR #131 and extended by CR-129/CR-132) remain intact.

### 6. Does it conflict with `gone-patterns.ts` or redirect behavior?

| Concern | Verdict |
|---|---|
| `gone-patterns.ts` direct edits | **No edits in WIP or stash.** |
| 410 isGone() short-circuit in middleware | **Yes, conflict with naive stash apply.** Reconciliation must layer Supabase auth onto post-cutover middleware, not replace it. |
| Redirect behavior in `next.config.mjs` | **No conflict** — redirects are not in middleware. |
| Broad matcher (excluding api/static/SEO) | **Yes, conflict with naive stash apply.** Stash uses narrow matcher `["/admin/:path*", "/apply/:path*", "/dashboard/:path*"]` which would stop middleware from running on dangerous WP paths and break 410. |

### 7. Does it require environment variables?

`updateSession` reads:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Per `CLAUDE.md`, both are already configured in Vercel (production + preview) and `.env.local`. **No new env vars required for the middleware change in isolation.**

For the broader applicant feature (data writes / admin operations), `SUPABASE_SERVICE_ROLE_KEY` is also documented as configured.

### 8. Does it require Supabase migrations?

**Yes, for the broader applicant feature.** The 9 untracked migrations under `supabase/migrations/2026042*.sql` define the schema (applications, application_events, screening_workflow, decision_intelligence, applicant_profiles, matching_system, placements, applications.created_at repair, core people/dogs/medical schema).

For the **middleware change in isolation**, no migrations are required (the middleware only calls `supabase.auth.getUser()` which is a hosted Supabase Auth API, schema-independent).

For Gate B "code-only middleware reconciliation" merging, migrations remain a **separate operational step** that must be coordinated before any applicant-facing route handlers go live.

### 9. Does it alter public routes, admin routes, auth routes, or API routes?

| Route class | Effect | Risk |
|---|---|---|
| Public (`/`, `/available-danes`, `/events`, `/adoption-successes`, etc.) | **No effect.** Reconciled middleware does not gate these. | NONE |
| Admin (`/admin/*`) | **No change** — passphrase gate preserved verbatim from origin/main. | NONE |
| Auth (`/auth/*`) | **NEW pages added** — login/register/callback. Middleware does not gate these (so unauthenticated users can reach them). | LOW |
| Apply (`/apply/*`) | **Auth-gated** by Supabase via `updateSession`. Currently `/apply/adopt` redirects to Jotform (per merged CR fix #123) — modifying this requires Lori/Ray decision. | MEDIUM (Jotform-vs-native-form policy decision) |
| Dashboard (`/dashboard/*`) | **NEW** — Supabase-auth-gated. New page from WIP. | LOW |
| API (`/api/*`) | **No middleware-level change** — matcher excludes `/api`. Each API route handles its own auth. | LOW |

### 10. Is reconciliation safe as code-only, or does it require database/env/deploy coordination?

**Code-only for the middleware change itself,** but **the broader applicant feature requires migration + deploy coordination**:

- **Middleware change alone** can land on `main` safely if it only adds the Supabase auth branch to middleware + introduces `src/lib/supabase/middleware.ts` + the `/auth/login` page (so redirect targets exist). This would not break any production behavior.
- **Applicant API + admin Supabase data flows** require the 9 migrations applied to the Supabase project AND the env vars (already configured) AND careful merging of all the dependent files together. This is not code-only.

**Recommendation:** Gate B should split into:
- **B-1 (small, safe):** middleware reconciliation + Supabase lib helpers + `/auth/login` page only. No applicant API, no admin panel changes, no migrations. Code-only PR.
- **B-2 (larger, coordinated):** applicant feature + admin panels + migrations as a separate packet with explicit operational coordination.

The CR-141 packet acceptance criteria suggest the operator (Ray/Atlas) decides how to split. Surfacing as a recommendation, not a decision.

## Stop conditions

Per the CR-141 packet, the following Gate A halt-and-surface conditions are checked:

| Stop condition | Triggered? | Notes |
|---|---|---|
| Correct Supabase-auth stash cannot be positively identified | NO | `stash@{0}` is unambiguous (subject explicitly says "Supabase auth extension") |
| Preserved WIP contains unrelated changes that cannot be isolated | NO | Unrelated files (.bak snapshots, build caches) are clearly separable |
| Middleware changes would weaken WordPress 410 protections | **YES — if naive stash apply is used** | Reconciliation plan addresses this; do NOT naively apply |
| `/wp-content/uploads/*` media allowlist cannot coexist with auth middleware | NO | uploads served via static, not gated by middleware; coexists |
| Public site routes become auth-gated | NO | Reconciled middleware preserves public access |
| Admin/auth expected behavior is unclear | PARTIAL | `/apply/adopt` Jotform-vs-native-form decision needs Ray/Lori input |
| Required Supabase env vars are missing | NO | already configured in Vercel + .env.local per CLAUDE.md |
| Required Supabase migrations are unverified | YES | 9 migrations are untracked and unapplied; affects broader feature, not middleware-only |
| Typecheck fails | NOT TESTED in Gate A | deferred to Gate B |
| Build fails | NOT TESTED in Gate A | deferred to Gate B |
| Local tests fail | NOT TESTED in Gate A | deferred to Gate B |
| Any command would require destructive stash operations | NO | All stash inspection used `--name-status` and `-p` only |
| Any change touches DNS / Cloudflare / Vercel domain / DMARC/SPF/DKIM/MX / GSC | NO | None of those touched |
| Any change overlaps with Misha Studio CRs | NO | Distinct workspace |

## Disposition recommendation

**`PASS-WITH-BLOCKERS`** — discovery complete, no source edits performed.

Blockers identified:

1. **Naive stash apply is unsafe** (would regress 410 protection). Gate B must use a manual layered reconciliation, not `git stash apply`.
2. **`/apply/adopt` Jotform-vs-native-form policy decision** needed before merging the modified `apply/adopt/page.tsx`. Currently CR-123 has it routed to Jotform; the WIP modifies it to a native flow.
3. **9 Supabase migrations are unapplied.** Required before applicant API + admin data routes function. Not a blocker for middleware-only Gate B.
4. **Branch posture decision** — the CR packet's Gate B initially recommends creating `fix/supabase-auth-middleware-reconcile` from `origin/main`. The active worktree has substantial WIP. Branch creation in a fresh worktree (Option A from the packet) is the safe path.

## Recommended next step

Before Gate B implementation, Ray/Atlas should decide:

- Whether to scope Gate B narrowly (middleware + minimal auth scaffolding only) or broadly (full applicant feature + migrations).
- Whether `/apply/adopt` should remain a Jotform redirect or become a native Supabase-backed form.
- Whether the 9 Supabase migrations should be applied to the production Supabase project as a separate operation, before or after Gate B PR.

These are policy decisions, not technical questions. Surfacing only.
