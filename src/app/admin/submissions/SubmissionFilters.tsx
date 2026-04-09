"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { key: "all", label: "All Submissions" },
  { key: "adopt", label: "Adoption" },
  { key: "foster", label: "Foster" },
  { key: "other", label: "Other Forms" },
] as const;

const STATUS_OPTIONS = [
  { key: "all", label: "All" },
  { key: "submitted", label: "Pending" },
  { key: "screening", label: "Screening" },
  { key: "needs_clarification", label: "Clarification" },
  { key: "approved", label: "Approved" },
  { key: "foster_approved", label: "Foster" },
  { key: "denied", label: "Denied" },
  { key: "withdrawn", label: "Withdrawn" },
] as const;

export default function SubmissionFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = params.get("type") || "all";
  const activeStatus = params.get("status") || "all";

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "all") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    router.push(`/admin/submissions?${next.toString()}`);
  }

  return (
    <div className="mb-6 space-y-3">
      {/* Type tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter("type", tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status:
        </span>
        <div className="flex gap-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter("status", opt.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeStatus === opt.key
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
