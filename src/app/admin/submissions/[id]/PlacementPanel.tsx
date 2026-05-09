"use client";

import { useState, useEffect } from "react";

interface Placement {
  id: string;
  match_candidate_id: string;
  placement_status: string;
  approved_by: string | null;
  approved_at: string | null;
  adoption_agreement_status: string;
  behavioral_addendum_status: string;
  medical_addendum_status: string;
  agreement_sent_at: string | null;
  agreement_signed_at: string | null;
  ready_for_transfer_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  notes: string | null;
  created_at: string;
  [key: string]: unknown;
}

const STATUS_FLOW = [
  { value: "proposed", label: "Proposed", color: "bg-gray-100 text-gray-800" },
  { value: "under_review", label: "Under Review", color: "bg-blue-100 text-blue-800" },
  { value: "approved", label: "Approved", color: "bg-green-100 text-green-800" },
  { value: "agreement_pending", label: "Agreement Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "agreement_signed", label: "Agreement Signed", color: "bg-emerald-100 text-emerald-800" },
  { value: "ready_for_transfer", label: "Ready for Transfer", color: "bg-indigo-100 text-indigo-800" },
  { value: "completed", label: "Completed", color: "bg-green-200 text-green-900" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const AGR_LABELS: Record<string, string> = {
  not_required: "Not Required", pending: "Pending", sent: "Sent", signed: "Signed",
};

interface PlacementPanelProps {
  matchCandidateIds: string[];
  applicationId: string;
}

export default function PlacementPanel({ matchCandidateIds, applicationId }: PlacementPanelProps) {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  async function loadPlacements() {
    const res = await fetch("/api/admin/placements");
    if (res.ok) {
      const { placements: all } = await res.json();
      // Filter to this application's match candidates
      setPlacements(all.filter((p: { match_candidate_id: string }) =>
        matchCandidateIds.includes(p.match_candidate_id)));
    }
    setLoaded(true);
  }

  useEffect(() => { loadPlacements(); }, []);

  async function createPlacement(matchId: string) {
    setCreating(true);
    setError("");
    const res = await fetch("/api/admin/placements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ match_candidate_id: matchId }),
    });
    if (res.ok) {
      await loadPlacements();
      setMsg("Placement created");
    } else {
      const { error: e, failures } = await res.json();
      setError(failures ? failures.join("; ") : e || "Failed");
    }
    setCreating(false);
    setTimeout(() => setMsg(""), 3000);
  }

  async function updatePlacement(placementId: string, updates: Record<string, unknown>) {
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/placements/${placementId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      await loadPlacements();
      setMsg("Updated");
    } else {
      const { error: e, failures } = await res.json();
      setError(failures ? failures.join("; ") : e || "Failed");
    }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  }

  if (!loaded) return <p className="text-sm text-gray-500">Loading placements...</p>;

  const hasPlacement = placements.length > 0;
  const unplacedMatches = matchCandidateIds.filter(
    mid => !placements.some(p => p.match_candidate_id === mid)
  );

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Placements</h3>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}
      {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">{msg}</div>}

      {/* Create placement from unplaced matches */}
      {unplacedMatches.length > 0 && (
        <div className="bg-gray-50 border rounded-lg p-3">
          <p className="text-sm text-gray-600 mb-2">{unplacedMatches.length} match candidate(s) available for placement</p>
          {unplacedMatches.map(mid => (
            <button key={mid} onClick={() => createPlacement(mid)} disabled={creating}
              className="text-sm bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 disabled:opacity-50 mr-2">
              {creating ? "Creating..." : "Promote Match to Placement"}
            </button>
          ))}
        </div>
      )}

      {!hasPlacement && unplacedMatches.length === 0 && (
        <p className="text-sm text-gray-500 italic">No placements or match candidates available.</p>
      )}

      {/* Active placements */}
      {placements.map(p => {
        const statusInfo = STATUS_FLOW.find(s => s.value === p.placement_status) || STATUS_FLOW[0];
        const isApprovedOrLater = ["approved", "agreement_pending", "agreement_signed", "ready_for_transfer", "completed"].includes(p.placement_status);
        const isFinal = p.placement_status === "completed" || p.placement_status === "cancelled";

        return (
          <div key={p.id} className="bg-white border rounded-lg p-4 space-y-3">
            {/* Status header */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
              <span className="text-xs text-gray-500">Created: {new Date(p.created_at).toLocaleDateString()}</span>
            </div>

            {p.approved_by && <p className="text-xs text-gray-500">Approved by: {p.approved_by} at {p.approved_at ? new Date(p.approved_at).toLocaleString() : "—"}</p>}

            {/* Status advancement */}
            {!isFinal && (
              <div className="flex flex-wrap gap-2">
                {STATUS_FLOW.filter(s => s.value !== p.placement_status && s.value !== "cancelled").map(s => (
                  <button key={s.value} onClick={() => updatePlacement(p.id, { placement_status: s.value, approved_by: "admin" })}
                    disabled={saving}
                    className={`text-xs px-2 py-1 rounded border ${s.color} hover:opacity-80 disabled:opacity-50`}>
                    → {s.label}
                  </button>
                ))}
              </div>
            )}

            {/* Agreements (only after approval) */}
            {isApprovedOrLater && (
              <div className="border-t pt-3 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Agreements</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {([
                    ["adoption_agreement_status", "Adoption Agreement"],
                    ["behavioral_addendum_status", "Behavioral Addendum"],
                    ["medical_addendum_status", "Medical Addendum"],
                  ] as const).map(([field, label]) => (
                    <div key={field}>
                      <label className="block text-xs text-gray-500 mb-1">{label}</label>
                      <select value={(p as Record<string, string>)[field]}
                        onChange={e => updatePlacement(p.id, { [field]: e.target.value })}
                        disabled={saving}
                        className="w-full px-2 py-1 border rounded text-xs">
                        {["not_required", "pending", "sent", "signed"].map(v => (
                          <option key={v} value={v}>{AGR_LABELS[v]}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancel */}
            {!isFinal && (
              <div className="border-t pt-3 flex items-center gap-2">
                <input type="text" placeholder="Cancellation reason" value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-xs" />
                <button onClick={() => updatePlacement(p.id, { placement_status: "cancelled", cancellation_reason: cancelReason })}
                  disabled={saving}
                  className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50">
                  Cancel Placement
                </button>
              </div>
            )}

            {p.cancelled_at && <p className="text-xs text-red-600">Cancelled: {p.cancellation_reason || "No reason given"}</p>}
            {p.completed_at && <p className="text-xs text-green-700">Completed: {new Date(p.completed_at).toLocaleString()}</p>}
          </div>
        );
      })}
    </div>
  );
}
