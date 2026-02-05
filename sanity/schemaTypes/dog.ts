import { defineField, defineType } from 'sanity'

export const dog = defineType({
  name: 'dog',
  title: 'Dog',
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

    // === STATUS ===
    defineField({
      name: 'status',
      title: 'Adoption Status',
      type: 'string',
      group: 'status',
      options: {
        list: [
          { title: '🟢 Available', value: 'available' },
          { title: '🟡 Pending', value: 'pending' },
          { title: '🎉 Adopted', value: 'adopted' },
          { title: '🌈 Rainbow Bridge', value: 'rainbow-bridge' },
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intakeDate',
      title: 'Intake Date',
      type: 'date',
      group: 'status',
    }),
    defineField({
      name: 'location',
      title: 'Current Location',
      type: 'string',
      group: 'status',
      description: 'City/State where dog is fostered',
    }),

    // === DETAILS ===
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'details',
      rows: 5,
      description: 'Tell the story of this dog — personality, what they need in a home',
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
      type: 'date',
      group: 'adoption',
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
    prepare({ title, status, media }) {
      const statusEmoji = {
        available: '🟢',
        pending: '🟡',
        adopted: '🎉',
        'rainbow-bridge': '🌈',
      }[status] || '❓'

      return {
        title: `${statusEmoji} ${title}`,
        media,
      }
    },
  },
})
