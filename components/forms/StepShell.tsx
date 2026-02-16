"use client";

import { useState, type ReactNode } from "react";
import { FormProvider, useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { FormStep, FormKey } from "../../lib/forms/types";

interface StepShellProps {
  formKey: FormKey;
  title: string;
  description?: string;
  schema: z.ZodType<any>;
  steps: FormStep[];
  /** Render function per step — receives step index */
  children: (stepIndex: number) => ReactNode;
  /** Default values for the form */
  defaultValues?: DefaultValues<any>;
  /** Is this a public form (shows honeypot) */
  isPublic?: boolean;
}

export default function StepShell({
  formKey,
  title,
  description,
  schema,
  steps,
  children,
  defaultValues,
  isPublic = false,
}: StepShellProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
    mode: "onTouched",
  });

  const isLastStep = currentStep === steps.length - 1;

  async function onSubmit(data: any) {
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/forms/${formKey}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const result = await res.json();
      setSubmissionId(result.submission_id);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Submission failed. Please try again.");
    }
  }

  async function handleNext() {
    // Validate current step fields
    const currentFields = steps[currentStep]?.fields ?? [];
    const valid = await methods.trigger(currentFields as any);
    if (valid) {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }
  }

  function handlePrev() {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }

  if (status === "success") {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h2>
        <p className="text-green-700">
          Your submission has been received.
          {submissionId && (
            <span className="block text-sm mt-1 text-green-600">
              Reference: {submissionId}
            </span>
          )}
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setCurrentStep(0);
            methods.reset();
          }}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-heading font-bold mb-2">{title}</h1>
      {description && <p className="text-gray-600 mb-6">{description}</p>}

      {/* Step indicator */}
      {steps.length > 1 && (
        <nav className="mb-6">
          <ol className="flex flex-wrap gap-1 text-xs">
            {steps.map((step, i) => (
              <li
                key={step.id}
                className={`px-3 py-1 rounded-full border ${
                  i === currentStep
                    ? "bg-sky-600 text-white border-sky-600"
                    : i < currentStep
                      ? "bg-sky-100 text-sky-700 border-sky-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {step.title}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Honeypot for public forms */}
          {isPublic && (
            <input
              type="text"
              {...methods.register("website")}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
          )}

          {/* Current step content */}
          <div className="space-y-4">{children(currentStep)}</div>

          {/* Error display */}
          {status === "error" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {isLastStep ? (
              <button
                type="submit"
                disabled={status === "submitting"}
                className="px-6 py-2 bg-sky-600 text-white font-semibold rounded hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
              >
                {status === "submitting" ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-sky-600 text-white font-semibold rounded hover:bg-sky-700 text-sm"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
