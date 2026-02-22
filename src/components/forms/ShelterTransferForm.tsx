"use client";

import { useState, FormEvent, useCallback } from "react";
import {
  SHELTER_TRANSFER_FIELD_MAP,
  SHELTER_TRANSFER_SECTIONS,
  type FieldDef,
} from "@/lib/forms/shelter-transfer/field-map";

/* ── Legal release text (matches PDF) ── */
const RELEASE_TEXT = `I, the rescue/shelter representative as stated above, hereby surrender the dog described above to Rocky Mountain Great Dane Rescue, Inc. I certify that this dog is not possessed of any dangerous or vicious propensities, and that I have not willfully concealed information about the dog that might indicate such propensities. The information I have provided about this dog is true and complete. I hereby forever release, discharge and agree to hold harmless and indemnify the Rocky Mountain Great Dane Rescue, Inc., its Board of Directors, and its members, officers and agents from all claims, demands, actions, causes of action or liability of any kind whatsoever arising as a result of or in connection with the adoption or other disposition of the above named dog.`;

/* ── Field input renderer ── */
function FieldInput({
  field,
  value,
  onChange,
  error,
}: {
  field: FieldDef;
  value: string | string[];
  onChange: (key: string, val: string | string[]) => void;
  error?: boolean;
}) {
  const baseClass =
    "w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500";
  const errorBorder = error ? "border-red-400" : "border-gray-300";

  /* ── checkbox-group ── */
  if (field.type === "checkbox-group" && field.options) {
    const selected = Array.isArray(value) ? value : value ? [value] : [];
    return (
      <div className="flex flex-wrap gap-3">
        {field.options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => {
                const next = selected.includes(opt)
                  ? selected.filter((v) => v !== opt)
                  : [...selected, opt];
                onChange(field.key, next);
              }}
              className="accent-teal-600 w-4 h-4"
            />
            {opt}
          </label>
        ))}
      </div>
    );
  }

  /* ── radio ── */
  if (field.type === "radio" && field.options) {
    return (
      <div className="flex flex-wrap gap-4">
        {field.options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-gray-700 cursor-pointer">
            <input
              type="radio"
              name={field.key}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(field.key, opt)}
              className="accent-teal-600 w-4 h-4"
            />
            {opt}
          </label>
        ))}
      </div>
    );
  }

  /* ── select ── */
  if (field.type === "select" && field.options) {
    return (
      <select
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(field.key, e.target.value)}
        className={`${baseClass} ${errorBorder}`}
      >
        <option value="">— Select —</option>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  /* ── textarea ── */
  if (field.type === "textarea") {
    return (
      <textarea
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        rows={4}
        className={`${baseClass} ${errorBorder}`}
      />
    );
  }

  /* ── text / email ── */
  return (
    <input
      type={field.type === "email" ? "email" : "text"}
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(field.key, e.target.value)}
      placeholder={field.placeholder}
      className={`${baseClass} ${errorBorder}`}
    />
  );
}

/* ── Main form component ── */
export default function ShelterTransferForm() {
  const [form, setForm] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = useCallback((key: string, val: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => prev.filter((k) => k !== key));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");

    /* Client-side required-field check */
    const missing: string[] = [];
    for (const f of SHELTER_TRANSFER_FIELD_MAP) {
      if (!f.required) continue;
      const val = form[f.key];
      if (val === undefined || val === null || (typeof val === "string" && val.trim() === "") || (Array.isArray(val) && val.length === 0)) {
        missing.push(f.key);
      }
    }
    if (missing.length > 0) {
      setErrors(missing);
      /* scroll to first error */
      const el = document.querySelector(`[data-field="${missing[0]}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/forms/shelter-transfer/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setServerError(data.error ?? "An error occurred. Please try again.");
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success state ── */
  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Transfer Request Submitted</h2>
          <p className="text-lg text-gray-700 mb-4">
            Thank you for reaching out to RMGDRI. We will review your transfer request and respond
            within 24–48 hours. If the dog is on an urgent timeline, please also email us directly.
          </p>
          <p className="text-gray-600">
            Contact:{" "}
            <a href="mailto:shelterrequests@rmgreatdane.org" className="text-teal-600 hover:underline font-semibold">
              shelterrequests@rmgreatdane.org
            </a>
          </p>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-6 py-10 space-y-10">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Rescue / Shelter Transfer Form</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Thank you for reaching out to Rocky Mountain Great Dane Rescue, Inc. Please fill out this
          form as fully as possible. Any additional pictures, medical/behavioral records, or other
          files can be sent to{" "}
          <a href="mailto:shelterrequests@rmgreatdane.org" className="text-teal-600 hover:underline">
            shelterrequests@rmgreatdane.org
          </a>.
        </p>
        <p className="text-sm text-red-500 mt-4">* Required fields</p>
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            name="website_url_hp"
            tabIndex={-1}
            autoComplete="off"
            value={typeof form.website_url_hp === "string" ? form.website_url_hp : ""}
            onChange={(e) => handleChange("website_url_hp", e.target.value)}
          />
        </label>
      </div>

      {SHELTER_TRANSFER_SECTIONS.map((section) => {
        const fields = SHELTER_TRANSFER_FIELD_MAP.filter((f) => f.section === section);
        return (
          <fieldset key={section} className="space-y-6">
            <legend className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 w-full">
              {section}
            </legend>

            {/* Show legal release text before the certification fields */}
            {section === "Certification & Signature" && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-sm text-gray-700 leading-relaxed">
                {RELEASE_TEXT}
              </div>
            )}

            {fields.map((field) => (
              <div key={field.key} data-field={field.key} className="space-y-1">
                <label className="block text-sm font-semibold text-gray-800">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <FieldInput
                  field={field}
                  value={form[field.key] ?? ""}
                  onChange={handleChange}
                  error={errors.includes(field.key)}
                />
                {errors.includes(field.key) && (
                  <p className="text-red-500 text-xs">This field is required</p>
                )}
              </div>
            ))}
          </fieldset>
        );
      })}

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {serverError}
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          Please fill in all required fields ({errors.length} remaining).
        </div>
      )}

      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-block bg-teal-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit Transfer Request"}
        </button>
      </div>
    </form>
  );
}
