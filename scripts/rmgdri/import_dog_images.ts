#!/usr/bin/env node

/**
 * RMGDRI Dog Images Import Script
 *
 * Imports dog adoption records from Cowork-curated JSON into Sanity CMS.
 *
 * GOVERNANCE COMPLIANCE:
 * - Deterministic: Same inputs → same outputs
 * - Idempotent: Safe to re-run without duplicates
 * - Traceable: Preserves WordPress provenance
 * - Fail-closed: Missing alt text → needsReview flag
 * - Reversible: Supports --delete-prefix for cleanup
 *
 * USAGE:
 *   npm run import:dogs -- --dry-run --limit 5
 *   npm run import:dogs -- --help
 *
 * REQUIRES:
 * - Node.js 18+
 * - Sanity API token in environment
 * - Cowork data file: dog_images_2022_2025.json
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

// =========================================
// TYPES
// =========================================

interface CoworkDogImage {
  image_id: string;
  wp_attachment_id: number;
  wp_post_id: number | null;
  file_path: string | null;
  url: string | null;
  alt_text: string | null;
  caption: string | null;
  description: string | null;
  title: string | null;
  keywords: string[];
  taxonomy_terms: string[];
  dimensions: {
    width: number | null;
    height: number | null;
  };
  file_size: number | null;
  mime_type: string | null;
  upload_date: string | null;
  is_hero: boolean;
  needs_review: boolean;
  review_reasons: string[];
  meta_keys_used: string[];
  taxonomy_terms_used: string[];
}

interface CoworkDog {
  dog_id: string;
  id_number: string | number | null;
  name: string;
  slug: string;
  sex: string | null;
  coat_color: string | null;
  markings: string | null;
  size_category: string | null;
  adoption_year: number | null;
  status: string | null;
  wp_post_id: number | null;
  images: CoworkDogImage[];
}

interface CoworkSuccessStory {
  story_id: string;
  title: string;
  slug: string;
  published_at: string | null;
  excerpt: string | null;
  body: string | null;
  wp_post_id: number | null;
  dogs_referenced: string[];
  images: CoworkDogImage[];
}

interface CoworkData {
  metadata: {
    extraction_date: string;
    total_images: number;
    date_range: string;
    needs_review_count: number;
  };
  dogs: CoworkDog[];
  success_stories?: CoworkSuccessStory[];
}

interface IDMapping {
  id_number: string;
  dog_name: string;
  wp_post_id?: number;
  slug?: string;
  adoption_year?: number;
}

interface ImportOptions {
  dryRun: boolean;
  limit: number | null;
  since: number | null;
  onlyNeedsReview: boolean;
  deletePrefix: string | null;
  confirm: boolean;
  dataFile: string;
  mappingFile: string | null;
}

interface ImportReport {
  timestamp: string;
  dryRun: boolean;
  options: Partial<ImportOptions>;
  summary: {
    dogsProcessed: number;
    dogsCreated: number;
    dogsUpdated: number;
    dogsSkipped: number;
    storiesProcessed: number;
    storiesCreated: number;
    imagesImported: number;
    imagesNeedingReview: number;
    idNumbersMatched: number;
    idNumbersUnmatched: number;
    errors: string[];
  };
  needsReview: Array<{
    dogId: string;
    dogName: string;
    imageType: 'hero' | 'gallery';
    reasons: string[];
    wpAttachmentId: number;
  }>;
}

// =========================================
// CONFIGURATION
// =========================================

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
};

const client = createClient(config);

// Default file paths
const DEFAULT_DATA_FILE = resolve(
  process.cwd(),
  '../cowork_outputs/dog_images_2022_2025.json'
);
const DEFAULT_MAPPING_FILE = resolve(
  process.cwd(),
  '../cowork_outputs/rmgdri_rescue_master_id_mapping.csv'
);

// =========================================
// CLI ARGUMENT PARSING
// =========================================

function parseArgs(): ImportOptions {
  const args = process.argv.slice(2);
  const options: ImportOptions = {
    dryRun: false,
    limit: null,
    since: null,
    onlyNeedsReview: false,
    deletePrefix: null,
    confirm: false,
    dataFile: DEFAULT_DATA_FILE,
    mappingFile: existsSync(DEFAULT_MAPPING_FILE) ? DEFAULT_MAPPING_FILE : null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--limit':
        options.limit = parseInt(args[++i], 10);
        break;
      case '--since':
        options.since = parseInt(args[++i], 10);
        break;
      case '--only-needs-review':
        options.onlyNeedsReview = true;
        break;
      case '--delete-prefix':
        options.deletePrefix = args[++i];
        break;
      case '--confirm':
        options.confirm = true;
        break;
      case '--data-file':
        options.dataFile = args[++i];
        break;
      case '--mapping-file':
        options.mappingFile = args[++i];
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
      default:
        console.error(`Unknown option: ${arg}`);
        printHelp();
        process.exit(1);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
RMGDRI Dog Images Import Script

USAGE:
  node scripts/rmgdri/import_dog_images.ts [OPTIONS]

OPTIONS:
  --dry-run              Preview import without writing to Sanity
  --limit N              Import only first N dogs (for testing)
  --since YEAR           Import only dogs from YEAR onwards
  --only-needs-review    Import only dogs with images needing review
  --delete-prefix PREFIX Delete all documents with _id starting with PREFIX
  --confirm              Confirm destructive operations (required with --delete-prefix)
  --data-file PATH       Path to Cowork JSON data file (default: ../cowork_outputs/dog_images_2022_2025.json)
  --mapping-file PATH    Path to ID mapping CSV file (default: ../cowork_outputs/rmgdri_rescue_master_id_mapping.csv)
  --help, -h             Show this help message

EXAMPLES:
  # Test import (dry run)
  node scripts/rmgdri/import_dog_images.ts --dry-run --limit 5

  # Full import
  node scripts/rmgdri/import_dog_images.ts

  # Import with custom data file
  node scripts/rmgdri/import_dog_images.ts --data-file /path/to/data.json

  # Delete all dogs (dry run first!)
  node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --dry-run
  node scripts/rmgdri/import_dog_images.ts --delete-prefix "dog-" --confirm

  # Delete specific WP attachment images
  node scripts/rmgdri/import_dog_images.ts --delete-prefix "image.wpatt_8834" --confirm
`);
}

// =========================================
// ID MAPPING
// =========================================

function loadIDMapping(mappingFile: string | null): Map<string, string> {
  const idMap = new Map<string, string>();

  if (!mappingFile || !existsSync(mappingFile)) {
    console.log('⚠️  ID mapping file not found (this is OK - IDs will be null)');
    return idMap;
  }

  try {
    const csvContent = readFileSync(mappingFile, 'utf-8');
    const lines = csvContent.split('\n').filter((line) => line.trim());
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

    const idNumIdx = headers.indexOf('id_number');
    const nameIdx = headers.indexOf('dog_name');
    const wpPostIdIdx = headers.indexOf('wp_post_id');
    const slugIdx = headers.indexOf('slug');

    if (idNumIdx === -1 || nameIdx === -1) {
      console.error('❌ ID mapping file missing required columns (id_number, dog_name)');
      return idMap;
    }

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim());
      const idNumber = cols[idNumIdx];
      const dogName = cols[nameIdx]?.toLowerCase();
      const wpPostId = wpPostIdIdx !== -1 ? cols[wpPostIdIdx] : null;
      const slug = slugIdx !== -1 ? cols[slugIdx] : null;

      if (wpPostId) idMap.set(`wp_${wpPostId}`, idNumber);
      if (slug) idMap.set(`slug_${slug}`, idNumber);
      if (dogName) idMap.set(`name_${dogName}`, idNumber);
    }

    console.log(`✅ ID mapping loaded: ${idMap.size} entries from ${mappingFile}`);
    return idMap;
  } catch (error) {
    console.error(`❌ Failed to load ID mapping file: ${error}`);
    return idMap;
  }
}

function findIDNumber(
  dog: CoworkDog,
  idMap: Map<string, string>
): { idNumber: string | null; matchMethod: string } {
  // Priority 1: Check by wp_post_id
  if (dog.wp_post_id) {
    const id = idMap.get(`wp_${dog.wp_post_id}`);
    if (id) return { idNumber: id, matchMethod: 'wp_post_id' };
  }

  // Priority 2: Check by slug
  if (dog.slug) {
    const id = idMap.get(`slug_${dog.slug}`);
    if (id) return { idNumber: id, matchMethod: 'slug' };
  }

  // Priority 3: Check by name (case-insensitive)
  const id = idMap.get(`name_${dog.name.toLowerCase()}`);
  if (id) return { idNumber: id, matchMethod: 'name' };

  return { idNumber: null, matchMethod: 'not_found' };
}

// =========================================
// IMAGE PROCESSING
// =========================================

function processImage(image: CoworkDogImage, dogName: string): any {
  // Determine if image needs review
  const needsReview = image.needs_review || !image.alt_text || !image.file_path;
  const reviewReasons = [...image.review_reasons];

  if (!image.alt_text) {
    reviewReasons.push('alt_missing_input');
  }
  if (!image.file_path) {
    reviewReasons.push('missing_local_asset_file');
  }

  // Generate fallback alt text
  const altText =
    image.alt_text ||
    image.caption ||
    image.description ||
    `${dogName}, a Great Dane rescue dog`;

  return {
    _type: 'dogImage',
    alt: altText,
    caption: image.caption || undefined,
    keywords: image.keywords.length > 0 ? image.keywords : undefined,
    needsReview,
    reviewReasons: reviewReasons.length > 0 ? reviewReasons : undefined,
    provenance: {
      wpAttachmentId: image.wp_attachment_id,
      wpPostId: image.wp_post_id || undefined,
      metaKeysUsed: image.meta_keys_used,
      taxonomyTermsUsed: image.taxonomy_terms_used,
    },
    // Note: Actual asset upload would happen here
    // For now, we store metadata only
    // Asset upload requires local file access
  };
}

// =========================================
// DOG IMPORT
// =========================================

async function importDog(
  dog: CoworkDog,
  idMap: Map<string, string>,
  options: ImportOptions,
  report: ImportReport
): Promise<void> {
  try {
    // Match ID number
    const { idNumber, matchMethod } = findIDNumber(dog, idMap);
    if (idNumber) {
      report.summary.idNumbersMatched++;
    } else {
      report.summary.idNumbersUnmatched++;
    }

    // Generate deterministic document ID
    const docId = `dog-${dog.slug}`;

    // Process images
    const heroImage = dog.images.find((img) => img.is_hero) || dog.images[0];
    if (!heroImage) {
      throw new Error(`Dog ${dog.name} has no images`);
    }

    const heroImageData = processImage(heroImage, dog.name);
    const galleryImages = dog.images
      .filter((img) => !img.is_hero)
      .map((img) => processImage(img, dog.name));

    // Track needs review
    if (heroImageData.needsReview) {
      report.needsReview.push({
        dogId: docId,
        dogName: dog.name,
        imageType: 'hero',
        reasons: heroImageData.reviewReasons || [],
        wpAttachmentId: heroImage.wp_attachment_id,
      });
      report.summary.imagesNeedingReview++;
    }

    galleryImages.forEach((img, idx) => {
      if (img.needsReview) {
        report.needsReview.push({
          dogId: docId,
          dogName: dog.name,
          imageType: 'gallery',
          reasons: img.reviewReasons || [],
          wpAttachmentId: dog.images[idx + 1]?.wp_attachment_id || 0,
        });
        report.summary.imagesNeedingReview++;
      }
    });

    // Build Sanity document
    const sanityDoc = {
      _id: docId,
      _type: 'dog',
      name: dog.name,
      slug: {
        _type: 'slug',
        current: dog.slug,
      },
      idNumber: idNumber || undefined,
      status: dog.status || 'available',
      adoptionYear: dog.adoption_year || undefined,
      sex: dog.sex || undefined,
      coatColor: dog.coat_color || undefined,
      markings: dog.markings || undefined,
      sizeCategory: dog.size_category || undefined,
      heroImage: heroImageData,
      gallery: galleryImages.length > 0 ? galleryImages : undefined,
      sourceWp: {
        wpPostId: dog.wp_post_id || undefined,
        wpSlug: dog.slug,
      },
    };

    // Write to Sanity (if not dry run)
    if (!options.dryRun) {
      await client.createOrReplace(sanityDoc);
      report.summary.dogsCreated++;
    } else {
      console.log(`  [DRY RUN] Would create/update: ${docId}`);
      report.summary.dogsCreated++;
    }

    report.summary.dogsProcessed++;
    report.summary.imagesImported += 1 + galleryImages.length;
  } catch (error) {
    const errorMsg = `Failed to import dog ${dog.name}: ${error}`;
    console.error(`❌ ${errorMsg}`);
    report.summary.errors.push(errorMsg);
  }
}

// =========================================
// DELETE PREFIX
// =========================================

async function deleteByPrefix(
  prefix: string,
  dryRun: boolean,
  confirm: boolean
): Promise<number> {
  if (!confirm && !dryRun) {
    console.error('❌ ERROR: Destructive operation requires --confirm flag');
    console.log('   Run with --dry-run first to preview what will be deleted');
    process.exit(1);
  }

  console.log(`\n🔍 Finding documents with _id starting with "${prefix}"...`);

  const query = `*[_id match $prefix]._id`;
  const params = { prefix: `${prefix}*` };
  const docIds = await client.fetch<string[]>(query, params);

  console.log(`\n📊 Found ${docIds.length} documents to delete`);

  if (docIds.length === 0) {
    return 0;
  }

  console.log('\nSample IDs:');
  docIds.slice(0, 10).forEach((id) => console.log(`  - ${id}`));
  if (docIds.length > 10) {
    console.log(`  ... and ${docIds.length - 10} more`);
  }

  if (dryRun) {
    console.log('\n[DRY RUN] No documents were deleted');
    return 0;
  }

  console.log(`\n🗑️  Deleting ${docIds.length} documents...`);

  const transaction = client.transaction();
  docIds.forEach((id) => transaction.delete(id));

  await transaction.commit();

  console.log(`✅ Deleted ${docIds.length} documents`);
  return docIds.length;
}

// =========================================
// MAIN IMPORT
// =========================================

async function main() {
  console.log('🐕 RMGDRI Dog Images Import Script\n');

  const options = parseArgs();

  // Validate environment
  if (!config.projectId || !config.token) {
    console.error('❌ Missing Sanity configuration:');
    console.error('   - NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID');
    console.error('   - SANITY_API_TOKEN');
    process.exit(1);
  }

  // Handle delete prefix mode
  if (options.deletePrefix) {
    const deletedCount = await deleteByPrefix(
      options.deletePrefix,
      options.dryRun,
      options.confirm
    );
    process.exit(0);
  }

  // Load data file
  console.log(`📂 Loading data from: ${options.dataFile}`);

  if (!existsSync(options.dataFile)) {
    console.error(`❌ Data file not found: ${options.dataFile}`);
    process.exit(1);
  }

  const coworkData: CoworkData = JSON.parse(readFileSync(options.dataFile, 'utf-8'));
  console.log(`✅ Loaded ${coworkData.dogs.length} dogs from Cowork data\n`);

  // Load ID mapping
  const idMap = loadIDMapping(options.mappingFile);

  // Initialize report
  const report: ImportReport = {
    timestamp: new Date().toISOString(),
    dryRun: options.dryRun,
    options: {
      limit: options.limit,
      since: options.since,
      onlyNeedsReview: options.onlyNeedsReview,
    },
    summary: {
      dogsProcessed: 0,
      dogsCreated: 0,
      dogsUpdated: 0,
      dogsSkipped: 0,
      storiesProcessed: 0,
      storiesCreated: 0,
      imagesImported: 0,
      imagesNeedingReview: 0,
      idNumbersMatched: 0,
      idNumbersUnmatched: 0,
      errors: [],
    },
    needsReview: [],
  };

  // Filter dogs
  let dogs = coworkData.dogs;

  if (options.since) {
    dogs = dogs.filter((dog) => dog.adoption_year && dog.adoption_year >= options.since!);
    console.log(`📅 Filtered to dogs from ${options.since} onwards: ${dogs.length} dogs\n`);
  }

  if (options.onlyNeedsReview) {
    dogs = dogs.filter((dog) => dog.images.some((img) => img.needs_review));
    console.log(`⚠️  Filtered to dogs with images needing review: ${dogs.length} dogs\n`);
  }

  if (options.limit) {
    dogs = dogs.slice(0, options.limit);
    console.log(`🔢 Limited to first ${options.limit} dogs\n`);
  }

  // Import dogs
  console.log(`🚀 Importing ${dogs.length} dogs...\n`);

  for (const dog of dogs) {
    await importDog(dog, idMap, options, report);
  }

  // Generate reports
  console.log('\n📊 IMPORT SUMMARY\n');
  console.log(`  Dogs Processed:        ${report.summary.dogsProcessed}`);
  console.log(`  Dogs Created/Updated:  ${report.summary.dogsCreated}`);
  console.log(`  Images Imported:       ${report.summary.imagesImported}`);
  console.log(`  Images Needing Review: ${report.summary.imagesNeedingReview}`);
  console.log(`  ID Numbers Matched:    ${report.summary.idNumbersMatched}`);
  console.log(`  ID Numbers Unmatched:  ${report.summary.idNumbersUnmatched}`);
  console.log(`  Errors:                ${report.summary.errors.length}`);

  if (report.summary.errors.length > 0) {
    console.log('\n❌ ERRORS:\n');
    report.summary.errors.forEach((err) => console.log(`  - ${err}`));
  }

  // Write reports
  const reportDir = join(process.cwd(), 'scripts/rmgdri');
  const jsonReportPath = join(reportDir, 'import_run_report.json');
  const mdReportPath = join(reportDir, 'import_run_report.md');

  writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 JSON report saved: ${jsonReportPath}`);

  const mdReport = generateMarkdownReport(report);
  writeFileSync(mdReportPath, mdReport);
  console.log(`📄 Markdown report saved: ${mdReportPath}`);

  if (options.dryRun) {
    console.log('\n⚠️  DRY RUN MODE - No changes were written to Sanity');
  }

  console.log('\n✅ Import complete!\n');
}

function generateMarkdownReport(report: ImportReport): string {
  return `# Import Run Report

**Run Date:** ${new Date(report.timestamp).toLocaleString()}
**Mode:** ${report.dryRun ? 'Dry Run' : 'Live Import'}
**Options:** ${JSON.stringify(report.options)}

## Summary

- Dogs Processed: ${report.summary.dogsProcessed}
- Dogs Created: ${report.summary.dogsCreated}
- Images Imported: ${report.summary.imagesImported}
- Images Needing Review: ${report.summary.imagesNeedingReview}
- ID Numbers Matched: ${report.summary.idNumbersMatched}
- ID Numbers Unmatched: ${report.summary.idNumbersUnmatched}

## Images Needing Review

${report.needsReview.length > 0 ? report.needsReview.map((item) => `- **${item.dogName}** (${item.dogId}): ${item.imageType} image - ${item.reasons.join(', ')} (WP Attachment ID: ${item.wpAttachmentId})`).join('\n') : '_No images needing review_'}

## Errors

${report.summary.errors.length > 0 ? report.summary.errors.map((err) => `- ${err}`).join('\n') : '_No errors_'}

## Next Steps

1. Review flagged images in Sanity Studio
2. Run query to find needsReview images:
   \`\`\`
   *[_type == "dog" && (heroImage.needsReview == true || count(gallery[needsReview == true]) > 0)]
   \`\`\`
3. Update alt text for flagged images
`;
}

// =========================================
// ENTRY POINT
// =========================================

main().catch((error) => {
  console.error('\n❌ FATAL ERROR:', error);
  process.exit(1);
});
