# RMGDRI Admin UI — Style Guide
## CR-ADMIN-UI-001 | 2026-03-15

This guide governs all admin-facing forms in the RMGDRI website.
The reference implementation is src/components/admin/IntentForm.tsx.

---

## Design principle

Color communicates meaning, not decoration. Every color in the admin
system has a semantic role. Do not use these colors outside their role.

| Color   | Semantic meaning                          | Use for                              |
|---------|-------------------------------------------|--------------------------------------|
| Navy    | Structural / neutral / informational      | Headers, active states, nav          |
| Sage    | Safe / confirmed / autonomous             | Checkboxes, confirmed status, go     |
| Amber   | Gate / warning / requires approval        | Must-ask items, correction notes     |
| Red     | Prohibition / hard limit / never          | Never-do items, destructive actions  |
| Gold    | Progress / active / save                  | Progress rings, active tab, save btn |

---

## Components

All admin forms import from src/components/admin/ui/ only.
Never redefine these components inline.

| Component     | Use for                                              |
|---------------|------------------------------------------------------|
| AdminCard     | Every logical section — the primary layout container |
| AdminField    | All text inputs and textareas                        |
| AdminCheckbox | All multi-select / boolean inputs                    |
| AdminRadio    | All mutually exclusive choice inputs                 |
| StatusChip    | Any record with a confirmation or review state       |
| ProgressRing  | Stage completion, any percentage indicator           |
| AdminSaveBar  | Every form that has a save action                    |

---

## Tokens

All colors, spacing, and fonts live in src/styles/admin-tokens.ts.
No admin component ever hardcodes a hex value or pixel value.

---

## Page structure

Every admin form follows this layout order:
1. Navy header bar (title, identity, completion %)
2. Stage/tab navigation strip (dark navy, gold active indicator)
3. 4px gold progress bar
4. Scrollable content area (parchment background, cards)
5. Fixed AdminSaveBar at viewport bottom

---

## Adding a new admin form

1. Import tokens from @/styles/admin-tokens
2. Import all components from @/components/admin/ui
3. Use AdminCard for every section
4. Use AdminField for all text inputs
5. Use AdminCheckbox / AdminRadio for all selections
6. Use AdminSaveBar — always fixed to viewport bottom
7. Do not introduce new colors. Use existing semantic tokens.
8. Raise a CR before building. Reference this guide in the packet.
