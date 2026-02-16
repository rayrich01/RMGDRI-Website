import { NextResponse } from "next/server";
import { uploadFile, insertFileRecord } from "./supabase";
import type { FormKey } from "./types";
import { methodNotAllowed } from "./handler";

/**
 * Create an upload POST handler for a form.
 * Accepts multipart/form-data with fields:
 *   - submission_id (required)
 *   - field_key (required)
 *   - file (required, the file blob)
 */
export function createUploadHandler(formKey: FormKey) {
  async function POST(req: Request) {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        { error: "invalid_form_data" },
        { status: 400 }
      );
    }

    const submissionId = formData.get("submission_id");
    const fieldKey = formData.get("field_key");
    const file = formData.get("file");

    if (
      typeof submissionId !== "string" ||
      typeof fieldKey !== "string" ||
      !(file instanceof File)
    ) {
      return NextResponse.json(
        { error: "missing_fields", required: ["submission_id", "field_key", "file"] },
        { status: 400 }
      );
    }

    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "file_too_large", max_bytes: 10 * 1024 * 1024 },
        { status: 413 }
      );
    }

    try {
      const storagePath = await uploadFile({
        formKey,
        submissionId,
        fieldKey,
        file,
      });

      await insertFileRecord({
        submissionId,
        fieldKey,
        storagePath,
        originalFilename: file.name,
        contentType: file.type,
      });

      return NextResponse.json({ storage_path: storagePath });
    } catch (err: any) {
      console.error(`[forms/${formKey}/upload]`, err?.message);
      return NextResponse.json({ error: "upload_failed" }, { status: 500 });
    }
  }

  function GET() {
    return methodNotAllowed();
  }

  return { POST, GET };
}
