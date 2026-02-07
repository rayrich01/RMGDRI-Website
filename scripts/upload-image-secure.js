#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

/**
 * Secure Image Upload Script
 * Uses environment variables instead of hardcoded tokens
 *
 * Usage:
 *   node scripts/upload-image-secure.js <image-path> <document-id> [field-name]
 *
 * Environment variables (loaded from .env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID  – Sanity project ID
 *   NEXT_PUBLIC_SANITY_DATASET     – Dataset name (default: production)
 *   SANITY_API_TOKEN               – Read+Write API token
 *
 * Examples:
 *   node scripts/upload-image-secure.js ./photos/hero.jpg homepage-hero
 *   node scripts/upload-image-secure.js ./dogs/rex.png dog-rex mainImage
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

// ── Config from environment ──────────────────────────────────────────
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN;

if (!projectId) {
  console.error('Error: NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local');
  process.exit(1);
}
if (!token) {
  console.error('Error: SANITY_API_TOKEN is not set in .env.local');
  process.exit(1);
}

// ── CLI arguments ────────────────────────────────────────────────────
const [imagePath, documentId, fieldName = 'image'] = process.argv.slice(2);

if (!imagePath || !documentId) {
  console.error('Usage: node scripts/upload-image-secure.js <image-path> <document-id> [field-name]');
  process.exit(1);
}

const resolvedPath = path.resolve(imagePath);
if (!fs.existsSync(resolvedPath)) {
  console.error(`Error: File not found: ${resolvedPath}`);
  process.exit(1);
}

// ── Sanity client ────────────────────────────────────────────────────
const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// ── Upload + patch ───────────────────────────────────────────────────
async function main() {
  const fileName = path.basename(resolvedPath);
  console.log(`Uploading "${fileName}" to project ${projectId}/${dataset} ...`);

  const imageAsset = await client.assets.upload(
    'image',
    fs.createReadStream(resolvedPath),
    { filename: fileName }
  );

  console.log(`Asset created: ${imageAsset._id}`);

  await client
    .patch(documentId)
    .set({
      [fieldName]: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id,
        },
      },
    })
    .commit();

  console.log(`Document "${documentId}" patched – field "${fieldName}" now references ${imageAsset._id}`);
}

main().catch((err) => {
  console.error('Upload failed:', err.message);
  process.exit(1);
});
