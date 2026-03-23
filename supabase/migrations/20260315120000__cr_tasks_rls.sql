-- ============================================================
-- 001-cr-tasks-rls.sql
-- Enable Row-Level Security on cr_tasks table
--
-- Context: Reconciliation Matrix Row 11 (P1)
-- Demonstrated vulnerability: any query omitting &tenant=eq.X
-- sees all tenants. Fixed at query layer (commit ae00f5e) but
-- the vulnerability class remains open.
--
-- This migration enforces tenant isolation at the database
-- layer so that even a missing query filter cannot leak data
-- across tenants.
--
-- Consumers:
--   - GitHub Actions workflows (5 per repo) use service_role key
--   - STUDIO-002 server uses service_role key
--   - Next.js apps use anon key for read-only display
--
-- Tenants: rmgdri, misha-main, misha-studio
--
-- IMPORTANT: service_role bypasses RLS by default in Supabase.
-- This is by design — workflows that use service_role will
-- continue to work without modification. RLS only restricts
-- anon and authenticated roles.
-- ============================================================

-- ── Step 1: Enable RLS ──────────────────────────────────────
-- If RLS is already enabled, this is a no-op.
ALTER TABLE public.cr_tasks ENABLE ROW LEVEL SECURITY;

-- ── Step 2: Drop existing policies if re-running ────────────
-- Safe to run even if policies don't exist.
DROP POLICY IF EXISTS "cr_tasks_service_role_all" ON public.cr_tasks;
DROP POLICY IF EXISTS "cr_tasks_anon_select_by_tenant" ON public.cr_tasks;
DROP POLICY IF EXISTS "cr_tasks_authenticated_select_by_tenant" ON public.cr_tasks;
DROP POLICY IF EXISTS "cr_tasks_authenticated_insert_by_tenant" ON public.cr_tasks;
DROP POLICY IF EXISTS "cr_tasks_authenticated_update_by_tenant" ON public.cr_tasks;

-- ── Step 3: service_role — full access ──────────────────────
-- Note: service_role bypasses RLS by default in Supabase,
-- so this policy is technically redundant but included for
-- documentation clarity. If Supabase ever changes the default
-- bypass behavior, this policy ensures continuity.
CREATE POLICY "cr_tasks_service_role_all"
  ON public.cr_tasks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── Step 4: anon — read-only, filtered by request header ────
-- The anon key is used by Next.js frontend apps.
-- Tenant is passed via the x-tenant request header, which
-- Supabase exposes as current_setting('request.header.x-tenant').
--
-- If no x-tenant header is provided, the policy returns NO rows
-- rather than ALL rows. This is the key security improvement.
CREATE POLICY "cr_tasks_anon_select_by_tenant"
  ON public.cr_tasks
  FOR SELECT
  TO anon
  USING (
    tenant = current_setting('request.header.x-tenant', true)
  );

-- ── Step 5: authenticated — CRUD filtered by JWT claim ──────
-- For future use: if authenticated users (e.g., dashboard)
-- access cr_tasks, their JWT must contain a tenant claim.
-- Supabase exposes JWT claims via auth.jwt()->'app_metadata'.
--
-- SELECT: can read rows matching their tenant
CREATE POLICY "cr_tasks_authenticated_select_by_tenant"
  ON public.cr_tasks
  FOR SELECT
  TO authenticated
  USING (
    tenant = (auth.jwt() -> 'app_metadata' ->> 'tenant')
  );

-- INSERT: can create rows matching their tenant
CREATE POLICY "cr_tasks_authenticated_insert_by_tenant"
  ON public.cr_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    tenant = (auth.jwt() -> 'app_metadata' ->> 'tenant')
  );

-- UPDATE: can update rows matching their tenant
CREATE POLICY "cr_tasks_authenticated_update_by_tenant"
  ON public.cr_tasks
  FOR UPDATE
  TO authenticated
  USING (
    tenant = (auth.jwt() -> 'app_metadata' ->> 'tenant')
  )
  WITH CHECK (
    tenant = (auth.jwt() -> 'app_metadata' ->> 'tenant')
  );

-- ── Verification queries (run after migration) ─────────────
-- These should be run manually to verify the migration:
--
-- 1. Check RLS is enabled:
--    SELECT relname, relrowsecurity
--    FROM pg_class WHERE relname = 'cr_tasks';
--    → relrowsecurity should be true
--
-- 2. Check policies exist:
--    SELECT policyname, cmd, roles
--    FROM pg_policies WHERE tablename = 'cr_tasks';
--    → should show 5 policies
--
-- 3. Test anon isolation (from PostgREST):
--    curl with anon key + no x-tenant header → 0 rows
--    curl with anon key + x-tenant: rmgdri → only rmgdri rows
--    curl with anon key + x-tenant: misha-main → only misha-main rows
--
-- 4. Test service_role bypass:
--    curl with service_role key → all rows (unchanged behavior)
