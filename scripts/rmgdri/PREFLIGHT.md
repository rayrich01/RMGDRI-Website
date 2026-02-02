---METADATA_HEADER---
tenant: RMGDRI
project: RMGDRI Website / Image Metadata + Ingest
tp_id: TP-RMGDRI-META-INGEST-01
run_id: RUN-1
run_date_local: 2026-02-02 America/Denver
author_role: Claude Code
author: Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
file_type: preflight
artifact_name: PREFLIGHT.md
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
notes: Pre-flight checklist for RMGDRI Sanity migration import execution
---END_METADATA_HEADER---

# Pre-Flight Checklist — Import Execution

**Task:** TP-RMGDRI-META-INGEST-01
**Purpose:** Validate environment before running import pipeline
**Audience:** Ray or executing developer

---

## Prerequisites

### 1. Node.js and npm Installed

```bash
node --version
# Required: v18.17.0 or later

npm --version
# Required: v9.0.0 or later
```

**If not installed:**
- macOS: `brew install node@18`
- Linux: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
- Windows: Download from nodejs.org

---

### 2. Sanity Project Configured

```bash
cd /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site/sanity
cat sanity.config.ts | grep projectId
# Verify: projectId and dataset are set correctly
```

**Expected output:**
```
projectId: 'your-project-id',
dataset: 'production',
```

---

### 3. Environment Variables Set

```bash
cd /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site
cat .env.local | grep SANITY
```

**Required variables:**
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your-write-token"
```

**If missing:**
```bash
cp .env.local.example .env.local
# Edit .env.local and add your credentials
```

**To generate API token:**
1. Visit: https://sanity.io/manage
2. Select your project
3. Go to API → Tokens
4. Create token with "Editor" or "Admin" permissions
5. Copy token to .env.local

---

### 4. Cowork Data Available

```bash
ls -lh /Users/rayrichardson/ControlHub/RMGDRI_Website/cowork_outputs/dog_images_2022_2025.json
# Expected: File exists, size > 10KB
```

**If file missing:**
- Verify TP-RMGDRI-DATA-EXTRACT-02 completed
- Check alternate path: `./cowork_outputs/`
- Use `--data-file` flag to specify custom location

**Preview data structure:**
```bash
head -50 /Users/rayrichardson/ControlHub/RMGDRI_Website/cowork_outputs/dog_images_2022_2025.json
# Should show: { "metadata": {...}, "dogs": [...] }
```

---

### 5. ID Mapping File (Optional)

```bash
ls -lh /Users/rayrichardson/ControlHub/RMGDRI_Website/cowork_outputs/rmgdri_rescue_master_id_mapping.csv
```

**Status:**
- ✅ **If exists:** Script will auto-load and match rescue IDs
- ✅ **If missing:** Script proceeds with idNumber: null (NOT A BLOCKER)

---

## Pre-Flight Commands

Run these commands IN ORDER before executing import.

### A. Backup Sanity Dataset

```bash
cd /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site
npx sanity dataset export production backup-$(date +%Y%m%d-%H%M%S).tar.gz
```

**Expected output:**
```
Export started...
Export finished
Exported to: backup-20260202-120000.tar.gz
```

**Verify backup created:**
```bash
ls -lh backup-*.tar.gz
# Should show recent backup file with size > 0
```

---

### B. Validate Schemas

```bash
cd sanity
npx sanity schema validate
```

**Expected output:**
```
✓ Schema is valid
```

**If errors:**
- Check that dogImage, dog, successStory are properly defined
- Verify index.ts exports all schemas
- Run: `npm install` if packages missing

---

### C. Generate TypeScript Types

```bash
npx sanity typegen generate
```

**Expected output:**
```
✓ Generated types for 3 schema types
Created: sanity.types.ts
```

**Verify types file:**
```bash
ls -lh sanity.types.ts
grep -E "dog|successStory|dogImage" sanity.types.ts
# Should show type definitions for all three schemas
```

---

### D. Test TypeScript Compilation

```bash
cd ..
npm run build
```

**Expected output:**
```
✓ Compiled successfully
```

**If errors:**
- Check SanityDogImage.tsx imports
- Verify image.ts uses correct client import
- Run: `npm install` if dependencies missing

---

### E. Test Dry Run (Limited)

```bash
node scripts/rmgdri/import_dog_images.ts --dry-run --limit 5
```

**Expected output:**
```
🐕 RMGDRI Dog Images Import Script

📂 Loading data from: ../cowork_outputs/dog_images_2022_2025.json
✅ Loaded X dogs from Cowork data

⚠️  ID mapping file not found (this is OK - IDs will be null)

🚀 Importing 5 dogs...

  [DRY RUN] Would create/update: dog-bella-2023
  [DRY RUN] Would create/update: dog-max-2023
  ...

📊 IMPORT SUMMARY

  Dogs Processed:        5
  Dogs Created/Updated:  5
  Images Imported:       15
  Images Needing Review: 2
  Errors:                0

⚠️  DRY RUN MODE - No changes were written to Sanity

