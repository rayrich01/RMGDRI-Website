import { defineField, defineType } from 'sanity'

export const successStory = defineType({
  name: 'successStory',
  title: 'Dog Blog Story',
  type: 'document',
  fields: [
    defineField({
      name: 'dog',
      title: 'Dog',
      type: 'reference',
      to: [{ type: 'dog' }],
      validation: (Rule) => Rule.required(),
      description: 'Select the adopted dog this story is about',
    }),
    defineField({
      name: 'title',
      title: 'Story Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "Zeus Finds His Forever Home"',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'string',
      description: 'Format: YYYY-MM-DD (e.g., 2025-02-07). Time not needed for blog posts.',
      placeholder: '2025-02-07',
      validation: (Rule) =>
        Rule.regex(/^\d{4}-\d{2}-\d{2}$/, {
          name: 'date',
          invert: false,
        }).error('Must be in YYYY-MM-DD format (e.g., 2025-02-07)'),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Main image for the blog post',
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief summary shown in listings',
    }),
    defineField({
      name: 'content',
      title: 'Story Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
      ],
      description: 'Write the adoption story here. You can add photos inline.',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      dogName: 'dog.name',
      media: 'featuredImage',
    },
    prepare({ title, dogName, media }) {
      return {
        title: title || 'Untitled',
        subtitle: dogName ? `About ${dogName}` : '',
        media,
      }
    },
  },
})
