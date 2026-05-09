/**
 * Vet Registry API
 * GET  /api/admin/vets — list vets
 * POST /api/admin/vets — create vet record
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("vet_registry")
    .select("*")
    .order("office_name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ vets: data });
}

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("vet_registry")
    .insert({
      vet_id: body.vet_id,
      office_name: body.office_name || "Unknown",
      address_street: body.address_street || null,
      address_city: body.address_city || null,
      address_state: body.address_state || null,
      address_zip: body.address_zip || null,
      phone: body.phone || null,
      email: body.email || null,
      website: body.website || null,
      specialty_services: body.specialty_services || null,
    })
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ vet: data }, { status: 201 });
}
