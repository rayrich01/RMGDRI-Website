"use client";

import { useState, FormEvent, useCallback } from "react";
import {
  OWNER_SURRENDER_FIELD_MAP,
  OWNER_SURRENDER_SECTIONS,
  SURRENDER_AGREEMENT_TEXT,
  type FieldDef,
} from "@/lib/forms/owner-surrender/field-map";
import { OWNER_SURRENDER_FORM_KEY } from "@/lib/forms/owner-surrender/labels";
import PhotoUploadField from "@/components/forms/PhotoUploadField";

/* ── Field input renderer ────────────────────────────────────────────── */
function FieldInput({
  field,
  value,
  onChange,
  error,
}: {
  field: FieldDef;
  value: string | string[] | boolean;
  onChange: (key: string, val: string | string[] | boolean) => void;
  error?: boolean;
}) {
  const baseClass =
    "w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500";
  const errorBorder = error ? "border-red-400" : "border-gray-300";

  /* ── photos ── */
  if (field.type === "photos") {
    return (
      <PhotoUploadField
        label={field.label}
        maxFiles={3}
        helpText="We will not process your surrender form until we receive at least 1 photo. If the photos will not upload, you can email them to rehome@rmgreatdane.org"
        onUrlsChange={(urls) => onChange(field.key, urls)}
      />
    );
  }

  /* ── checkbox-group ── */
  if (field.type === "checkbox-group" && field.options) {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {field.options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer hover:bg-teal-50 rounded-lg px-3 py-2 transition-colors"
          >
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

  /* ── checkbox (single boolean) ── */
  if (field.type === "checkbox") {
    return (
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={value === true || value === "true"}
          onChange={(e) => onChange(field.key, e.target.checked)}
          className="accent-teal-600 w-5 h-5 mt-0.5"
        />
        <span className="text-gray-700 text-sm">{field.label}</span>
      </label>
    );
  }

  /* ── radio ── */
  if (field.type === "radio" && field.options) {
    return (
      <div className="flex flex-wrap gap-4">
        {field.options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-gray-700 cursor-pointer"
          >
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
        <option value="">&mdash; Select &mdash;</option>
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

  /* ── text / email / tel ── */
  return (
    <input
      type={
        field.type === "email"
          ? "email"
          : field.type === "tel"
            ? "tel"
            : "text"
      }
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(field.key, e.target.value)}
      placeholder={field.placeholder}
      className={`${baseClass} ${errorBorder}`}
    />
  );
}

/* ── Main form component ─────────────────────────────────────────────── */
export default function OwnerSurrenderForm() {
  /* ── State ── */
  const [formData, setFormData] = useState<
    Record<string, string | string[] | boolean>
  >(() => {
    const init: Record<string, string | string[] | boolean> = {};
    for (const f of OWNER_SURRENDER_FIELD_MAP) {
      if (
        f.type === "checkbox-group" ||
        f.type === "photos"
      ) {
        init[f.key] = [];
      } else if (f.type === "checkbox") {
        init[f.key] = false;
      } else {
        init[f.key] = "";
      }
    }
    return init;
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Set<string>>(new Set());

  /* ── Handlers ── */
  const handleChange = useCallback(
    (key: string, val: string | string[] | boolean) => {
      setFormData((prev) => ({ ...prev, [key]: val }));
      setFieldErrors((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setErrorMessage("");
      setFieldErrors(new Set());

      /* ── Client-side required check ── */
      const missing = new Set<string>();
      for (const f of OWNER_SURRENDER_FIELD_MAP) {
        if (!f.required) continue;
        const val = formData[f.key];
        if (f.type === "checkbox-group" || f.type === "photos") {
          if (!Array.isArray(val) || val.length === 0) missing.add(f.key);
        } else if (f.type === "checkbox") {
          if (val !== true && val !== "true") missing.add(f.key);
        } else if (typeof val === "string" && val.trim() === "") {
          missing.add(f.key);
        }
      }

      if (missing.size > 0) {
        setFieldErrors(missing);
        setErrorMessage("Please complete all required fields.");
        /* Scroll to first error */
        const firstKey = [...missing][0];
        const el = document.getElementById(`field-${firstKey}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      /* ── Submit ── */
      setStatus("submitting");
      try {
        const res = await fetch("/api/forms/owner-surrender/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          /* Highlight server-reported missing fields */
          if (Array.isArray(json.missing)) {
            setFieldErrors(new Set(json.missing));
          }
          throw new Error(
            json.error || `HTTP ${res.status}`,
          );
        }

        setStatus("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err: unknown) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Submission failed. Please try again.",
        );
      }
    },
    [formData],
  );

  /* ── Success state ── */
  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">&#10003;</div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">
          Thank You!
        </h2>
        <p className="text-green-700">
          Your owner surrender form has been received. Our Incoming
          Coordinator will review it and reach out to you via email within
          1&ndash;3 business days. Please check your spam/junk folder if you
          do not hear from us. You can also email us directly at{" "}
          <a
            href="mailto:rehome@rmgreatdane.org"
            className="text-teal-600 hover:underline font-semibold"
          >
            rehome@rmgreatdane.org
          </a>
          .
        </p>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <form onSubmit={handleSubmit} className="space-y-10" noValidate>
      {/* Honeypot — hidden from users */}
      <input
        type="text"
        name="website_url_hp"
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <p className="text-sm text-red-500">* Required fields</p>

      {OWNER_SURRENDER_SECTIONS.map((section) => {
        const fields = OWNER_SURRENDER_FIELD_MAP.filter(
          (f) => f.section === section,
        );

        return (
          <fieldset key={section} className="space-y-6">
            <legend className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 w-full">
              {section}
            </legend>

            {/* Show legal agreement text before the Surrender Agreement fields */}
            {section === "Surrender Agreement" && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {SURRENDER_AGREEMENT_TEXT}
              </div>
            )}

            {fields.map((field) => {
              const hasError = fieldErrors.has(field.key);

              /* photos — rendered entirely by PhotoUploadField */
              if (field.type === "photos") {
                return (
                  <div
                    key={field.key}
                    id={`field-${field.key}`}
                    className="space-y-1"
                  >
                    <FieldInput
                      field={field}
                      value={formData[field.key] ?? []}
                      onChange={handleChange}
                      error={hasError}
                    />
                    {hasError && (
                      <p className="text-red-600 text-xs mt-1">
                        This field is required.
                      </p>
                    )}
                  </div>
                );
              }

              /* Single-checkbox fields get inline label from FieldInput */
              if (field.type === "checkbox") {
                return (
                  <div key={field.key} id={`field-${field.key}`}>
                    <FieldInput
                      field={field}
                      value={formData[field.key] ?? false}
                      onChange={handleChange}
                      error={hasError}
                    />
                    {hasError && (
                      <p className="text-red-600 text-xs mt-1">
                        This field is required.
                      </p>
                    )}
                  </div>
                );
              }

              /* All other field types */
              return (
                <div
                  key={field.key}
                  id={`field-${field.key}`}
                  className="space-y-1"
                >
                  <label className="block text-sm font-semibold text-gray-800">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <FieldInput
                    field={field}
                    value={formData[field.key] ?? ""}
                    onChange={handleChange}
                    error={hasError}
                  />
                  {hasError && (
                    <p className="text-red-600 text-xs mt-1">
                      This field is required.
                    </p>
                  )}
                </div>
              );
            })}
          </fieldset>
        );
      })}

      {/* Error banner */}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {errorMessage}
        </div>
      )}
      {errorMessage && status !== "error" && fieldErrors.size > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting"
          ? "Submitting\u2026"
          : "Submit Surrender Form"}
      </button>
    </form>
  );
}
