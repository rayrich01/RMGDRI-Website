import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getFormRegistry, getFormTypeLabel } from "@/lib/forms/registry";
import type { FieldDef } from "@/lib/forms/bite-report-human/field-map";

export const dynamic = "force-dynamic";

/* ── helpers ─────────────────────────────────────────────────────────── */

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return String(iso);
  }
}

/** Rewrite legacy media.rmgdri.org URLs to the working R2 public URL. */
const R2_PUBLIC = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";
function normalizeImageUrl(url: string): string {
  if (R2_PUBLIC && url.includes("media.rmgdri.org")) {
    return url.replace("https://media.rmgdri.org", R2_PUBLIC);
  }
  return url;
}

function isImageUrl(val: unknown): val is string {
  if (typeof val !== "string") return false;
  return /\.(jpe?g|png|gif|webp|heic|heif)$/i.test(val) || val.includes("r2.dev/") || val.includes("media.rmgdri.org");
}

function isImageUrlArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.length > 0 && val.every(isImageUrl);
}

/* ── field value renderer ────────────────────────────────────────────── */

function FieldValue({
  field,
  value,
}: {
  field?: FieldDef;
  value: unknown;
}) {
  // Photos
  if (field?.type === "photos" || isImageUrlArray(value)) {
    const urls = Array.isArray(value) ? value : [value];
    if (urls.length === 0 || (urls.length === 1 && !urls[0])) {
      return <span className="text-gray-400 italic">No photos uploaded</span>;
    }
    return (
      <div className="flex flex-wrap gap-3">
        {urls.map((url, i) => {
          const src = normalizeImageUrl(String(url));
          return (
            <a
              key={i}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Photo ${i + 1}`}
                className="w-36 h-36 object-cover rounded-md border border-gray-200 hover:border-blue-400 transition-colors"
              />
            </a>
          );
        })}
      </div>
    );
  }

  // Checkbox (boolean)
  if (field?.type === "checkbox") {
    return (
      <span className={value ? "text-green-700 font-medium" : "text-gray-500"}>
        {value ? "Yes" : "No"}
      </span>
    );
  }

  // Arrays (non-image)
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-400 italic">None</span>;
    return <span>{value.join(", ")}</span>;
  }

  // Null / empty
  if (value === null || value === undefined || value === "") {
    return <span className="text-gray-400 italic">—</span>;
  }

  // Objects (render as formatted JSON)
  if (typeof value === "object") {
    return (
      <pre className="text-xs bg-gray-50 rounded p-2 overflow-x-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  // Primitive string/number/boolean
  return <span className="whitespace-pre-wrap">{String(value)}</span>;
}

/* ── section renderer using field-map ────────────────────────────────── */

function FieldMapView({
  sections,
  fields,
  payload,
}: {
  sections: readonly string[];
  fields: FieldDef[];
  payload: Record<string, unknown>;
}) {
  return (
    <div className="space-y-8">
      {sections.map((section) => {
        const sectionFields = fields.filter((f) => f.section === section);
        if (sectionFields.length === 0) return null;

        return (
          <div key={section}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              {section}
            </h3>
            <dl className="space-y-4">
              {sectionFields.map((field) => (
                <div key={field.key}>
                  <dt className="text-sm font-medium text-gray-500 mb-1">
                    {field.label}
                  </dt>
                  <dd className="text-sm text-gray-900">
                    <FieldValue field={field} value={payload[field.key]} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}

      {/* Render any payload keys not in the field-map */}
      <UnmappedFields fields={fields} payload={payload} />
    </div>
  );
}

/* ── raw fallback for unknown form types ─────────────────────────────── */

function RawPayloadView({ payload }: { payload: Record<string, unknown> }) {
  const entries = Object.entries(payload);
  if (entries.length === 0) {
    return <p className="text-gray-400 italic">No form data.</p>;
  }

  return (
    <dl className="space-y-4">
      {entries.map(([key, value]) => (
        <div key={key}>
          <dt className="text-sm font-medium text-gray-500 mb-1">
            {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </dt>
          <dd className="text-sm text-gray-900">
            <FieldValue value={value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ── render payload keys that aren't in the field-map ────────────────── */

function UnmappedFields({
  fields,
  payload,
}: {
  fields: FieldDef[];
  payload: Record<string, unknown>;
}) {
  const mappedKeys = new Set(fields.map((f) => f.key));
  const extra = Object.entries(payload).filter(
    ([k, v]) => !mappedKeys.has(k) && v !== "" && v !== null && v !== undefined
  );
  if (extra.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
        Additional Data
      </h3>
      <dl className="space-y-4">
        {extra.map(([key, value]) => (
          <div key={key}>
            <dt className="text-sm font-medium text-gray-500 mb-1">
              {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </dt>
            <dd className="text-sm text-gray-900">
              <FieldValue value={value} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ── page ─────────────────────────────────────────────────────────────── */

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const profile = (data.applicant_profile ?? {}) as Record<string, unknown>;
  const flags = (data.internal_flags ?? {}) as Record<string, unknown>;
  const formType = String(
    flags.form_type ?? profile.form_type ?? data.type ?? "unknown"
  );
  const payload = (profile.payload ?? {}) as Record<string, unknown>;
  const registry = getFormRegistry(formType);

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/submissions"
        className="text-sm text-blue-600 hover:text-blue-800 mb-6 inline-block"
      >
        &larr; Back to Submissions
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {getFormTypeLabel(formType)}
            </h1>
            <p className="text-sm text-gray-500">
              Submitted {formatDate(profile.submitted_at as string | null ?? data.submitted_at)}
            </p>
          </div>
          <span
            className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
              data.status === "submitted"
                ? "bg-blue-100 text-blue-800"
                : data.status === "approved"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {data.status}
          </span>
        </div>

        {/* Metadata row */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
          {data.applicant_name && (
            <div>
              <span className="font-medium text-gray-500">Name:</span>{" "}
              {data.applicant_name}
            </div>
          )}
          {data.applicant_email && (
            <div>
              <span className="font-medium text-gray-500">Email:</span>{" "}
              <a
                href={`mailto:${data.applicant_email}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {data.applicant_email}
              </a>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-500">ID:</span>{" "}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
              {data.id}
            </code>
          </div>
        </div>
      </div>

      {/* Form data */}
      <div className="bg-white rounded-lg shadow p-6">
        {registry ? (
          <FieldMapView
            sections={registry.sections}
            fields={registry.fields}
            payload={payload}
          />
        ) : (
          <RawPayloadView payload={payload} />
        )}
      </div>
    </div>
  );
}
