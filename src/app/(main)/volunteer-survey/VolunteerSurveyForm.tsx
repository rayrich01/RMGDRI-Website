"use client";

import { useState } from "react";

const RATING_QUESTIONS = [
  { key: "communication", label: "How clear and timely is communication from RMGDRI leadership?" },
  { key: "scheduling", label: "How well-organized is scheduling and coordination for your role?" },
  { key: "leadership_support", label: "How supported do you feel by RMGDRI leadership?" },
  { key: "tools_preparedness", label: "How prepared and equipped do you feel to perform your volunteer duties?" },
  { key: "event_experience", label: "How would you rate your experience at RMGDRI events (if applicable)?" },
  { key: "raise_concerns", label: "How comfortable are you raising concerns or giving feedback?" },
  { key: "valued", label: "How valued do you feel as a volunteer?" },
  { key: "overall", label: "Overall, how satisfied are you with your volunteer experience at RMGDRI?" },
];

const RATING_OPTIONS = [
  { value: "1", label: "1 — Poor" },
  { value: "2", label: "2 — Fair" },
  { value: "3", label: "3 — Good" },
  { value: "4", label: "4 — Very Good" },
  { value: "5", label: "5 — Excellent" },
];

const ROLE_OPTIONS = [
  "Foster",
  "Transporter",
  "Event Volunteer",
  "Application Processor",
  "Home Check Processor",
  "Follow-up Specialist",
  "Social Media",
  "Fundraising",
  "Board Member",
  "Staff",
  "Other",
];

export default function VolunteerSurveyForm() {
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [role, setRole] = useState("");
  const [bestPart, setBestPart] = useState("");
  const [improve, setImprove] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function setRating(key: string, val: string) {
    setRatings((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    // Validate — all ratings required
    const missing = RATING_QUESTIONS.filter((q) => !ratings[q.key]);
    if (missing.length > 0) {
      setResult({
        ok: false,
        message: `Please rate all questions. Missing: ${missing.map((q) => q.label.split("?")[0]).join(", ")}`,
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/forms/volunteer-survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ratings,
          role: role || "Prefer not to say",
          best_part: bestPart,
          improvement_suggestions: improve,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setResult({
          ok: true,
          message: "Thank you for your feedback! Your anonymous response has been recorded.",
        });
      } else {
        setResult({ ok: false, message: data?.error || `Error ${res.status}` });
      }
    } catch {
      setResult({ ok: false, message: "Network error — please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.ok) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-12">
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-emerald-700 mb-3">Thank You!</h2>
          <p className="text-gray-700">{result.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10">
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-8 text-sm text-gray-700">
        <p className="font-semibold text-teal-800 mb-1">This survey is completely anonymous.</p>
        <p>No name, email, or identifying information is collected. Your honest feedback helps us improve.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Optional role */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your primary volunteer role <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          >
            <option value="">Prefer not to say</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Rating questions */}
        {RATING_QUESTIONS.map((q) => (
          <div key={q.key} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              {q.label} <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {RATING_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-colors text-sm ${
                    ratings[q.key] === opt.value
                      ? "border-teal-500 bg-teal-50 text-teal-700 font-semibold"
                      : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.key}
                    value={opt.value}
                    checked={ratings[q.key] === opt.value}
                    onChange={() => setRating(q.key, opt.value)}
                    className="accent-teal-600"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Free text — best part */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            What do you enjoy most about volunteering with RMGDRI?
          </label>
          <textarea
            value={bestPart}
            onChange={(e) => setBestPart(e.target.value)}
            rows={3}
            placeholder="Share what's working well..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>

        {/* Free text — improvements */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            What could we do to improve the volunteer experience?
          </label>
          <textarea
            value={improve}
            onChange={(e) => setImprove(e.target.value)}
            rows={3}
            placeholder="Suggestions, concerns, or ideas..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>

        {/* Feedback */}
        <div id="survey-feedback">
          {result && !result.ok && (
            <div className="bg-red-50 border-2 border-red-400 rounded-xl p-5 text-red-700 text-sm">
              {result.message}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="text-center pt-2 pb-8">
          <button
            type="submit"
            disabled={submitting}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
          >
            {submitting ? "Submitting..." : "Submit Anonymous Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
}
