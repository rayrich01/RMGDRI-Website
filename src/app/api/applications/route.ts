/**
 * Application Ingest API
 * TTP-RMGDRI-APPLICATION-INGEST-001
 *
 * POST /api/applications — Create draft application
 * GET /api/applications — List user's applications
 */
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logApplicationEvent } from "@/lib/applications/event-logger";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const type = body.type || "adopt";

  if (!["adopt", "foster"].includes(type)) {
    return NextResponse.json({ error: "Invalid application type" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("applications")
    .insert({
      user_id: user.id,
      type,
      status: "draft",
      data: body.data || {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log event (non-blocking)
  logApplicationEvent({
    applicationId: data.id,
    eventType: "application_created",
    actorId: user.id,
    metadata: { type },
  });

  return NextResponse.json({ application: data }, { status: 201 });
}

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("applications")
    .select("id, type, status, created_at, updated_at, submitted_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ applications: data });
}
