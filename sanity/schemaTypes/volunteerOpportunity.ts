import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'volunteerOpportunity',
  title: 'Volunteer Opportunity',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Position Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'responsibilities',
      title: 'Responsibilities',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'qualifications',
      title: 'Qualifications',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'benefits',
      title: 'What We Offer',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'hideFromWebsite',
      title: 'Hide from Website',
      type: 'boolean',
      description: 'When checked, this position will not appear on the public Volunteer Opportunities page.',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first. Leave blank for alphabetical.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      hidden: 'hideFromWebsite',
    },
    prepare({ title, hidden }) {
      return {
        title: title || 'Untitled',
        subtitle: hidden ? '🚫 Hidden from website' : '✅ Visible',
      }
    },
  },
})
