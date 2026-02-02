---METADATA_HEADER---
tenant: RMGDRI
project: RMGDRI Website / Image Metadata + Ingest
tp_id: TP-RMGDRI-META-INGEST-01
run_id: RUN-2
run_date_local: 2026-02-02 America/Denver
author_role: Claude Code
author: Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
file_type: manifest
artifact_name: MANIFEST.md
artifact_version: n/a
source_of_truth: TP-RMGDRI-META-INGEST-01_ClaudeCode_RequestPacket.md
inputs:
  - TP-RMGDRI-META-INGEST-01_ClaudeCode_RequestPacket.md
  - dog_images_2022_2025.json (expected from TP-RMGDRI-DATA-EXTRACT-02)
outputs:
  - dogImage.ts
  - dog.ts
  - successStory.ts
  - index.ts (schema export)
  - getDogBySlug.groq
  - getSuccessStoryBySlug.groq
  - getNeedsReviewImages.groq
  - SanityDogImage.tsx
  - image.ts
  - import_dog_images.ts
  - import_run_report.template.json
  - README_IMPORT.md
  - MANIFEST.md
  - PREFLIGHT.md
  - ROLLBACK.md
  - checksums.sha256
governance:
  fail_closed: true
  no_hallucination: true
  deterministic_ids: true
  checksum_sha256: see checksums.sha256
status: candidate
notes: Complete Sanity CMS + Next.js metadata ingestion pipeline with governance (RUN-2 with path corrections)
---END_METADATA_HEADER---

# RMGDRI Sanity Migration — File Manifest (RUN-2)

**Date:** 2026-02-02
**Author:** Claude Code (Sonnet 4.5)
**Task:** TP-RMGDRI-META-INGEST-01
**Run:** RUN-2 (corrected paths + missing artifacts)
**Commit:** _(pending single commit)_

⚠️ **IMPORTANT:** All files below were created for a SINGLE commit as required by specification.

---

## CORRECTIONS FROM RUN-1

**✅ Path Normalization:**
- Schemas moved: `sanity/schemas/` → `sanity/schemaTypes/`
- Queries moved: `src/lib/sanity/queries/` → `lib/sanity/queries/`

**✅ Missing Artifact:**
- Added: `import_run_report.template.json`

**✅ Executable Command:**
- Updated all docs to use: `npx tsx scripts/rmgdri/import_dog_images.ts`
- Recommends installing tsx as devDependency

**✅ Delete Prefix Clarification:**
- Images are embedded in dog documents (not separate)
- Valid prefixes: `dog-` and `story-` only
- Removed misleading `image.wpatt_` examples

**✅ Artifact Count:**
- Corrected from 14 to **15 files**

---

## Git Workflow (Single Commit Requirement)

### Prerequisites

```bash
# Install tsx for TypeScript execution (if not already installed)
npm install --save-dev tsx
```

### Single Commit Execution

```bash
# Navigate to project root
cd /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site

# Stage all files together (NOT separately)
git add sanity/schemaTypes/objects/dogImage.ts
git add sanity/schemaTypes/documents/dog.ts
git add sanity/schemaTypes/documents/successStory.ts
git add sanity/schemaTypes/index.ts
git add lib/sanity/queries/getDogBySlug.groq
git add lib/sanity/queries/getSuccessStoryBySlug.groq
git add lib/sanity/queries/getNeedsReviewImages.groq
git add components/media/SanityDogImage.tsx
git add src/lib/sanity/image.ts
git add scripts/rmgdri/import_dog_images.ts
git add scripts/rmgdri/import_run_report.template.json
git add scripts/rmgdri/README_IMPORT.md
git add scripts/rmgdri/MANIFEST.md
git add scripts/rmgdri/PREFLIGHT.md
git add scripts/rmgdri/ROLLBACK.md
git add scripts/rmgdri/checksums.sha256

# Verify all files staged
git status
# Expected: 15 files staged for commit

# Single commit with governance-compliant message
git commit -m "feat(rmgdri): implement Sanity migration pipeline with governance

Implements TP-RMGDRI-META-INGEST-01: Complete metadata ingestion from WordPress to Sanity CMS

SCHEMAS (sanity/schemaTypes/):
- Add dogImage object type with alt-text validation and provenance tracking
- Enhance dog document with idNumber, heroImage, gallery, sourceWp fields
- Add successStory document with dog references and provenance

QUERIES (lib/sanity/queries/):
- Add getDogBySlug.groq with full image metadata
- Add getSuccessStoryBySlug.groq with referenced dogs
- Add getNeedsReviewImages.groq for editorial review queue

COMPONENTS:
- Add SanityDogImage.tsx with type-enforced alt text (WCAG compliant)
- Modify image.ts helper for Sanity image URL generation

IMPORT PIPELINE (scripts/rmgdri/):
- Add import_dog_images.ts with dry-run, limit, idempotent operations
- Add import_run_report.template.json for report structure
- Support ID number mapping from CSV (optional)
- Generate JSON + Markdown reports
- Support --delete-prefix for safe cleanup (dog-, story- prefixes)

GOVERNANCE:
- Add MANIFEST.md (this file - file inventory + commit template)
- Add PREFLIGHT.md (pre-execution checklist)
- Add ROLLBACK.md (recovery procedures)
- Add README_IMPORT.md (usage guide)
- Add checksums.sha256 (SHA-256 hashes for all 15 files)

COMPLIANCE:
- Deterministic IDs: dog-{slug}, story-{slug}
- Fail-closed: Missing alt text → needsReview flag + fallback
- Traceability: WordPress provenance in all imported records
- Idempotent: Safe to re-run without duplicates
- Reversible: --delete-prefix flag for cleanup

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Verify single commit
git log --oneline -1 --stat
```

