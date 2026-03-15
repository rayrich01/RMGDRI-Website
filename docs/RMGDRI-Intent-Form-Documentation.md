**RMGDRI — THE WAY™**

**Atlas Intent Engineering Form**

System Documentation & Operational Reference

|                   |                                        |
|-------------------|----------------------------------------|
| **Document type** | Project record / operational reference |
| **Project**       | RMGDRI — The Way™                      |
| **Workstream**    | Atlas Governance / Intent Engineering  |
| **Date**          | 2026-03-15                             |
| **Author**        | Ray Richardson / Atlas Architecture    |
| **Status**        | Active — CR-INTENT-001 deployed        |
| **File location** | ControlHub/RMGDRI_Website/docs/        |

**1. Purpose and Context**

RMGDRI (Rocky Mountain Great Dane Rescue, Inc.) is undergoing a
four-layer organizational redesign including a full website rebuild on a
modern technology stack. As part of this rebuild, an AI governance layer
called Atlas is being developed to assist with content, communications,
and operational decisions on behalf of the organization.

Atlas requires a machine-actionable intent profile — a structured record
of what RMGDRI values, how it prioritizes competing needs, what Atlas
may do autonomously, what requires human approval, and what it must
never do. Without this profile, Atlas operates on generic assumptions
rather than rescue-specific judgment. The quality of Atlas behavior is
directly proportional to the quality of this intent data.

The Intent Engineering Workbook was created by Ray Richardson as a
guided worksheet for Lori (Board President, RMGDRI) to capture this
organizational intent. The electronic form described in this document
converts that workbook into a persistent, web-accessible tool that Lori
can complete in stages, return to over time, and that produces a
directly usable JSON intent profile for Atlas governance configuration.

**2. What Was Built**

**2.1 The Form — Four Stages**

The form is organized as a staged workbook designed to minimize Lori's
effort while maximizing the quality of intent data captured. It can be
completed in short passes across multiple sessions.

**Stage 1 — Confirm What We Know**

Five pre-populated organizational belief statements that Lori marks as
Confirmed, Needs Correction, or Need to Discuss — with conditional
correction text fields that appear only when relevant. Followed by
open-ended identity questions (mission statement, what the public should
feel, what Atlas must never forget) and structured numeric inputs for
priority ranking and stakeholder ordering.

**Stage 2 — Priorities and Boundaries**

Checkbox-based inputs across four governance areas: what Atlas may do
autonomously; hard gates that always require Lori's approval; absolute
prohibitions (what Atlas must never do); and escalation triggers
(situations requiring immediate human review). Also includes tone
selectors (use vs. avoid) and website intent and optimization inputs.

**Stage 3 — Judgment Examples**

Free-text example cards where Lori describes real or anticipated
situations, what Atlas should do in each case, and why. Includes a
section on bad optimization patterns — what would go wrong if Atlas
optimized only for speed, conversion, workload reduction, or public
positivity. Additional examples can be added at any time, making this a
growing training resource.

**Stage 4 — Atlas Intent Profile**

Auto-populated summary built from Stages 1–3, with refinable free-text
fields. Includes a Fast-Start option (six essential questions for a
10-minute completion session) and a live JSON export of the complete
machine-actionable intent profile ready for Atlas governance
configuration. Lori does not need to re-enter information already
provided in earlier stages.

**2.2 User Experience**

|  |
|----|
| Lori accesses the form via a single URL in any browser, on any device. A passphrase gate protects the page on entry. Progress rings on each stage tab show completion at a glance. Answers save to the database when Lori clicks Save Progress. Returning to the URL and re-entering the passphrase restores all saved answers exactly where she left off. |

The form is designed to be low-stress and interruptible. Lori can
complete one stage, save, close the browser, and return days later.
Stage 4 auto-populates as earlier stages are completed. New judgment
examples can be added at any time. There is no deadline, no required
order, and no penalty for incomplete fields — partial answers are saved
and treated as in-progress intent.

