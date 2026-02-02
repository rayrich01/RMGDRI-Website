import {defineConfig} from 'sanity'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'RMGDRI Studio',
  // Placeholder until you create Sanity infra:
  projectId: process.env.SANITY_PROJECT_ID || 'REPLACE_ME',
  dataset: process.env.SANITY_DATASET || 'production',
  schema: {types: schemaTypes},
})
