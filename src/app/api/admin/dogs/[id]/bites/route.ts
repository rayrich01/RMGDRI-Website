/**
 * Dog Bite Records API
 * POST /api/admin/dogs/[id]/bites — record bite incident with policy evaluation
 */
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { evaluateBitePolicy } from "@/lib/applications/bite-policy";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  // Get prior bite history for this dog
  const { data: priorBites } = await supabase
    .from("bite_records")
    .select("dunbar_level")
    .eq("dog_id", id);

  const priorLevel3Plus = (priorBites || []).filter(b => b.dunbar_level >= 3);

  // Evaluate against policy
  const evaluation = evaluateBitePolicy({
    dunbar_level: body.dunbar_level ?? 0,
    context: body.context || "unknown",
    aimed_at_face_neck: body.aimed_at_face_neck ?? false,
    is_defensive: body.is_defensive ?? false,
    is_puppy_play: body.is_puppy_play ?? false,
    is_accidental_breakup: body.is_accidental_breakup ?? false,
    prior_bite_count: priorLevel3Plus.length,
    prior_highest_level: Math.max(0, ...priorLevel3Plus.map(b => b.dunbar_level)),
  });

  // Insert bite record with policy evaluation
  const { data, error } = await supabase
    .from("bite_records")
    .insert({
      dog_id: id,
      bite_date: body.bite_date || null,
      dunbar_level: body.dunbar_level ?? 0,
      context: body.context || "unknown",
      bite_target: body.bite_target || "human",
      aimed_at_face_neck: body.aimed_at_face_neck ?? false,
      description: body.description || null,
      circumstances: body.circumstances || null,
      meets_exception: evaluation.exception_met,
      exception_type: evaluation.exception_type,
      board_vote_required: evaluation.board_vote_required,
      vet_eval_required: evaluation.vet_eval_required,
      behaviorist_eval_required: evaluation.behaviorist_eval_required,
      bloodwork_required: evaluation.bloodwork_required,
      reported_by: body.reported_by || null,
      notes: body.notes || null,
    })
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    record: data,
    policy_evaluation: evaluation,
  }, { status: 201 });
}