**3. Technical Architecture**

**3.1 Technology Stack**

The form runs entirely within the existing RMGDRI technology stack. No
new services, accounts, or subscriptions were introduced.

| **Layer** | **Technology** | **Purpose** |
|----|----|----|
| Frontend | React (Next.js App Router) | Form UI, state management, progress tracking |
| Routing | Next.js App Router | Page and API route handling |
| API | Next.js Route Handler | Server-side read/write, auth check |
| Database | Supabase (PostgreSQL) | Persistent storage of form data as JSONB |
| Deployment | Vercel | Hosting, auto-deploy on git push to main |
| Auth | ADMIN_PASSPHRASE env var | Single shared passphrase gate, server-side only |

**3.2 File Locations in Repository**

**Repository: rayrich01/RMGDRI-Website**

| **File path** | **Purpose** |
|----|----|
| src/app/admin/intent/page.tsx | Passphrase gate + form page route |
| src/app/api/intent/route.ts | GET and POST API route handler |
| src/components/admin/IntentForm.tsx | Full form component — all four stages |
| supabase/migrations/20260315000000_create_intent_profile.sql | Database migration — creates intent_profile table |

**3.3 Where the Data Lives**

Form data is stored in the RMGDRI Supabase project as a single row in
the intent_profile table. Every time Lori clicks Save Progress, the
entire form state is written to the data column via an upsert on the
canonical slug rmgdri-v1. There is one authoritative row — not one row
per session.

| **Column** | **Type**    | **Description**                                |
|------------|-------------|------------------------------------------------|
| id         | uuid        | Primary key                                    |
| slug       | text        | rmgdri-v1 — unique identifier for this profile |
| version    | text        | Schema version (currently 1.0)                 |
| data       | jsonb       | Complete form state — all of Lori's answers    |
| created_at | timestamptz | Row creation timestamp                         |
| updated_at | timestamptz | Auto-updated on every save                     |

|  |
|----|
| Row Level Security is enabled on the intent_profile table with no public policies. All reads and writes go through the API route using the Supabase service role key, which never reaches the browser. The table is not directly accessible from the internet. |

**3.4 How the Passphrase Gate Works**

The form page makes a GET request to /api/intent with the entered
passphrase in the x-admin-passphrase header. The API route compares this
against the ADMIN_PASSPHRASE environment variable server-side. If it
matches, the saved profile data is returned and the form renders. If it
does not match, a 401 is returned and the gate remains closed. The
passphrase is never exposed in the browser bundle or client-side
JavaScript.

**3.5 JSON Intent Profile Export**

Stage 4 renders a live JSON export derived from all four stages. This
JSON is structured for direct use in Atlas governance configuration.
Fields include:

| **JSON field**        | **Description**                                    |
|-----------------------|----------------------------------------------------|
| atlas_optimize_for    | Outcomes Atlas should work toward                  |
| atlas_protect         | Values and standards that must not be compromised  |
| atlas_escalate_when   | Conditions requiring human review                  |
| atlas_never_assume    | Facts that must always be verified, never inferred |
| atlas_behave_like     | The role archetype Atlas should embody             |
| stakeholder_priority  | Ranked array of stakeholder groups                 |
| hard_prohibitions     | Absolute behavioral limits (never do)              |
| escalation_triggers   | Enumerated conditions that trigger escalation      |
| tone_use / tone_avoid | Communication tone directives                      |
| judgment_examples     | Lori's real-situation training examples            |
| bad_patterns          | Anti-patterns Atlas must avoid optimizing for      |

**4. Access and Operations**

**4.1 How Lori Accesses the Form**

| **Item** | **Detail** |
|----|----|
| URL | https://rmgdri-site.vercel.app/admin/intent |
| Passphrase | Shared admin passphrase (same as site admin access) |
| Device | Any browser, any device — no installation required |
| Session | Stateless — passphrase required each visit, all data restores from database |
| Availability | 24/7 — hosted on Vercel, tied to Supabase uptime SLA |

