import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

/**
 * Sanity Studio Configuration
 *
 * This config enables:
 * - Schema validation for TP-RMGDRI-META-INGEST-01 schemas
 * - Sanity Studio UI at /studio route (via Next.js integration)
 * - Vision plugin for GROQ query testing
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'RMGDRI Website',

  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
