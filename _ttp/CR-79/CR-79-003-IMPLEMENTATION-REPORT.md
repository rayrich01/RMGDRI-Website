# CR-79-003: Implementation Report

## Exact Code Changed

**File:** `sanity/schemaTypes/dog.ts`

### Change 1: Added `hideFromWebsite` to preview select (line 301)
```typescript
// Before
select: {
  title: 'name',
  status: 'status',
  media: 'mainImage',
},

// After
select: {
  title: 'name',
  status: 'status',
  hideFromWebsite: 'hideFromWebsite',
  media: 'mainImage',
},
```

### Change 2: Added `hideFromWebsite` to prepare destructuring (line 305)
```typescript
// Before
prepare({ title, status, media }: Record<string, any>) {

// After
prepare({ title, status, hideFromWebsite, media }: Record<string, any>) {
```

### Change 3: Added hidden tag and subtitle (lines 317-322)
```typescript
// Before
return {
  title: `${emoji} ${title}`,
  media,
}

// After
const hiddenTag = hideFromWebsite ? ' 🚫 HIDDEN' : ''

return {
  title: `${emoji} ${title}${hiddenTag}`,
  subtitle: hideFromWebsite ? 'Hidden from website' : undefined,
  media,
}
```

## Before/After Behavior

### Before
- Dog list items showed: `🟢 Duke` (status emoji + name only)
- No way to tell if a dog was hidden without clicking into the document
- Hidden dogs were visually identical to visible dogs in every list

### After
- Hidden dogs show: `🟢 Duke 🚫 HIDDEN` with subtitle "Hidden from website"
- Non-hidden dogs show: `🟢 Duke` (unchanged — no subtitle)
- Hidden state is immediately visible in every Studio list: Available Danes, All Dogs, Hidden from Website, etc.

## What Was Added
- **Badge in list items:** Yes — `🚫 HIDDEN` appended to title
- **Subtitle:** Yes — "Hidden from website" for hidden dogs
- **Dedicated menu item:** Yes — already committed earlier on this branch (`f52f9f5`)
- **Both badge and menu:** Yes

## Limitations
- The indicator uses emoji + text in the title field, not a colored badge component. This is because Sanity's default document list preview supports `title`, `subtitle`, and `media` — not custom badge components without a plugin.
- The `🚫 HIDDEN` text appears at the end of the title, so very long dog names may push it offscreen in narrow viewports. In practice, dog names are short (1-3 words).
