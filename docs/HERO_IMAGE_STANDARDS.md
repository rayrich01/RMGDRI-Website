# Hero Image Standards

**Document ID:** RMGDRI-STD-001
**Created:** 2026-02-08
**Purpose:** Ensure all hero images display subjects (especially dog portraits) without cropping heads or critical features.

---

## Core Principle

**Never crop the subject's head or critical features in hero images.**

---

## Standard Practice

### 1. **Aspect Ratio Selection**

Choose container aspect ratio based on typical image orientation:

| Image Type | Typical Ratio | Container Class | Object Fit |
|------------|---------------|-----------------|------------|
| Dog portraits (vertical) | 3:4 | `aspect-[3/4]` | `object-contain` |
| Landscape photos | 16:9 | `aspect-video` | `object-contain` |
| Square photos | 1:1 | `aspect-square` | `object-contain` |
| Unknown/Mixed | 4:3 | `aspect-[4/3]` | `object-contain` |

### 2. **Object Fit Rules**

**Always use `object-contain` for hero images unless:**
- You have explicit crop/hotspot data from Sanity
- The image is designed as a background pattern
- You're showing a decorative section (not a portrait)

**Never use `object-cover` for:**
- Dog portraits
- People photos
- Any image where the subject's face is important

### 3. **Sanity Image Integration**

When available, use Sanity's built-in image tools:

```typescript
mainImage {
  asset-> {
    url,
    metadata {
      dimensions
    }
  },
  hotspot,
  crop
}
```

If `hotspot` or `crop` exist, construct URL with Sanity's image API:
```typescript
`${dog.mainImage.asset.url}?fit=crop&crop=focalpoint`
```

### 4. **Fallback Behavior**

When no image is available:
```tsx
<div className="w-full h-full flex items-center justify-center text-9xl text-gray-300">
  🐕
</div>
```

---

## Component Pattern

**Standard Dog Detail Hero:**

```tsx
<div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
  {dog.mainImage?.asset?.url ? (
    <Image
      src={dog.mainImage.asset.url}
      alt={dog.name || "Dog photo"}
      fill
      className="object-contain"
      priority
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-9xl text-gray-300">
      🐕
    </div>
  )}
</div>
```

**Key attributes:**
- `aspect-[3/4]` matches typical portrait photos
- `object-contain` preserves full image without cropping
- `bg-gray-100` provides clean letterbox background
- `rounded-xl` maintains design consistency

---

## Testing Checklist

Before deploying a new dog detail page:

- [ ] Load page in browser
- [ ] Verify dog's full head is visible
- [ ] Check ears aren't cropped
- [ ] Confirm no critical features are cut off
- [ ] Test on mobile (portrait orientation)
- [ ] Test on desktop (landscape orientation)

---

## Migration Guide

**To fix existing pages:**

1. Find all uses of `aspect-square` with dog images:
   ```bash
   grep -r "aspect-square" src/app --include="*.tsx"
   ```

2. For each dog detail component:
   - Change `aspect-square` → `aspect-[3/4]`
   - Change `object-cover` → `object-contain`
   - Add `bg-gray-100` for letterbox background

3. Test locally:
   ```bash
   npm run dev
   # Visit /available-danes/[slug] pages
   ```

---

## Related Documents

- **Sanity Schema:** `sanity/schemas/dog.ts`
- **Image Upload Guide:** (TBD)
- **Component Library:** (TBD)

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-02-08 | Initial standard created after Chloe hero crop issue | System |
