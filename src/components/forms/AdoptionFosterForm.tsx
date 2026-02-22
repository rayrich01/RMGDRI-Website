"use client";

import { useMemo, useState } from "react";
import {
  ADOPTION_FOSTER_FIELD_MAP,
  ADOPTION_FOSTER_SECTIONS,
  type FieldDef,
} from "@/lib/forms/adoption-foster/field-map";

type FormState = Record<string, string>;

interface Props {
  /** Pre-select application type: "adopt" | "foster" | "both" */
  defaultType?: "adopt" | "foster" | "both";
  /** Page title override */
  title?: string;
}

function FieldInput({
  def,
  value,
  onChange,
  error,
}: {
  def: FieldDef;
  value: string;
  onChange: (val: string) => void;
  error: boolean;
}) {
  const baseInput =
    "w-full border rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors";
  const errorClass = error ? "border-red-400 bg-red-50" : "border-gray-300";

  if (def.type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={`${baseInput} ${errorClass}`}
        placeholder={def.placeholder}
      />
    );
  }

  if (def.type === "select" && def.options) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseInput} ${errorClass}`}
      >
        <option value="">— Select —</option>
        {def.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (def.type === "radio" && def.options) {
    return (
      <div className="flex flex-wrap gap-4">
        {def.options.map((opt) => (
          <label
            key={opt}
            className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-colors ${
              value === opt
                ? "border-teal-500 bg-teal-50 text-teal-700"
                : `${errorClass} bg-white hover:bg-gray-50`
            }`}
          >
            <input
              type="radio"
              name={def.key}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="accent-teal-600"
            />
            <span className="capitalize">{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <input
      type={def.type === "email" ? "email" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${baseInput} ${errorClass}`}
      placeholder={def.placeholder}
    />
  );
}

export default function AdoptionFosterForm({ defaultType, title }: Props) {
  const [state, setState] = useState<FormState>(() => {
    const init: FormState = {};
    for (const f of ADOPTION_FOSTER_FIELD_MAP) {
      init[f.key] = f.key === "application_type" && defaultType ? defaultType : "";
    }
    init["todays_date"] = new Date().toLocaleDateString("en-US");
    return init;
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const requiredDefs = useMemo(
    () => ADOPTION_FOSTER_FIELD_MAP.filter((f) => f.required),
    []
  );

  const missingKeys = useMemo(() => {
    return new Set(
      requiredDefs
        .filter((f) => !String(state[f.key] ?? "").trim())
        .map((f) => f.key)
    );
  }, [requiredDefs, state]);

  // Determine which sections to show based on application type
  const applicationType = state["application_type"];
  const visibleFields = useMemo(() => {
    return ADOPTION_FOSTER_FIELD_MAP.filter((f) => {
      if (f.section === "Foster-Specific Questions") {
        return applicationType === "foster" || applicationType === "both";
      }
      return true;
    });
  }, [applicationType]);

  const visibleSections = useMemo(() => {
    const sections = ADOPTION_FOSTER_SECTIONS.filter((s) => {
      if (s === "Foster-Specific Questions") {
        return applicationType === "foster" || applicationType === "both";
      }
      return true;
    });
    return sections;
  }, [applicationType]);

  function setField(key: string, val: string) {
    setState((prev) => ({ ...prev, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setShowErrors(true);

    if (missingKeys.size > 0) {
      const labels = requiredDefs
        .filter((f) => missingKeys.has(f.key))
        .map((f) => f.label);
      setResult({
        ok: false,
        message: `Please fill in the following required fields:\n${labels.join(", ")}`,
      });
      // Scroll to first error
      const firstMissing = requiredDefs.find((f) => missingKeys.has(f.key));
      if (firstMissing) {
        document.getElementById(`field-${firstMissing.key}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/forms/adoption-foster/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(state),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const missing = Array.isArray(data?.missing) ? data.missing : [];
        const msg = missing.length
          ? `Missing: ${missing.join(", ")}`
          : data?.error ?? `Error ${res.status}`;
        setResult({ ok: false, message: msg });
      } else {
        setResult({
          ok: true,
          message:
            "Your application has been submitted successfully! Our team will review it and contact you within a few business days. Thank you!",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      setResult({ ok: false, message: err?.message ?? "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.ok) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-emerald-700 mb-4">Application Submitted!</h2>
          <p className="text-lg text-gray-700">{result.message}</p>
          <p className="text-gray-500 mt-4">
            Questions? Contact us at{" "}
            <a href="mailto:applications@rmgreatdane.org" className="text-teal-600 hover:text-teal-700 font-semibold">
              applications@rmgreatdane.org
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-12 pb-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
        {title ?? "Adoption / Foster Application"}
      </h1>
      <p className="text-center text-gray-600 mb-2 max-w-2xl mx-auto">
        Thank you for your interest! Please complete this application thoroughly and honestly.
        Our team will review it and contact you within a few business days.
      </p>
      <p className="text-center text-gray-500 text-sm mb-8">
        Fields marked with <span className="text-red-500 font-bold">*</span> are required.
      </p>

      {result && !result.ok && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6 text-red-700">
          {result.message}
        </div>
      )}

      {/* Honeypot — hidden from humans */}
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <input
          type="text"
          name="website_url_hp"
          tabIndex={-1}
          autoComplete="off"
          value={state["website_url_hp"] ?? ""}
          onChange={(e) => setField("website_url_hp", e.target.value)}
        />
      </div>

      <form onSubmit={onSubmit} className="space-y-10">
        {visibleSections.map((section) => {
          const fields = visibleFields.filter((f) => f.section === section);
          if (!fields.length) return null;

          return (
            <section key={section} className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                {section}
              </h2>
              <div className="space-y-5">
                {fields.map((def) => {
                  const hasError = showErrors && def.required && missingKeys.has(def.key);
                  return (
                    <div key={def.key} id={`field-${def.key}`}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {def.label}
                        {def.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <FieldInput
                        def={def}
                        value={state[def.key] ?? ""}
                        onChange={(val) => setField(def.key, val)}
                        error={hasError}
                      />
                      {hasError && (
                        <p className="text-red-500 text-xs mt-1">This field is required</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-12 py-4 rounded-lg text-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
