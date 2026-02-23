import { NextRequest, NextResponse } from "next/server";

/**
 * Admin route protection middleware.
 *
 * Checks for an `admin_session` cookie on all /admin/* routes
 * (except /admin/login). Redirects to /admin/login when missing or invalid.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page and auth API routes through without a cookie
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/")
  ) {
    return NextResponse.next();
  }

  const passphrase = process.env.ADMIN_PASSPHRASE;
  if (!passphrase) {
    // Admin not configured — block access
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

export const config = {
  matcher: ["/admin/:path*"],
};
