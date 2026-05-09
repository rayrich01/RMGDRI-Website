"use client";

import { useState } from "react";

interface Profile {
  id: string;
  profile_summary: string;
  queue_eligible: boolean;
  queue_status: string;
  queue_notes: string | null;
  active_for_matching: boolean;
  readiness_tier: string;
  readiness_notes: string;
  household_profile: Record<string, unknown>;
  environment_profile: Record<string, unknown>;
  experience_profile: Record<string, unknown>;
  lifestyle_profile: Record<string, unknown>;
  dog_preference_profile: Record<string, unknown>;
  constraints_profile: Record<string, unknown>;
  strengths_profile: Record<string, unknown>;
  risk_summary: Record<string, unknown>;
  generated_at: string;
}

const TIER_LABELS: Record<string, { label: string; color: string }> = {
  tier_1_ready: { label: "Tier 1 — Ready", color: "bg-green-100 text-green-800" },
  tier_2_ready_with_conditions: { label: "Tier 2 — Conditions", color: "bg-yellow-100 text-yellow-800" },
  tier_3_hold: { label: "Tier 3 — Hold", color: "bg-orange-100 text-orange-800" },
  not_queue_eligible: { label: "Not Eligible", color: "bg-gray-100 text-gray-800" },
};

const QUEUE_LABELS: Record<string, string> = {
  not_eligible: "Not Eligible",
  ready: "Ready",
  hold: "Hold",
  matched: "Matched",
  withdrawn: "Withdrawn",
};

function ProfileSection({ title, data }: { title: string; data: Record<string, unknown> }) {
  const entries = Object.entries(data).filter(([, v]) => v != null && v !== "");
  if (entries.length === 0) return null;
  return (
    <div className="bg-white border rounded-lg p-3">
      <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      <dl className="space-y-1">
        {entries.map(([k, v]) => (
          <div key={k} className="flex text-sm">
            <dt className="text-gray-500 w-40 flex-shrink-0">{k.replace(/_/g, " ")}</dt>
            <dd className="text-gray-800">{typeof v === "object" ? JSON.stringify(v) : String(v)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ProfilePanel({ applicationId }: { applicationId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [queueNotes, setQueueNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadProfile() {
    const res = await fetch(`/api/admin/applications/${applicationId}/profile`);
    if (res.ok) {
      const { profile: p } = await res.json();
      setProfile(p);
      if (p?.queue_notes) setQueueNotes(p.queue_notes);
    }
    setLoaded(true);
  }

  async function generate() {
    setGenerating(true);
    setError("");
    const res = await fetch(`/api/admin/applications/${applicationId}/profile`, { method: "POST" });
    if (res.ok) {
      const { profile: p } = await res.json();
      setProfile(p);
    } else {
      const { error: msg } = await res.json();
      setError(msg || "Generation failed");
    }
    setGenerating(false);
  }

  async function updateQueue(updates: Record<string, unknown>) {
    setSaving(true);
    await fetch(`/api/admin/applications/${applicationId}/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    await loadProfile();
    setSaving(false);
  }

  if (!loaded) loadProfile();

  const tier = profile?.readiness_tier ? TIER_LABELS[profile.readiness_tier] : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Applicant Profile & Queue</h3>
        <button onClick={generate} disabled={generating}
          className="px-4 py-2 text-sm bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50">
          {generating ? "Generating..." : profile ? "Regenerate" : "Generate Profile"}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

      {!profile && !generating && loaded && (
        <p className="text-sm text-gray-500 italic">No profile generated yet.</p>
      )}

      {profile && (
        <div className="space-y-4">
          {/* Header */}
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-violet-900">{profile.profile_summary}</p>
                <p className="text-xs text-violet-600 mt-1">
                  Generated: {new Date(profile.generated_at).toLocaleString()}
                </p>
              </div>
              <div className="text-right space-y-1">
                {tier && (
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${tier.color}`}>
                    {tier.label}
                  </span>
                )}
                <p className="text-xs text-gray-500">
                  Queue: {QUEUE_LABELS[profile.queue_status] || profile.queue_status}
                </p>
              </div>
            </div>
            {profile.readiness_notes && (
              <p className="text-xs text-violet-700 mt-2">{profile.readiness_notes}</p>
            )}
          </div>

          {/* Profile dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ProfileSection title="Household" data={profile.household_profile} />
            <ProfileSection title="Environment" data={profile.environment_profile} />
            <ProfileSection title="Experience" data={profile.experience_profile} />
            <ProfileSection title="Lifestyle" data={profile.lifestyle_profile} />
            <ProfileSection title="Preferences" data={profile.dog_preference_profile} />
            <ProfileSection title="Constraints" data={profile.constraints_profile} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ProfileSection title="Strengths" data={profile.strengths_profile} />
            <ProfileSection title="Risks" data={profile.risk_summary} />
          </div>

          {/* Queue controls */}
          {profile.queue_eligible && (
            <div className="bg-white border rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Queue Management</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Queue Status</label>
                  <select value={profile.queue_status}
                    onChange={(e) => updateQueue({ queue_status: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    <option value="ready">Ready</option>
                    <option value="hold">Hold</option>
                    <option value="matched">Matched</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Active for Matching</label>
                  <select value={profile.active_for_matching ? "yes" : "no"}
                    onChange={(e) => updateQueue({ active_for_matching: e.target.value === "yes" })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Queue Notes</label>
                <textarea value={queueNotes} onChange={(e) => setQueueNotes(e.target.value)}
                  rows={2} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                <button onClick={() => updateQueue({ queue_notes: queueNotes })}
                  disabled={saving}
                  className="mt-1 text-xs text-violet-600 hover:underline">
                  {saving ? "Saving..." : "Save notes"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
