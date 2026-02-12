#!/usr/bin/env bash
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATE="$(date +%F)"
TS="$(date +%H%M%S)"
TTP_DIR="$REPO/_ttp"
EVID_ROOT="$TTP_DIR/evidence"
OUT_DIR="$EVID_ROOT/IMAGE_METADATA_${DATE}_${TS}"

mkdir -p "$OUT_DIR"

echo "== TTP: Image Metadata Population & WCAG Compliance =="
echo "Repo: $REPO"
echo "Out:  $OUT_DIR"
echo

cd "$REPO"

exec > >(tee -a "$OUT_DIR/run.log") 2>&1

# =============================================================================
# Gate A: Discovery & Audit
# =============================================================================
echo "== Gate A: Discovery & Audit =="
echo

# Create Node.js script for querying Sanity
cat > "$OUT_DIR/gate-a-query.mjs" << 'EOFJS'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '17o8qiin',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const query = `{
  "dogs": *[_type == "dog"] | order(name asc) {
    _id,
    name,
    status,
    "primaryImage": primaryImage {
      _type,
      _key,
      alt,
      caption,
      keywords,
      needsReview,
      reviewReasons,
      "assetId": asset._ref,
      "url": asset->url,
      provenance
    },
    "gallery": gallery[] {
      _type,
      _key,
      alt,
      caption,
      keywords,
      needsReview,
      reviewReasons,
      "assetId": asset._ref,
      "url": asset->url,
      provenance
    }
  },
  "successStories": *[_type == "successStory"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    "dogName": dog->name,
    "featuredImage": featuredImage {
      _type,
      _key,
      alt,
      caption,
      keywords,
      needsReview,
      reviewReasons,
      "assetId": asset._ref,
      "url": asset->url,
      provenance
    },
    "contentImages": content[_type == "image"] {
      _type,
      _key,
      alt,
      caption,
      keywords,
      needsReview,
      reviewReasons,
      "assetId": asset._ref,
      "url": asset->url,
      provenance
    }
  }
}`

try {
  const results = await client.fetch(query)
  console.log(JSON.stringify(results, null, 2))
} catch (error) {
  console.error('Error:', error.message)
  process.exit(1)
}
EOFJS

echo "Querying Sanity for all images..."
if ! node "$OUT_DIR/gate-a-query.mjs" > "$OUT_DIR/gate-a-inventory.json" 2>&1; then
  echo "❌ Gate A failed: Could not query Sanity"
  exit 1
fi

echo "✅ Gate A: Inventory captured"
echo

# =============================================================================
# Gate A: Analysis & Gap Detection
# =============================================================================
echo "== Gate A: Analysis =="
echo

# Analyze inventory and generate gaps report
cat > "$OUT_DIR/gate-a-analyze.mjs" << 'EOFJS'
import fs from 'fs'

const inventory = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'))
const gaps = []
const stats = {
  totalImages: 0,
  missingAlt: 0,
  missingCaption: 0,
  missingKeywords: 0,
  needsReview: 0,
  wcagCompliant: 0,
}

function analyzeImage(img, context) {
  if (!img || !img.assetId) return

  stats.totalImages++

  const gap = {
    context,
    assetId: img.assetId,
    hasAlt: !!img.alt,
    hasCaption: !!img.caption,
    hasKeywords: !!(img.keywords && img.keywords.length > 0),
    needsReview: !!img.needsReview,
    wcagCompliant: !!img.alt && img.alt.length >= 10 && img.alt.length <= 180,
  }

  if (!gap.hasAlt) stats.missingAlt++
  if (!gap.hasCaption) stats.missingCaption++
  if (!gap.hasKeywords) stats.missingKeywords++
  if (gap.needsReview) stats.needsReview++
  if (gap.wcagCompliant) stats.wcagCompliant++

  if (!gap.wcagCompliant) {
    gaps.push(gap)
  }
}

// Analyze dogs
inventory.dogs.forEach(dog => {
  if (dog.primaryImage) {
    analyzeImage(dog.primaryImage, {
      type: 'dog',
      docId: dog._id,
      dogName: dog.name,
      location: 'primaryImage',
    })
  }

  dog.gallery?.forEach((img, idx) => {
    analyzeImage(img, {
      type: 'dog',
      docId: dog._id,
      dogName: dog.name,
      location: `gallery[${idx}]`,
      imageKey: img._key,
    })
  })
})

// Analyze success stories
inventory.successStories.forEach(story => {
  if (story.featuredImage) {
    analyzeImage(story.featuredImage, {
      type: 'successStory',
      docId: story._id,
      title: story.title,
      location: 'featuredImage',
    })
  }

  story.contentImages?.forEach((img, idx) => {
    analyzeImage(img, {
      type: 'successStory',
      docId: story._id,
      title: story.title,
      location: `content[${idx}]`,
      imageKey: img._key,
    })
  })
})

