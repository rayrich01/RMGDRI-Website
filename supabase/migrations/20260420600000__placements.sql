-- ============================================================
-- TTP-RMGDRI-PLACEMENT-GOVERNANCE-EXECUTION-001
-- Placements: governed transition from match to placement
-- No auto-placement. No auto-state-advancement.
-- Every transition is human-driven and logged.
-- ============================================================

create table if not exists public.placements (
  id                        uuid        primary key default gen_random_uuid(),
  applicant_profile_id      uuid        not null references public.applicant_profiles(id),
  dane_profile_id           uuid        not null references public.dane_profiles(id),
  match_candidate_id        uuid        not null references public.match_candidates(id),

  -- Lifecycle
  placement_status          text        not null default 'proposed',
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),

  -- Approval
  approved_by               text        null,
  approved_at               timestamptz null,

  -- Agreements
  adoption_agreement_status text        not null default 'pending',
  behavioral_addendum_status text       not null default 'not_required',
  medical_addendum_status   text        not null default 'not_required',
  agreement_sent_at         timestamptz null,
  agreement_signed_at       timestamptz null,

  -- Completion
  ready_for_transfer_at     timestamptz null,
  completed_at              timestamptz null,
  cancelled_at              timestamptz null,
  cancellation_reason       text        null,

  -- Context
  notes                     text        null,
  placement_snapshot        jsonb       not null default '{}'::jsonb,

  -- Constraints
  constraint placements_status_check
    check (placement_status in (
      'proposed',
      'under_review',
      'approved',
      'agreement_pending',
      'agreement_signed',
      'ready_for_transfer',
      'completed',
      'cancelled'
    )),

  constraint placements_adoption_agreement_check
    check (adoption_agreement_status in ('not_required', 'pending', 'sent', 'signed')),

  constraint placements_behavioral_addendum_check
    check (behavioral_addendum_status in ('not_required', 'pending', 'sent', 'signed')),

  constraint placements_medical_addendum_check
    check (medical_addendum_status in ('not_required', 'pending', 'sent', 'signed'))
);

comment on table public.placements is
  'Governed placement lifecycle. Every state transition is human-driven and audited.';

create index if not exists idx_placements_applicant
  on public.placements (applicant_profile_id);

create index if not exists idx_placements_dane
  on public.placements (dane_profile_id);

create index if not exists idx_placements_match
  on public.placements (match_candidate_id);

create index if not exists idx_placements_status
  on public.placements (placement_status);

create trigger trg_placements_updated_at
  before update on public.placements
  for each row execute function public.set_updated_at();

-- RLS
alter table public.placements enable row level security;

create policy "Users can view own placements"
  on public.placements for select
  using (applicant_profile_id in (
    select ap.id from public.applicant_profiles ap
    join public.applications a on ap.application_id = a.id
    where a.user_id = auth.uid()
  ));

-- All writes via service role
