import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type SeedResult = {
  application_id: string;
  event_id: string;
};

export async function POST() {
  const url = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const appPayload = {
    type: "contact",
    status: "submitted",
    source: "admin",
    applicant_name: "TTP-0105 Test",
    applicant_email: "test@example.invalid",
    applicant_phone: "000-000-0000",
    applicant_profile: { purpose: "TTP-0105 smoke test" },
    internal_flags: { ttp: "TTP-0105" },
  };

  const { data: appRow, error: appErr } = await supabase
    .from("applications")
    .insert(appPayload)
    .select("id")
    .single();

  if (appErr || !appRow?.id) {
    return NextResponse.json(
      { error: "applications insert failed", details: appErr?.message ?? "unknown" },
      { status: 500 }
    );
  }

  const { data: evRow, error: evErr } = await supabase
    .from("application_events")
    .insert({
      application_id: appRow.id,
      event_type: "system",
      from_status: null,
      to_status: "submitted",
      actor_user_id: null,
      details: { message: "Seed created by TTP-0105" },
    })
    .select("id")
    .single();

  if (evErr || !evRow?.id) {
    return NextResponse.json(
      { error: "application_events insert failed", details: evErr?.message ?? "unknown", application_id: appRow.id },
      { status: 500 }
    );
  }

  const result: SeedResult = { application_id: appRow.id, event_id: evRow.id };
  return NextResponse.json(result, { status: 200 });
}
