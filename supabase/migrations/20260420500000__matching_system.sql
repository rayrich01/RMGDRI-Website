-- ============================================================
-- TTP-RMGDRI-MATCHING-SYSTEM-001
-- Dane profiles + match candidates
-- No auto-placement. No scoring/ranking. Deterministic only.
-- ============================================================

-- 1. Dane profiles — normalized dog data for matching
create table if not exists public.dane_profiles (
  id                  uuid        primary key default gen_random_uuid(),
  sanity_id           text        null,
  name                text        not null,
  active_for_matching boolean     not null default false,
  profile_status      text        not null default 'draft',

  -- Identity
  age                 text        null,
  sex                 text        null,
  size                text        null,
  breed               text        null,
  weight              text        null,

  -- Behavioral
  energy_level        text        null,
  temperament         jsonb       not null default '[]'::jsonb,
  behavior_profile    jsonb       not null default '{}'::jsonb,

  -- Medical
  medical_profile     jsonb       not null default '{}'::jsonb,

  -- Training
  training_profile    jsonb       not null default '{}'::jsonb,

  -- Matching dimensions
  environment_needs   jsonb       not null default '{}'::jsonb,
  household_fit       jsonb       not null default '{}'::jsonb,
  constraints         jsonb       not null default '{}'::jsonb,
  strengths           jsonb       not null default '[]'::jsonb,
  risks               jsonb       not null default '[]'::jsonb,
  placement_notes     text        null,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.dane_profiles is
  'Normalized dog profiles for matching. Separate from Sanity CMS content.';

create index if not exists idx_dane_profiles_active
  on public.dane_profiles (active_for_matching) where active_for_matching = true;

create index if not exists idx_dane_profiles_sanity_id
  on public.dane_profiles (sanity_id) where sanity_id is not null;

create trigger trg_dane_profiles_updated_at
  before update on public.dane_profiles
  for each row execute function public.set_updated_at();

alter table public.dane_profiles enable row level security;
-- Public read for active danes (applicants can see matching-eligible dogs)
create policy "Anyone can view active dane profiles"
  on public.dane_profiles for select using (active_for_matching = true);

-- 2. Match candidates — one per applicant-dane pair
create table if not exists public.match_candidates (
  id                    uuid        primary key default gen_random_uuid(),
  applicant_profile_id  uuid        not null references public.applicant_profiles(id) on delete cascade,
  dane_profile_id       uuid        not null references public.dane_profiles(id) on delete cascade,

  -- Compatibility outputs
  compatibility_summary text        null,
  fit_strengths         jsonb       not null default '[]'::jsonb,
  fit_cautions          jsonb       not null default '[]'::jsonb,
  hard_stops            jsonb       not null default '[]'::jsonb,
  missing_information   jsonb       not null default '[]'::jsonb,

  -- Disposition (advisory)
  suggested_disposition text        not null default 'insufficient_data',
  candidate_status      text        not null default 'generated',

  -- Admin review
  review_notes          text        null,
  reviewed_by           text        null,
  reviewed_at           timestamptz null,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  constraint match_candidates_disposition_check
    check (suggested_disposition in (
      'strong_candidate',
      'candidate_with_cautions',
      'hold_needs_review',
      'not_recommended',
      'insufficient_data'
    )),

  constraint match_candidates_status_check
    check (candidate_status in (
      'generated',
      'under_review',
      'approved',
      'rejected',
      'placed',
      'archived'
    )),

  constraint match_candidates_unique_pair
    unique (applicant_profile_id, dane_profile_id)
);

comment on table public.match_candidates is
  'Applicant-Dane match candidates. Advisory only. No auto-placement.';

create index if not exists idx_match_candidates_applicant
  on public.match_candidates (applicant_profile_id);

create index if not exists idx_match_candidates_dane
  on public.match_candidates (dane_profile_id);

create index if not exists idx_match_candidates_status
  on public.match_candidates (candidate_status);

create trigger trg_match_candidates_updated_at
  before update on public.match_candidates
  for each row execute function public.set_updated_at();

alter table public.match_candidates enable row level security;
-- Applicants can view their own match candidates
create policy "Users can view own match candidates"
  on public.match_candidates for select
  using (applicant_profile_id in (
    select ap.id from public.applicant_profiles ap
    join public.applications a on ap.application_id = a.id
    where a.user_id = auth.uid()
  ));
-- All writes via service role
