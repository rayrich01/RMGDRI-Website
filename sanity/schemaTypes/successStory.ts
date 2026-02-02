import { defineField, defineType } from 'sanity';

/**
 * Success Story Schema
 *
 * Stories of adopted dogs and their new families.
 * Links to dog documents for cross-referencing.
 * Includes WordPress provenance for migration traceability.
 *
 * Related: dog.ts
 */

export const successStory = defineType({
  name: 'successStory',
  title: 'Success Story',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'migration', title: 'Migration Data' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // =========================================
    // CONTENT
    // =========================================
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'Story headline (e.g., "Bella\'s Happy Ending")',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'content',
      description: 'When this story was published',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short summary for previews (max 240 characters)',
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'body',
      title: 'Story Content',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'content',
      description: 'Full story text (rich text with formatting)',
      validation: (Rule) => Rule.required(),
    }),

    // =========================================
    // RELATIONSHIPS
    // =========================================
    defineField({
      name: 'dogs',
      title: 'Featured Dogs',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'dog' }],
        },
      ],
      group: 'content',
      description: 'Link to the dog(s) featured in this story',
      validation: (Rule) => Rule.min(1).warning('Link at least one dog to this story'),
    }),

    // =========================================
    // MEDIA
    // =========================================
    defineField({
      name: 'images',
      title: 'Story Images',
      type: 'array',
      of: [{ type: 'dogImage' }],
      group: 'media',
      description: 'Photos illustrating this success story',
    }),

    // =========================================
    // MIGRATION DATA (WordPress Provenance)
    // =========================================
    defineField({
      name: 'sourceWp',
      title: 'WordPress Source',
      type: 'object',
      group: 'migration',
      description: 'Original WordPress data (do not edit)',
      readOnly: true,
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'wpPostId',
          title: 'WP Post ID',
          type: 'number',
          description: 'Original WordPress post ID',
        },
        {
          name: 'wpSlug',
          title: 'WP Slug',
          type: 'string',
          description: 'Original WordPress slug',
        },
      ],
    }),

    // =========================================
    // SEO
    // =========================================
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Leave blank to use story title',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          description: 'Leave blank to use excerpt',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      media: 'images.0',
      dog0: 'dogs.0.name',
      dog1: 'dogs.1.name',
    },
    prepare({ title, publishedAt, media, dog0, dog1 }) {
      const dogs = [dog0, dog1].filter(Boolean);
      const subtitle = dogs.length > 0 ? `🐕 ${dogs.join(', ')}` : 'No dogs linked';
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : '';

      return {
        title,
        subtitle: [date, subtitle].filter(Boolean).join(' • '),
        media,
      };
    },
  },

  orderings: [
    {
      title: 'Published Date (Newest First)',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date (Oldest First)',
      name: 'publishedAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});
