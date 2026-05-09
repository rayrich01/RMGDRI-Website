-- ============================================================
-- TTP-RMGDRI-DECISION-INTELLIGENCE-001
-- Decision Intelligence table — append-only historical records
-- Advisory only. Never auto-applied to application_recommendations.
-- ============================================================

create table if not exists public.application_decision_intelligence (
  id                  uuid        primary key default gen_random_uuid(),
  application_id      uuid        not null references public.applications(id) on delete cascade,
  generated_at        timestamptz not null default now(),
  source              text        not null default 'deterministic_engine',

  -- Synthesized outputs
  applicant_summary       text    null,
  validation_zones        jsonb   not null default '[]'::jsonb,
  trust_signals           jsonb   not null default '[]'::jsonb,
  risk_signals            jsonb   not null default '[]'::jsonb,
  contradictions          jsonb   not null default '[]'::jsonb,
  acceptance_factors      jsonb   not null default '[]'::jsonb,
  risk_factors            jsonb   not null default '[]'::jsonb,
  denial_factors          jsonb   not null default '[]'::jsonb,
  recommended_prompts     jsonb   not null default '[]'::jsonb,

  -- Decision assist
  rationale_summary       text    null,
  suggested_recommendation text   null,
  confidence_score        numeric(3,2) null,

  -- Snapshots (what was known at generation time)
  status_snapshot         text    null,
  input_snapshot          jsonb   not null default '{}'::jsonb,

  constraint adi_suggested_recommendation_check
    check (suggested_recommendation is null or suggested_recommendation in (
      'recommend_approved',
      'recommend_approved_with_conditions',
      'denied_with_remediation',
      'denied'
    ))
);

comment on table public.application_decision_intelligence is
  'Append-only decision intelligence artifacts. Advisory only — never auto-applied.';

create index if not exists idx_adi_application_id
  on public.application_decision_intelligence (application_id);

create index if not exists idx_adi_generated_at
  on public.application_decision_intelligence (generated_at desc);

-- RLS
alter table public.application_decision_intelligence enable row level security;

-- Applicants can see intelligence for their own applications
create policy "Users can view own decision intelligence"
  on public.application_decision_intelligence for select
  using (application_id in (select id from public.applications where user_id = auth.uid()));

-- All writes via service role
