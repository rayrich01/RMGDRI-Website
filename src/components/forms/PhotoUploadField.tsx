"use client";

import { useCallback, useRef, useState } from "react";

/**
 * PhotoUploadField — standalone file upload component (NO react-hook-form dependency).
 *
 * Flow:
 * 1. User picks file(s) via click or drag-and-drop
 * 2. Client validates type + size
 * 3. POSTs file as FormData to the provided uploadEndpoint
 * 4. Server uploads to R2 and returns { publicUrl, key }
 * 5. Stores publicUrl and calls onUrlsChange callback
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

interface UploadedPhoto {
  publicUrl: string;
  fileName: string;
  /** local object URL for thumbnail preview */
  previewUrl: string;
}

interface PhotoUploadFieldProps {
  label: string;
  helpText?: string;
  /** Max number of photos allowed. Defaults to 1. */
  maxFiles?: number;
  /** API endpoint to POST files to. */
  uploadEndpoint: string;
  /** Called whenever the set of uploaded URLs changes */
  onUrlsChange: (urls: string[]) => void;
}

export default function PhotoUploadField({
  label,
  helpText,
  maxFiles = 1,
  uploadEndpoint,
  onUrlsChange,
}: PhotoUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const remaining = maxFiles - photos.length;

  const uploadFile = useCallback(
    async (file: File): Promise<UploadedPhoto | null> => {
      // Client-side validation
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" is not an image file.`);
        return null;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(
          `"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is 10 MB.`
        );
        return null;
      }

      // Upload file directly to our API as FormData (server proxies to R2)
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (res.status === 503) {
          setError(
            body?.message ??
              "Photo uploads are not yet configured. You can email photos to adoptadane@rmgreatdane.org."
          );
        } else if (res.status === 429) {
          setError("Too many uploads. Please wait a moment and try again.");
        } else {
          setError(body?.message ?? body?.error ?? `Upload failed (${res.status}).`);
        }
        return null;
      }

      const { publicUrl } = await res.json();

      return {
        publicUrl,
        fileName: file.name,
        previewUrl: URL.createObjectURL(file),
      };
    },
    [uploadEndpoint]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files).slice(0, remaining);
      if (fileArr.length === 0) return;

      setError(null);
      setUploading(true);

      try {
        const results = await Promise.all(fileArr.map(uploadFile));
        const successful = results.filter(Boolean) as UploadedPhoto[];

        if (successful.length > 0) {
          setPhotos((prev) => {
            const next = [...prev, ...successful];
            onUrlsChange(next.map((p) => p.publicUrl));
            return next;
          });
        }
      } catch (e: any) {
        setError(e?.message ?? "Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [remaining, uploadFile, onUrlsChange]
  );

  const removePhoto = useCallback(
    (index: number) => {
      setPhotos((prev) => {
        const next = prev.filter((_, i) => i !== index);
        // Revoke the old object URL to free memory
        if (prev[index]?.previewUrl) {
          URL.revokeObjectURL(prev[index].previewUrl);
        }
        onUrlsChange(next.map((p) => p.publicUrl));
        return next;
      });
    },
    [onUrlsChange]
  );

  // --- Drop handlers ---
  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(true);
    },
    []
  );
  const onDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
    },
    []
  );
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      if (remaining <= 0) return;
      if (e.dataTransfer.files?.length) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles, remaining]
  );

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}

      {/* Thumbnail previews */}
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {photos.map((p, i) => (
            <div
              key={p.publicUrl}
              className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.previewUrl}
                alt={p.fileName}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone / file picker */}
      {remaining > 0 && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed
            px-4 py-6 cursor-pointer transition-colors
            ${dragOver ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-teal-400 hover:bg-gray-50"}
            ${uploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          {uploading ? (
            <span className="text-sm text-gray-500">Uploading...</span>
          ) : (
            <>
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16v-8m0 0l-3 3m3-3l3 3M6.75 19.5A4.5 4.5 0 013 15.75V8.25A4.5 4.5 0 017.5 3.75h9A4.5 4.5 0 0121 8.25v7.5a4.5 4.5 0 01-4.5 4.5H6.75z"
                />
              </svg>
              <span className="text-sm text-gray-600">
                {maxFiles === 1
                  ? "Click or drag a photo here"
                  : `Click or drag photos here (${remaining} remaining)`}
              </span>
              <span className="text-xs text-gray-400">
                JPEG, PNG, WebP, GIF, HEIC &bull; Max 10 MB each
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={maxFiles > 1}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFiles(e.target.files);
            e.target.value = ""; // reset so same file can be re-selected
          }
        }}
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
