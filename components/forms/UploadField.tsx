"use client";

import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

interface UploadFieldProps {
  name: string;
  label: string;
  required?: boolean;
  accept?: string;
  maxFiles?: number;
  helpText?: string;
}

export default function UploadField({
  name,
  label,
  required,
  accept = "image/*,.pdf",
  maxFiles = 3,
  helpText,
}: UploadFieldProps) {
  const { setValue, watch, formState: { errors } } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const files: File[] = watch(name) ?? [];

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const merged = [...files, ...selected].slice(0, maxFiles);
    setValue(name, merged, { shouldValidate: true });

    // Generate previews for images
    const newPreviews: string[] = [];
    merged.forEach((f) => {
      if (f.type.startsWith("image/")) {
        newPreviews.push(URL.createObjectURL(f));
      }
    });
    setPreviews(newPreviews);
  }

  function removeFile(index: number) {
    const updated = files.filter((_, i) => i !== index);
    setValue(name, updated, { shouldValidate: true });
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  const err = (errors[name] as any)?.message as string | undefined;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-sky-400 transition-colors">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm text-sky-600 hover:text-sky-700 font-medium"
        >
          {files.length > 0
            ? `${files.length} file${files.length > 1 ? "s" : ""} selected — click to add more`
            : "Click to upload"}
        </button>
        <p className="text-xs text-gray-500 mt-1">
          {helpText ?? `Up to ${maxFiles} file${maxFiles > 1 ? "s" : ""}. Max 10 MB each.`}
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between text-sm bg-gray-50 px-3 py-1 rounded"
            >
              <span className="truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-red-500 hover:text-red-700 ml-2 text-xs"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Image previews */}
      {previews.length > 0 && (
        <div className="flex gap-2 mt-2">
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Preview ${i + 1}`}
              className="h-16 w-16 object-cover rounded border"
            />
          ))}
        </div>
      )}

      {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
    </div>
  );
}