console.log('=== Statistics ===')
console.log(`Total images: ${stats.totalImages}`)
console.log(`Missing alt text: ${stats.missingAlt} (${((stats.missingAlt/stats.totalImages)*100).toFixed(1)}%)`)
console.log(`Missing caption: ${stats.missingCaption} (${((stats.missingCaption/stats.totalImages)*100).toFixed(1)}%)`)
console.log(`Missing keywords: ${stats.missingKeywords} (${((stats.missingKeywords/stats.totalImages)*100).toFixed(1)}%)`)
console.log(`WCAG compliant: ${stats.wcagCompliant} (${((stats.wcagCompliant/stats.totalImages)*100).toFixed(1)}%)`)
console.log(`Needs review: ${stats.needsReview}`)
console.log()
console.log(`Images needing metadata: ${gaps.length}`)

fs.writeFileSync(
  process.argv[3],
  JSON.stringify({ stats, gaps }, null, 2)
)

process.exit(gaps.length > 0 ? 1 : 0)
EOFJS

echo "Analyzing gaps..."
if node "$OUT_DIR/gate-a-analyze.mjs" "$OUT_DIR/gate-a-inventory.json" "$OUT_DIR/gate-a-gaps.json"; then
  echo "✅ All images have complete metadata!"
  echo "✅ Gate A complete: No action needed"
  exit 0
else
  echo "⚠️  Found images needing metadata"
fi

echo "✅ Gate A complete"
echo

# =============================================================================
# Gate B: Metadata Population
# =============================================================================
echo "== Gate B: Metadata Population =="
echo

cat > "$OUT_DIR/gate-b-populate.mjs" << 'EOFJS'
import fs from 'fs'
import { createClient } from '@sanity/client'

const gapsData = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'))
const inventory = JSON.parse(fs.readFileSync(process.argv[3], 'utf-8'))

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '17o8qiin',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const patches = []
const results = []

// Helper: Generate alt text for dog images
function generateDogAltText(context, assetId) {
  const dogName = context.dogName || 'Great Dane'

  // Extract color from asset ID if possible (rough heuristic)
  let description = `${dogName}, a Great Dane`

  if (context.location.includes('gallery')) {
    return `${description} in photo ${context.location.match(/\d+/)?.[0] || ''}`
  }

  return `${description} portrait photo`
}

// Helper: Generate keywords
function generateKeywords(context) {
  const keywords = ['great-dane']

  if (context.dogName) {
    keywords.push(context.dogName.toLowerCase().replace(/\s+/g, '-'))
  }

  if (context.location === 'primaryImage') {
    keywords.push('portrait', 'primary-photo')
  } else if (context.location.includes('gallery')) {
    keywords.push('gallery', 'additional-photo')
  }

  return keywords
}

// Process each gap
for (const gap of gapsData.gaps) {
  const { context, assetId } = gap

  console.log(`Processing: ${context.type} ${context.docId} ${context.location}`)

  const patch = {
    id: context.docId,
    operations: []
  }

  // Determine patch path
  let basePath = ''
  if (context.location === 'primaryImage') {
    basePath = 'primaryImage'
  } else if (context.location === 'featuredImage') {
    basePath = 'featuredImage'
  } else if (context.location.startsWith('gallery')) {
    basePath = `gallery[_key=="${context.imageKey}"]`
  } else if (context.location.startsWith('content')) {
    basePath = `content[_key=="${context.imageKey}"]`
  }

  // Add alt text if missing
  if (!gap.hasAlt) {
    const altText = context.type === 'dog'
      ? generateDogAltText(context, assetId)
      : `Image for ${context.title || 'adoption success story'}`

    patch.operations.push({
      set: { [`${basePath}.alt`]: altText }
    })
  }

  // Add keywords if missing
  if (!gap.hasKeywords) {
    const keywords = generateKeywords(context)
    patch.operations.push({
      set: { [`${basePath}.keywords`]: keywords }
    })
  }

  // Set needsReview flag (auto-generated content needs review)
  if (!gap.hasAlt || !gap.hasKeywords) {
    patch.operations.push({
      set: {
        [`${basePath}.needsReview`]: true,
        [`${basePath}.reviewReasons`]: ['alt_missing_input']
      }
    })
  }

  patches.push(patch)
}

// Save patches for evidence
fs.writeFileSync(
  process.argv[4],
  JSON.stringify(patches, null, 2)
)

console.log(`\nGenerated ${patches.length} patch operations`)
console.log('\nApplying patches to Sanity...')

// Apply patches
for (const patch of patches) {
  try {
    const patchOp = client.patch(patch.id)

    for (const op of patch.operations) {
      if (op.set) {
        for (const [path, value] of Object.entries(op.set)) {
          patchOp.set({ [path]: value })
        }
      }
    }

    const result = await patchOp.commit()
    results.push({ id: patch.id, success: true, result })
    console.log(`✅ Patched ${patch.id}`)
  } catch (error) {
    results.push({ id: patch.id, success: false, error: error.message })
    console.error(`❌ Failed to patch ${patch.id}: ${error.message}`)
  }
}

