/**
 * Dane Profiles API
 * TTP-RMGDRI-MATCHING-SYSTEM-001
 *
 * GET  /api/admin/danes — list dane profiles
 * POST /api/admin/danes — create dane profile
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { logApplicationEvent } from "@/lib/applications/event-logger";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("dane_profiles")
    .select("id, name, age, sex, size, energy_level, active_for_matching, profile_status, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ danes: data });
}

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("dane_profiles")
    .insert({
      name: body.name || "Unnamed",
      sanity_id: body.sanity_id || null,
      age: body.age || null,
      sex: body.sex || null,
      size: body.size || null,
      breed: body.breed || null,
      weight: body.weight || null,
      energy_level: body.energy_level || null,
      temperament: body.temperament || [],
      behavior_profile: body.behavior_profile || {},
      medical_profile: body.medical_profile || {},
      training_profile: body.training_profile || {},
      environment_needs: body.environment_needs || {},
      household_fit: body.household_fit || {},
      constraints: body.constraints || {},
      strengths: body.strengths || [],
      risks: body.risks || [],
      placement_notes: body.placement_notes || null,
      active_for_matching: body.active_for_matching ?? false,
      profile_status: body.profile_status || "draft",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  logApplicationEvent({
    eventType: "application_section_saved",
    actorType: "admin",
    metadata: { action: "dane_profile_created", dane_id: data.id, name: data.name },
  });

  return NextResponse.json({ dane: data }, { status: 201 });
}
