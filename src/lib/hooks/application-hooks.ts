/**
 * Application Lifecycle Hook Stubs
 * TTP-RMGDRI-APPLICATION-INGEST-001
 *
 * These are stub implementations for Stage 1.
 * Actual implementations will be wired in future TTPs.
 */

interface Application {
  id: string;
  user_id: string;
  type: string;
  status: string;
  data: Record<string, unknown>;
  submitted_at: string | null;
}

/**
 * Fired after an application transitions from draft → submitted.
 * Hook points:
 * - Send applicant confirmation email
 * - Notify staff
 * - Assign screener
 */
export async function onApplicationSubmitted(application: Application): Promise<void> {
  // STUB: Send applicant confirmation email
  console.log(
    `[HOOK STUB] Email: confirmation to user ${application.user_id} for application ${application.id}`
  );

  // STUB: Notify staff
  console.log(
    `[HOOK STUB] Notification: staff notified of new ${application.type} application ${application.id}`
  );

  // STUB: Assign screener
  console.log(
    `[HOOK STUB] Screener: assignment triggered for application ${application.id}`
  );
}
