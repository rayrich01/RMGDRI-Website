# CR-C Gate A — Closeout

**CR:** Issue #141
**Mode executed:** Gate A only — discovery / evidence
**Operator:** Claude Code
**Date:** 2026-05-06 UTC
**Evidence worktree:** `_worktrees/crc` on branch `hotfix/141-cr-c-supabase-auth-middleware-evidence` (off `origin/main` @ `f8e8132`) — **NOT committed, NOT pushed**

## Final Gate A disposition

**`PASS-WITH-BLOCKERS`** — discovery complete; no source edits, no commits, no push, no PR, no destructive stash operations.

## What was done

- Inventoried the WIP working tree (20 modified tracked + 38 untracked items).
- Identified `stash@{0}` as the canonical Supabase-auth middleware stash (read-only inspection via `git stash show --name-status` and `-p`).
- Read origin/main's current `src/middleware.ts` via `git show origin/main:src/middleware.ts` (no checkout).
- Three-way diffed pre-cutover middleware (stash baseline) vs post-cutover production vs stash patch.
- Inspected the Supabase library helpers (untracked) and auth pages (untracked).
- Catalogued 9 untracked Supabase migrations.
- Confirmed `@supabase/ssr ^0.10.2` is the only new dependency added by the package.json modification.
- Catalogued unrelated WIP (.bak snapshots, build caches) so they can be untouched.

## What was NOT done (per packet rules)

- No source code edits
- No commits, no push, no PR
- No `git stash apply` / `pop` / `drop` (only `--name-status` and `--patch` read inspection)
- No `git reset --hard`, no `git clean`
- No DNS / Cloudflare / Vercel / Google Workspace / mail-auth changes
- No Sanity mutations
- No Supabase migrations applied
- No env var changes
- No typecheck or build (Gate A is discovery; build/test deferred to Gate B)

## Headline finding

**Naive `git stash apply stash@{0}` is unsafe and would regress production 410 protection.** The stash patch is anchored to pre-cutover middleware (admin-only matcher, no 410 logic). Direct apply replaces post-cutover middleware with pre-cutover middleware + Supabase auth, removing both:

- The `if (isGone(pathname)) return new NextResponse(null, { status: 410 });` short-circuit
- The broad matcher `/((?!_next/static|_next/image|api|favicon\\.ico|robots\\.txt|sitemap\\.xml|\\.well-known).*)` that makes the 410 fire on dangerous WP paths

Reconciliation must be a **manual layering**, not a stash apply. A specific reconciliation pattern is documented in `middleware-diff-analysis.md`.

## Evidence artifacts produced

| File | Purpose | Lines |
|---|---|---|
| `gate-a-discovery.md` | Main discovery report — 10 Gate A questions + recommendations | ~190 |
| `wip-file-inventory.tsv` | Per-file inventory: path, status, source, category, reconcile_action, risk, notes | 53 |
| `middleware-diff-analysis.md` | Three-way middleware comparison + proposed reconciled middleware (NOT for execution) | ~140 |
| `raw-discovery.txt` | Raw output of git status / log / stash list / diffs / show commands | 130 |
| `gate-a-closeout.md` | This file | — |

All files live under `_worktrees/crc/_ttp/CR-C-RMGDRI-SUPABASE-AUTH-MIDDLEWARE-RECONCILE/evidence/`. **Nothing committed. Nothing pushed.**

## Identified blockers

1. **Reconciliation requires manual layering, not stash apply** (otherwise regresses 410 protection).
2. **`/apply/adopt` Jotform-vs-native-form policy decision** — the modified `src/app/apply/adopt/page.tsx` likely re-wires from the Jotform redirect (added by merged CR fix #123) to a native Supabase-backed flow. Lori/Ray must decide which path stays.
3. **9 Supabase migrations are unapplied.** Required for the broader applicant feature (API + admin data flows). Not a blocker for middleware-only Gate B if scoped narrowly.
4. **Gate B scope decision** — whether to implement broadly (full applicant feature + migrations) or narrowly (middleware + minimal auth scaffolding only).

## Recommended Gate B scoping options

| Option | Scope | Risk | Operational cost |
|---|---|---|---|
| **B-1 (narrow)** | Middleware reconciliation + 4 Supabase lib helpers + `/auth/{login,register,callback}` pages only | LOW | None beyond standard PR flow |
| **B-2 (full)** | B-1 + applicant API + admin panels + migrations | MEDIUM-HIGH | Requires Supabase migration application (preview AND production), Lori-side Jotform decision, larger preview verification |

Surfacing options only — not making the choice.

## Compliance with CR-C scope guards

- ✅ No source code edits
- ✅ No commits / pushes / PRs
- ✅ No destructive stash operations (read-only inspection only)
- ✅ No `git reset --hard`, `git clean`
- ✅ No DNS / Cloudflare / Vercel changes
- ✅ No CR-A or CR-B execution gates touched
- ✅ No Misha CR execution
- ✅ Primary worktree WIP preserved untouched (45 entries unchanged)
- ✅ All 19 stashes preserved
- ✅ Evidence worktree separate from primary; uncommitted

## Next-step authorization gate

**Halt before Gate B.** Awaiting Ray/Atlas authorization for:

1. Gate B scope (B-1 narrow vs B-2 full)
2. `/apply/adopt` Jotform-vs-native decision
3. Branch posture (the CR packet recommends `fix/supabase-auth-middleware-reconcile` from `origin/main`; the existing evidence worktree branch `hotfix/141-cr-c-supabase-auth-middleware-evidence` could be reused or replaced)
