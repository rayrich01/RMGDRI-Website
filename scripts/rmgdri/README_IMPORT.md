
---METADATA_HEADER---
tenant: RMGDRI
project: RMGDRI Website / Image Metadata + Ingest
tp_id: TP-RMGDRI-META-INGEST-01
run_id: RUN-1
run_date_local: 2026-02-02 America/Denver
author_role: Claude Code
author: Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
file_type: report
artifact_name: README_IMPORT.md
artifact_version: n/a
source_of_truth: TP-RMGDRI-META-INGEST-01_ClaudeCode_RequestPacket.md
inputs:
  - dog_images_2022_2025.json
  - rmgdri_rescue_master_id_mapping.csv (optional)
outputs:
  - import_run_report.json
  - import_run_report.md
governance:
  fail_closed: true
  no_hallucination: true
  deterministic_ids: true
  checksum_sha256: pending
status: candidate
notes: Complete usage guide for RMGDRI dog images import script
---END_METADATA_HEADER---

# RMGDRI Import Script Usage Guide

This document explains how to use the `import_dog_images.ts` script to import dog adoption records from Cowork-curated data into Sanity CMS.

---

## Prerequisites

### Required

1. **Node.js 18+** installed
2. **Sanity API token** with write permissions
3. **Cowork data file**: `dog_images_2022_2025.json`

### Environment Variables

Set these in `.env.local` or export them:

```bash
# Required
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your-api-token-with-write-permissions"

# Optional (for ID mapping)
SANITY_PROJECT_ID="your-project-id"  # Alternative to NEXT_PUBLIC_SANITY_PROJECT_ID
```

---

## Quick Start

### 1. Test Import (Recommended First Step)

```bash
cd rmgdri-site
node scripts/rmgdri/import_dog_images.ts --dry-run --limit 3
```

This will:
- Preview what would be imported
- Show first 3 dogs
- NOT write to Sanity
- Generate a report

### 2. Full Import

```bash
node scripts/rmgdri/import_dog_images.ts
```

This will:
- Import all dogs from Cowork data
- Write to Sanity
- Generate JSON and Markdown reports

---

## Command Line Options

| Option | Description | Example |
|--------|-------------|---------|
| `--dry-run` | Preview import without writing to Sanity | `--dry-run` |
| `--limit N` | Import only first N dogs (testing) | `--limit 5` |
| `--since YEAR` | Import only dogs from YEAR onwards | `--since 2023` |
| `--only-needs-review` | Import only dogs with flagged images | `--only-needs-review` |
| `--delete-prefix PREFIX` | Delete documents by _id prefix | `--delete-prefix "dog-"` |
| `--confirm` | Confirm destructive operations | `--confirm` |
| `--data-file PATH` | Custom path to JSON data file | `--data-file /path/to/data.json` |
| `--mapping-file PATH` | Custom path to ID mapping CSV | `--mapping-file /path/to/mapping.csv` |
| `--help` | Show help message | `--help` |

---

## Common Workflows

### Test Import (Small Batch)

```bash
# Dry run with 5 dogs
node scripts/rmgdri/import_dog_images.ts --dry-run --limit 5

# Actual import with 5 dogs
node scripts/rmgdri/import_dog_images.ts --limit 5
```

### Full Import

```bash
# Full import (all dogs)
node scripts/rmgdri/import_dog_images.ts
```

### Import Recent Dogs Only

```bash
# Dogs from 2024 onwards
node scripts/rmgdri/import_dog_images.ts --since 2024
```

### Import Dogs with Image Issues

```bash
# Only dogs with images needing review
node scripts/rmgdri/import_dog_images.ts --only-needs-review
```

### Re-Import After Changes

```bash
# Import is idempotent - safe to re-run
# Uses same _id, so will update existing docs
node scripts/rmgdri/import_dog_images.ts
```

---

## Cleanup Operations

### Delete All Dogs (With Safety Check)

```bash
# Step 1: Dry run to preview
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --dry-run

# Step 2: Review output, then confirm
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --confirm
```

### Delete Specific Dogs

```bash
# Delete dogs from 2023 (if using prefix scheme like dog-2023-)
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-2023-" --dry-run --confirm
```

### Delete All Success Stories

```bash
node scripts/rmgdri/import_dog_images.ts --delete-prefix "story-" --dry-run --confirm
```

---

## ID Number Mapping

### Without ID Mapping File

If `rmgdri_rescue_master_id_mapping.csv` does not exist:
- Import proceeds normally
- All dogs have `idNumber: null`
- Can be updated later with a second pass

### With ID Mapping File

If `rmgdri_rescue_master_id_mapping.csv` exists:
- Script auto-detects and loads it
- Matches dogs by:
  1. `wp_post_id` (most reliable)
  2. `slug` (pretty reliable)
  3. `name` (case-insensitive)
- Report shows match statistics

### Custom Mapping File Location

