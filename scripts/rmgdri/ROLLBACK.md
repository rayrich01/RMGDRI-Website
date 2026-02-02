---METADATA_HEADER---
tenant: RMGDRI
project: RMGDRI Website / Image Metadata + Ingest
tp_id: TP-RMGDRI-META-INGEST-01
run_id: RUN-1
run_date_local: 2026-02-02 America/Denver
author_role: Claude Code
author: Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
file_type: rollback
artifact_name: ROLLBACK.md
artifact_version: n/a
source_of_truth: TP-RMGDRI-META-INGEST-01_ClaudeCode_RequestPacket.md
inputs:
  - n/a
outputs:
  - n/a
governance:
  fail_closed: true
  no_hallucination: true
  deterministic_ids: true
  checksum_sha256: pending
status: candidate
notes: Rollback and recovery procedures for RMGDRI Sanity migration
---END_METADATA_HEADER---

# Rollback Procedures

**Task:** TP-RMGDRI-META-INGEST-01
**Purpose:** Safe recovery from migration issues
**Critical:** Always run --dry-run before destructive operations

---

## Quick Reference

| Scenario | Rollback Method | Risk Level |
|----------|----------------|------------|
| Schema won't load | Git revert | LOW |
| Import created bad data | Delete by prefix | LOW |
| Next.js build fails | Git revert | LOW |
| Complete failure | Restore backup | MEDIUM |
| Partial import | Re-run (idempotent) | LOW |

---

## Scenario A: Schema Deployment Failed

### Symptoms
- Sanity Studio won't load
- Schema validation errors in console
- "Schema is invalid" message

### Recovery Steps

**Step 1: Revert Code Changes**
```bash
cd /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site

# Find the migration commit
git log --oneline | grep "rmgdri"
# Example output: abc1234 feat(rmgdri): implement Sanity migration pipeline

# Revert the commit (creates new revert commit)
git revert <commit-sha>
```

**Step 2: Redeploy Sanity Studio**
```bash
cd sanity
npx sanity deploy
```

**Step 3: Verify Studio Loads**
- Navigate to your Sanity Studio URL
- Confirm no schema errors
- Verify existing content still accessible

---

## Scenario B: Import Created Bad Data

### Symptoms
- Incorrect data in Sanity
- Duplicate dogs
- Missing or wrong fields
- Images not displaying correctly

### Recovery Method 1: Prefix-Scoped Deletion (RECOMMENDED)

**Delete All Imported Dogs:**

```bash
cd /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site

# Step 1: DRY RUN (always first!)
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --dry-run

# Review output:
# 📊 Found 147 documents to delete
# Sample IDs:
#   - dog-bella-2023
#   - dog-max-2023
#   ...

# Step 2: Confirm deletion
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --confirm

# Expected output:
# 🗑️  Deleting 147 documents...
# ✅ Deleted 147 documents
```

**Delete All Imported Success Stories:**

```bash
# Step 1: DRY RUN
node scripts/rmgdri/import_dog_images.ts --delete-prefix "story-" --dry-run

# Step 2: Confirm
node scripts/rmgdri/import_dog_images.ts --delete-prefix "story-" --confirm
```

**Delete Specific Subset:**

```bash
# Delete only 2023 dogs (if using year-prefix scheme)
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-2023" --dry-run --confirm

# Delete specific WP attachment images (if needed)
node scripts/rmgdri/import_dog_images.ts --delete-prefix "image.wpatt_8834" --dry-run --confirm
```

### Recovery Method 2: Manual Sanity Query Deletion

**CAUTION:** More complex; use only if prefix deletion doesn't work.

```bash
# Step 1: Preview what will be deleted (DRY RUN)
npx sanity documents query '*[_type == "dog" && _id match "dog-*"]._id'

# Step 2: Delete dogs
npx sanity documents query 'delete *[_type == "dog" && _id match "dog-*"]'

# Step 3: Delete success stories
npx sanity documents query 'delete *[_type == "successStory" && _id match "story-*"]'
```

### Recovery Method 3: Restore from Backup

**Use when:** Prefix deletion or queries don't work; need complete restore.

```bash
# Step 1: List available backups
ls -lh backup-*.tar.gz
# Example: backup-20260202-120000.tar.gz

# Step 2: Restore (CAUTION: overwrites ALL current data)
npx sanity dataset import backup-20260202-120000.tar.gz production --replace

# ALTERNATIVE: Import without replacing (merges data)
npx sanity dataset import backup-20260202-120000.tar.gz production
```

**⚠️ WARNING:** `--replace` flag DELETES all current data and replaces with backup.

---

## Scenario C: Code Breaks Next.js Build

### Symptoms
- `npm run build` fails
- TypeScript errors in terminal
- Module import errors
- Type errors for SanityDogImage component

### Recovery Steps

**Step 1: Identify Error**
```bash
cd /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site
npm run build 2>&1 | tee build-error.log
# Review error message
```

**Step 2: Revert Code**
```bash
# Revert the migration commit
git revert <commit-sha>

# Verify build works again
npm run build
```

**Step 3: Investigate**
- Check import paths in SanityDogImage.tsx
- Verify image.ts exports correctly
- Confirm sanityClient import is correct

---

## Scenario D: Complete Rollback (Nuclear Option)

### Use When
- Multiple issues across code and data
- Unclear state
- Need fresh start

