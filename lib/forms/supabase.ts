import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using SERVICE ROLE key.
 * Only import in API route handlers (never in client components).
 */
export function getServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Insert a form submission and its initial audit event.
 * Returns the submission_id.
 */
export async function insertSubmission(opts: {
  formKey: string;
  formVersion: number;
  email?: string | null;
  payload: Record<string, unknown>;
}): Promise<string> {
  const sb = getServiceClient();

  const { data: row, error: insertErr } = await sb
    .from("form_submissions")
    .insert({
      form_key: opts.formKey,
      form_version: opts.formVersion,
      submitted_by_email: opts.email ?? null,
      payload: opts.payload,
      current_status: "submitted",
    })
    .select("id")
    .single();

  if (insertErr || !row?.id) {
    throw new Error(insertErr?.message ?? "Failed to insert submission");
  }

  const submissionId: string = row.id;

  // Audit event
  const { error: evErr } = await sb.from("submission_events").insert({
    submission_id: submissionId,
    event_type: "status_change",
    from_status: null,
    to_status: "submitted",
    actor: opts.email ?? "anonymous",
    note: "Form submitted via web",
  });

  if (evErr) {
    // Non-fatal: submission exists, audit row failed.
    console.error("Failed to insert audit event:", evErr.message);
  }

  return submissionId;
}

/**
 * Record a file attachment for a submission.
 */
export async function insertFileRecord(opts: {
  submissionId: string;
  fieldKey: string;
  storagePath: string;
  originalFilename?: string;
  contentType?: string;
}) {
  const sb = getServiceClient();

  const { error } = await sb.from("submission_files").insert({
    submission_id: opts.submissionId,
    field_key: opts.fieldKey,
    storage_provider: "supabase",
    storage_path: opts.storagePath,
    original_filename: opts.originalFilename ?? null,
    content_type: opts.contentType ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Upload a file to Supabase Storage (form-uploads bucket).
 * Returns the storage path.
 */
export async function uploadFile(opts: {
  formKey: string;
  submissionId: string;
  fieldKey: string;
  file: File;
}): Promise<string> {
  const sb = getServiceClient();
  const ext = opts.file.name.split(".").pop() ?? "bin";
  const storagePath = `${opts.formKey}/${opts.submissionId}/${opts.fieldKey}/${Date.now()}.${ext}`;

  const { error } = await sb.storage
    .from("form-uploads")
    .upload(storagePath, opts.file, {
      contentType: opts.file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return storagePath;
}
