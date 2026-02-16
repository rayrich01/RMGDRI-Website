"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface SignatureFieldProps {
  name: string;
  label: string;
  required?: boolean;
  /** "typed" = text input, "checkbox" = attestation checkbox */
  mode?: "typed" | "checkbox";
}

export default function SignatureField({
  name,
  label,
  required,
  mode = "typed",
}: SignatureFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const [agreed, setAgreed] = useState(false);

  const err = (errors[name] as any)?.message as string | undefined;

  if (mode === "checkbox") {
    return (
      <div>
        <label className="flex items-start gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            {...register(name)}
            className="mt-0.5 text-sky-600 focus:ring-sky-500 rounded"
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </span>
        </label>
        {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
      </div>
    );
  }

  // Typed signature
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={name}
        type="text"
        placeholder="Type your full name as signature"
        {...register(name)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm italic"
      />
      {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
    </div>
  );
}