### Steps

**1. Delete All Imported Data**
```bash
# Delete dogs
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --confirm

# Delete stories
node scripts/rmgdri/import_dog_images.ts --delete-prefix "story-" --confirm
```

**2. Restore Sanity Data from Backup (if needed)**
```bash
npx sanity dataset import backup-YYYYMMDD.tar.gz production --replace
```

**3. Revert Code Changes**
```bash
cd /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site
git revert <commit-sha>
```

**4. Redeploy Everything**
```bash
# Redeploy Sanity Studio
cd sanity
npx sanity deploy

# Rebuild Next.js
cd ..
npm run build
```

**5. Verify Clean State**
```bash
# Check no dogs exist
npx sanity documents query '*[_type == "dog"]' | grep "_id"
# Expected: No results

# Check Studio loads
npm run sanity
# Navigate to http://localhost:3333/
```

---

## Partial Rollback Examples

### Delete Only Dogs from 2023

**If using year-prefix ID scheme:**
```bash
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-2023" --dry-run

# Review, then:
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-2023" --confirm
```

**If using slug-based IDs without year prefix:**
```bash
# Use Sanity query with adoption year filter
npx sanity documents query '*[_type == "dog" && adoptionYear == 2023]._id' | \
  jq -r '.[]' | \
  xargs -I {} npx sanity documents query 'delete *[_id == "{}"]'
```

---

### Delete Only Images Needing Review

**CAUTION:** This deletes entire dog documents, not just images.

```bash
# Query dogs with needsReview images
npx sanity documents query '*[_type == "dog" && (heroImage.needsReview == true || count(gallery[needsReview == true]) > 0)]._id'

# Review IDs, then delete selectively
# (Manual process - no automated command for this scenario)
```

---

### Re-Import After Fixing Source Data

**Scenario:** Source data was corrected; need to update existing dogs.

```bash
# Option 1: Re-run import (idempotent - updates existing)
node scripts/rmgdri/import_dog_images.ts

# Option 2: Delete all and reimport fresh
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --confirm
node scripts/rmgdri/import_dog_images.ts
```

---

## Prevention Best Practices

### Before Import

✅ **Always run --dry-run first**
```bash
node scripts/rmgdri/import_dog_images.ts --dry-run --limit 5
```

✅ **Always create backup**
```bash
npx sanity dataset export production backup-$(date +%Y%m%d-%H%M%S).tar.gz
```

✅ **Test with small batch first**
```bash
node scripts/rmgdri/import_dog_images.ts --limit 10
```

✅ **Preview delete operations**
```bash
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --dry-run
```

### During Import

✅ **Monitor output** for errors

✅ **Check reports** after completion

✅ **Verify sample data** in Sanity Studio

### After Import

✅ **Test queries** work as expected

✅ **Check needsReview count** matches expectations

✅ **Verify provenance fields** are populated

---

## Emergency Contacts

**If rollback fails or unclear:**
- **Project Lead:** Ray (ray@glorifyjesus.org)
- **Task ID:** TP-RMGDRI-META-INGEST-01
- **Documentation:** See MANIFEST.md, PREFLIGHT.md

---

## Rollback Command Reference

### Delete by Prefix (Recommended)

```bash
# Dogs
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --dry-run --confirm

# Success stories
node scripts/rmgdri/import_dog_images.ts --delete-prefix "story-" --dry-run --confirm

# Specific prefix
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-2023-" --dry-run --confirm
```

### Sanity CLI Deletion

```bash
# Delete all dogs
npx sanity documents query 'delete *[_type == "dog"]'

# Delete all success stories
npx sanity documents query 'delete *[_type == "successStory"]'

# Delete by ID pattern
npx sanity documents query 'delete *[_id match "dog-*"]'
```

### Backup Operations

```bash
# Create backup
npx sanity dataset export production backup-$(date +%Y%m%d-%H%M%S).tar.gz

# List backups
ls -lh backup-*.tar.gz

# Restore (REPLACE mode - destroys current data)
npx sanity dataset import backup-FILE.tar.gz production --replace

# Restore (MERGE mode - keeps current data)
npx sanity dataset import backup-FILE.tar.gz production
```

### Git Operations

```bash
# View commit history
git log --oneline | head -20

# Revert specific commit (creates new revert commit)
git revert <commit-sha>

# Hard reset to before migration (DESTRUCTIVE)
git reset --hard <commit-before-migration-sha>
```

---

## Testing Rollback Procedures

**Before going live, test rollback capability:**

```bash
# 1. Import small batch
node scripts/rmgdri/import_dog_images.ts --limit 3

# 2. Verify import worked
npx sanity documents query '*[_type == "dog"]'

# 3. Test delete (dry run)
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --dry-run

# 4. Execute delete
node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --confirm

# 5. Verify deleted
npx sanity documents query '*[_type == "dog"]'
# Expected: No results
```

---

## Success Criteria for Rollback

A successful rollback means:

✅ Sanity Studio loads without errors

✅ All imported dogs removed (or backup restored)

✅ Existing content (if any) unaffected

✅ Next.js build completes successfully

✅ No schema validation errors

✅ Can re-run import cleanly if desired

---

**Status:** Ready for use
**Last Updated:** 2026-02-02
**Related Docs:** MANIFEST.md, PREFLIGHT.md, README_IMPORT.md
