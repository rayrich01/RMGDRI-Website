# CR-79-002: Implementation Plan

## Exact UX Change

Add a `🚫 HIDDEN` suffix to dog names and a "Hidden from website" subtitle in Sanity Studio list views for dogs where `hideFromWebsite === true`.

**Before:** `🟢 Duke` (no indication of hidden state)
**After:** `🟢 Duke 🚫 HIDDEN` with subtitle "Hidden from website"

This applies in every Studio list that shows dog documents: Available Danes, All Dogs, Recently Adopted, Hidden from Website menu, etc.

## Files to Change

| File | Change |
|------|--------|
| `sanity/schemaTypes/dog.ts` | Add `hideFromWebsite` to preview select, append `🚫 HIDDEN` to title when true, add subtitle |

**One file, one function, 4 lines changed.**

## Why This Is the Minimum Viable Fix

1. The dedicated "Hidden from Website" menu item already exists (committed earlier on this branch)
2. The remaining gap is visibility within other lists — staff shouldn't have to navigate to the dedicated menu to know a dog is hidden
3. Modifying the preview `prepare` function is the smallest change that provides universal visibility
4. Uses the same emoji pattern (`🚫`) already established in the menu item title
5. No new files, no new components, no new dependencies

## Alternatives Considered and Rejected

| Alternative | Reason Rejected |
|-------------|----------------|
| Custom list item component with colored badge | Over-engineered for a boolean indicator; emoji in title achieves same visibility with zero new components |
| Separate "Hidden" column in list view | Sanity Studio document lists don't support custom columns without significant customization |
| Document badge plugin | Requires installing @sanity/document-badges or custom plugin — too heavy for one boolean |
| Only the dedicated menu (no preview change) | Doesn't solve the core visibility problem — staff in other lists still can't see hidden state |