**4.2 How Ray Accesses the Data**

The saved intent profile can be retrieved at any time via the Supabase
dashboard (Table Editor → intent_profile) or programmatically via the
API using the admin passphrase. The GET response includes the full data
object and updated_at timestamp.

**4.3 How the Intent Profile Reaches Atlas**

The JSON export in Stage 4 is the bridge between Lori's answers and
Atlas governance configuration. The workflow is:

|  |
|----|
| 1\. Lori completes the form and saves 2. Ray retrieves the JSON via the API or copies it from Stage 4 3. Ray incorporates the JSON into the Atlas intent configuration in the control-hub governance layer 4. Atlas operates against this profile as its intent reference |

The form is a living document. Lori can return at any time to refine
answers, add judgment examples, or update priorities as the rescue
evolves. Each save overwrites the previous state and updates the
updated_at timestamp.

**5. Change Request Record**

| **Field**     | **Value**                                                  |
|---------------|------------------------------------------------------------|
| CR number     | CR-INTENT-001                                              |
| Title         | Atlas Intent Engineering Form                              |
| Raised        | 2026-03-15                                                 |
| Authority     | Ray Richardson                                             |
| Risk level    | Low — additive only, no existing routes or schema modified |
| Evidence path | \_ttp/CR-INTENT-001/                                       |
| Branch        | feat/intent-engineering-form → main                        |

**Deliverables**

| **File** | **Description** |
|----|----|
| 20260315000000_create_intent_profile.sql | Supabase migration |
| src/app/api/intent/route.ts | API route handler |
| src/app/admin/intent/page.tsx | Passphrase gate page |
| src/components/admin/IntentForm.tsx | Form component |
| CR-INTENT-001.md | Execution packet for Claude Code |
| RMGDRI-Intent-Form-Documentation.md/.docx | This document (both formats) |

**6. Key Design Decisions**

**Single JSONB row, not normalized tables**

The form data is a coherent unit. Normalizing it would add query
complexity with no benefit. JSONB allows the schema to evolve — new
questions added to the form — without database migrations. Existing
answers survive field additions through the mergeWithInitial() function
in the component, which deep-merges saved data over current defaults on
load.

**Passphrase gate, not full authentication**

This form is internal, single-user, and operationally low-risk. A full
auth system would add deployment complexity disproportionate to the
sensitivity of the data. The passphrase is validated server-side and
never exposed client-side. This is sufficient for this use case and
consistent with existing RMGDRI admin access patterns.

**Service role key, not anon key**

Row Level Security is enabled with no public policies. All database
access goes through the API route using the Supabase service role key.
Even if the API route URL were discovered, a valid passphrase would
still be required to read or write any data.

**Living document design**

The mergeWithInitial() deep merge function ensures that when new
questions are added to the form in future iterations, Lori's existing
answers are preserved. This was a deliberate governance decision — the
form must be extensible without data loss or re-entry burden.

**Auto-populated Stage 4**

Lori should not have to re-summarize what she already answered. Stage 4
reads from Stages 1–3 and constructs the intent summary automatically,
with free-text fields available for refinement. This reduces Stage 4 to
a review-and-refine task rather than a writing task.

**7. Next Steps**

|  |
|----|
| □ Lori completes the form and provides feedback on question clarity □ Ray reviews Stage 4 JSON export and incorporates into Atlas intent configuration □ Consider adding a read-only view mode for Ray to review without edit access □ Consider versioned snapshots — archive JSON each time a completed profile is saved □ File evidence under \_ttp/CR-INTENT-001/ per governance policy |

*This document is the authoritative record of the RMGDRI Intent
Engineering Form as built and deployed on 2026-03-15.*

*For questions contact Ray Richardson / Atlas Architecture.*
