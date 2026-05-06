import { NextRequest, NextResponse } from "next/server";
import { isGone } from "@/data/gone-patterns";

/**
 * Combined middleware:
 *
 *   1. 410 Gone for legacy URLs whose content was not migrated
 *      (CC-PACKET-RMGD-001 Phase B, 2026-05-05).
 *      Patterns live in src/data/gone-patterns.ts.
 *      Runs FIRST so 410 short-circuits before any auth or redirect work.
 *
 *   2. Admin route protection — passphrase-based session cookie on /admin/*.
 *
 * Edge-runtime safe: Set + RegExp lookups, no I/O, no Node-only APIs.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── 410 Gone (CC-PACKET-RMGD-001) ──
  if (isGone(pathname)) {
    return new NextResponse(null, { status: 410 });
  }

  // ── Admin route protection (passphrase) ──
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
  }

  return NextResponse.next();
}

/**
 * Matcher (CC-PACKET-RMGD-001 Phase B refinement 2):
 *
 * Run middleware on most content paths so the 410 branch can fire on legacy
 * URLs (including .html / .htm files). Exclude only true system/static paths
 * that must always pass through unmodified.
 *
 * Excluded prefixes:
 *   - _next/static, _next/image  → Next.js build output
 *   - api/                        → API routes (handled by their own logic)
 *   - favicon.ico                 → site favicon
 *   - robots.txt, sitemap.xml     → SEO crawler files
 *   - .well-known/                → discovery endpoints (nodeinfo, openid-config)
 *
 * NOT excluded: generic dotted paths. Legacy /Photos/foo.htm and /2001Donations.html
 * MUST flow through the middleware to be handled by the 410 branch.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api|favicon\\.ico|robots\\.txt|sitemap\\.xml|\\.well-known).*)",
  ],
};
