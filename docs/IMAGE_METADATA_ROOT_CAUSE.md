# Image Metadata Root Cause Analysis & Resolution

**Date**: 2026-02-12
**Status**: ✅ ROOT CAUSE IDENTIFIED - Schema Fix Applied
**Issue**: Cannot populate image metadata (alt text, keywords, etc.)

---

## Root Cause

The `dog` schema was using the basic Sanity `image` type for photos instead of the custom `dogImage` type that includes metadata fields.

###Before (Broken):
```typescript
// sanity/schemaTypes/dog.ts (lines 211-233)
defineField({
  name: 'mainImage',
  title: 'Main Photo',
  type: 'image',  // ❌ Basic image type - no metadata fields
  group: 'photos',
  options: { hotspot: true },
  description: 'Primary photo shown in listings',
}),
defineField({
  name: 'gallery',
  title: 'Additional Photos',
  type: 'array',
  group: 'photos',
  of: [{
    type: 'image',  // ❌ Basic image type - no metadata fields
    options: { hotspot: true },
    fields: [
      { name: 'caption', type: 'string', title: 'Caption' },  // Only caption field
    ],
  }],
}),
```

### After (Fixed):
```typescript
// sanity/schemaTypes/dog.ts (updated)
defineField({
  name: 'mainImage',
  title: 'Main Photo',
  type: 'dogImage',  // ✅ Custom type with full metadata
  group: 'photos',
  description: 'Primary photo shown in listings',
}),
defineField({
  name: 'gallery',
  title: 'Additional Photos',
  type: 'array',
  group: 'photos',
  of: [{ type: 'dogImage' }],  // ✅ Custom type with full metadata
  description: 'Additional photos with full metadata (alt text required for WCAG compliance)',
}),
```

---

## What dogImage Provides

The `dogImage` schema type (defined in `sanity/schemaTypes/objects/dogImage.ts`) includes:

**Required**:
- `alt` (string, 10-180 chars) - WCAG 2.1 Level A compliance

**Optional**:
- `caption` (string, max 220 chars) - Display caption
- `keywords` (array[string]) - Searchability
- `needsReview` (boolean) - Quality flag
- `reviewReasons` (array[string]) - Review tracking codes
- `provenance` (object) - WordPress migration metadata

---

## Why TTP Failed

When the TTP tried to patch images:

```
Error: Field validation failed:
  - gallery[_key=="b98d84a3d779"].alt: Field "alt" does not exist in schema "dog"
  - gallery[_key=="b98d84a3d779"].keywords: Field "keywords" does not exist in schema "dog"
```

The basic `image` type only has:
- `asset` (reference to image file)
- `hotspot` (crop/focus point)
- ~~No alt text field~~
- ~~No keywords field~~
- ~~No metadata fields~~

---

## Fix Applied

**Commit**: `89e6af1`
```
fix: update dog schema to use dogImage type for WCAG compliance

- Changed mainImage from basic 'image' to 'dogImage' type
- Changed gallery items from basic 'image' to 'dogImage' type
- dogImage type includes required alt text + metadata fields
```

**Files Modified**:
- `sanity/schemaTypes/dog.ts`

---

## Next Steps to Complete

### Step 1: Deploy Schema to Sanity ⏸️ PENDING

The schema change is committed to git but NOT yet deployed to Sanity's cloud.

**Option A: Via Sanity Studio UI** (Recommended)
1. Start Sanity Studio:
   ```bash
   cd ~/ControlHub/RMGDRI_Website/rmgdri-site
   npm run dev
   ```
2. Open Studio: http://localhost:3000/studio
3. Studio will detect schema changes and prompt to deploy
4. Click "Deploy" or "Update Schema"

**Option B: Via CLI**
```bash
cd ~/ControlHub/RMGDRI_Website/rmgdri-site/sanity
export SANITY_PROJECT_ID="17o8qiin"
export SANITY_DATASET="production"
npx sanity schema deploy
```

**Option C: Via Sanity MCP Tool**
```bash
# Use mcp__Sanity__deploy_schema tool
# (May require extracting schema to proper format)
```

### Step 2: Re-run Image Metadata TTP ✅ READY

Once schema is deployed:

```bash
cd ~/ControlHub/RMGDRI_Website/rmgdri-site
_ttp/run-image-metadata-populate.sh
```

**Expected Result**:
- ✅ Gate A: Discovers 4 images needing metadata
- ✅ Gate B: Successfully patches all 4 images with alt text + keywords
- ✅ Gate C: Validates 100% WCAG compliance

