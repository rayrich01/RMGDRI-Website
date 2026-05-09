/**
 * Application Events API — logs auth and lifecycle events
 *
 * POST /api/applications/events — Log an event from the client
 * Used for applicant_login and applicant_registration events
 * that originate client-side.
 */
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logApplicationEvent, ApplicationEventType } from "@/lib/applications/event-logger";

const ALLOWED_CLIENT_EVENTS: ApplicationEventType[] = [
  "applicant_login",
  "applicant_registration",
];

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const eventType = body.event_type as ApplicationEventType;

  if (!ALLOWED_CLIENT_EVENTS.includes(eventType)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  await logApplicationEvent({
    applicationId: body.application_id || null,
    eventType,
    actorId: user.id,
    metadata: body.metadata || {},
  });

  return NextResponse.json({ ok: true });
}