```bash
node scripts/rmgdri/import_dog_images.ts --mapping-file /path/to/custom_mapping.csv
```

---

## Output Reports

After import, two reports are generated:

### 1. JSON Report (`import_run_report.json`)

Machine-readable report with:
- Timestamp and options
- Summary statistics
- List of images needing review
- Error messages

**Location:** `scripts/rmgdri/import_run_report.json`

### 2. Markdown Report (`import_run_report.md`)

Human-readable report with:
- Summary statistics
- Images needing review
- Next steps

**Location:** `scripts/rmgdri/import_run_report.md`

---

## Understanding Import Behavior

### Deterministic IDs

- Dogs get ID: `dog-{slug}`
- Success stories get ID: `story-{slug}`
- Same slug → same ID → updates existing document

### Idempotency

- Safe to re-run
- Won't create duplicates
- Updates existing records in-place

### Alt Text Safety

If alt text is missing:
- Fallback is generated: `"[Dog Name], a Great Dane rescue dog"`
- Image flagged: `needsReview: true`
- Reason logged: `"alt_missing_input"`

### Provenance Tracking

Every image stores:
- `wpAttachmentId`: Original WordPress attachment ID
- `wpPostId`: WordPress post it was attached to
- `metaKeysUsed`: Meta keys used during extraction
- `taxonomyTermsUsed`: Taxonomy terms extracted

---

## Troubleshooting

### Error: Missing Sanity credentials

```
❌ Missing Sanity configuration:
   - NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID
   - SANITY_API_TOKEN
```

**Fix:** Set environment variables in `.env.local`

### Error: Data file not found

```
❌ Data file not found: ../cowork_outputs/dog_images_2022_2025.json
```

**Fix:**
- Verify file path
- Use `--data-file` to specify custom path
- Check file exists: `ls ../cowork_outputs/dog_images_2022_2025.json`

### Error: Invalid Sanity token

```
❌ Sanity API error: Unauthorized
```

**Fix:**
- Verify token has write permissions
- Check token hasn't expired
- Generate new token in Sanity dashboard if needed

### Error: Destructive operation requires --confirm

```
❌ ERROR: Destructive operation requires --confirm flag
   Run with --dry-run first to preview what will be deleted
```

**Fix:**
- Always run `--delete-prefix` with `--dry-run` first
- Review what will be deleted
- Then add `--confirm` flag

---

## Best Practices

### Before Import

1. ✅ **Backup your Sanity dataset**
   ```bash
   npx sanity dataset export production backup-$(date +%Y%m%d-%H%M%S).tar.gz
   ```

2. ✅ **Validate schemas**
   ```bash
   cd sanity && npx sanity schema validate
   ```

3. ✅ **Test with dry run**
   ```bash
   node scripts/rmgdri/import_dog_images.ts --dry-run --limit 3
   ```

### During Import

1. ✅ **Monitor output** for errors
2. ✅ **Check reports** after completion
3. ✅ **Verify in Sanity Studio** that data looks correct

### After Import

1. ✅ **Review flagged images**
   - Open Sanity Studio
   - Query: `*[_type == "dog" && heroImage.needsReview == true]`
   - Update missing alt text

2. ✅ **Run GROQ query** to find needs-review images
   ```bash
   npx sanity documents query '*[_type == "dog" && (heroImage.needsReview == true || count(gallery[needsReview == true]) > 0)]'
   ```

3. ✅ **Check import reports**
   - `scripts/rmgdri/import_run_report.json`
   - `scripts/rmgdri/import_run_report.md`

---

## Advanced Usage

### Custom Data File Location

```bash
node scripts/rmgdri/import_dog_images.ts --data-file /absolute/path/to/data.json
```

### Chain Multiple Filters

```bash
# Only dogs from 2024 with images needing review, limit to first 10
node scripts/rmgdri/import_dog_images.ts --since 2024 --only-needs-review --limit 10
```

### Dry Run Everything First

```bash
# Always dry run before actual import
node scripts/rmgdri/import_dog_images.ts --dry-run [other options]

# Then run for real
node scripts/rmgdri/import_dog_images.ts [other options]
```

---

## File Paths Reference

| File | Default Path | Override Flag |
|------|--------------|---------------|
| Data file | `../cowork_outputs/dog_images_2022_2025.json` | `--data-file` |
| ID mapping | `../cowork_outputs/rmgdri_rescue_master_id_mapping.csv` | `--mapping-file` |
| JSON report | `scripts/rmgdri/import_run_report.json` | _(auto-generated)_ |
| MD report | `scripts/rmgdri/import_run_report.md` | _(auto-generated)_ |

---

## Support

For issues or questions:
- Check Sanity Studio for imported data
- Review import reports
- Check Sanity API token permissions
- Contact: ray@glorifyjesus.org

---

**Last Updated:** 2026-02-02
**Version:** 1.0
**Task:** TP-RMGDRI-META-INGEST-01
