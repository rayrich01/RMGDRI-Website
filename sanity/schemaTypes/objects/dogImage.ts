import { defineField, defineType } from 'sanity';

/**
 * Dog Image Schema
 *
 * Enhanced image type with:
 * - Required alt text validation (WCAG compliance)
 * - Review flag system for quality control
 * - WordPress provenance tracking for migration traceability
 * - Caption and keywords for content management
 *
 * Used by: dog.ts, successStory.ts
 */

export const dogImage = defineType({
  name: 'dogImage',
  title: 'Dog Image',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe this image for accessibility (required for WCAG compliance)',
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .max(180)
          .warning('Alt text should be descriptive and between 10-180 characters'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption displayed below the image',
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Keywords for searchability and categorization',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'needsReview',
      title: 'Needs Review',
      type: 'boolean',
      description: 'Flag for editorial review',
      initialValue: false,
    }),
    defineField({
      name: 'reviewReasons',
      title: 'Review Reasons',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Why this image needs review',
      hidden: ({ parent }) => !parent?.needsReview,
      options: {
        list: [
          { title: 'Missing alt text (migrated)', value: 'alt_missing_input' },
          { title: 'Missing local asset file', value: 'missing_local_asset_file' },
          { title: 'Low quality/resolution', value: 'low_quality' },
          { title: 'Duplicate image', value: 'duplicate' },
          { title: 'Incorrect subject', value: 'incorrect_subject' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'provenance',
      title: 'Source Provenance',
      type: 'object',
      description: 'WordPress migration metadata (do not edit)',
      readOnly: true,
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'wpAttachmentId',
          title: 'WP Attachment ID',
          type: 'number',
          description: 'Original WordPress attachment ID',
        },
        {
          name: 'wpPostId',
          title: 'WP Post ID',
          type: 'number',
          description: 'WordPress post this image was attached to',
        },
        {
          name: 'metaKeysUsed',
          title: 'Meta Keys Used',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'WordPress meta keys used during extraction',
        },
        {
          name: 'taxonomyTermsUsed',
          title: 'Taxonomy Terms Used',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'WordPress taxonomy terms extracted',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      subtitle: 'caption',
      media: 'asset',
      needsReview: 'needsReview',
    },
    prepare({ title, subtitle, media, needsReview }) {
      return {
        title: needsReview ? `⚠️ ${title || 'Untitled'}` : title || 'Untitled',
        subtitle: subtitle || (needsReview ? 'Needs Review' : 'No caption'),
        media,
      };
    },
  },
});
