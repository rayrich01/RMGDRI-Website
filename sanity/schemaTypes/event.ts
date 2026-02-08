import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "Utah Adoption Day", "Denver Dane Meetup"',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: '🐾 Adoption Event', value: 'adoption' },
          { title: '🎉 Meetup', value: 'meetup' },
          { title: '💰 Fundraiser', value: 'fundraiser' },
          { title: '📚 Educational', value: 'educational' },
          { title: '🎪 Other', value: 'other' },
        ],
        layout: 'radio',
      },
      initialValue: 'adoption',
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      options: {
        list: [
          { title: 'Utah', value: 'utah' },
          { title: 'Colorado', value: 'colorado' },
          { title: 'Wyoming', value: 'wyoming' },
          { title: 'Idaho', value: 'idaho' },
          { title: 'Montana', value: 'montana' },
          { title: 'New Mexico', value: 'new-mexico' },
          { title: 'Virtual / Online', value: 'virtual' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date & Time',
      type: 'string',
      description: 'Format: YYYY-MM-DD HH:MM AM/PM (e.g., 2025-02-15 2:30 PM)',
      placeholder: '2025-02-15 2:30 PM',
      validation: (Rule) =>
        Rule.required().regex(
          /^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2} (AM|PM)$/,
          'Must be YYYY-MM-DD HH:MM AM/PM format (e.g., 2025-02-15 2:30 PM)'
        ),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date & Time',
      type: 'string',
      description: 'Format: YYYY-MM-DD HH:MM AM/PM (e.g., 2025-02-15 5:00 PM). Leave blank for single-day events',
      placeholder: '2025-02-15 5:00 PM',
      validation: (Rule) =>
        Rule.regex(
          /^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2} (AM|PM)$/,
          'Must be YYYY-MM-DD HH:MM AM/PM format (e.g., 2025-02-15 5:00 PM)'
        ),
    }),
    defineField({
      name: 'location',
      title: 'Location Name',
      type: 'string',
      description: 'e.g., "PetSmart - Sandy", "City Park Pavilion"',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 2,
      description: 'Full street address',
    }),
    defineField({
      name: 'description',
      title: 'Event Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
          ],
        },
      ],
      description: 'Details about the event, what to expect, what to bring',
    }),
    defineField({
      name: 'image',
      title: 'Event Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Flyer or promotional image',
    }),
    defineField({
      name: 'registrationLink',
      title: 'Registration / RSVP Link',
      type: 'url',
      description: 'External link for sign-up (if applicable)',
    }),
    defineField({
      name: 'facebookEventUrl',
      title: 'Facebook Event URL',
      type: 'url',
      description: 'Link to Facebook event page',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'For questions about this event',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Event',
      type: 'boolean',
      initialValue: false,
      description: 'Show prominently on homepage or events page',
    }),
    defineField({
      name: 'isActive',
      title: 'Active / Published',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck to hide without deleting',
    }),
  ],

  orderings: [
    {
      title: 'Event Date (Upcoming First)',
      name: 'startDateAsc',
      by: [{ field: 'startDate', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      date: 'startDate',
      region: 'region',
      media: 'image',
      isActive: 'isActive',
    },
    prepare({ title, date, region, media, isActive }) {
      const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'No date'
      const status = isActive ? '' : '🚫 '
      return {
        title: `${status}${title}`,
        subtitle: `${formattedDate} • ${region || 'No region'}`,
        media,
      }
    },
  },
})
