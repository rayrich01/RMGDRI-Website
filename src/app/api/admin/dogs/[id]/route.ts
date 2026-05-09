/**
 * Dog Detail API
 * GET   /api/admin/dogs/[id] — full dog record with medical, bites, fosters
 * PATCH /api/admin/dogs/[id] — update dog fields
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();

  const { data: dog, error } = await supabase
    .from("dogs").select("*").eq("id", id).single();

  if (error || !dog) return NextResponse.json({ error: "Dog not found" }, { status: 404 });

  // Fetch related records
  const [medical, bites, fosters] = await Promise.all([
    supabase.from("medical_records").select("*").eq("dog_id", id).order("created_at", { ascending: false }),
    supabase.from("bite_records").select("*").eq("dog_id", id).order("bite_date", { ascending: false }),
    supabase.from("foster_assignments").select("*, people:foster_people_id(name, people_id)").eq("dog_id", id).order("start_date", { ascending: false }),
  ]);

  return NextResponse.json({
    dog,
    medical_records: medical.data || [],
    bite_records: bites.data || [],
    foster_assignments: fosters.data || [],
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  // Allow updating any dog field
  const { data, error } = await supabase
    .from("dogs").update(body).eq("id", id).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dog: data });
}
