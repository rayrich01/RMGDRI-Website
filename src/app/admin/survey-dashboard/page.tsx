import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const RATING_LABELS: Record<string, string> = {
  communication: "Communication",
  scheduling: "Scheduling",
  leadership_support: "Leadership Support",
  tools_preparedness: "Tools & Preparedness",
  event_experience: "Event Experience",
  raise_concerns: "Comfort Raising Concerns",
  valued: "Feeling Valued",
  overall: "Overall Satisfaction",
};

function ratingBar(avg: number) {
  const pct = (avg / 5) * 100;
  const color =
    avg >= 4 ? "bg-emerald-500" : avg >= 3 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-10 text-right">
        {avg.toFixed(1)}
      </span>
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

interface SurveyResponse {
  id: string;
  submitted_at: string | null;
  applicant_profile: {
    payload?: {
      ratings?: Record<string, string>;
      role?: string;
      best_part?: string;
      improvement_suggestions?: string;
      average_score?: string;
    };
  } | null;
}

export default async function SurveyDashboardPage() {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("applications")
    .select("id, submitted_at, applicant_profile")
    .eq("type", "volunteer_survey")
    .order("submitted_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800 text-sm">Failed to load surveys: {error.message}</p>
      </div>
    );
  }

  const responses: SurveyResponse[] = data ?? [];

  // Compute aggregates
  const ratingKeys = Object.keys(RATING_LABELS);
  const aggregates: Record<string, { sum: number; count: number }> = {};
  for (const key of ratingKeys) {
    aggregates[key] = { sum: 0, count: 0 };
  }

  const roleCounts: Record<string, number> = {};

  for (const r of responses) {
    const payload = r.applicant_profile?.payload;
    if (!payload?.ratings) continue;
    for (const key of ratingKeys) {
      const val = Number(payload.ratings[key] || 0);
      if (val > 0) {
        aggregates[key].sum += val;
        aggregates[key].count += 1;
      }
    }
    const role = payload.role || "Not specified";
    roleCounts[role] = (roleCounts[role] || 0) + 1;
  }

  const overallAvg =
    aggregates.overall.count > 0
      ? aggregates.overall.sum / aggregates.overall.count
      : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Volunteer Satisfaction Survey Dashboard
      </h1>

      {responses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No survey responses yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Share the survey at: /volunteer-survey
          </p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Total Responses
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {responses.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Overall Satisfaction
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {overallAvg > 0 ? `${overallAvg.toFixed(1)}/5` : "—"}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Role Breakdown
              </p>
              <div className="text-sm text-gray-700 space-y-1 mt-1">
                {Object.entries(roleCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([role, count]) => (
                    <div key={role} className="flex justify-between">
                      <span>{role}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Aggregate ratings */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Average Ratings ({responses.length} responses)
            </h2>
            <div className="space-y-3">
              {ratingKeys.map((key) => {
                const avg =
                  aggregates[key].count > 0
                    ? aggregates[key].sum / aggregates[key].count
                    : 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{RATING_LABELS[key]}</span>
                      <span className="text-gray-400 text-xs">
                        {aggregates[key].count} responses
                      </span>
                    </div>
                    {ratingBar(avg)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual responses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Individual Responses
            </h2>
            <div className="space-y-4">
              {responses.map((r) => {
                const payload = r.applicant_profile?.payload;
                if (!payload) return null;
                const avg = payload.average_score || "—";
                return (
                  <div
                    key={r.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-sm font-semibold text-gray-800">
                          {payload.role || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          Avg: {avg}/5
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(r.submitted_at)}
                      </span>
                    </div>

                    {/* Compact ratings */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {ratingKeys.map((key) => {
                        const val = Number(payload.ratings?.[key] || 0);
                        const bg =
                          val >= 4
                            ? "bg-emerald-100 text-emerald-800"
                            : val >= 3
                            ? "bg-yellow-100 text-yellow-800"
                            : val > 0
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-500";
                        return (
                          <span
                            key={key}
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${bg}`}
                            title={RATING_LABELS[key]}
                          >
                            {RATING_LABELS[key].split(" ")[0]}: {val || "—"}
                          </span>
                        );
                      })}
                    </div>

                    {payload.best_part && (
                      <div className="text-sm text-gray-700 mb-2">
                        <span className="font-medium text-gray-500">
                          Best part:{" "}
                        </span>
                        {payload.best_part}
                      </div>
                    )}
                    {payload.improvement_suggestions && (
                      <div className="text-sm text-gray-700">
                        <span className="font-medium text-gray-500">
                          Improve:{" "}
                        </span>
                        {payload.improvement_suggestions}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
