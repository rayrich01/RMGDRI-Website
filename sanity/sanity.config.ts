import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './studioStructure'

export default defineConfig({
  name: 'default',
  title: 'RMGDRI Studio',
  projectId: '17o8qiin',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
  ],

  schema: {types: schemaTypes},
})
