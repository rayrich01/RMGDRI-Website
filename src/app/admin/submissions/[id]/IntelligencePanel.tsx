"use client";

import { useState } from "react";

interface Signal {
  id: string;
  label: string;
  source: string;
  detail: string;
}

interface Intelligence {
  id: string;
  generated_at: string;
  applicant_summary: string;
  validation_zones: string[];
  trust_signals: Signal[];
  risk_signals: Signal[];
  contradictions: Signal[];
  denial_factors: Signal[];
  recommended_prompts: string[];
  rationale_summary: string;
  suggested_recommendation: string;
  confidence_score: number;
}

interface IntelligencePanelProps {
  applicationId: string;
}

const RECOMMENDATION_LABELS: Record<string, { label: string; color: string }> = {
  recommend_approved: { label: "Recommend Approved", color: "bg-green-100 text-green-800" },
  recommend_approved_with_conditions: { label: "Approved w/ Conditions", color: "bg-yellow-100 text-yellow-800" },
  denied_with_remediation: { label: "Denied w/ Remediation", color: "bg-orange-100 text-orange-800" },
  denied: { label: "Denied", color: "bg-red-100 text-red-800" },
};

function SignalList({ signals, color }: { signals: Signal[]; color: string }) {
  if (signals.length === 0) return <p className="text-sm text-gray-400 italic">None detected</p>;
  return (
    <ul className="space-y-1">
      {signals.map((s) => (
        <li key={s.id} className={`text-sm px-2 py-1 rounded ${color}`}>
          <span className="font-medium">{s.id}: {s.label}</span>
          <span className="text-xs ml-2 opacity-75">({s.source})</span>
          {s.detail && <p className="text-xs mt-0.5 opacity-80">{s.detail}</p>}
        </li>
      ))}
    </ul>
  );
}

export default function IntelligencePanel({ applicationId }: IntelligencePanelProps) {
  const [intelligence, setIntelligence] = useState<Intelligence | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  async function loadLatest() {
    const res = await fetch(`/api/admin/applications/${applicationId}/intelligence`);
    if (res.ok) {
      const { latest } = await res.json();
      setIntelligence(latest);
    }
    setLoaded(true);
  }

  async function generate() {
    setGenerating(true);
    setError("");
    const res = await fetch(`/api/admin/applications/${applicationId}/intelligence`, {
      method: "POST",
    });
    if (res.ok) {
      const { intelligence: intel } = await res.json();
      setIntelligence(intel);
    } else {
      const { error: msg } = await res.json();
      setError(msg || "Generation failed");
    }
    setGenerating(false);
  }

  // Load on first render
  if (!loaded) {
    loadLatest();
  }

  const rec = intelligence?.suggested_recommendation
    ? RECOMMENDATION_LABELS[intelligence.suggested_recommendation]
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Decision Intelligence</h3>
        <button
          onClick={generate}
          disabled={generating}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {generating ? "Generating..." : intelligence ? "Regenerate" : "Generate Intelligence"}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

      {!intelligence && !generating && loaded && (
        <p className="text-sm text-gray-500 italic">No intelligence generated yet. Click &ldquo;Generate Intelligence&rdquo; to begin.</p>
      )}

      {intelligence && (
        <div className="space-y-4">
          {/* Header */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-900">{intelligence.applicant_summary}</p>
                <p className="text-xs text-indigo-600 mt-1">
                  Generated: {new Date(intelligence.generated_at).toLocaleString()}
                  {" · "}Sources: {intelligence.validation_zones.join(", ")}
                </p>
              </div>
              {rec && (
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">SUGGESTED (advisory only)</p>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${rec.color}`}>
                    {rec.label}
                  </span>
                  {intelligence.confidence_score != null && (
                    <p className="text-xs text-gray-500 mt-1">
                      Confidence: {Math.round(intelligence.confidence_score * 100)}%
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Rationale */}
          {intelligence.rationale_summary && (
            <div className="bg-white border rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Rationale</h4>
              <p className="text-sm text-gray-600">{intelligence.rationale_summary}</p>
            </div>
          )}

          {/* Signals grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border rounded-lg p-3">
              <h4 className="text-sm font-medium text-green-700 mb-2">Trust Signals ({intelligence.trust_signals.length})</h4>
              <SignalList signals={intelligence.trust_signals} color="bg-green-50 text-green-800" />
            </div>
            <div className="bg-white border rounded-lg p-3">
              <h4 className="text-sm font-medium text-amber-700 mb-2">Risk Signals ({intelligence.risk_signals.length})</h4>
              <SignalList signals={intelligence.risk_signals} color="bg-amber-50 text-amber-800" />
            </div>
          </div>

          {intelligence.contradictions.length > 0 && (
            <div className="bg-white border border-red-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-red-700 mb-2">Contradictions ({intelligence.contradictions.length})</h4>
              <SignalList signals={intelligence.contradictions} color="bg-red-50 text-red-800" />
            </div>
          )}

          {intelligence.denial_factors.length > 0 && (
            <div className="bg-white border border-red-300 rounded-lg p-3">
              <h4 className="text-sm font-medium text-red-800 mb-2">Denial Factors ({intelligence.denial_factors.length})</h4>
              <SignalList signals={intelligence.denial_factors} color="bg-red-100 text-red-900" />
            </div>
          )}

          {/* Prompts */}
          {intelligence.recommended_prompts.length > 0 && (
            <div className="bg-white border border-blue-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-700 mb-2">Recommended Next Steps</h4>
              <ul className="space-y-1">
                {intelligence.recommended_prompts.map((p, i) => (
                  <li key={i} className="text-sm text-blue-800 bg-blue-50 px-2 py-1 rounded">• {p}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-gray-400 italic">
            This is advisory intelligence only. The actual recommendation must be entered by staff in the Recommendation section above.
          </p>
        </div>
      )}
    </div>
  );
}