---

## Files Created (15 Total)

### Sanity Schemas (4 files)

1. ✅ `sanity/schemaTypes/objects/dogImage.ts` (136 lines)
   - Enhanced image type with required alt text validation
   - Provenance tracking (wp_attachment_id, wp_post_id, meta keys, taxonomy terms)
   - Review flag system (needsReview, reviewReasons)
   - Caption, keywords for content management

2. ✅ `sanity/schemaTypes/documents/dog.ts` (392 lines)
   - Enhanced with idNumber field (rescue's primary key)
   - Physical details: sex, coatColor, markings, sizeCategory
   - Hero image + gallery (dogImage type)
   - WordPress provenance (sourceWp object)
   - Adoption year, intake/adopted dates

3. ✅ `sanity/schemaTypes/documents/successStory.ts` (179 lines)
   - Title, slug, publishedAt, excerpt, body
   - Dogs array (references to dog documents)
   - Images array (dogImage type)
   - WordPress provenance

4. ✅ `sanity/schemaTypes/index.ts` (38 lines - modified)
   - Exports dog, successStory, dogImage
   - Exports existing blockContent

### GROQ Queries (3 files)

5. ✅ `lib/sanity/queries/getDogBySlug.groq` (75 lines)
   - Retrieves single dog by slug
   - Includes hero image + gallery with full asset metadata
   - Includes provenance, dimensions, LQIP

6. ✅ `lib/sanity/queries/getSuccessStoryBySlug.groq` (57 lines)
   - Retrieves single story by slug
   - Includes referenced dogs with basic info + hero images
   - Includes story images with metadata

7. ✅ `lib/sanity/queries/getNeedsReviewImages.groq` (43 lines)
   - Finds all dogs with flagged images
   - Returns hero + gallery images needing review
   - Includes reasons and provenance

### Next.js Components (2 files)

8. ✅ `components/media/SanityDogImage.tsx` (157 lines)
   - Alt text REQUIRED at type level (TypeScript)
   - Runtime fallback if alt missing: "Great Dane rescue dog"
   - Dev mode warnings + visual indicators
   - Caption support
   - Background variant for hero sections

9. ✅ `src/lib/sanity/image.ts` (23 lines - modified)
   - Image URL builder helper
   - Uses sanityClient from existing client.ts

### Import Pipeline (3 files)

10. ✅ `scripts/rmgdri/import_dog_images.ts` (711 lines)
    - CLI with --dry-run, --limit, --since, --only-needs-review
    - ID number mapping from CSV (optional)
    - Deterministic document IDs (dog-{slug}, story-{slug})
    - Idempotent (createOrReplace)
    - Alt text safety (fallback + needsReview flag)
    - Provenance tracking (wp_attachment_id, wp_post_id, meta keys)
    - Report generation (JSON + Markdown)
    - Delete by prefix (--delete-prefix with --confirm)

11. ✅ `scripts/rmgdri/import_run_report.template.json` (28 lines)
    - Template structure for import reports
    - Shows expected JSON format
    - Documents all report fields

12. ✅ `scripts/rmgdri/README_IMPORT.md` (473 lines with metadata header)
    - Complete usage guide
    - Prerequisites and environment variables
    - Command-line options reference
    - Common workflows
    - Cleanup operations
    - Troubleshooting
    - Best practices

### Governance Documentation (4 files)

13. ✅ `scripts/rmgdri/MANIFEST.md` (this file)
    - File inventory
    - Git workflow instructions
    - Single commit template
    - Line counts and descriptions

14. ✅ `scripts/rmgdri/PREFLIGHT.md` (updated with correct paths)
    - Pre-execution checklist
    - Validation commands
    - Go/No-Go criteria
    - Test commands

15. ✅ `scripts/rmgdri/ROLLBACK.md` (updated with correct prefixes)
    - Recovery procedures
    - Delete-by-prefix examples (dog-, story- only)
    - Backup restoration
    - Scenario-based rollback guides

16. ✅ `scripts/rmgdri/checksums.sha256` (SHA-256 hashes for all 15 files)
    - Integrity verification
    - All artifacts checksummed

---

## Total Impact

- **Files Created:** 13
- **Files Modified:** 2 (image.ts, schemaTypes/index.ts)
- **Total Files in Delivery:** 15
- **Total Lines of Code:** ~2,750

---

## Executable Commands

### Install Prerequisites

```bash
# Install tsx for running TypeScript files
npm install --save-dev tsx
```

### Run Import Script

```bash
# Dry run (preview only)
npx tsx scripts/rmgdri/import_dog_images.ts --dry-run --limit 5

# Test import (10 dogs)
npx tsx scripts/rmgdri/import_dog_images.ts --limit 10

# Full import
npx tsx scripts/rmgdri/import_dog_images.ts

# Delete all dogs (dry run first!)
npx tsx scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --dry-run
npx tsx scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --confirm

# Delete all stories
npx tsx scripts/rmgdri/import_dog_images.ts --delete-prefix "story-" --dry-run --confirm
```

---

## Prefix-Scoped Deletion

**IMPORTANT:** Images are embedded within dog/story documents. They do NOT have separate document IDs.

**Valid Delete Prefixes:**
- `dog-` - Deletes all dog documents
- `dog-{specific-slug}` - Deletes specific dog
- `story-` - Deletes all success story documents
- `story-{specific-slug}` - Deletes specific story

**Invalid Prefixes:**
- ~~`image.wpatt_`~~ - Images are not separate documents
- Any other prefix - No documents match

**Example Usage:**

```bash
# Preview deletion (ALWAYS FIRST)
npx tsx scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --dry-run
# Output: "📊 Found 147 documents to delete"
# Sample IDs: dog-bella-2023, dog-max-2023, ...

# Execute deletion (ONLY AFTER REVIEW)
npx tsx scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --confirm
# Output: "🗑️ Deleting 147 documents... ✅ Deleted 147 documents"

# Deletion without --confirm FAILS
npx tsx scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-"
# Error: "❌ ERROR: Destructive operation requires --confirm flag"
```

---

## Governance Gates Status

| Gate | Code | Test | Notes |
|------|------|------|-------|
| **A - Schema** | ✅ | ⏳ | `npx sanity schema validate` |
| **B - Import** | ✅ | ⏳ | `npx tsx ... --dry-run --limit 3` |
| **C - Render** | ✅ | ⏳ | `npm run build` |
| **D - Traceability** | ✅ | ⏳ | Import + query verification |
| **E - Rollback** | ✅ | ⏳ | `--delete-prefix --dry-run` |

---

## Checksum Verification

After commit, verify file integrity:

```bash
cd scripts/rmgdri
shasum -c checksums.sha256
```

**Expected Output:**
```
sanity/schemaTypes/objects/dogImage.ts: OK
sanity/schemaTypes/documents/dog.ts: OK
sanity/schemaTypes/documents/successStory.ts: OK
... (15 files total)
All checksums verified: 15 OK
```

---

## Contact

**Project Lead:** Ray (ray@glorifyjesus.org)
**Task ID:** TP-RMGDRI-META-INGEST-01
**Run:** RUN-2
**Status:** CANDIDATE (awaiting testing and final approval)
**Commit SHA:** _(pending)_
