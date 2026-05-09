-- ============================================================
-- Application Events — Observability Layer
-- Safe for both fresh creation and existing table scenarios
-- ============================================================

create table if not exists public.application_events (
  id              uuid        primary key default gen_random_uuid(),
  application_id  uuid        null,
  event_type      text        not null,
  created_at      timestamptz not null default now()
);

-- Add columns that may be missing on existing table
alter table public.application_events add column if not exists actor_id uuid;
alter table public.application_events add column if not exists actor_type text default 'applicant';
alter table public.application_events add column if not exists metadata jsonb default '{}'::jsonb;

comment on table public.application_events is
  'Append-only audit trail for application lifecycle events.';

-- Indexes (safe — IF NOT EXISTS)
create index if not exists idx_application_events_application_id
  on public.application_events (application_id);

create index if not exists idx_application_events_event_type
  on public.application_events (event_type);

create index if not exists idx_application_events_actor_id
  on public.application_events (actor_id);

create index if not exists idx_application_events_created_at
  on public.application_events (created_at desc);

-- RLS
alter table public.application_events enable row level security;

drop policy if exists "Users can view events for own applications" on public.application_events;
create policy "Users can view events for own applications"
  on public.application_events for select
  using (
    actor_id = auth.uid()
    or application_id in (
      select id from public.applications where user_id = auth.uid()
    )
  );
