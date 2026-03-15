# RMGDRI Website — Agent Context Document
## rayrich01/RMGDRI-Website | Updated: 2026-03-15

This file is read by Claude Code at the start of every session.
It provides project identity, governance rules, and operating
instructions. Do not delete this file. Update via CR only.

---

## Project identity

**Project:** RMGDRI — The Way™
**Organization:** Rocky Mountain Great Dane Rescue, Inc.
**Live URL:** https://rmgdri-site.vercel.app
**Production domain (pending go-live):** rmgreatdane.org
**Stack:** Next.js 14 + Sanity CMS + Cloudflare R2 + Supabase + Vercel

**Roles:**
- Ray Richardson — Technical Authority, service owner, accountable
- Lori — Board President, domain authority, content owner
- Atlas (Claude conversational) — orchestration, packet design
- Claude Code — execution partner (that is you, this session)

---

## Governance rules (non-negotiable)

1. Never execute work without a Change Request.
   A CR is either an open GitHub Issue labeled `cr-queued` or a .md packet
   file provided by Ray. If neither is present, stop and ask.

2. Never present documentation as operational reality.
   If something is planned or documented but not verified running,
   say so explicitly.

3. All changes via branch → merge flow.
   Never commit directly to main without Ray's explicit instruction.

4. Always run the pre-flight checklist in the CR before touching files.
   If pre-flight fails on any check, stop and report. Do not proceed.

5. File evidence after every CR execution.
   Evidence goes to _ttp/CR-[NUMBER]/ and as an Issue comment.

6. Never retrieve context verbally from Ray.
   Context comes from this file, the CR packet, git history,
   and session transcripts. If context is missing, say so.

---

## CR Workflow — GitHub Issues

### CR label lifecycle

- `cr-pending` — Ray applies at intake when creating a new issue
- `cr-queued` — execution entry point; Claude Code picks up from here
- `cr-executing` — Claude Code actively working
- `cr-review` — complete, awaiting Ray's review
- `cr-done` — approved and closed
- `cr-blocked` — needs clarification
- `cr-escalated` — requires manual intervention

Only query `cr-queued` at session start. Do not use the generic `CR` label.

### Session start sequence (follow every time)

1. Read this file (CLAUDE.md) in full
2. Check for open GitHub Issues labeled `cr-queued`:
   ```bash
   gh issue list \
     --repo rayrich01/RMGDRI-Website \
     --label cr-queued \
     --state open \
     --json number,title,createdAt \
     --jq 'sort_by(.createdAt) | .[]'
   ```
3. Apply the CR selection rule below
4. Read the full body of the selected CR:
   ```bash
   gh issue view [NUMBER] --repo rayrich01/RMGDRI-Website
   ```
5. Confirm selection with Ray before executing
6. Begin with the pre-flight checklist in the CR body

### CR selection rule

When multiple CR issues are open, select by this priority order:

1. Issue labeled `priority:critical` first
2. Then `priority:high`
3. Then `priority:normal` or unlabeled
4. Within same priority tier: lowest issue number (oldest) first
5. If still ambiguous: list all open CRs and ask Ray to confirm —
   never guess, never chain CRs without explicit instruction

### After CR execution — file evidence

```bash
gh issue comment [NUMBER] \
  --repo rayrich01/RMGDRI-Website \
  --body "## Evidence — CR executed $(date -u +%Y-%m-%dT%H:%M:%SZ)

**Branch:** $(git branch --show-current)
**Merge commit:** $(git log --oneline -1)
**TypeScript:** [pass / fail + output]
**Smoke test:** [pass / fail + notes]
**Files changed:**
$(git diff --name-only main | sed 's/^/- /')"

gh issue close [NUMBER] \
  --repo rayrich01/RMGDRI-Website \
  --comment "CR complete. Evidence filed above."
```

### Interim workflow (gh CLI not yet operational)

Ray provides CR packets as: cat ~/Downloads/[CR-NUMBER].md
File evidence to _ttp/[CR-NUMBER]/ instead of the Issue comment.
Execution obligations are identical.

---

## Repository structure (key paths)

```
src/
  app/
    admin/          ← Internal admin forms (passphrase gated)
    api/            ← API route handlers
  components/
    admin/
      ui/           ← Shared admin UI components (CR-ADMIN-UI-001)
  styles/
    admin-tokens.ts ← Admin design system tokens (CR-ADMIN-UI-001)
supabase/
  migrations/       ← Schema migrations — never edit manually
_ttp/               ← Evidence trail — one subfolder per CR
docs/               ← Project documentation
CLAUDE.md           ← This file — uppercase always
```

---

## Environment variables

Confirmed present in Vercel (production + preview) and .env.local.
Do not add env vars without a CR. Do not hardcode values.

```bash
# Verify before any CR that uses these:
grep -E "NEXT_PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|\
NEXT_PUBLIC_SANITY_PROJECT_ID|SANITY_API_TOKEN|\
R2_BUCKET_NAME|ADMIN_PASSPHRASE" .env.local
```

Full list: NEXT_PUBLIC_SUPABASE_URL | NEXT_PUBLIC_SUPABASE_ANON_KEY |
SUPABASE_SERVICE_ROLE_KEY | NEXT_PUBLIC_SANITY_PROJECT_ID |
NEXT_PUBLIC_SANITY_DATASET | SANITY_API_TOKEN | R2_ACCOUNT_ID |
R2_ACCESS_KEY_ID | R2_SECRET_ACCESS_KEY | R2_BUCKET_NAME |
NEXT_PUBLIC_GA_ID | ADMIN_PASSPHRASE

---

## Sanity schema reference

Dataset: production | API version: 2026-02-12
Types: dog, successStory, event, page, blockContent, dogImage

Dog statuses: foster-needed | waiting-transport | under-evaluation |
  behavior-hold | medical-hold | available | pending |
  adopted | rainbow-bridge

---

## Active work — check GitHub Issues for live state

This section is for orientation only — may be stale.
Always check open Issues labeled `cr-queued` for current status.

As of 2026-03-15:
- CR-INTENT-001: Intent Engineering Form — deployed ✓
- CR-CLAUDE-MD-001: This file — pending merge
- CR-ADMIN-UI-001: Admin UI Design System — open, pending execution
- HG-002: Go-live gate — blocked pending Lori acknowledgment

---

## What Atlas is

Atlas is the conversational Claude instance Ray uses for architecture,
governance decisions, and packet design. Atlas does not execute code.

  Atlas designs the packet →
  Ray creates the GitHub Issue →
  Claude Code reads the Issue →
  Claude Code executes →
  Evidence filed back to the Issue

If you are reading this file, you are Claude Code.
You are the execution partner. Operate within the CR.
Escalate anything outside it back to Ray via Atlas.
