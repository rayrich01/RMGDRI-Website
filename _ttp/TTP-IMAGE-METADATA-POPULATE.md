# TTP: Image Metadata Population & WCAG Compliance

## Objective
Ensure all images in Sanity CMS have complete metadata according to the `dogImage` schema, with focus on WCAG 2.1 AA compliance (required alt text).

## Scope
- All dog documents in Sanity (`_type == "dog"`)
- All success story documents (`_type == "successStory"`)
- Primary images and gallery images
- Featured images and inline content images

## Schema Requirements (from dogImage.ts)

**Required**:
- `alt` (string, 10-180 chars) - WCAG compliance

**Recommended**:
- `caption` (string, max 220 chars) - Display caption
- `keywords` (array[string]) - Searchability
- `needsReview` (boolean) - Quality flag
- `reviewReasons` (array[string]) - Review tracking
- `provenance` (object) - WordPress migration metadata

## Gates

### Gate A: Discovery & Audit
**Purpose**: Query all images, identify gaps

**Actions**:
1. Query all dog documents with image metadata
2. Query all success story documents with image metadata
3. Generate comprehensive inventory CSV
4. Calculate compliance metrics
5. Identify images needing metadata

**Output**: `IMAGE_INVENTORY_<timestamp>.csv`

### Gate B: Metadata Population
**Purpose**: Add missing metadata to images

**Actions**:
1. For each image missing alt text:
   - Generate descriptive alt text based on image analysis
   - Follow WCAG guidelines (10-180 chars)
   - Use pattern: "{DogName}, a {color} Great Dane, {action/pose}"
2. For images missing caption:
   - Add brief caption if context available
3. For images missing keywords:
   - Add searchable keywords (colors, actions, settings)
4. Set needsReview flag for images needing human verification

**Output**: Sanity patch operations applied

### Gate C: Validation & Evidence
**Purpose**: Verify compliance, generate evidence

**Actions**:
1. Re-query all images
2. Verify 100% have alt text
3. Generate compliance report
4. Create before/after comparison
5. Export final CSV

**Output**:
- `COMPLIANCE_REPORT_<timestamp>.md`
- `IMAGE_METADATA_FINAL_<timestamp>.csv`

## Evidence Artifacts

```
_ttp/evidence/IMAGE_METADATA_<timestamp>/
├── gate-a-inventory.csv          # Initial audit
├── gate-a-gaps.json               # Images needing metadata
├── gate-b-patches.json            # Sanity patch operations
├── gate-b-results.json            # Patch results
├── gate-c-compliance.md           # Final compliance report
├── gate-c-final-inventory.csv     # Complete inventory
└── run.log                        # Full execution log
```

## Success Criteria

- ✅ 100% of images have alt text (10-180 chars)
- ✅ 0 WCAG violations
- ✅ All images flagged for review if metadata auto-generated
- ✅ Complete CSV inventory exported
- ✅ Evidence bundle created

## Rollback Plan

If issues detected:
1. Sanity revision history allows rollback
2. gate-b-patches.json contains all operations
3. Can revert via Sanity Studio history panel

## Execution

```bash
cd ~/ControlHub/RMGDRI_Website/rmgdri-site
_ttp/run-image-metadata-populate.sh
```

## Notes

- Auto-generated alt text will be marked with `needsReview: true`
- Human review recommended before production deployment
- WordPress provenance data populated only if source data available
- Keywords follow taxonomy: colors, breeds, actions, settings