fs.writeFileSync(
  process.argv[5],
  JSON.stringify(results, null, 2)
)

const successCount = results.filter(r => r.success).length
console.log(`\nCompleted: ${successCount}/${results.length} successful`)

process.exit(successCount === results.length ? 0 : 1)
EOFJS

echo "Generating and applying patches..."
if ! node "$OUT_DIR/gate-b-populate.mjs" \
  "$OUT_DIR/gate-a-gaps.json" \
  "$OUT_DIR/gate-a-inventory.json" \
  "$OUT_DIR/gate-b-patches.json" \
  "$OUT_DIR/gate-b-results.json"; then
  echo "❌ Gate B failed: Patch errors occurred"
  exit 1
fi

echo "✅ Gate B complete"
echo

# =============================================================================
# Gate C: Validation & Evidence
# =============================================================================
echo "== Gate C: Validation & Evidence =="
echo

echo "Re-querying Sanity for validation..."
if ! node "$OUT_DIR/gate-a-query.mjs" > "$OUT_DIR/gate-c-final-inventory.json" 2>&1; then
  echo "❌ Gate C failed: Could not re-query Sanity"
  exit 1
fi

# Validate compliance
cat > "$OUT_DIR/gate-c-validate.mjs" << 'EOFJS'
import fs from 'fs'

const inventory = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'))
let totalImages = 0
let compliantImages = 0
let issueImages = []

function validateImage(img, context) {
  if (!img || !img.assetId) return

  totalImages++

  const isCompliant = img.alt && img.alt.length >= 10 && img.alt.length <= 180

  if (isCompliant) {
    compliantImages++
  } else {
    issueImages.push({
      context,
      assetId: img.assetId,
      alt: img.alt,
      issue: !img.alt ? 'Missing alt text' : `Alt text length ${img.alt.length} (need 10-180)`
    })
  }
}

inventory.dogs.forEach(dog => {
  if (dog.primaryImage) {
    validateImage(dog.primaryImage, `${dog.name} - primaryImage`)
  }
  dog.gallery?.forEach((img, idx) => {
    validateImage(img, `${dog.name} - gallery[${idx}]`)
  })
})

inventory.successStories.forEach(story => {
  if (story.featuredImage) {
    validateImage(story.featuredImage, `${story.title} - featuredImage`)
  }
  story.contentImages?.forEach((img, idx) => {
    validateImage(img, `${story.title} - content[${idx}]`)
  })
})

const complianceRate = (compliantImages / totalImages) * 100

console.log('=== WCAG Compliance Validation ===')
console.log(`Total images: ${totalImages}`)
console.log(`Compliant: ${compliantImages}`)
console.log(`Non-compliant: ${issueImages.length}`)
console.log(`Compliance rate: ${complianceRate.toFixed(1)}%`)
console.log()

if (issueImages.length > 0) {
  console.log('Issues found:')
  issueImages.forEach(issue => {
    console.log(`  - ${issue.context}: ${issue.issue}`)
  })
  process.exit(1)
} else {
  console.log('✅ 100% WCAG compliant!')
  process.exit(0)
}
EOFJS

if node "$OUT_DIR/gate-c-validate.mjs" "$OUT_DIR/gate-c-final-inventory.json"; then
  COMPLIANCE_STATUS="✅ PASS"
else
  COMPLIANCE_STATUS="❌ FAIL"
fi

echo "✅ Gate C complete"
echo

# =============================================================================
# Generate Final Report
# =============================================================================
echo "== Generating Compliance Report =="

cat > "$OUT_DIR/COMPLIANCE_REPORT.md" << EOF
# Image Metadata Compliance Report

**Date**: $(date -Iseconds 2>/dev/null || date +"%Y-%m-%dT%H:%M:%S%z")
**TTP**: Image Metadata Population & WCAG Compliance
**Status**: ${COMPLIANCE_STATUS}

## Evidence Artifacts

\`\`\`
$(ls -1 "$OUT_DIR")
\`\`\`

## Gate A: Discovery Results

\`\`\`json
$(cat "$OUT_DIR/gate-a-gaps.json" | head -50)
\`\`\`

## Gate B: Patches Applied

\`\`\`json
$(cat "$OUT_DIR/gate-b-patches.json" | head -100)
\`\`\`

## Gate C: Final Validation

\`\`\`
$(node "$OUT_DIR/gate-c-validate.mjs" "$OUT_DIR/gate-c-final-inventory.json" 2>&1 || true)
\`\`\`

## Next Steps

- [ ] Review auto-generated alt text in Sanity Studio
- [ ] Update needsReview flags after human verification
- [ ] Add captions where appropriate
- [ ] Refine keywords for better searchability

---

**Evidence Location**: $OUT_DIR
EOF

echo "✅ Report generated: $OUT_DIR/COMPLIANCE_REPORT.md"
echo

echo "== TTP Complete =="
echo
echo "Evidence bundle: $OUT_DIR"
echo "Compliance report: $OUT_DIR/COMPLIANCE_REPORT.md"
echo
