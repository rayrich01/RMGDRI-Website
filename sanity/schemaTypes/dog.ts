import { defineField, defineType } from 'sanity'

export const dog = defineType({
  name: 'dog',
  title: 'Dane',
  type: 'document',
  groups: [
    { name: 'basic', title: '🐕 Basic Info', default: true },
    { name: 'status', title: '📋 Status' },
    { name: 'details', title: '📝 Details' },
    { name: 'medical', title: '🏥 Medical' },
    { name: 'photos', title: '📷 Photos' },
    { name: 'adoption', title: '🎉 Adoption Info' },
  ],
  fields: [
    // === BASIC INFO ===
    defineField({
      name: 'name',
      title: 'Dog Name',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'basic',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: 'Click "Generate" after entering the name',
    }),
    defineField({
      name: 'breed',
      title: 'Breed',
      type: 'string',
      group: 'basic',
      initialValue: 'Great Dane',
    }),
    defineField({
      name: 'age',
      title: 'Age',
      type: 'string',
      group: 'basic',
      description: 'e.g., "2 years", "6 months", "Senior"',
    }),
    defineField({
      name: 'sex',
      title: 'Sex',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Male', value: 'male' },
          { title: 'Female', value: 'female' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'color',
      title: 'Color/Markings',
      type: 'string',
      group: 'basic',
      description: 'e.g., "Fawn", "Brindle", "Blue", "Harlequin"',
    }),
    defineField({
      name: 'weight',
      title: 'Weight (lbs)',
      type: 'number',
      group: 'basic',
      description: 'Weight in pounds',
    }),
    defineField({
      name: 'ears',
      title: 'Ears',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Natural', value: 'natural' },
          { title: 'Cropped', value: 'cropped' },
        ],
        layout: 'radio',
      },
    }),

    // === STATUS ===
    defineField({
      name: 'status',
      title: 'Adoption Status',
      type: 'string',
      group: 'status',
      options: {
        list: [
          { title: 'FN - Foster Needed', value: 'foster-needed' },
          { title: 'WT - Waiting Transport', value: 'waiting-transport' },
          { title: 'UE - Under Evaluation', value: 'under-evaluation' },
          { title: 'BH - Behavior Hold', value: 'behavior-hold' },
          { title: 'MH - Medical Hold', value: 'medical-hold' },
          { title: 'A - Available', value: 'available' },
          { title: 'PA - Pending Adoption', value: 'pending' },
          { title: '🎉 Adopted', value: 'adopted' },
          { title: '🌈 Rainbow Bridge', value: 'rainbow-bridge' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'under-evaluation',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intakeDate',
      title: 'Intake Date',
      type: 'string',
      group: 'status',
      description: 'Format: YYYY-MM-DD (e.g., 2025-02-07)',
      placeholder: '2025-02-07',
      validation: (Rule) =>
        Rule.regex(/^\d{4}-\d{2}-\d{2}$/, {
          name: 'date',
          invert: false,
        }).error('Must be in YYYY-MM-DD format (e.g., 2025-02-07)'),
    }),
    defineField({
      name: 'location',
      title: 'Current Location',
      type: 'string',
      group: 'status',
      description: 'City/State where dog is fostered',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'status',
      initialValue: false,
      description: 'Mark as featured to show "New!" or highlight in listings',
    }),

    // === DETAILS ===
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      group: 'details',
      rows: 3,
      description: 'Brief intro (shown in cards and at top of profile)',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'text',
      group: 'details',
      rows: 10,
      description: 'Tell the full story of this dog — personality, what they need in a home',
    }),
    defineField({
      name: 'goodWith',
      title: 'Good With',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Kids', value: 'kids' },
          { title: 'Dogs', value: 'dogs' },
          { title: 'Cats', value: 'cats' },
        ],
      },
    }),
    defineField({
      name: 'specialNeeds',
      title: 'Special Needs',
      type: 'text',
      group: 'details',
      rows: 3,
      description: 'Any special requirements or accommodations needed',
    }),

    // === MEDICAL ===
    defineField({
      name: 'spayedNeutered',
      title: 'Spayed/Neutered',
      type: 'boolean',
      group: 'medical',
      initialValue: false,
    }),
    defineField({
      name: 'vaccinated',
      title: 'Vaccinations Current',
      type: 'boolean',
      group: 'medical',
      initialValue: false,
    }),
    defineField({
      name: 'microchipped',
      title: 'Microchipped',
      type: 'boolean',
      group: 'medical',
      initialValue: false,
    }),
    defineField({
      name: 'medicalNotes',
      title: 'Medical Notes',
      type: 'text',
      group: 'medical',
      rows: 4,
    }),

    // === PHOTOS ===
    defineField({
      name: 'mainImage',
      title: 'Main Photo',
      type: 'image',
      group: 'photos',
      options: { hotspot: true },
      description: 'Primary photo shown in listings',
    }),
    defineField({
      name: 'gallery',
      title: 'Additional Photos',
      type: 'array',
      group: 'photos',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
      ],
    }),

    // === ADOPTION INFO (shown when status = adopted) ===
    defineField({
      name: 'adoptionDate',
      title: 'Adoption Date',
      type: 'string',
      group: 'adoption',
      description: 'Format: YYYY-MM-DD (e.g., 2025-02-07)',
      placeholder: '2025-02-07',
      validation: (Rule) =>
        Rule.regex(/^\d{4}-\d{2}-\d{2}$/, {
          name: 'date',
          invert: false,
        }).error('Must be in YYYY-MM-DD format (e.g., 2025-02-07)'),
      hidden: ({ document }) => document?.status !== 'adopted',
    }),
    defineField({
      name: 'adoptionYear',
      title: 'Adoption Year',
      type: 'string',
      group: 'adoption',
      options: {
        list: ['2025', '2024', '2023', '2022', '2021', '2020'],
      },
      hidden: ({ document }) => document?.status !== 'adopted',
      description: 'Used for Success Gallery pages',
    }),
    defineField({
      name: 'adopterFirstName',
      title: 'Adopter First Name',
      type: 'string',
      group: 'adoption',
      hidden: ({ document }) => document?.status !== 'adopted',
      description: 'For success story (optional)',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      status: 'status',
      media: 'mainImage',
    },
    prepare({ title, status, media }: Record<string, any>) {
      const statusEmoji: Record<string, string> = {
        available: '🟢',
        pending: '🟡',
        adopted: '🎉',
        'rainbow-bridge': '🌈',
      }
      const emoji = (status && statusEmoji[status]) || '❓'

      return {
        title: `${emoji} ${title}`,
        media,
      }
    },
  },
})
