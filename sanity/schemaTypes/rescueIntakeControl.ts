import { defineField, defineType } from 'sanity'

/**
 * Rescue Intake Control — Singleton
 * TTP-RMGDRI-INTAKE-STATUS-CONTROL-001
 *
 * Governs intake posture from Sanity Studio.
 * Fixed document ID: rescueIntakeControl
 *
 * Modes: open | limited | paused
 * Scope: global, owner surrender, shelter transfer
 */
export const rescueIntakeControl = defineType({
  name: 'rescueIntakeControl',
  title: 'Rescue Intake Control',
  type: 'document',
  groups: [
    { name: 'status', title: '🚦 Intake Status', default: true },
    { name: 'pausePage', title: '📄 Pause Page Content' },
    { name: 'ops', title: '🔧 Operations' },
  ],
  fields: [
    // === INTAKE STATUS ===
    defineField({
      name: 'globalIntakeMode',
      title: 'Global Intake Mode',
      type: 'string',
      group: 'status',
      options: {
        list: [
          { title: '🟢 Open — accepting intake requests', value: 'open' },
          { title: '🟡 Limited — case-by-case review only', value: 'limited' },
          { title: '🔴 Paused — intake temporarily suspended', value: 'paused' },
        ],
        layout: 'radio',
      },
      initialValue: 'paused',
      validation: (Rule) => Rule.required(),
      description: 'Controls the overall intake posture for the rescue.',
    }),
    defineField({
      name: 'ownerSurrenderMode',
      title: 'Owner Surrender Mode',
      type: 'string',
      group: 'status',
      options: {
        list: [
          { title: '🟢 Open', value: 'open' },
          { title: '🟡 Limited', value: 'limited' },
          { title: '🔴 Paused', value: 'paused' },
        ],
        layout: 'radio',
      },
      initialValue: 'paused',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shelterTransferMode',
      title: 'Shelter Transfer / Shelter Intake Mode',
      type: 'string',
      group: 'status',
      options: {
        list: [
          { title: '🟢 Open', value: 'open' },
          { title: '🟡 Limited', value: 'limited' },
          { title: '🔴 Paused', value: 'paused' },
        ],
        layout: 'radio',
      },
      initialValue: 'paused',
      validation: (Rule) => Rule.required(),
    }),

    // === PAUSE PAGE CONTENT ===
    defineField({
      name: 'pausePageEnabled',
      title: 'Pause Page Enabled',
      type: 'boolean',
      group: 'pausePage',
      initialValue: true,
      description: 'When enabled, affected intake routes show the pause page.',
    }),
    defineField({
      name: 'pausePageTitle',
      title: 'Page Title (browser tab)',
      type: 'string',
      group: 'pausePage',
      initialValue: 'Check Back — Intake Temporarily Paused | RMGDRI',
    }),
    defineField({
      name: 'pausePageHeading',
      title: 'Page Heading',
      type: 'string',
      group: 'pausePage',
      initialValue: 'Check Back',
    }),
    defineField({
      name: 'pausePageBody',
      title: 'Page Body',
      type: 'text',
      group: 'pausePage',
      rows: 10,
      description: 'Main body text for the pause page. Supports plain text.',
      initialValue: `Please remember that Rocky Mountain Great Dane Rescue is a wholly volunteer-run organization and depends entirely on our foster families and volunteer team to care for the Danes that come into rescue.

As we continue transitioning to our updated adoption, foster, and Dane intake processes, we do not currently have the staffing capacity to support standard Owner Surrender and Shelter Intake requests through our legacy process.

We are still reviewing a limited number of intake situations on a case-by-case basis when urgency, available foster capacity, and rescue resources allow.

Submission of a request does not guarantee acceptance, immediate placement, or an immediate response.`,
    }),
    defineField({
      name: 'intakeReviewEmail',
      title: 'Intake Review Email',
      type: 'string',
      group: 'pausePage',
      initialValue: 'rehome@rmgreatdane.org',
      description: 'Email shown on the pause page for limited intake review requests.',
    }),
    defineField({
      name: 'limitedReviewInstructions',
      title: 'Limited Review Instructions',
      type: 'text',
      group: 'pausePage',
      rows: 6,
      initialValue: `Please include:
- your name
- phone number
- city and state
- whether this is an owner surrender or shelter case
- the dog's age and sex
- the reason the situation is urgent
- any immediate medical or behavioral concerns`,
    }),
    defineField({
      name: 'returnHomeEnabled',
      title: 'Show Return Home Button',
      type: 'boolean',
      group: 'pausePage',
      initialValue: true,
    }),
    defineField({
      name: 'returnHomeLabel',
      title: 'Return Home Button Label',
      type: 'string',
      group: 'pausePage',
      initialValue: 'Return Home',
    }),
    defineField({
      name: 'returnHomeHref',
      title: 'Return Home URL',
      type: 'string',
      group: 'pausePage',
      initialValue: '/',
    }),

    // === OPERATIONS ===
    defineField({
      name: 'effectiveFrom',
      title: 'Effective From',
      type: 'datetime',
      group: 'ops',
      description: 'When this intake posture took effect.',
    }),
    defineField({
      name: 'lastReviewedBy',
      title: 'Last Reviewed By',
      type: 'string',
      group: 'ops',
      description: 'Name of the person who last reviewed/updated this control.',
    }),
    defineField({
      name: 'internalOpsNotes',
      title: 'Internal Operations Notes',
      type: 'text',
      group: 'ops',
      rows: 5,
      description: 'Internal notes — not shown publicly.',
    }),
  ],

  preview: {
    select: {
      globalMode: 'globalIntakeMode',
      surrender: 'ownerSurrenderMode',
      shelter: 'shelterTransferMode',
    },
    prepare({ globalMode, surrender, shelter }) {
      const emoji: Record<string, string> = { open: '🟢', limited: '🟡', paused: '🔴' }
      return {
        title: `${emoji[globalMode] || '❓'} Intake: ${globalMode || 'unknown'}`,
        subtitle: `Surrender: ${surrender || '?'} | Shelter: ${shelter || '?'}`,
      }
    },
  },
})
