"use client";

import { useState } from "react";

interface ReviewLogEntry {
  action: string;
  note?: string;
  by: string;
  at: string;
}

interface ReviewPanelProps {
  submissionId: string;
  currentStatus: string;
  reviewLog: ReviewLogEntry[];
  reviewerNotes: string;
  assessment: string;
  clarificationRequested: string;
}

const STATUS_OPTIONS = ["submitted", "reviewing", "needs_clarification", "approved", "rejected"] as const;

export default function ReviewPanel({
  submissionId,
  currentStatus,
  reviewLog: initialLog,
  reviewerNotes: initialNotes,
  assessment: initialAssessment,
  clarificationRequested: initialClarification,
}: ReviewPanelProps) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [assessment, setAssessment] = useState(initialAssessment);
  const [clarification, setClarification] = useState(initialClarification);
  const [log, setLog] = useState<ReviewLogEntry[]>(initialLog);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newComment, setNewComment] = useState("");

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/review/${submissionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes, assessment, clarification }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.log) setLog(data.log);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleAddComment() {
    if (!newComment.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/review/${submissionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newComment }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.log) setLog(data.log);
        setNewComment("");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">
        Review & Assessment
      </h2>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setStatus(opt)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                status === opt
                  ? opt === "approved" ? "bg-green-600 text-white" :
                    opt === "rejected" ? "bg-red-600 text-white" :
                    opt === "reviewing" ? "bg-yellow-500 text-white" :
                    opt === "needs_clarification" ? "bg-orange-500 text-white" :
                    "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {opt === "needs_clarification" ? "Needs Clarification" : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Assessment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Assessment</label>
        <textarea
          value={assessment}
          onChange={(e) => setAssessment(e.target.value)}
          rows={3}
          placeholder="Final assessment of this application..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Clarification Requested */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Clarification / Remediation Required
        </label>
        <textarea
          value={clarification}
          onChange={(e) => setClarification(e.target.value)}
          rows={2}
          placeholder="What additional information or corrections are needed from the applicant?"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Reviewer Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Internal Reviewer Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Internal notes (not visible to applicant)..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save Review"}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">Saved ✓</span>}
      </div>

      {/* Add Comment */}
      <div className="border-t border-gray-200 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
        <div className="flex gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            placeholder="Add a review comment..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddComment}
            disabled={saving || !newComment.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Activity Log */}
      {log.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Activity Log</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {log.slice().reverse().map((entry, i) => (
              <div key={i} className="flex gap-3 text-sm border-l-2 border-gray-200 pl-3 py-1">
                <span className="text-gray-400 whitespace-nowrap text-xs">
                  {new Date(entry.at).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
                  })}
                </span>
                <span className="text-gray-700">
                  <span className="font-medium">{entry.action}</span>
                  {entry.note && <span className="text-gray-500"> — {entry.note}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
