# CR-86-001: Implementation Summary

## What was built
Staff workflow for the application review portal: status management, internal notes, assessment tracking, clarification requests, comment thread, and activity log.

## Where changes occurred

| File | Type | Purpose |
|------|------|---------|
| `src/app/admin/submissions/[id]/ReviewPanel.tsx` | New | Client component — status buttons, assessment, clarification, notes, comments, activity log |
| `src/app/api/admin/review/[id]/route.ts` | New | POST endpoint — persists review state to `applications.status` + `internal_flags` JSONB |
| `src/app/admin/submissions/[id]/page.tsx` | Modified | Wired ReviewPanel into detail view, improved status badge colors |
| `src/app/admin/submissions/page.tsx` | Modified | Added `needs_clarification` status to list page badge |
| `src/app/admin/submissions/SubmissionFilters.tsx` | New | Type tabs (Adopt/Foster/Other) + status filter (all 5 statuses) |

## Key decisions

1. **No schema migration.** Review state is stored in the existing `internal_flags` JSONB column. This avoids migration risk and works immediately. The activity log is a `review_log` array within `internal_flags`.

2. **Status uses existing `status` TEXT column.** The `status` field already existed on `applications`. We added `needs_clarification` as a new valid value alongside `submitted`, `reviewing`, `approved`, `rejected`.

3. **Timestamps in `internal_flags`.** Processing timestamps (`reviewed_at`, `assessed_at`, `status_changed_at`) are stored in `internal_flags` rather than as top-level columns. This avoids needing a migration while maintaining full audit capability.

4. **Activity log in `internal_flags.review_log`.** Each status change, assessment update, clarification request, and comment is appended to a JSONB array. This provides a lightweight but complete audit trail without a separate events table query.

5. **Reused all existing infrastructure.** Auth (passphrase middleware), Supabase client (`createAdminSupabaseClient`), admin layout, and UI patterns are all reused. No new dependencies.
