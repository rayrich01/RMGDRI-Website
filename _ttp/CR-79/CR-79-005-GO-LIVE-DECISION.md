# CR-79-005: Go-Live Decision

## Decision: READY WITH RESTRICTIONS

## Rationale
The implementation is complete and all code-level validations pass. The change is minimal (one file, one function, 4 lines) and uses existing patterns (emoji + title string, same as status indicators).

## Restrictions
1. **Live-fire visual confirmation required** — a team member should open the deployed Studio and verify:
   - A known hidden dog shows `🚫 HIDDEN` in the list view
   - A known non-hidden dog does NOT show the hidden indicator
   - The "Hidden from Website" menu item shows the correct filtered list
2. **Deploy Studio after merge** — the preview change requires a Studio rebuild/redeploy to take effect

## Classifications

| Dimension | Rating | Rationale |
|-----------|--------|-----------|
| Usability impact | HIGH | Staff can now instantly identify hidden dogs in any list view — resolves the core CR-79 complaint |
| Implementation complexity | LOW | 4 lines changed in one function, using existing patterns |
| Blast radius | LOW | Preview-only change. No schema, query, validation, or navigation changes |
| Reversibility | HIGH | Revert one commit to remove. No data migration, no schema change |

## What This Does NOT Address
- Why specific dogs are hidden (that's a content/operational decision)
- Bulk hide/unhide operations (not in CR-79 scope)
- CR-75 (separate CR, separate scope)
- Any public website behavior changes (this is Studio-only)
