/**
 * Recommendation CRUD API
 * TTP-RMGDRI-SCREENING-VALIDATION-001
 *
 * GET  /api/admin/applications/[id]/recommendation — list recommendations
 * POST /api/admin/applications/[id]/recommendation — create recommendation
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { logApplicationEvent } from "@/lib/applications/event-logger";

const VALID_RECOMMENDATIONS = [
  "recommend_approved",
  "recommend_approved_with_conditions",
  "denied_with_remediation",
  "denied",
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("application_recommendations")
    .select("*")
    .eq("application_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recommendations: data });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  if (!body.recommendation || !VALID_RECOMMENDATIONS.includes(body.recommendation)) {
    return NextResponse.json(
      { error: "Invalid recommendation. Must be one of: " + VALID_RECOMMENDATIONS.join(", ") },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("application_recommendations")
    .insert({
      application_id: id,
      recommendation: body.recommendation,
      acceptance_factors: body.acceptance_factors || null,
      risk_flags: body.risk_flags || null,
      denial_factors: body.denial_factors || null,
      conditions: body.conditions || null,
      rationale: body.rationale || null,
      confidence_score: body.confidence_score ?? null,
      recommender: body.recommender || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  logApplicationEvent({
    applicationId: id,
    eventType: "application_section_saved",
    actorType: "admin",
    metadata: {
      action: "recommendation_recorded",
      recommendation: body.recommendation,
      recommender: body.recommender,
    },
  });

  return NextResponse.json({ recommendation: data }, { status: 201 });
}
