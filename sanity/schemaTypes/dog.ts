import { defineField, defineType } from 'sanity';

/**
 * Dog Schema (RMGDRI Migration Enhanced)
 *
 * Enhanced for TP-RMGDRI-META-INGEST-01 with:
 * - ID Number tracking (rescue's primary key)
 * - Hero image + gallery using dogImage type (alt-safe)
 * - WordPress provenance tracking
 * - Adoption year and enhanced status fields
 */

export const dog = defineType({
  name: 'dog',
  title: 'Dog',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'physical', title: 'Physical Details' },
    { name: 'details', title: 'Personality & Care' },
    { name: 'health', title: 'Health' },
    { name: 'media', title: 'Media' },
    { name: 'migration', title: 'Migration Data' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // =========================================
    // BASIC INFO
    // =========================================
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'idNumber',
      title: 'Rescue ID Number',
      type: 'string',
      group: 'basic',
      description: 'Official RMGDRI rescue ID (e.g., 2023047 or 2023-047)',
      validation: (Rule) =>
        Rule.custom((idNumber) => {
          if (!idNumber) return true; // Optional field
          // Format: YYYY### or YYYY-### or RMGDRI-YYYY-###
          const pattern = /^(RMGDRI-)?(\d{4})-?(\d{3})$/;
          if (!pattern.test(idNumber)) {
            return 'ID format should be YYYY### or YYYY-### (e.g., 2023047 or 2023-047)';
          }
          return true;
        }),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Pending Adoption', value: 'pending' },
          { title: 'Adopted', value: 'adopted' },
          { title: 'In Foster Care', value: 'foster' },
          { title: 'Medical Hold', value: 'medical_hold' },
          { title: 'Not Available', value: 'not_available' },
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'adoptionYear',
      title: 'Adoption Year',
      type: 'number',
      group: 'basic',
      description: 'Year the dog was adopted',
      hidden: ({ document }) => document?.status !== 'adopted',
      validation: (Rule) =>
        Rule.custom((year) => {
          if (!year) return true;
          if (year < 2020 || year > 2030) {
            return 'Adoption year should be between 2020 and 2030';
          }
          return true;
        }),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
      description: 'Show this dog on the homepage featured section',
    }),

    // =========================================
    // PHYSICAL DETAILS
    // =========================================
    defineField({
      name: 'sex',
      title: 'Sex',
      type: 'string',
      group: 'physical',
      options: {
        list: [
          { title: 'Male', value: 'male' },
          { title: 'Female', value: 'female' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'coatColor',
      title: 'Coat Color',
      type: 'string',
      group: 'physical',
      description: 'Primary coat color (e.g., Black, Blue, Fawn, Brindle, Harlequin, Mantle)',
      options: {
        list: [
          { title: 'Black', value: 'black' },
          { title: 'Blue', value: 'blue' },
          { title: 'Fawn', value: 'fawn' },
          { title: 'Brindle', value: 'brindle' },
          { title: 'Harlequin', value: 'harlequin' },
          { title: 'Mantle', value: 'mantle' },
          { title: 'Merle', value: 'merle' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'markings',
      title: 'Markings',
      type: 'string',
      group: 'physical',
      description: 'Distinctive markings or patterns',
    }),
    defineField({
      name: 'sizeCategory',
      title: 'Size Category',
      type: 'string',
      group: 'physical',
      options: {
        list: [
          { title: 'Small (under 100 lbs)', value: 'small' },
          { title: 'Standard (100-140 lbs)', value: 'standard' },
          { title: 'Large (140+ lbs)', value: 'large' },
          { title: 'Extra Large (170+ lbs)', value: 'extra_large' },
        ],
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'weight',
      title: 'Weight (lbs)',
      type: 'number',
      group: 'physical',
    }),
    defineField({
      name: 'age',
      title: 'Age',
      type: 'string',
      group: 'physical',
      description: 'e.g., "2 years", "6 months", "Senior (8+)"',
    }),
    defineField({
      name: 'breed',
      title: 'Breed',
      type: 'string',
      group: 'physical',
      options: {
        list: [
          { title: 'Great Dane', value: 'great-dane' },
          { title: 'Great Dane Mix', value: 'dane-mix' },
        ],
      },
      initialValue: 'great-dane',
    }),

    // =========================================
    // PERSONALITY & CARE
    // =========================================
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      group: 'details',
      rows: 2,
      description: 'Brief description for cards and previews (max 150 characters)',
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'blockContent',
      group: 'details',
    }),
    defineField({
      name: 'goodWith',
      title: 'Good With',
      type: 'object',
      group: 'details',
      fields: [
        { name: 'kids', title: 'Kids', type: 'boolean', initialValue: false },
        { name: 'dogs', title: 'Other Dogs', type: 'boolean', initialValue: false },
        { name: 'cats', title: 'Cats', type: 'boolean', initialValue: false },
        { name: 'notes', title: 'Compatibility Notes', type: 'text', rows: 2 },
      ],
    }),

    // =========================================
    // HEALTH
    // =========================================
    defineField({
      name: 'health',
      title: 'Health Information',
      type: 'object',
      group: 'health',
      fields: [
        { name: 'spayedNeutered', title: 'Spayed/Neutered', type: 'boolean', initialValue: true },
        { name: 'vaccinated', title: 'Vaccinated', type: 'boolean', initialValue: true },
        { name: 'microchipped', title: 'Microchipped', type: 'boolean', initialValue: true },
        { name: 'heartwormTested', title: 'Heartworm Tested', type: 'boolean', initialValue: true },
        { name: 'specialNeeds', title: 'Special Needs', type: 'text', rows: 3 },
        { name: 'medicalNotes', title: 'Medical Notes', type: 'text', rows: 3 },
      ],
    }),

    // =========================================
    // ADOPTION INFO
    // =========================================
    defineField({
      name: 'adoptionFee',
      title: 'Adoption Fee',
      type: 'number',
      group: 'basic',
      description: 'Leave blank to hide fee or if variable',
    }),
    defineField({
      name: 'intakeDate',
      title: 'Intake Date',
      type: 'date',
      group: 'basic',
    }),
    defineField({
      name: 'adoptedDate',
      title: 'Adoption Date',
      type: 'date',
      group: 'basic',
      hidden: ({ document }) => document?.status !== 'adopted',
    }),

    // =========================================
    // MEDIA (Alt-Safe Images)
    // =========================================
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'dogImage',
      group: 'media',
      description: 'Primary image shown on dog profile and cards',
      validation: (Rule) => Rule.required().error('Hero image is required'),
    }),
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      of: [{ type: 'dogImage' }],
      group: 'media',
      description: 'Additional photos of the dog',
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
          description: 'Leave blank to use dog name',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          description: 'Leave blank to use short description',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'name',
      status: 'status',
      idNumber: 'idNumber',
      media: 'heroImage',
    },
    prepare({ title, status, idNumber, media }) {
      const statusLabels: Record<string, string> = {
        available: '🟢 Available',
        pending: '🟡 Pending',
        adopted: '🔵 Adopted',
        foster: '🟣 Foster',
        medical_hold: '🔴 Medical Hold',
        not_available: '⚫ Not Available',
      };
      const subtitle = [statusLabels[status] || status, idNumber && `ID: ${idNumber}`]
        .filter(Boolean)
        .join(' • ');

      return {
        title,
        subtitle,
        media,
      };
    },
  },

  orderings: [
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Newest First',
      name: 'intakeDateDesc',
      by: [{ field: 'intakeDate', direction: 'desc' }],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }],
    },
    {
      title: 'Rescue ID',
      name: 'idNumberAsc',
      by: [{ field: 'idNumber', direction: 'asc' }],
    },
  ],
});
