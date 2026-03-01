# Change Request (CR) Workflow

Manual broker workflow for processing Lori's change requests.
This is Stage 1 of TTP-0120 — Ray remains the broker, but intake is structured.

---

## Intake Sources

| Source | Where | Format |
|--------|-------|--------|
| GitHub Issue | [New Issue](https://github.com/rayrich01/RMGDRI-Website/issues/new/choose) | Structured template (content-update, new-feature, dog-record, bug) |
| PR Comment | [PR #9](https://github.com/rayrich01/RMGDRI-Website/pull/9) | `**Page:** ... **What to change:** ...` format |
| Email / Text | Direct from Lori | Unstructured — convert to GitHub Issue before processing |

---

## Workflow Steps

### 1. Receive Notification

GitHub sends email/notification when:
- New issue is opened (any template)
- New comment on PR #9

### 2. Triage

- Read the CR and assess scope
- Assign label if not auto-labeled:
  - `content-update` — text, image, or date change
  - `feature-request` — new page, form, or feature
  - `dog-record` — dog page, photo, or adoption story
  - `bug` — broken functionality
- Assign priority label:
  - `urgent` — blocks operations
  - `before-launch` — needed before go-live
  - `nice-to-have` — non-blocking enhancement
- Estimate effort: trivial (< 5 min), small (< 30 min), medium (< 2 hr), large (> 2 hr)

### 3. Execute

**For content updates (trivial/small):**
```
1. checkout the appropriate branch
2. find the file (grep for the text or page route)
3. make the edit
4. commit with message: "CR-{issue#}: {summary}"
5. push to branch
```

**For bug fixes:**
```
1. reproduce the bug on the preview
2. diagnose root cause
3. fix and test locally
4. commit: "fix: CR-{issue#}: {summary}"
5. push to branch
```

**For feature requests:**
```
1. scope the work — may need a TTP
2. create branch if large
3. implement
4. commit: "feat: CR-{issue#}: {summary}"
5. push to branch
```

**For dog record issues:**
```
1. check if it's a Sanity content issue or code issue
2. for Sanity: update via Studio or API
3. for code: edit the relevant page/component
4. commit and push
```

### 4. Deploy

- Push to `release/lori-review-*` branch or the active PR branch
- Vercel auto-deploys a preview within ~60 seconds
- Verify the change on the preview URL

### 5. Notify

Comment on the issue or PR:

```markdown
## CR-{number} Complete

**Change:** {brief description}
**Preview:** [View updated page]({preview-url})

Please review and let me know if any adjustments are needed.
```

### 6. Close

- Wait for Lori to confirm the change looks good
- If adjustments needed → repeat from step 3
- Once approved → close the issue or mark the PR comment resolved

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — only merged PRs |
| `pr5-adoption-foster-native-form` | Adoption/foster form (PR #5) |
| `pr6-shelter-transfer-native-form` | Shelter transfer form (PR #6) |
| `pr7-volunteer-native-form` | Volunteer form (PR #7) |
| `pr8-bite-report-human` | Bite report form (PR #8) |

CRs against a specific form go on that form's branch.
General CRs go on the active release branch or directly to main.

---

## Label Taxonomy

| Label | Meaning |
|-------|---------|
| `cr-pending` | Received, awaiting triage |
| `cr-in-progress` | Being worked on |
| `cr-review` | Complete, awaiting Lori's review |
| `cr-done` | Approved and closed |
| `cr-blocked` | Needs clarification |
| `content-update` | Category: text/image/date |
| `feature-request` | Category: new functionality |
| `dog-record` | Category: Sanity content |
| `bug` | Category: broken behavior |

---

## Escalation

- If a CR is ambiguous → comment asking for clarification, label `cr-blocked`
- If a CR touches security, env vars, or API routes → Ray reviews before executing
- If a CR requires > 2 hours → create a TTP before starting
