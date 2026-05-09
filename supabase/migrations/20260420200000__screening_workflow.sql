-- ============================================================
-- TTP-RMGDRI-SCREENING-VALIDATION-001
-- Stage 2: Screening & Validation schema
-- ============================================================

-- 1. Expand applications status constraint for Stage 2
alter table public.applications
  drop constraint if exists applications_status_check;

-- WORKFLOW STATES — includes legacy values for backward compatibility with existing data
alter table public.applications
  add constraint applications_status_check
  check (status in (
    'draft',
    'submitted',
    'screening',
    'interview_complete',
    'home_check_complete',
    'decision_pending',
    'decisioned',
    -- Legacy statuses (existing data compatibility)
    'reviewing',
    'needs_clarification',
    'approved',
    'rejected',
    'foster_approved',
    'denied',
    'dna',
    'withdrawn',
    'expired'
  ));

-- 2. Add screener assignment columns to applications
alter table public.applications
  add column if not exists assigned_screener text null,
  add column if not exists assigned_at timestamptz null;

-- 3. Application interviews table
create table if not exists public.application_interviews (
  id              uuid        primary key default gen_random_uuid(),
  application_id  uuid        not null references public.applications(id) on delete cascade,
  interviewer     text        not null,
  interview_date  timestamptz null,
  notes           text        null,
  trust_observations    text  null,
  clarifications        text  null,
  contradictions        text  null,
  assessment            text  null,
  validation_dimensions jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.application_interviews is
  'Phone/video interview records for application screening.';

create index if not exists idx_application_interviews_application_id
  on public.application_interviews (application_id);

create trigger trg_application_interviews_updated_at
  before update on public.application_interviews
  for each row execute function public.set_updated_at();

-- 4. Application home checks table
create table if not exists public.application_home_checks (
  id              uuid        primary key default gen_random_uuid(),
  application_id  uuid        not null references public.applications(id) on delete cascade,
  home_checker    text        not null,
  check_date      timestamptz null,
  observations    text        null,
  environment_validation  text null,
  yard_fence_gate         text null,
  household_context       text null,
  safety_concerns         text null,
  assessment              text null,
  check_data      jsonb     not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.application_home_checks is
  'Home check records for application screening.';

create index if not exists idx_application_home_checks_application_id
  on public.application_home_checks (application_id);

create trigger trg_application_home_checks_updated_at
  before update on public.application_home_checks
  for each row execute function public.set_updated_at();

-- 5. Application recommendations table
create table if not exists public.application_recommendations (
  id              uuid        primary key default gen_random_uuid(),
  application_id  uuid        not null references public.applications(id) on delete cascade,
  recommendation  text        not null,
  acceptance_factors    text  null,
  risk_flags            text  null,
  denial_factors        text  null,
  conditions            text  null,
  rationale             text  null,
  confidence_score      numeric(3,2) null,
  recommender           text  null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint application_recommendations_type_check
    check (recommendation in (
      'recommend_approved',
      'recommend_approved_with_conditions',
      'denied_with_remediation',
      'denied'
    ))
);

comment on table public.application_recommendations is
  'Screening decision recommendations for applications.';

create index if not exists idx_application_recommendations_application_id
  on public.application_recommendations (application_id);

create trigger trg_application_recommendations_updated_at
  before update on public.application_recommendations
  for each row execute function public.set_updated_at();

-- 6. RLS for new tables
alter table public.application_interviews enable row level security;
alter table public.application_home_checks enable row level security;
alter table public.application_recommendations enable row level security;

-- Applicants can view their own screening records (read-only)
create policy "Users can view own interviews"
  on public.application_interviews for select
  using (application_id in (select id from public.applications where user_id = auth.uid()));

create policy "Users can view own home checks"
  on public.application_home_checks for select
  using (application_id in (select id from public.applications where user_id = auth.uid()));

create policy "Users can view own recommendations"
  on public.application_recommendations for select
  using (application_id in (select id from public.applications where user_id = auth.uid()));

-- All writes via service role (admin API routes)
