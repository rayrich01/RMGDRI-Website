import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/auth
 *
 * Validates the passphrase and sets an httpOnly session cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const passphrase = String(body.passphrase ?? "").trim();

    const expected = (process.env.ADMIN_PASSPHRASE ?? "").trim();
    if (!expected) {
      return NextResponse.json(
        { error: "Admin access is not configured." },
        { status: 503 }
      );
    }

    if (passphrase !== expected) {
      return NextResponse.json(
        { error: "Invalid passphrase." },
        { status: 401 }
      );
    }

    // Set session cookie — 8 hours
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_session", passphrase, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Bad request." },
      { status: 400 }
    );
  }
}
