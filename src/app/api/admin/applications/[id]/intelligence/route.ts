/**
 * Decision Intelligence API
 * TTP-RMGDRI-DECISION-INTELLIGENCE-001
 *
 * POST /api/admin/applications/[id]/intelligence — Generate new intelligence
 * GET  /api/admin/applications/[id]/intelligence — Get latest + history
 *
 * Advisory only. Never auto-applied to application_recommendations.
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { generateDecisionIntelligence } from "@/lib/applications/decision-engine";
import { logApplicationEvent } from "@/lib/applications/event-logger";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const intelligence = await generateDecisionIntelligence(id);

    // Persist to table (append-only)
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("application_decision_intelligence")
      .insert({
        application_id: id,
        source: intelligence.source,
        applicant_summary: intelligence.applicant_summary,
        validation_zones: intelligence.validation_zones,
        trust_signals: intelligence.trust_signals,
        risk_signals: intelligence.risk_signals,
        contradictions: intelligence.contradictions,
        acceptance_factors: intelligence.acceptance_factors,
        risk_factors: intelligence.risk_factors,
        denial_factors: intelligence.denial_factors,
        recommended_prompts: intelligence.recommended_prompts,
        rationale_summary: intelligence.rationale_summary,
        suggested_recommendation: intelligence.suggested_recommendation,
        confidence_score: intelligence.confidence_score,
        status_snapshot: intelligence.status_snapshot,
        input_snapshot: intelligence.input_snapshot,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log event
    logApplicationEvent({
      applicationId: id,
      eventType: "application_section_saved",
      actorType: "system",
      metadata: {
        action: "decision_intelligence_generated",
        suggested: intelligence.suggested_recommendation,
        confidence: intelligence.confidence_score,
      },
    });

    return NextResponse.json({ intelligence: data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("application_decision_intelligence")
    .select("*")
    .eq("application_id", id)
    .order("generated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    latest: data?.[0] || null,
    history: data || [],
  });
}
