// src/styles/admin-tokens.ts
// RMGDRI Admin Design System — Single source of truth for all admin UI tokens
// CR-ADMIN-UI-001 | 2026-03-15
// DO NOT add values here without a corresponding usage. Do not remove values
// without confirming no component imports them.

export const AdminColors = {
  // ── Page structure ─────────────────────────────────────────────────────
  bg:           '#F7F4EF',   // Warm parchment — page background
  surface:      '#FFFFFF',   // Card and input surfaces
  border:       '#D8D0C4',   // Default border — warm tan (not cool gray)
  borderDark:   '#B8AA98',   // Focused / filled input border
  muted:        '#F2EEE8',   // Empty input background, subtle fills

  // ── Text ───────────────────────────────────────────────────────────────
  text:         '#2C2416',   // Primary body text
  textMid:      '#5A4E3C',   // Secondary text, labels
  textLight:    '#8A7E6E',   // Hints, placeholders, metadata

  // ── Primary — Navy ─────────────────────────────────────────────────────
  // Used for: headers, active radio/tab states, structural elements
  navy:         '#1C3557',
  navyLight:    '#2A4E7F',   // Hover states

  // ── Semantic: Safe / Confirmed / Autonomous ─────────────────────────────
  // Used for: confirmed checkboxes, safe-to-act items, positive status
  sage:         '#4A7C59',
  sageLight:    '#EBF3EE',   // Checked checkbox background

  // ── Semantic: Gate / Warning / Must-Ask ────────────────────────────────
  // Used for: items requiring human approval, correction notes, warnings
  amber:        '#C45E00',
  amberLight:   '#FFF3E0',

  // ── Semantic: Prohibition / Never-Do / Hard Limit ──────────────────────
  // Used for: absolute prohibitions, hard limits, destructive actions
  red:          '#8B1A1A',
  redLight:     '#FDF0F0',

  // ── Accent — Gold ──────────────────────────────────────────────────────
  // Used for: active tab indicator, save button, progress fill, in-progress rings
  gold:         '#B8860B',
  goldLight:    '#D4A017',

  // ── Progress ring states ────────────────────────────────────────────────
  ringComplete: '#4A7C59',   // = sage — 100% complete
  ringPartial:  '#D4A017',   // = goldLight — in progress
  ringEmpty:    '#D8D0C4',   // = border — not started
} as const

export const AdminFonts = {
  heading:  'Georgia, serif',
  body:     'Georgia, serif',
  ui:       'Georgia, serif',
} as const

export const AdminSpacing = {
  cardPadding:    24,   // px — internal card padding
  cardRadius:     10,   // px — card border radius
  inputRadius:    6,    // px — input/button border radius
  chipRadius:     20,   // px — status chip border radius
  sectionGap:     20,   // px — vertical gap between cards
} as const
