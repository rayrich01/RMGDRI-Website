"use client";

import { useState } from "react";

interface ScreeningPanelProps {
  applicationId: string;
  currentStatus: string;
  assignedScreener: string | null;
}

// WORKFLOW STATES ONLY — outcomes are stored in application_recommendations
const STATUS_FLOW = [
  { value: "submitted", label: "Submitted" },
  { value: "screening", label: "Screening" },
  { value: "interview_complete", label: "Interview Complete" },
  { value: "home_check_complete", label: "Home Check Complete" },
  { value: "decision_pending", label: "Decision Pending" },
  { value: "decisioned", label: "Decisioned" },
];

const RECOMMENDATION_OPTIONS = [
  { value: "recommend_approved", label: "Recommend Approved" },
  { value: "recommend_approved_with_conditions", label: "Recommend Approved w/ Conditions" },
  { value: "denied_with_remediation", label: "Denied w/ Remediation" },
  { value: "denied", label: "Denied" },
];

export default function ScreeningPanel({
  applicationId,
  currentStatus,
  assignedScreener: initialScreener,
}: ScreeningPanelProps) {
  const [status, setStatus] = useState(currentStatus);
  const [screener, setScreener] = useState(initialScreener || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  // Interview state
  const [interviewer, setInterviewer] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [trustObs, setTrustObs] = useState("");
  const [clarifications, setClarifications] = useState("");
  const [contradictions, setContradictions] = useState("");
  const [interviewAssessment, setInterviewAssessment] = useState("");

  // Home check state
  const [homeChecker, setHomeChecker] = useState("");
  const [hcObservations, setHcObservations] = useState("");
  const [hcEnvironment, setHcEnvironment] = useState("");
  const [hcYardFence, setHcYardFence] = useState("");
  const [hcHousehold, setHcHousehold] = useState("");
  const [hcSafety, setHcSafety] = useState("");
  const [hcAssessment, setHcAssessment] = useState("");

  // Recommendation state
  const [recommendation, setRecommendation] = useState("");
  const [acceptanceFactors, setAcceptanceFactors] = useState("");
  const [riskFlags, setRiskFlags] = useState("");
  const [denialFactors, setDenialFactors] = useState("");
  const [conditions, setConditions] = useState("");
  const [rationale, setRationale] = useState("");
  const [recommender, setRecommender] = useState("");

  async function saveScreening() {
    setSaving(true);
    const res = await fetch(`/api/admin/applications/${applicationId}/screening`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, assigned_screener: screener || null }),
    });
    setSaving(false);
    setSaved(res.ok ? "Screening updated" : "Failed to save");
    setTimeout(() => setSaved(""), 3000);
  }

  async function saveInterview() {
    setSaving(true);
    const res = await fetch(`/api/admin/applications/${applicationId}/interview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interviewer, notes: interviewNotes, trust_observations: trustObs,
        clarifications, contradictions, assessment: interviewAssessment,
      }),
    });
    setSaving(false);
    setSaved(res.ok ? "Interview saved" : "Failed to save");
    setTimeout(() => setSaved(""), 3000);
  }

  async function saveHomeCheck() {
    setSaving(true);
    const res = await fetch(`/api/admin/applications/${applicationId}/home-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        home_checker: homeChecker, observations: hcObservations,
        environment_validation: hcEnvironment, yard_fence_gate: hcYardFence,
        household_context: hcHousehold, safety_concerns: hcSafety, assessment: hcAssessment,
      }),
    });
    setSaving(false);
    setSaved(res.ok ? "Home check saved" : "Failed to save");
    setTimeout(() => setSaved(""), 3000);
  }

  async function saveRecommendation() {
    if (!recommendation) return;
    setSaving(true);
    const res = await fetch(`/api/admin/applications/${applicationId}/recommendation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recommendation, acceptance_factors: acceptanceFactors,
        risk_flags: riskFlags, denial_factors: denialFactors,
        conditions, rationale, recommender,
      }),
    });
    setSaving(false);
    setSaved(res.ok ? "Recommendation saved" : "Failed to save");
    setTimeout(() => setSaved(""), 3000);
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const sectionClass = "bg-white border rounded-lg p-4 space-y-3";
  const btnClass = "px-4 py-2 text-sm rounded-md text-white";

  return (
    <div className="space-y-6">
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">{saved}</div>}

      {/* Assignment & Status */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-gray-900">Assignment & Status</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Assigned Screener</label>
            <input type="text" value={screener} onChange={(e) => setScreener(e.target.value)} placeholder="Screener name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
              {STATUS_FLOW.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <button onClick={saveScreening} disabled={saving} className={`${btnClass} bg-blue-600 hover:bg-blue-700`}>
          {saving ? "Saving..." : "Update Assignment & Status"}
        </button>
      </div>

      {/* Interview */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-gray-900">Phone Interview</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Interviewer</label><input type="text" value={interviewer} onChange={(e) => setInterviewer(e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Assessment</label><input type="text" value={interviewAssessment} onChange={(e) => setInterviewAssessment(e.target.value)} className={inputClass} /></div>
        </div>
        <div><label className={labelClass}>Notes</label><textarea value={interviewNotes} onChange={(e) => setInterviewNotes(e.target.value)} rows={3} className={inputClass} /></div>
        <div><label className={labelClass}>Trust Observations</label><textarea value={trustObs} onChange={(e) => setTrustObs(e.target.value)} rows={2} className={inputClass} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Clarifications</label><textarea value={clarifications} onChange={(e) => setClarifications(e.target.value)} rows={2} className={inputClass} /></div>
          <div><label className={labelClass}>Contradictions</label><textarea value={contradictions} onChange={(e) => setContradictions(e.target.value)} rows={2} className={inputClass} /></div>
        </div>
        <button onClick={saveInterview} disabled={saving || !interviewer} className={`${btnClass} bg-purple-600 hover:bg-purple-700`}>
          {saving ? "Saving..." : "Save Interview"}
        </button>
      </div>

      {/* Home Check */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-gray-900">Home Check</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Home Checker</label><input type="text" value={homeChecker} onChange={(e) => setHomeChecker(e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Assessment</label><input type="text" value={hcAssessment} onChange={(e) => setHcAssessment(e.target.value)} className={inputClass} /></div>
        </div>
        <div><label className={labelClass}>Observations</label><textarea value={hcObservations} onChange={(e) => setHcObservations(e.target.value)} rows={2} className={inputClass} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Environment</label><textarea value={hcEnvironment} onChange={(e) => setHcEnvironment(e.target.value)} rows={2} className={inputClass} /></div>
          <div><label className={labelClass}>Yard/Fence/Gate</label><textarea value={hcYardFence} onChange={(e) => setHcYardFence(e.target.value)} rows={2} className={inputClass} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Household Context</label><textarea value={hcHousehold} onChange={(e) => setHcHousehold(e.target.value)} rows={2} className={inputClass} /></div>
          <div><label className={labelClass}>Safety Concerns</label><textarea value={hcSafety} onChange={(e) => setHcSafety(e.target.value)} rows={2} className={inputClass} /></div>
        </div>
        <button onClick={saveHomeCheck} disabled={saving || !homeChecker} className={`${btnClass} bg-teal-600 hover:bg-teal-700`}>
          {saving ? "Saving..." : "Save Home Check"}
        </button>
      </div>

      {/* Recommendation */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-gray-900">Decision Recommendation</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Recommendation</label>
            <select value={recommendation} onChange={(e) => setRecommendation(e.target.value)} className={inputClass}>
              <option value="">Select...</option>
              {RECOMMENDATION_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div><label className={labelClass}>Recommender</label><input type="text" value={recommender} onChange={(e) => setRecommender(e.target.value)} className={inputClass} /></div>
        </div>
        <div><label className={labelClass}>Rationale</label><textarea value={rationale} onChange={(e) => setRationale(e.target.value)} rows={3} className={inputClass} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Acceptance Factors</label><textarea value={acceptanceFactors} onChange={(e) => setAcceptanceFactors(e.target.value)} rows={2} className={inputClass} /></div>
          <div><label className={labelClass}>Risk Flags</label><textarea value={riskFlags} onChange={(e) => setRiskFlags(e.target.value)} rows={2} className={inputClass} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Denial Factors</label><textarea value={denialFactors} onChange={(e) => setDenialFactors(e.target.value)} rows={2} className={inputClass} /></div>
          <div><label className={labelClass}>Conditions</label><textarea value={conditions} onChange={(e) => setConditions(e.target.value)} rows={2} className={inputClass} /></div>
        </div>
        <button onClick={saveRecommendation} disabled={saving || !recommendation} className={`${btnClass} bg-amber-600 hover:bg-amber-700`}>
          {saving ? "Saving..." : "Save Recommendation"}
        </button>
      </div>
    </div>
  );
}
