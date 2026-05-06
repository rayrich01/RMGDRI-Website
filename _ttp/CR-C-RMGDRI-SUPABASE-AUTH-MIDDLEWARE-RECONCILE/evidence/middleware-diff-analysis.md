# Middleware Diff Analysis — three-way comparison

**CR:** CR-C / Issue #141 — Supabase Auth Middleware Reconciliation
**Mode:** Gate A discovery — read-only inspection
**Generated:** 2026-05-06 UTC

## Three middleware sources

There are three distinct snapshots of `src/middleware.ts` to consider:

| Source | Reference | Behavior summary |
|---|---|---|
| **A — Pre-cutover (stash baseline)** | implicit base of `stash@{0}` (`a0517ff`) | Admin passphrase only on `/admin/*`. Narrow matcher `["/admin/:path*"]`. **No 410 logic.** |
| **B — Post-cutover production** | `origin/main:src/middleware.ts` (currently `f8e8132`) | 410 `isGone()` first → admin passphrase on `/admin/*` → next. Broad matcher excluding `_next/static`, `_next/image`, `api`, `favicon.ico`, `robots.txt`, `sitemap.xml`, `.well-known`. |
| **C — stash@{0} patch (Supabase auth extension)** | applied to source A | Admin passphrase + Supabase `updateSession()` for `/apply` and `/dashboard`. Matcher `["/admin/:path*", "/apply/:path*", "/dashboard/:path*"]`. **No 410 logic** (because A had none). |

## The reconciliation problem

The stash patch (C) was authored against pre-cutover (A). It does NOT account for the 410 logic that production (B) gained in PR #131 (`c93505c`). Applying stash@{0} would replace B with C, **wiping out**:

1. The `if (isGone(pathname)) return new NextResponse(null, { status: 410 });` short-circuit that protects every dangerous WordPress path (`/wp-admin/`, `/wp-login.php`, `/wp-json/*`, `/wp-includes/*`, `/wp-content/plugins/*`, `/wp-content/themes/*`, `/wp-content/cache/*`, non-upload `/wp-content/*`).
2. The broad matcher pattern, which is what makes the 410 fire on those paths in the first place.

The result of a naive apply would be a security regression: dangerous WP paths would no longer return 410 because the matcher would only run middleware on `/admin`, `/apply`, `/dashboard`. Production would silently lose its WordPress hardening.

## Required reconciled middleware (proposal — NOT for execution in Gate A)

For Gate B (when authorized), the reconciled middleware should look approximately like:

```ts
import { NextRequest, NextResponse } from "next/server";
import { isGone } from "@/data/gone-patterns";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // (1) 410 Gone — preserve cutover protection (FIRST, short-circuit)
  if (isGone(pathname)) {
    return new NextResponse(null, { status: 410 });
  }

  // (2) Admin route protection (passphrase) — preserve existing behavior
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname.startsWith("/api/admin/")) {
      return NextResponse.next();
    }
    const passphrase = (process.env.ADMIN_PASSPHRASE ?? "").trim();
    if (!passphrase) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
    const session = req.cookies.get("admin_session")?.value;
    if (!session || session !== passphrase) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // (3) Applicant Supabase auth (NEW) — for /apply, /dashboard
  if (pathname.startsWith("/apply") || pathname.startsWith("/dashboard")) {
    return await updateSession(req);
  }

  return NextResponse.next();
}

// KEEP origin/main's broad matcher (already covers /apply and /dashboard;
// excludes /api, _next, favicon, robots, sitemap, .well-known)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api|favicon\\.ico|robots\\.txt|sitemap\\.xml|\\.well-known).*)",
  ],
};
```

**Key points:**

1. Preserve the 410 isGone() check **at the very top** — order matters because it must fire before any auth gate or redirect.
2. Preserve the admin passphrase block exactly as it appears on origin/main.
3. Add the Supabase auth block **after** admin handling, not before.
4. **Keep origin/main's broad matcher**. The narrow matcher from stash@{0} would re-introduce the regression.
5. Note: middleware function becomes `async` because `updateSession` is async — must verify Edge runtime compatibility (it is, since `@supabase/ssr` is Edge-safe).

## Additional concerns surfaced

### `/api` exclusion in matcher
The broad matcher excludes `/api/*`. This means **API routes do not pass through middleware**, so:

- `/api/admin/*` — admin API endpoints already noop the passphrase gate (per origin/main `if (pathname === "/admin/login" || pathname.startsWith("/api/admin/")) return NextResponse.next();`). They're expected to handle auth internally.
- `/api/applications` (untracked, Supabase-backed applicant API) — would NOT be Supabase-auth-gated by middleware. If applicant API needs auth, it must be enforced inside route handlers via `createServerClient` server-side.

This is a potential gap but is consistent with the prior session's matcher. The Gate B implementation should explicitly decide whether `/api/applications` needs middleware-level auth (matcher refinement) or handler-level auth (status quo).

### Async middleware impact

The current production middleware is synchronous. Switching to async (required for Supabase auth) is a low-risk change, but:

- Every request that reaches the middleware now incurs an `await` — even pure-pass-through requests.
- The 410 short-circuit fires before the await, so dangerous-path traffic is unaffected.
- For public site traffic, the function is still effectively synchronous (it returns `NextResponse.next()` without any await on Supabase paths).

### `updateSession` redirect target

`src/lib/supabase/middleware.ts` redirects unauthenticated users to `/auth/login?redirect=<original-path>`. This requires the `/auth/login` page to exist on the deployed branch. The page exists in untracked WIP (`src/app/auth/login/`) but has not been merged to main. **Gate B must include the auth route files alongside the middleware change** to prevent broken redirects.

### Environment variable dependency

`updateSession` reads:
- `process.env.NEXT_PUBLIC_SUPABASE_URL`
- `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`

Both are documented in CLAUDE.md as already configured in Vercel (production + preview) and `.env.local`. **Already-present** — no new env vars required for the middleware itself.

### Database dependency

The auth middleware itself only calls `supabase.auth.getUser()` which works against the Supabase Auth service (always available for any Supabase project). However, the broader application code (`/api/applications`, applicant routes) will require the 9 Supabase migrations (see inventory):

```
20260420000000__applications_table.sql
20260420100000__application_events.sql
20260420200000__screening_workflow.sql
20260420300000__decision_intelligence.sql
20260420400000__applicant_profiles.sql
20260420500000__matching_system.sql
20260420600000__placements.sql
20260421000000__repair_applications_created_at.sql
20260423000000__core_schema_people_dogs_medical.sql
```

These must be applied to the Supabase project (preview AND production) before the application API will function. Migration application is a separate operational step from code merge.

## Conflict map vs production behavior (cutover protections)

| Production behavior | Reconciled middleware preserves? | Risk if naive stash apply |
|---|---|---|
| `/wp-content/uploads/*` returns 200 (CR-137) | YES — uploads aren't in `gone-patterns.ts`; middleware passes through | NO direct middleware conflict (handled by Next.js static serving + the public/wp-content/ allowlist) |
| Dangerous WP paths return 410 | YES — `isGone()` retained | **REGRESSION** — naive stash apply removes the check entirely |
| Legacy redirects (`/jumbo` etc.) | YES — redirects live in `next.config.mjs`, not middleware; unaffected | No middleware conflict |
| `/robots.txt` and `/sitemap.xml` return 200 | YES — explicitly excluded from matcher | YES with stash apply (matcher narrows to /admin /apply /dashboard, so /robots and /sitemap fall through to default Next.js handling — still 200, but middleware-level guarantees lost) |
| Public route access (`/`, `/available-danes`, etc.) | YES — neither origin/main nor reconciled middleware gates these | No conflict |
| Admin passphrase on `/admin/*` | YES — preserved verbatim | Still works after naive apply (stash preserved this branch) |

## Summary

- **The naive `git stash apply stash@{0}` is unsafe.** It would replace post-cutover middleware with pre-cutover middleware plus Supabase auth, removing the 410 protection.
- **A clean reconciliation is straightforward** — it's a layering exercise (410 check FIRST, then admin, then Supabase) plus keeping origin/main's broad matcher.
- **All required Supabase library files exist as untracked WIP** in the primary worktree (`src/lib/supabase/{admin,browser,middleware,server}.ts`).
- **All required auth pages exist as untracked WIP** (`src/app/auth/{login,register,callback}/`).
- **No additional env vars required** for the middleware itself.
- **9 Supabase migrations are required** before applicant-facing code (apply/dashboard/api) becomes operational, but they are not blockers for the middleware change in isolation.
