"use client";

import { useFormContext } from "react-hook-form";
import type { FieldDescriptor } from "../../lib/forms/types";

interface FieldProps {
  descriptor: FieldDescriptor;
  /** Override the form field name (defaults to descriptor.key) */
  name?: string;
}

const baseInput =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const errorClass = "text-xs text-red-600 mt-1";

export default function Field({ descriptor, name }: FieldProps) {
  const fieldName = name ?? descriptor.key;
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  // Conditional visibility
  if (descriptor.conditionalOn) {
    const depVal = watch(descriptor.conditionalOn);
    const show = descriptor.conditionalValues
      ? descriptor.conditionalValues.includes(String(depVal))
      : Boolean(depVal);
    if (!show) return null;
  }

  const err = getNestedError(errors, fieldName);
  const reqMark = descriptor.required ? (
    <span className="text-red-500 ml-0.5">*</span>
  ) : null;

  switch (descriptor.type) {
    case "text":
    case "email":
    case "phone":
    case "date":
    case "initials":
      return (
        <div>
          <label htmlFor={fieldName} className={labelClass}>
            {descriptor.label}
            {reqMark}
          </label>
          <input
            id={fieldName}
            type={
              descriptor.type === "phone"
                ? "tel"
                : descriptor.type === "initials"
                  ? "text"
                  : descriptor.type
            }
            placeholder={descriptor.placeholder}
            {...register(fieldName)}
            className={baseInput}
            maxLength={descriptor.type === "initials" ? 5 : undefined}
          />
          {descriptor.helpText && (
            <p className="text-xs text-gray-500 mt-1">{descriptor.helpText}</p>
          )}
          {err && <p className={errorClass}>{err}</p>}
        </div>
      );

    case "number":
      return (
        <div>
          <label htmlFor={fieldName} className={labelClass}>
            {descriptor.label}
            {reqMark}
          </label>
          <input
            id={fieldName}
            type="number"
            placeholder={descriptor.placeholder}
            {...register(fieldName, { valueAsNumber: true })}
            className={baseInput}
          />
          {err && <p className={errorClass}>{err}</p>}
        </div>
      );

    case "textarea":
      return (
        <div>
          <label htmlFor={fieldName} className={labelClass}>
            {descriptor.label}
            {reqMark}
          </label>
          <textarea
            id={fieldName}
            rows={4}
            placeholder={descriptor.placeholder}
            {...register(fieldName)}
            className={baseInput + " resize-y min-h-[80px]"}
          />
          {err && <p className={errorClass}>{err}</p>}
        </div>
      );

    case "radio":
      return (
        <fieldset>
          <legend className={labelClass}>
            {descriptor.label}
            {reqMark}
          </legend>
          <div className="space-y-1 mt-1">
            {(descriptor.options ?? []).map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="radio"
                  value={opt}
                  {...register(fieldName)}
                  className="text-sky-600 focus:ring-sky-500"
                />
                {opt}
              </label>
            ))}
          </div>
          {err && <p className={errorClass}>{err}</p>}
        </fieldset>
      );

    case "checkbox":
      return (
        <fieldset>
          <legend className={labelClass}>
            {descriptor.label}
            {reqMark}
          </legend>
          <div className="space-y-1 mt-1">
            {(descriptor.options ?? []).map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={opt}
                  {...register(fieldName)}
                  className="text-sky-600 focus:ring-sky-500 rounded"
                />
                {opt}
              </label>
            ))}
          </div>
          {err && <p className={errorClass}>{err}</p>}
        </fieldset>
      );

    case "select":
      return (
        <div>
          <label htmlFor={fieldName} className={labelClass}>
            {descriptor.label}
            {reqMark}
          </label>
          <select
            id={fieldName}
            {...register(fieldName)}
            className={baseInput}
          >
            <option value="">Select...</option>
            {(descriptor.options ?? []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {err && <p className={errorClass}>{err}</p>}
        </div>
      );

    case "rating-scale": {
      const [min, max] = descriptor.scaleRange ?? [1, 5];
      const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      return (
        <fieldset>
          <legend className={labelClass}>
            {descriptor.label}
            {reqMark}
          </legend>
          <div className="flex items-center gap-3 mt-1">
            {descriptor.scaleMin && (
              <span className="text-xs text-gray-500">{descriptor.scaleMin}</span>
            )}
            {range.map((n) => (
              <label key={n} className="flex flex-col items-center text-xs gap-0.5 cursor-pointer">
                <input
                  type="radio"
                  value={String(n)}
                  {...register(fieldName)}
                  className="text-sky-600 focus:ring-sky-500"
                />
                {n}
              </label>
            ))}
            {descriptor.scaleMax && (
              <span className="text-xs text-gray-500">{descriptor.scaleMax}</span>
            )}
          </div>
          {err && <p className={errorClass}>{err}</p>}
        </fieldset>
      );
    }

    case "address":
      return (
        <fieldset className="space-y-2">
          <legend className={labelClass}>
            {descriptor.label}
            {reqMark}
          </legend>
          <input
            placeholder="Street Address"
            {...register(`${fieldName}.street`)}
            className={baseInput}
          />
          <input
            placeholder="Street Address Line 2"
            {...register(`${fieldName}.street2`)}
            className={baseInput}
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              placeholder="City"
              {...register(`${fieldName}.city`)}
              className={baseInput}
            />
            <input
              placeholder="State"
              {...register(`${fieldName}.state`)}
              className={baseInput}
            />
            <input
              placeholder="Zip Code"
              {...register(`${fieldName}.zip`)}
              className={baseInput}
            />
          </div>
          {err && <p className={errorClass}>{err}</p>}
        </fieldset>
      );

    default:
      return (
        <div>
          <label className={labelClass}>
            {descriptor.label} <span className="text-gray-400">(unsupported type: {descriptor.type})</span>
          </label>
        </div>
      );
  }
}

/** Retrieve nested error message from react-hook-form errors object */
function getNestedError(errors: Record<string, any>, path: string): string | undefined {
  const parts = path.split(".");
  let current = errors;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = current[part];
  }
  return current?.message as string | undefined;
}
