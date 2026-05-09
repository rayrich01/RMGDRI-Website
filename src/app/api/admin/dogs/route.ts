/**
 * Dogs Registry API
 * GET  /api/admin/dogs — list dogs
 * POST /api/admin/dogs — create dog record
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const supabase = createAdminSupabaseClient();

  let query = supabase
    .from("dogs")
    .select("id, dane_id, name, status, sex, age_text, weight_lbs, state_of_foster, date_in, created_at")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dogs: data });
}

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("dogs")
    .insert({
      name: body.name || "Unnamed",
      dane_id: body.dane_id || null,
      intake_id: body.intake_id || null,
      status: body.status || "UE",
      color: body.color || null,
      sex: body.sex || null,
      ears: body.ears || null,
      dob: body.dob || null,
      age_text: body.age_text || null,
      weight_lbs: body.weight_lbs ?? null,
      date_in: body.date_in || null,
      state_of_origin: body.state_of_origin || null,
      surrender_type: body.surrender_type || null,
      state_of_foster: body.state_of_foster || null,
      microchip_number: body.microchip_number || null,
      special_needs_notes: body.special_needs_notes || null,
      comments: body.comments || null,
      transport_in: body.transport_in || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dog: data }, { status: 201 });
}
