/**
 * POST /api/forms/volunteer-survey/submit
 *
 * Anonymous Volunteer Satisfaction Survey submission handler.
 * - Stores response in Supabase applications table (type: "volunteer_survey")
 * - Sends email notification to Lori@rmgreatdane.org
 * - No identity fields collected — anonymous by design
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/* ── Rate limiter ── */
const hits = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const log = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  log.push(now);
  hits.set(ip, log);
  return log.length > 5;
}

/* ── Email helper ── */
async function sendEmailNotification(data: Record<string, unknown>) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("[volunteer-survey] RESEND_API_KEY not set — skipping email");
    return;
  }

  const ratings = (data.ratings ?? {}) as Record<string, string>;
  const ratingLabels: Record<string, string> = {
    communication: "Communication clarity",
    scheduling: "Scheduling & coordination",
    leadership_support: "Leadership support",
    tools_preparedness: "Tools & preparedness",
    event_experience: "Event experience",
    raise_concerns: "Comfort raising concerns",
    valued: "Feeling valued",
    overall: "Overall satisfaction",
  };

  const ratingLines = Object.entries(ratingLabels)
    .map(([key, label]) => `${label}: ${ratings[key] || "—"}/5`)
    .join("\n");

  const avgScore =
    Object.values(ratings).length > 0
      ? (
          Object.values(ratings).reduce((s, v) => s + Number(v || 0), 0) /
          Object.values(ratings).length
        ).toFixed(1)
      : "N/A";

  const body = `New Volunteer Satisfaction Survey Response

Role: ${data.role || "Not specified"}
Average Score: ${avgScore}/5
Submitted: ${new Date().toLocaleString("en-US", { timeZone: "America/Denver" })}

--- Ratings ---
${ratingLines}

--- What they enjoy most ---
${data.best_part || "(no response)"}

--- Improvement suggestions ---
${data.improvement_suggestions || "(no response)"}
`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "RMGDRI Surveys <surveys@rmgreatdane.org>",
        to: ["Lori@rmgreatdane.org"],
        subject: `Volunteer Survey Response — ${avgScore}/5 avg (${data.role || "Anonymous"})`,
        text: body,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[volunteer-survey] Email send failed:", res.status, err);
    }
  } catch (err) {
    console.error("[volunteer-survey] Email send error:", err);
  }
}

/* ── Handler ── */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions — please wait." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // Validate ratings
  const ratings = body.ratings as Record<string, string> | undefined;
  if (!ratings || typeof ratings !== "object") {
    return NextResponse.json(
      { ok: false, error: "Ratings are required" },
      { status: 400 }
    );
  }

  const requiredKeys = [
    "communication",
    "scheduling",
    "leadership_support",
    "tools_preparedness",
    "event_experience",
    "raise_concerns",
    "valued",
    "overall",
  ];
  const missing = requiredKeys.filter(
    (k) => !ratings[k] || !["1", "2", "3", "4", "5"].includes(ratings[k])
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Missing or invalid ratings: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  // Persist to Supabase
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json(
      { ok: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const avgScore =
    Object.values(ratings).reduce((s, v) => s + Number(v), 0) /
    Object.values(ratings).length;

  const insertData = {
    type: "volunteer_survey",
    status: "submitted",
    source: "web_form",
    applicant_name: null, // anonymous
    applicant_email: null, // anonymous
    applicant_phone: null, // anonymous
    submitted_at: new Date().toISOString(),
    applicant_profile: {
      form_key: "volunteer-satisfaction-survey-v1",
      anonymous: true,
      submitted_at: new Date().toISOString(),
      payload: {
        ratings,
        role: body.role || "Prefer not to say",
        best_part: body.best_part || "",
        improvement_suggestions: body.improvement_suggestions || "",
        average_score: avgScore.toFixed(1),
      },
    },
    internal_flags: {
      form_type: "volunteer-satisfaction-survey-v1",
      anonymous: true,
    },
  };

  const { data: row, error } = await supabase
    .from("applications")
    .insert(insertData)
    .select("id")
    .single();

  if (error || !row?.id) {
    console.error("[volunteer-survey] Insert failed:", error?.message);
    return NextResponse.json(
      { ok: false, error: "Failed to save response" },
      { status: 500 }
    );
  }

  // Send email notification (non-blocking — don't fail the submission)
  sendEmailNotification(body).catch((err) =>
    console.error("[volunteer-survey] Email error:", err)
  );

  return NextResponse.json({ ok: true, id: row.id });
}
