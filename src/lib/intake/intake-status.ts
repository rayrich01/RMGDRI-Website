/**
 * Intake Status Helpers
 * TTP-RMGDRI-INTAKE-STATUS-CONSUMPTION-001
 *
 * Interprets globalIntakeMode, ownerSurrenderMode, shelterTransferMode.
 * Provides type-safe mode evaluation.
 */

export type IntakeMode = "open" | "limited" | "paused";

export interface IntakeControl {
  globalIntakeMode: IntakeMode | null;
  ownerSurrenderMode: IntakeMode | null;
  shelterTransferMode: IntakeMode | null;
  pausePageEnabled: boolean | null;
  pausePageTitle: string | null;
  pausePageHeading: string | null;
  pausePageBody: string | null;
  intakeReviewEmail: string | null;
  limitedReviewInstructions: string | null;
  returnHomeEnabled: boolean | null;
  returnHomeLabel: string | null;
  returnHomeHref: string | null;
  effectiveFrom: string | null;
  lastReviewedBy: string | null;
  internalOpsNotes: string | null;
}

/**
 * Determine the effective mode for a specific intake type.
 * Global mode overrides unless the specific mode is more restrictive.
 */
export function getEffectiveMode(
  globalMode: IntakeMode | null,
  specificMode: IntakeMode | null
): IntakeMode {
  const g = globalMode || "paused";
  const s = specificMode || "paused";

  // Most restrictive wins
  const severity: Record<IntakeMode, number> = { paused: 2, limited: 1, open: 0 };
  return severity[g] >= severity[s] ? g : s;
}

/**
 * Check if intake is effectively paused for a specific type.
 */
export function isIntakePaused(
  globalMode: IntakeMode | null,
  specificMode: IntakeMode | null
): boolean {
  return getEffectiveMode(globalMode, specificMode) === "paused";
}

/**
 * Check if intake is in limited mode for a specific type.
 */
export function isIntakeLimited(
  globalMode: IntakeMode | null,
  specificMode: IntakeMode | null
): boolean {
  return getEffectiveMode(globalMode, specificMode) === "limited";
}

/**
 * Check if intake is open for a specific type.
 */
export function isIntakeOpen(
  globalMode: IntakeMode | null,
  specificMode: IntakeMode | null
): boolean {
  return getEffectiveMode(globalMode, specificMode) === "open";
}