### Step 3: Human Review of Auto-Generated Metadata

The TTP will generate basic alt text like:
- "Chevy, a Great Dane in photo 0"
- "Chloe, a Great Dane in photo 0"

**Recommend**:
1. Open Sanity Studio
2. Review each image's auto-generated alt text
3. Enhance with specific details:
   - Color: "Chevy, a merle Great Dane"
   - Pose: "Jumbo, a black Great Dane sitting in grass"
   - Action: "Kevin, a harlequin Great Dane playing in snow"
4. Clear `needsReview` flag after human verification

---

## Migration Impact

### Existing Documents (4 dogs)

**Current State**:
- All 4 dogs have images in `mainImage` and `gallery` fields
- Images use old basic `image` type
- No metadata fields exist

**After Schema Deploy**:
- Existing images remain unchanged (Sanity is backward-compatible)
- New metadata fields become available
- Images can be patched to add metadata
- **No data loss** - existing captions preserved

### New Documents (future dogs)

**Behavior**:
- `mainImage` and `gallery` will use `dogImage` type
- Alt text field will be **required** (validation enforced)
- Sanity Studio will show metadata fields automatically
- Cannot save without adding alt text (WCAG enforcement)

---

## Testing Plan

### Pre-Deployment Test
```bash
# Verify schema compiles
cd ~/ControlHub/RMGDRI_Website/rmgdri-site
npm run build
```

### Post-Deployment Test
```bash
# Run TTP
_ttp/run-image-metadata-populate.sh

# Verify compliance
cd _ttp/evidence/IMAGE_METADATA_<timestamp>
cat COMPLIANCE_REPORT.md
```

### Manual Verification
1. Open Sanity Studio
2. Navigate to any dog document
3. Click on `mainImage` or `gallery` item
4. Verify metadata fields visible:
   - ✅ Alt Text (required, red asterisk)
   - ✅ Caption
   - ✅ Keywords
   - ✅ Needs Review
   - ✅ Review Reasons

---

## Evidence

### TTP Executions

**First Run** (2026-02-12 10:44:38):
- Gate A: ✅ Complete
- Gate B: ❌ Failed (insufficient permissions)
- Evidence: `_ttp/evidence/IMAGE_METADATA_2026-02-12_104438/`

**Second Run** (2026-02-12 11:13:51):
- Gate A: ✅ Complete
- Gate B: ❌ Failed (schema validation - fields don't exist)
- Evidence: `_ttp/evidence/IMAGE_METADATA_2026-02-12_111351/`
- **Root cause identified**: dog schema using wrong image type

### Commits

**Schema Fix**: `89e6af1`
```
fix: update dog schema to use dogImage type for WCAG compliance
```

**TTP Creation**: `0e21511`
```
ttp: add image metadata population with WCAG compliance validation
```

**Documentation**: `b000aef`
```
docs: add complete image metadata status with TTP execution results
```

---

## Rollback Plan

If issues occur after schema deployment:

1. **Revert schema change**:
   ```bash
   git revert 89e6af1
   cd sanity && npx sanity schema deploy
   ```

2. **Sanity Studio History**:
   - Sanity keeps revision history
   - Can restore previous schema version via Studio UI

3. **Document Safety**:
   - Existing documents unaffected
   - No data loss from schema change
   - Metadata patches are separate operations

---

## Success Criteria

✅ Schema deployed to Sanity
✅ TTP runs successfully (all 3 gates pass)
✅ 4/4 images have alt text (10-180 chars)
✅ 100% WCAG 2.1 Level A compliance
✅ Metadata visible in Sanity Studio
✅ No existing data lost

---

## Open Questions

**Q**: Should we migrate existing caption-only data to new dogImage format?
**A**: No migration needed - captions will be preserved when schema deploys. Only new metadata fields (alt, keywords, etc.) need to be populated.

**Q**: What happens to images uploaded before schema change?
**A**: They remain valid but won't have metadata. TTP will identify and populate missing metadata.

**Q**: Can we enforce alt text on existing images?
**A**: Yes - after schema deploy, validation will require alt text for any image edits. TTP can batch-populate existing images.

---

**Status**: Schema fix applied, awaiting deployment
**Next Action**: Deploy schema via Sanity Studio or CLI
**Blocker**: None - ready to proceed
**Risk Level**: Low (backward-compatible schema change)

**Report Generated**: 2026-02-12
**Author**: Claude (TTP execution + root cause analysis)
