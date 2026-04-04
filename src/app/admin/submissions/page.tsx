import Link from "next/link";
import { Suspense } from "react";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getFormTypeLabel } from "@/lib/forms/registry";
import SubmissionFilters from "./SubmissionFilters";

export const dynamic = "force-dynamic";

/* ── helpers ─────────────────────────────────────────────────────────── */

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

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    submitted: "bg-blue-100 text-blue-800",
    reviewing: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    needs_clarification: "bg-orange-100 text-orange-800",
  };
  const cls = colors[status] ?? "bg-gray-100 text-gray-800";
  const label = status === "needs_clarification" ? "Needs Clarification" : status;
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

/* ── types ────────────────────────────────────────────────────────────── */

interface Submission {
  id: string;
  type: string;
  status: string;
  submitted_at: string | null;
  applicant_name: string | null;
  applicant_email: string | null;
  applicant_profile: {
    form_type?: string;
    submitted_at?: string;
    type?: string;
    payload?: { application_type?: string };
    [key: string]: unknown;
  } | null;
  internal_flags: {
    form_type?: string;
    [key: string]: unknown;
  } | null;
}

/** Determine if a submission is adopt, foster, or other */
function getApplicationCategory(s: Submission): "adopt" | "foster" | "other" {
  // Check top-level type first (set by intake submit)
  if (s.type === "adopt") return "adopt";
  if (s.type === "foster") return "foster";
  // Check applicant_profile.type (also set by intake)
  const profileType = s.applicant_profile?.type;
  if (profileType === "adopt") return "adopt";
  if (profileType === "foster") return "foster";
  // Check payload.application_type (set by full adoption-foster form)
  const payload = s.applicant_profile?.payload;
  const appType = payload?.application_type;
  if (appType === "adopt" || appType === "both") return "adopt";
  if (appType === "foster") return "foster";
  // Check form_type string
  const formType = s.internal_flags?.form_type ?? s.applicant_profile?.form_type;
  if (typeof formType === "string" && formType.includes("adopt")) return "adopt";
  if (typeof formType === "string" && formType.includes("foster")) return "foster";
  return "other";
}

/* ── page ─────────────────────────────────────────────────────────────── */

interface PageProps {
  searchParams: Promise<{ type?: string; status?: string }>;
}

export default async function SubmissionsListPage({ searchParams }: PageProps) {
  const { type: typeFilter, status: statusFilter } = await searchParams;
  const supabase = createAdminSupabaseClient();

  let query = supabase
    .from("applications")
    .select(
      "id, type, status, submitted_at, applicant_name, applicant_email, applicant_profile, internal_flags"
    )
    .order("submitted_at", { ascending: false })
    .limit(200);

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800 text-sm">Failed to load submissions: {error.message}</p>
      </div>
    );
  }

  let submissions: Submission[] = data ?? [];

  // Type filter (application category is inside JSONB, filtered client-side)
  if (typeFilter && typeFilter !== "all") {
    submissions = submissions.filter((s) => getApplicationCategory(s) === typeFilter);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Form Submissions</h1>
        <span className="text-sm text-gray-500">{submissions.length} results</span>
      </div>

      <Suspense>
        <SubmissionFilters />
      </Suspense>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No submissions match the current filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((s) => {
                  const formType = s.internal_flags?.form_type ?? s.applicant_profile?.form_type ?? s.type;
                  const dateStr = s.applicant_profile?.submitted_at ?? s.submitted_at;
                  const cat = getApplicationCategory(s);
                  const catLabel = cat === "adopt" ? "Adoption" : cat === "foster" ? "Foster" : getFormTypeLabel(formType as string);

                  return (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">{s.applicant_name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.applicant_email || "—"}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                          cat === "adopt" ? "bg-emerald-100 text-emerald-800" :
                          cat === "foster" ? "bg-purple-100 text-purple-800" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {catLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(dateStr as string | null)}</td>
                      <td className="px-4 py-3">{statusBadge(s.status)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/submissions/${s.id}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          Review →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
