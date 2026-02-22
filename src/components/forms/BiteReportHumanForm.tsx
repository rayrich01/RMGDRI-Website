"use client";

import { useState, useRef, FormEvent } from "react";
import {
  BITE_REPORT_HUMAN_FIELD_MAP,
  BITE_REPORT_HUMAN_SECTIONS,
  FieldDef,
} from "@/lib/forms/bite-report-human/field-map";
import { CERTIFICATION_TEXT } from "@/lib/forms/bite-report-human/labels";

// ── Helpers ──────────────────────────────────────────────────────────
function fieldsBySection(section: string): FieldDef[] {
  return BITE_REPORT_HUMAN_FIELD_MAP.filter((f) => f.section === section);
}

// ── FieldInput ───────────────────────────────────────────────────────
function FieldInput({
  def,
  value,
  onChange,
  error,
}: {
  def: FieldDef;
  value: string;
  onChange: (key: string, val: string) => void;
  error?: string;
}) {
  const id = `field-${def.key}`;
  const base =
    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 " +
    (error ? "border-red-400 bg-red-50" : "border-gray-300");

  if (def.type === "checkbox") {
    return (
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          id={id}
          name={def.key}
          checked={value === "yes"}
          onChange={(e) => onChange(def.key, e.target.checked ? "yes" : "")}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
        />
        <span className="text-sm text-gray-700">{def.label}</span>
      </label>
    );
  }

  if (def.type === "radio" && def.options) {
    return (
      <div className="flex gap-6">
        {def.options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={def.key}
              value={opt}
              checked={value === opt}
              onChange={(e) => onChange(def.key, e.target.value)}
              className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  if (def.type === "textarea") {
    return (
      <textarea
        id={id}
        name={def.key}
        rows={4}
        className={base}
        placeholder={def.placeholder}
        value={value}
        onChange={(e) => onChange(def.key, e.target.value)}
      />
    );
  }

  // text, email, tel, date
  return (
    <input
      id={id}
      name={def.key}
      type={def.type === "date" ? "date" : def.type === "email" ? "email" : "text"}
      className={base}
      placeholder={def.placeholder}
      value={value}
      onChange={(e) => onChange(def.key, e.target.value)}
    />
  );
}

// ── Main Form ────────────────────────────────────────────────────────
export default function BiteReportHumanForm() {
  const formRef = useRef<HTMLFormElement>(null);

  // State: field values keyed by field-map key
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    BITE_REPORT_HUMAN_FIELD_MAP.forEach((f) => {
      init[f.key] = "";
    });
    return init;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function scrollToFirst(errs: Record<string, string>) {
    const firstKey = Object.keys(errs)[0];
    if (!firstKey) return;
    const el =
      document.getElementById(`field-${firstKey}`) ??
      document.querySelector(`[name="${firstKey}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (el && "focus" in el) (el as HTMLElement).focus();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");

    // Client-side required check
    const newErrors: Record<string, string> = {};
    BITE_REPORT_HUMAN_FIELD_MAP.filter((f) => f.required).forEach((f) => {
      const v = values[f.key];
      if (!v || !String(v).trim()) {
        newErrors[f.key] = `${f.label} is required`;
      }
    });

    // Conditional: medical treatment details required if medical attention = Yes
    if (
      values.medical_attention_required === "Yes" &&
      !values.medical_treatment_details?.trim()
    ) {
      newErrors.medical_treatment_details =
        "Please explain the medical treatment required";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      scrollToFirst(newErrors);
      return;
    }

    setSubmitting(true);

    // Build payload — convert checkbox "yes" to true for Zod
    const payload: Record<string, unknown> = { ...values };
    if (payload.certification_agreement === "yes") {
      payload.certification_agreement = true;
    }

    try {
      const res = await fetch("/api/forms/bite-report-human/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();

      if (!res.ok || !body.ok) {
        // Highlight missing fields from server
        if (body.missing && Array.isArray(body.missing)) {
          const serverErrs: Record<string, string> = {};
          body.missing.forEach((key: string) => {
            const label = body.labels?.[key] ?? key;
            serverErrs[key] = `${label} is required`;
          });
          setErrors(serverErrs);
          scrollToFirst(serverErrs);
        } else if (body.issues && Array.isArray(body.issues)) {
          const zodErrs: Record<string, string> = {};
          body.issues.forEach(
            (iss: { path?: string[]; message?: string }) => {
              const key = iss.path?.[0] ?? "_form";
              zodErrs[key] = iss.message ?? "Invalid value";
            }
          );
          setErrors(zodErrs);
          scrollToFirst(zodErrs);
        } else {
          setServerError(body.error ?? "Submission failed. Please try again.");
        }
      } else {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success state ──────────────────────────────────────────────────
  if (success) {
    return (
      <div className="rounded-lg border border-green-300 bg-green-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-2">
          Report Submitted
        </h2>
        <p className="text-green-700">
          Thank you. Your bite report has been received. A board member will
          review this report and follow up if additional information is needed.
        </p>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────
  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-10">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_url_hp">Website</label>
        <input
          id="website_url_hp"
          name="website_url_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {serverError && (
        <div className="rounded-md bg-red-50 border border-red-300 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {BITE_REPORT_HUMAN_SECTIONS.map((section) => {
        const fields = fieldsBySection(section);
        if (!fields.length) return null;

        return (
          <fieldset key={section} className="space-y-5">
            <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 w-full">
              {section}
            </legend>

            {/* Show certification text before the checkbox */}
            {section === "Certification & Signature" && (
              <div className="rounded-md bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700 italic">
                {CERTIFICATION_TEXT}
              </div>
            )}

            {fields.map((def) => (
              <div key={def.key}>
                {def.type !== "checkbox" && (
                  <label
                    htmlFor={`field-${def.key}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {def.label}
                    {def.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                )}

                {/* Conditional note for medical treatment details */}
                {def.key === "medical_treatment_details" && (
                  <p className="text-xs text-gray-500 mb-1">
                    Required if medical attention was recommended or required.
                  </p>
                )}

                <FieldInput
                  def={def}
                  value={values[def.key] ?? ""}
                  onChange={handleChange}
                  error={errors[def.key]}
                />

                {errors[def.key] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[def.key]}
                  </p>
                )}
              </div>
            ))}
          </fieldset>
        );
      })}

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-teal-600 px-6 py-3 text-white font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Submitting…" : "Submit Bite Report"}
        </button>
      </div>
    </form>
  );
}
