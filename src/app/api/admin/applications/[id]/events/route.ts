/**
 * Admin Application Events API — audit trail for a specific application
 *
 * GET /api/admin/applications/[id]/events
 * Returns all lifecycle events for admin review.
 */
import { NextResponse } from "next/server";
import { getApplicationEvents } from "@/lib/applications/event-logger";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const events = await getApplicationEvents(id);

  return NextResponse.json({ events });
}
