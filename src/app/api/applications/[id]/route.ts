/**
 * Application Detail API
 * TTP-RMGDRI-APPLICATION-INGEST-001
 *
 * GET /api/applications/[id] — Get application (owner only via RLS)
 * PATCH /api/applications/[id] — Autosave / section save (draft only)
 * POST /api/applications/[id]/submit — Submit application
 */
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logApplicationEvent } from "@/lib/applications/event-logger";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  return NextResponse.json({ application: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Only update the data field (autosave / section save)
  const { data, error } = await supabase
    .from("applications")
    .update({ data: body.data })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "draft")
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Application not found or not editable" },
      { status: 404 }
    );
  }

  // Log save event (non-blocking)
  const saveType = body.section ? "application_section_saved" : "application_autosaved";
  logApplicationEvent({
    applicationId: id,
    eventType: saveType as "application_autosaved" | "application_section_saved",
    actorId: user.id,
    metadata: body.section ? { section: body.section } : {},
  });

  return NextResponse.json({ application: data });
}