✅ Import complete!
```

**If errors:**
- Check data file path is correct
- Verify Sanity credentials in .env.local
- Check file format matches expected schema

---

## Go/No-Go Criteria

### ✅ GO Criteria (All Must Pass)

- [ ] Node.js 18+ installed
- [ ] Sanity project ID configured
- [ ] Environment variables set (SANITY_API_TOKEN has write permissions)
- [ ] Cowork data file exists and is valid JSON
- [ ] Backup created successfully (`backup-*.tar.gz` exists)
- [ ] Schema validation passes (no errors)
- [ ] TypeScript types generated
- [ ] Build completes successfully
- [ ] Dry run with --limit 5 completes without errors

### ❌ NO-GO Criteria (Any One Blocks)

- [ ] No Sanity API token
- [ ] API token lacks write permissions
- [ ] Cowork data file missing or malformed
- [ ] Schema validation fails
- [ ] TypeScript compilation errors
- [ ] Dry run throws errors

---

## Execution Commands

### Test Run (10 Dogs)

**Recommended first run after dry-run validation:**

```bash
node scripts/rmgdri/import_dog_images.ts --limit 10
```

**Monitor output for:**
- Success count matches expected (10 dogs)
- No errors in summary
- Report files generated

**Verify in Sanity Studio:**
```bash
# Option 1: Query via CLI
npx sanity documents query '*[_type == "dog"] | order(_createdAt desc)[0...5]'

# Option 2: Open Sanity Studio
npm run sanity
# Navigate to http://localhost:3333/
# Check "Dogs" content type
```

---

### Full Import

**Only run after successful test import:**

```bash
node scripts/rmgdri/import_dog_images.ts
```

**Expected duration:** 2-5 minutes for ~150 dogs

**Monitor output:**
- Dogs processed count
- Images imported count
- Images needing review count
- Errors (should be 0)

---

## Post-Import Verification

### 1. Query Imported Dogs

```bash
npx sanity documents query '*[_type == "dog"] | order(_createdAt desc)[0...5]'
```

**Expected:** Returns array of 5 most recent dogs with all fields

---

### 2. Check for Dogs Needing Review

```bash
npx sanity documents query '*[_type == "dog" && heroImage.needsReview == true]'
```

**Expected:** Returns dogs with flagged hero images (if any)

---

### 3. Verify Provenance Fields

```bash
npx sanity documents query '*[_type == "dog"][0] {
  name,
  heroImage {
    alt,
    provenance
  }
}'
```

**Expected output:**
```json
{
  "name": "Bella",
  "heroImage": {
    "alt": "Bella, a harlequin Great Dane",
    "provenance": {
      "wpAttachmentId": 8834,
      "wpPostId": 4521,
      "metaKeysUsed": ["_wp_attachment_image_alt"],
      "taxonomyTermsUsed": ["category", "post_tag"]
    }
  }
}
```

---

### 4. Check Import Reports

```bash
cat scripts/rmgdri/import_run_report.md
```

**Expected sections:**
- Summary (counts)
- Images Needing Review
- Errors
- Next Steps

---

### 5. Open Sanity Studio

```bash
npm run sanity
```

Navigate to http://localhost:3333/ and verify:
- Dogs appear in content list
- Hero images display correctly
- Alt text is present
- Provenance data is in "Migration Data" group

---

## Rollback Preparation

**Before running full import, verify rollback capability:**

```bash
# Test delete-prefix in dry-run mode
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --dry-run

# Expected: Shows count of dogs that would be deleted
```

**Keep backup file safe:**
```bash
ls -lh backup-*.tar.gz
# Do NOT delete this file until migration is confirmed successful
```

---

## Troubleshooting

### Error: "Sanity API credentials missing"

**Fix:**
```bash
# Verify .env.local exists
cat .env.local | grep SANITY_API_TOKEN

# If missing, add it:
echo 'SANITY_API_TOKEN="your-token-here"' >> .env.local
```

---

### Error: "Data file not found"

**Fix:**
```bash
# Check file path
ls -lh ../cowork_outputs/dog_images_2022_2025.json

# If in different location, use --data-file flag:
node scripts/rmgdri/import_dog_images.ts --data-file /path/to/data.json
```

---

### Error: "Schema validation failed"

**Fix:**
```bash
cd sanity
npm install
npx sanity schema validate

# Check specific error message and fix schema files
```

---

### Error: "Module not found"

**Fix:**
```bash
# Install dependencies
cd /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site
npm install

# Verify @sanity/client is installed
npm list @sanity/client
```

---

## Emergency Stop

**If import needs to be stopped mid-run:**

1. Press `Ctrl+C` in terminal
2. Import will stop (already-imported dogs remain)
3. Safe to re-run (idempotent)
4. To remove partial import:
   ```bash
   node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --confirm
   ```

---

## Sign-Off

Before proceeding with full import, confirm:

- [ ] All GO criteria met
- [ ] Backup created and verified
- [ ] Dry run successful
- [ ] Test import (--limit 10) successful
- [ ] Rollback procedure understood
- [ ] Reports reviewed and acceptable

**Signed:** _____________________ **Date:** _____________________

---

**Next:** Proceed to full import or see ROLLBACK.md if issues occur.
