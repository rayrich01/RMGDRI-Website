/**
 * People Registry API
 * GET  /api/admin/people — list people (with optional tag filter)
 * POST /api/admin/people — create person
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function nextPeopleId(current: string | null): string {
  if (!current) return "P000001";
  const num = parseInt(current.replace("P", ""), 10);
  return `P${String(num + 1).padStart(6, "0")}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const supabase = createAdminSupabaseClient();

  let query = supabase
    .from("people")
    .select("id, people_id, name, email, phone, tags, experience, last_home_check_date, created_at")
    .order("created_at", { ascending: false });

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ people: data });
}

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  // Auto-generate people_id
  const { data: latest } = await supabase
    .from("people")
    .select("people_id")
    .order("people_id", { ascending: false })
    .limit(1)
    .single();

  const peopleId = nextPeopleId(latest?.people_id || null);

  const { data, error } = await supabase
    .from("people")
    .insert({
      people_id: peopleId,
      name: body.name || "Unknown",
      phone: body.phone || null,
      email: body.email || null,
      age: body.age || null,
      experience: body.experience || null,
      training_experience: body.training_experience || null,
      num_cats: body.num_cats ?? null,
      num_dogs: body.num_dogs ?? null,
      num_kids: body.num_kids ?? null,
      kids_ages: body.kids_ages || null,
      house_type: body.house_type || null,
      type_of_dog_must_haves: body.type_of_dog_must_haves || null,
      wish_lists: body.wish_lists || null,
      tags: body.tags || [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ person: data }, { status: 201 });
}
