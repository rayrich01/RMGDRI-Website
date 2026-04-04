# CR-86-002: Schema Changes

## No migration required

All review state is stored in existing columns:

### `applications.status` (existing TEXT column)
Added new valid value:
- `needs_clarification` (joins existing `submitted`, `reviewing`, `approved`, `rejected`)

### `applications.internal_flags` (existing JSONB column)
New keys used by the review API:

| Key | Type | Set when |
|-----|------|----------|
| `reviewer_notes` | string | Notes saved |
| `assessment` | string | Assessment text saved |
| `clarification_requested` | string | Clarification text saved |
| `reviewed_at` | ISO timestamp | Status first set to "reviewing" |
| `assessed_at` | ISO timestamp | Status set to "approved" or "rejected" |
| `status_changed_at` | ISO timestamp | Any status change |
| `review_log` | array of {action, note?, by, at} | Any review action |

### Why no migration
- `internal_flags` is JSONB — accepts arbitrary keys without schema changes
- `status` is TEXT — no enum constraint to update
- The `applications` table was created manually in Supabase (no migration file exists for it)
- Adding JSONB keys is non-breaking — existing reads ignore unknown keys

### Migration notes
If a future CR needs indexed queries on review state (e.g., "find all needs_clarification applications"), consider:
- Adding `review_status` as a top-level column
- Adding `reviewed_at` and `status_updated_at` as top-level TIMESTAMPTZ columns
- Creating indexes on these columns

For now, JSONB storage is sufficient for the admin portal's needs (small dataset, admin-only access).
