-- ============================================================
-- TTP-RMGDRI-STAGE1-REPAIR-MIGRATION-001
-- Repair: add missing created_at column to applications table
-- Root cause: table pre-existed before TTP-001 migration;
--   CREATE TABLE IF NOT EXISTS skipped; created_at not added
-- Additive only. No data loss. No destructive operations.
-- ============================================================

-- 1. Add the missing column
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- 2. Backfill null values on existing rows
-- Use updated_at as best available proxy; fall back to now()
UPDATE public.applications
  SET created_at = COALESCE(updated_at, now())
  WHERE created_at IS NULL;

-- 3. Set NOT NULL after backfill (safe — no nulls remain)
ALTER TABLE public.applications
  ALTER COLUMN created_at SET NOT NULL;
