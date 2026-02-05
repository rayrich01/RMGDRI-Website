import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'RMGDRI Studio',
  projectId: process.env.SANITY_PROJECT_ID || 'REPLACE_ME',
  dataset: process.env.SANITY_DATASET || 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
  ],

  schema: {types: schemaTypes},
})
