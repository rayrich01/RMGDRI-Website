-- RMGDRI Forms System — Supabase Migration
-- Tables: form_definitions, form_submissions, submission_events, submission_files
-- Workflow: submitted -> triage -> in_review -> (approved | rejected | needs_more_info) -> closed
-- Storage bucket: form-uploads

-- ============================================================
-- 1. form_definitions
-- ============================================================
create table if not exists public.form_definitions (
  form_key   text        primary key,
  version    int         not null default 1,
  title      text        not null,
  is_public  bool        not null default false,
  created_at timestamptz not null default now()
);

comment on table public.form_definitions is 'Registry of all form types (public + ops).';

-- Seed definitions
insert into public.form_definitions (form_key, version, title, is_public) values
  ('adopt-foster',       1, 'Adoption / Foster Application',  true),
  ('owner-surrender',    1, 'Owner Surrender',                true),
  ('volunteer',          1, 'Volunteer Application',          true),
  ('approval',           1, 'RMGDRI Approval',                false),
  ('homecheck',          1, 'Homecheck',                      false),
  ('phone-interview',    1, 'Phone Interview',                false),
  ('foster-medical',     1, 'Foster Medical Assessment',      false),
  ('bite-report-human',  1, 'Bite Report — Human',            false),
  ('shelter-transfer',   1, 'Rescue or Shelter Transfer',     false),
  ('adoption-followup',  1, 'Adoption Followup',              false)
on conflict (form_key) do nothing;

-- ============================================================
-- 2. form_submissions
-- ============================================================
create table if not exists public.form_submissions (
  id                uuid        primary key default gen_random_uuid(),
  form_key          text        not null references public.form_definitions(form_key),
  form_version      int         not null default 1,
  submitted_at      timestamptz not null default now(),
  submitted_by_email text       null,
  payload           jsonb       not null default '{}'::jsonb,
  current_status    text        not null default 'submitted',
  pii_class         text        not null default 'med',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.form_submissions is 'Every form submission (public + ops).';

create index if not exists idx_form_submissions_form_key
  on public.form_submissions (form_key);

create index if not exists idx_form_submissions_status
  on public.form_submissions (current_status);

create index if not exists idx_form_submissions_submitted_at
  on public.form_submissions (submitted_at desc);

-- ============================================================
-- 3. submission_events  (audit trail)
-- ============================================================
create table if not exists public.submission_events (
  id            uuid        primary key default gen_random_uuid(),
  submission_id uuid        not null references public.form_submissions(id) on delete cascade,
  event_type    text        not null,
  from_status   text        null,
  to_status     text        null,
  actor         text        null,
  note          text        null,
  created_at    timestamptz not null default now()
);

comment on table public.submission_events is 'Audit trail for every state transition or action on a submission.';

create index if not exists idx_submission_events_submission_id
  on public.submission_events (submission_id);

-- ============================================================
-- 4. submission_files
-- ============================================================
create table if not exists public.submission_files (
  id               uuid        primary key default gen_random_uuid(),
  submission_id    uuid        not null references public.form_submissions(id) on delete cascade,
  field_key        text        not null,
  storage_provider text        not null default 'supabase',
  storage_path     text        not null,
  original_filename text       null,
  content_type     text        null,
  created_at       timestamptz not null default now()
);

comment on table public.submission_files is 'File attachments linked to submissions.';

create index if not exists idx_submission_files_submission_id
  on public.submission_files (submission_id);

-- ============================================================
-- 5. RLS — strict deny-all for anon; service role bypasses
-- ============================================================
alter table public.form_definitions  enable row level security;
alter table public.form_submissions  enable row level security;
alter table public.submission_events enable row level security;
alter table public.submission_files  enable row level security;

-- No public policies — all access via service role in API routes.

-- ============================================================
-- 6. Storage bucket: form-uploads
-- ============================================================
-- NOTE: Run via Supabase dashboard or CLI if not using the storage schema directly.
-- insert into storage.buckets (id, name, public)
--   values ('form-uploads', 'form-uploads', false)
--   on conflict (id) do nothing;

-- ============================================================
-- 7. updated_at trigger for form_submissions
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_form_submissions_updated_at on public.form_submissions;
create trigger trg_form_submissions_updated_at
  before update on public.form_submissions
  for each row execute function public.set_updated_at();
