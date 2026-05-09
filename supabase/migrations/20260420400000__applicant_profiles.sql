-- ============================================================
-- TTP-RMGDRI-APPLICANT-PROFILING-QUEUE-001
-- Applicant profiles with queue state
-- No dog-specific logic. No matching assumptions.
-- ============================================================

create table if not exists public.applicant_profiles (
  id                  uuid        primary key default gen_random_uuid(),
  application_id      uuid        not null references public.applications(id) on delete cascade,
  profile_status      text        not null default 'generated',
  generated_at        timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  -- Queue state
  queue_eligible      boolean     not null default false,
  queue_status        text        not null default 'not_eligible',
  entered_queue_at    timestamptz null,
  queue_priority      int         not null default 0,
  queue_notes         text        null,
  active_for_matching boolean     not null default false,

  -- Profile dimensions
  profile_summary     text        null,
  household_profile   jsonb       not null default '{}'::jsonb,
  environment_profile jsonb       not null default '{}'::jsonb,
  experience_profile  jsonb       not null default '{}'::jsonb,
  lifestyle_profile   jsonb       not null default '{}'::jsonb,
  dog_preference_profile jsonb    not null default '{}'::jsonb,
  constraints_profile jsonb       not null default '{}'::jsonb,
  conditions_profile  jsonb       not null default '{}'::jsonb,
  strengths_profile   jsonb       not null default '{}'::jsonb,
  risk_summary        jsonb       not null default '{}'::jsonb,

  -- Readiness
  readiness_tier      text        not null default 'not_queue_eligible',
  readiness_notes     text        null,

  -- Source snapshot
  source_snapshot     jsonb       not null default '{}'::jsonb,

  constraint applicant_profiles_queue_status_check
    check (queue_status in ('not_eligible', 'ready', 'hold', 'matched', 'withdrawn')),

  constraint applicant_profiles_readiness_tier_check
    check (readiness_tier in (
      'tier_1_ready',
      'tier_2_ready_with_conditions',
      'tier_3_hold',
      'not_queue_eligible'
    ))
);

comment on table public.applicant_profiles is
  'Normalized applicant profile with queue state. No dog-specific logic.';

create index if not exists idx_applicant_profiles_application_id
  on public.applicant_profiles (application_id);

create index if not exists idx_applicant_profiles_queue_status
  on public.applicant_profiles (queue_status);

create index if not exists idx_applicant_profiles_readiness_tier
  on public.applicant_profiles (readiness_tier);

create index if not exists idx_applicant_profiles_queue_eligible
  on public.applicant_profiles (queue_eligible) where queue_eligible = true;

create trigger trg_applicant_profiles_updated_at
  before update on public.applicant_profiles
  for each row execute function public.set_updated_at();

-- RLS
alter table public.applicant_profiles enable row level security;

create policy "Users can view own profile"
  on public.applicant_profiles for select
  using (application_id in (select id from public.applications where user_id = auth.uid()));

-- All writes via service role
