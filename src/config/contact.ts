/**
 * Centralized contact information for RMGDRI
 * Single source of truth for all email addresses used throughout the site
 */

export const CONTACT_EMAILS = {
  /** General information and inquiries */
  INFO: 'info@rmgreatdane.org',

  /** Adoption inquiries and applications */
  ADOPTION: 'adoptadane@rmgreatdane.org',

  /** Volunteer program inquiries */
  VOLUNTEER: 'volunteer@rmgreatdane.org',

  /** Dog rehoming/surrender inquiries */
  REHOME: 'rehome@rmgreatdane.org',

  /** Placement coordinator */
  PLACEMENTS: 'placements@rmgreatdane.org',

  /** Training program inquiries */
  TRAINING: 'Training@rmgreatdane.org',
} as const

export type ContactEmailKey = keyof typeof CONTACT_EMAILS
