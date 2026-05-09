/**
 * Application Event Logger — Observability Layer
 *
 * Logs lifecycle events to application_events table.
 * Non-blocking: failures are caught and logged to console, never thrown.
 * Uses service role client to bypass RLS for writes.
 */
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export type ApplicationEventType =
  | "application_created"
  | "application_autosaved"
  | "application_section_saved"
  | "application_submitted"
  | "applicant_login"
  | "applicant_registration";

interface LogEventParams {
  applicationId?: string | null;
  eventType: ApplicationEventType;
  actorId?: string | null;
  actorType?: "applicant" | "system" | "admin";
  metadata?: Record<string, unknown>;
}

/**
 * Log an application lifecycle event.
 * Non-blocking — never throws. Safe to call in any context.
 */
export async function logApplicationEvent({
  applicationId = null,
  eventType,
  actorId = null,
  actorType = "applicant",
  metadata = {},
}: LogEventParams): Promise<void> {
  try {
    const supabase = createAdminSupabaseClient();

    await supabase.from("application_events").insert({
      application_id: applicationId,
      event_type: eventType,
      actor_id: actorId,
      actor_type: actorType,
      metadata,
    });
  } catch (err) {
    // Non-blocking: log failure but never throw
    console.error("[EVENT LOGGER] Failed to log event:", eventType, err);
  }
}

/**
 * Get audit trail for a specific application.
 * Used by admin to view lifecycle history.
 */
export async function getApplicationEvents(applicationId: string) {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("application_events")
    .select("*")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[EVENT LOGGER] Failed to fetch events:", error);
    return [];
  }

  return data;
}
