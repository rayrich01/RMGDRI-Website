# CR-79-001: Current Studio Landscape

## Existing Field

- **Field name:** `hideFromWebsite`
- **Type:** `boolean`
- **Default:** `false`
- **Group:** `status`
- **Schema file:** `sanity/schemaTypes/dog.ts` (lines 140-146)
- **Description:** "Keep this record in Sanity but do not display it on the public website"

## Current Visibility Gap

### What already works (pre-this-packet, already committed on this branch)
- **Dedicated menu item:** "🚫 Hidden from Website" in Studio nav (studioStructure.ts lines 71-79)
- Filters for `_type == "dog" && hideFromWebsite == true`
- Staff can navigate to this list to see all hidden dogs

### What was still missing (the gap)
- In **All Dogs**, **Available Danes**, or any other dog list view, hidden dogs looked identical to visible dogs
- No visual indicator on the list item preview
- Staff browsing the main lists could not tell at a glance which dogs were hidden
- The preview only showed `{statusEmoji} {name}` — no hidden state in title or subtitle
- Staff had to click into each dog document to check the `hideFromWebsite` toggle

## Relevant Studio Files

| File | Purpose |
|------|---------|
| `sanity/schemaTypes/dog.ts` | Dog schema definition + preview |
| `sanity/studioStructure.ts` | Studio navigation structure |
| `sanity/sanity.config.ts` | Studio configuration |

## Recommended Minimal Fix

Add `hideFromWebsite` to the preview `select` and show a `🚫 HIDDEN` tag in the title + a "Hidden from website" subtitle. This makes hidden dogs visually distinct in every list view across the entire Studio, not just the dedicated menu.
