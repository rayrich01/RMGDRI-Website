-- ============================================================
-- TTP-RMGDRI-APPLICATION-INGEST-001
-- Applications table — governed lifecycle entity
-- Safe for both fresh creation and existing table scenarios
-- ============================================================

-- 1. Create table if it doesn't exist
create table if not exists public.applications (
  id            uuid        primary key default gen_random_uuid(),
  status        text        not null default 'draft',
  data          jsonb       not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 2. Add columns that may be missing on an existing table
alter table public.applications add column if not exists user_id uuid;
alter table public.applications add column if not exists type text default 'adopt';
alter table public.applications add column if not exists submitted_at timestamptz;
alter table public.applications add column if not exists data jsonb default '{}'::jsonb;

-- 3. Drop and recreate constraints safely (may differ from prior versions)
alter table public.applications drop constraint if exists applications_type_check;
alter table public.applications add constraint applications_type_check
  check (type in ('adopt', 'foster', 'volunteer', 'surrender', 'contact',
                  'bite-report-human', 'shelter-transfer', 'owner-surrender',
                  'adopt-foster', 'volunteer-survey'));

alter table public.applications drop constraint if exists applications_status_check;
alter table public.applications add constraint applications_status_check
  check (status in ('draft', 'submitted'));

comment on table public.applications is
  'Governed application lifecycle entity. Stage 1: ingest (draft → submitted).';

-- 4. Indexes (safe — IF NOT EXISTS)
create index if not exists idx_applications_user_id
  on public.applications (user_id);

create index if not exists idx_applications_status
  on public.applications (status);

create index if not exists idx_applications_type
  on public.applications (type);

create index if not exists idx_applications_submitted_at
  on public.applications (submitted_at desc nulls last);

-- 5. Updated_at trigger (drop first to avoid duplicate)
drop trigger if exists trg_applications_updated_at on public.applications;
create trigger trg_applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- 6. Row Level Security
alter table public.applications enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Users can view own applications" on public.applications;
drop policy if exists "Users can insert own applications" on public.applications;
drop policy if exists "Users can update own draft applications" on public.applications;

create policy "Users can view own applications"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own draft applications"
  on public.applications for update
  using (auth.uid() = user_id and status = 'draft');
