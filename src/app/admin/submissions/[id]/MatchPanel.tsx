"use client";

import { useState } from "react";

interface Signal {
  dimension: string;
  label: string;
  detail: string;
}

interface MatchCandidate {
  id: string;
  dane_profile_id: string;
  compatibility_summary: string;
  fit_strengths: Signal[];
  fit_cautions: Signal[];
  hard_stops: Signal[];
  missing_information: Signal[];
  suggested_disposition: string;
  candidate_status: string;
  review_notes: string | null;
  reviewed_by: string | null;
}

const DISPOSITION_LABELS: Record<string, { label: string; color: string }> = {
  strong_candidate: { label: "Strong Candidate", color: "bg-green-100 text-green-800" },
  candidate_with_cautions: { label: "With Cautions", color: "bg-yellow-100 text-yellow-800" },
  hold_needs_review: { label: "Hold — Review", color: "bg-orange-100 text-orange-800" },
  not_recommended: { label: "Not Recommended", color: "bg-red-100 text-red-800" },
  insufficient_data: { label: "Insufficient Data", color: "bg-gray-100 text-gray-800" },
};

function SignalList({ signals, color }: { signals: Signal[]; color: string }) {
  if (signals.length === 0) return <span className="text-xs text-gray-400">None</span>;
  return (
    <ul className="space-y-0.5">
      {signals.map((s, i) => (
        <li key={i} className={`text-xs px-1.5 py-0.5 rounded ${color}`}>
          <span className="font-medium">{s.label}</span>
          <span className="opacity-70 ml-1">({s.dimension})</span>
        </li>
      ))}
    </ul>
  );
}

export default function MatchPanel({ applicantProfileId }: { applicantProfileId: string | null }) {
  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  async function loadCandidates() {
    if (!applicantProfileId) return;
    const res = await fetch(`/api/admin/matches?applicant_profile_id=${applicantProfileId}`);
    if (res.ok) {
      const { candidates: c } = await res.json();
      setCandidates(c || []);
    }
    setLoaded(true);
  }

  async function generateMatches() {
    if (!applicantProfileId) return;
    setGenerating(true);
    setError("");
    const res = await fetch("/api/admin/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicant_profile_id: applicantProfileId }),
    });
    if (res.ok) {
      const { candidates: c } = await res.json();
      setCandidates(c || []);
    } else {
      const { error: msg } = await res.json();
      setError(msg || "Match generation failed");
    }
    setGenerating(false);
  }

  if (!applicantProfileId) {
    return <p className="text-sm text-gray-500 italic">Generate an applicant profile first to enable matching.</p>;
  }

  if (!loaded) loadCandidates();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Match Candidates</h3>
        <button onClick={generateMatches} disabled={generating}
          className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50">
          {generating ? "Generating..." : candidates.length > 0 ? "Regenerate Matches" : "Generate Matches"}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

      {candidates.length === 0 && !generating && loaded && (
        <p className="text-sm text-gray-500 italic">No match candidates generated yet.</p>
      )}

      {candidates.map((c) => {
        const disp = DISPOSITION_LABELS[c.suggested_disposition] || DISPOSITION_LABELS.insufficient_data;
        return (
          <div key={c.id} className="bg-white border rounded-lg p-4 space-y-2">
            <div className="flex items-start justify-between">
              <p className="text-sm text-gray-800">{c.compatibility_summary}</p>
              <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-3 ${disp.color}`}>
                {disp.label}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
              <div>
                <p className="text-xs font-medium text-green-700 mb-1">Strengths ({c.fit_strengths.length})</p>
                <SignalList signals={c.fit_strengths} color="bg-green-50 text-green-800" />
              </div>
              <div>
                <p className="text-xs font-medium text-amber-700 mb-1">Cautions ({c.fit_cautions.length})</p>
                <SignalList signals={c.fit_cautions} color="bg-amber-50 text-amber-800" />
              </div>
              <div>
                <p className="text-xs font-medium text-red-700 mb-1">Hard Stops ({c.hard_stops.length})</p>
                <SignalList signals={c.hard_stops} color="bg-red-50 text-red-800" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-700 mb-1">Missing ({c.missing_information.length})</p>
                <SignalList signals={c.missing_information} color="bg-blue-50 text-blue-800" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-xs text-gray-500">
              <span>Status: {c.candidate_status}</span>
              {c.reviewed_by && <span>· Reviewed by: {c.reviewed_by}</span>}
            </div>
          </div>
        );
      })}

      {candidates.length > 0 && (
        <p className="text-xs text-gray-400 italic">
          Match candidates are advisory only. Placement decisions require human review and approval.
        </p>
      )}
    </div>
  );
}
