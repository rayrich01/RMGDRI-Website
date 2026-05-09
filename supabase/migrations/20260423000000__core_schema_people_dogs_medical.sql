-- ============================================================
-- TTP-RMGDRI-CORE-SCHEMA-DESIGN-001
-- Core schema: People, Households, Dogs (expanded), Medical,
-- Vets, Bite Records, Foster Assignments, Waiting List
--
-- Authority: Lori's fields.md + bite policy Rev. 03
-- All field names traced to Lori's definitions.
-- ============================================================

-- ============================================================
-- 1. HOUSEHOLDS (protected records)
-- ============================================================
create table if not exists public.households (
  id              uuid        primary key default gen_random_uuid(),
  household_id    text        unique,  -- auto-generated or manual
  address_street  text        null,
  address_city    text        null,
  address_state   text        null,    -- 2-char abbreviation
  address_zip     text        null,
  private_notes   text        null,    -- protected info
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.households is 'Protected household records. Address and private notes.';

create trigger trg_households_updated_at
  before update on public.households
  for each row execute function public.set_updated_at();

alter table public.households enable row level security;

-- ============================================================
-- 2. PEOPLE (universal P###### ID)
-- ============================================================
create table if not exists public.people (
  id              uuid        primary key default gen_random_uuid(),
  people_id       text        unique not null,  -- P###### format
  auth_user_id    uuid        null,             -- link to Supabase Auth if applicable
  name            text        not null,
  phone           text        null,
  email           text        null,
  age             text        null,
  household_id    uuid        null references public.households(id),

  -- Experience
  experience      text        null,  -- GDE, GBE, none
  training_experience text    null,

  -- Household composition
  num_cats        int         null,
  num_dogs        int         null,
  num_kids        int         null,
  kids_ages       text        null,
  house_type      text        null,

  -- Preferences
  type_of_dog_must_haves text null,
  wish_lists      text        null,

  -- Tags (multiple roles per person)
  tags            text[]      not null default '{}',

  -- Home check
  last_home_check_date timestamptz null,

  -- Links
  family_info_link     text   null,
  folder_link          text   null,  -- link to application/interview/homecheck/approval

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint people_id_format
    check (people_id ~ '^P\d{6}$'),

  constraint people_experience_check
    check (experience is null or experience in ('GDE', 'GBE', 'none'))
);

comment on table public.people is
  'Universal person registry. One P###### per person. Tags determine roles.';
comment on column public.people.tags is
  'Role tags: foster_family, board_member, adopting_family, volunteer, coordinator, transporter, homechecker, applications, donor';

create index if not exists idx_people_people_id on public.people (people_id);
create index if not exists idx_people_email on public.people (email);
create index if not exists idx_people_tags on public.people using gin (tags);
create index if not exists idx_people_household on public.people (household_id);

create trigger trg_people_updated_at
  before update on public.people
  for each row execute function public.set_updated_at();

alter table public.people enable row level security;

-- ============================================================
-- 3. DOGS (expanded — Lori's full field set)
-- ============================================================
-- Extends the existing dane_profiles or creates canonical dog records.
-- This is the RMGDRI system-of-record for dogs, separate from Sanity CMS content.

create table if not exists public.dogs (
  id              uuid        primary key default gen_random_uuid(),
  sanity_id       text        null,     -- link to Sanity CMS document
  dane_profile_id uuid        null references public.dane_profiles(id),

  -- Identity
  name            text        not null,
  dane_id         text        unique,   -- YYYY-### format (e.g., 2026-001)
  intake_id       text        null,     -- TR-YYYY-### or OS-YYYY-###
  status          text        not null default 'UE',
  color           text        null,
  sex             text        null,     -- Male, Female, Neutered Male, Spayed Female
  ears            text        null,     -- cropped, natural
  dob             date        null,
  age_text        text        null,     -- years/months, calculated or typed
  weight_lbs      numeric     null,

  -- Dates
  date_in         date        null,     -- date placed with foster
  rap_due_date    date        null,     -- date_in + 10 days
  adoption_date   date        null,     -- date out
  days_in_rescue  int         null,     -- calculated

  -- Origin
  state_of_origin text        null,     -- 2-char
  surrender_type  text        null,     -- owner_surrender, shelter_surrender

  -- Foster
  state_of_foster text        null,     -- 2-char
  foster_people_id uuid       null references public.people(id),

  -- CVI
  cvi_required    boolean     null,
  cvi_date_issued date        null,
  cvi_certificate_number text null,

  -- Microchip
  microchip_number text       null,

  -- PACFA
  days_old_at_entry int       null,

  -- Transport
  transport_in    text        null,     -- names or "No transport, staying with Foster"
  transport_out   text        null,

  -- Adoption
  adopted_by_people_id uuid   null references public.people(id),

  -- Links
  foster_dane_agreement_signed boolean null,  -- FDA - PACFA form

  -- Notes
  special_needs_notes text    null,
  comments        text        null,     -- behavior issues, medical issues, etc.

  -- Photos
  photos          jsonb       not null default '[]'::jsonb,  -- array of {photo_id, url, caption}

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint dogs_status_check
    check (status in ('FN','WT','UE','BH','MH','A','PA','PF','adopted','rainbow-bridge')),

  constraint dogs_dane_id_format
    check (dane_id is null or dane_id ~ '^\d{4}-\d{3}$'),

  constraint dogs_surrender_type_check
    check (surrender_type is null or surrender_type in ('owner_surrender', 'shelter_surrender'))
);

comment on table public.dogs is
  'RMGDRI system-of-record for dogs. Full field set per Lori fields.md. Separate from Sanity CMS.';

create index if not exists idx_dogs_dane_id on public.dogs (dane_id);
create index if not exists idx_dogs_status on public.dogs (status);
create index if not exists idx_dogs_foster on public.dogs (foster_people_id);
create index if not exists idx_dogs_sanity on public.dogs (sanity_id) where sanity_id is not null;

create trigger trg_dogs_updated_at
  before update on public.dogs
  for each row execute function public.set_updated_at();

alter table public.dogs enable row level security;

-- ============================================================
-- 4. MEDICAL RECORDS
-- ============================================================
create table if not exists public.medical_records (
  id              uuid        primary key default gen_random_uuid(),
  dog_id          uuid        not null references public.dogs(id) on delete cascade,

  -- Exams
  exam_date       date        null,
  exam_due        date        null,     -- exam_date + 1 year

  -- Rabies
  rabies_tag_number text      null,
  rabies_given    date        null,
  rabies_type     text        null,     -- '1yr' or '3yr'
  rabies_due      date        null,

  -- DA2PP
  da2pp_given     date        null,
  da2pp_type      text        null,     -- '1yr' or '3yr'
  da2pp_due       date        null,

  -- Bordetella
  bordetella_given date       null,
  bordetella_due  date        null,

  -- Leptospirosis
  lepto_given     date        null,
  lepto_due       date        null,

  -- Fecal
  fecal_date      date        null,
  fecal_due       date        null,

  -- Other
  dewormer_given  date        null,
  spay_neuter_date date       null,
  heartworm_test_date date    null,
  gastropexy_date date        null,     -- blank if not done

  -- Notes
  other_notes     text        null,

  -- FMA link
  foster_medical_assessment_link text null,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.medical_records is
  'Dog medical records. Vaccinations, exams, dates, and due dates per PACFA requirements.';

create index if not exists idx_medical_records_dog on public.medical_records (dog_id);

create trigger trg_medical_records_updated_at
  before update on public.medical_records
  for each row execute function public.set_updated_at();

alter table public.medical_records enable row level security;

-- ============================================================
-- 5. VET REGISTRY
-- ============================================================
create table if not exists public.vet_registry (
  id              uuid        primary key default gen_random_uuid(),
  vet_id          text        unique not null,   -- ST-#### format
  office_name     text        not null,
  address_street  text        null,
  address_city    text        null,
  address_state   text        null,
  address_zip     text        null,
  phone           text        null,
  email           text        null,
  website         text        null,
  specialty_services text     null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint vet_id_format
    check (vet_id ~ '^[A-Z]{2}-\d{4}$')
);

comment on table public.vet_registry is
  'Vet office registry. ID format: ST-#### (state abbreviation + number).';

create trigger trg_vet_registry_updated_at
  before update on public.vet_registry
  for each row execute function public.set_updated_at();

alter table public.vet_registry enable row level security;

-- Dog-to-vet link (many-to-many)
create table if not exists public.dog_vet_links (
  id              uuid        primary key default gen_random_uuid(),
  dog_id          uuid        not null references public.dogs(id) on delete cascade,
  vet_id          uuid        not null references public.vet_registry(id),
  notes           text        null,
  created_at      timestamptz not null default now(),
  unique(dog_id, vet_id)
);

alter table public.dog_vet_links enable row level security;

-- ============================================================
-- 6. BITE RECORDS (Dr. Ian Dunbar Scale)
-- ============================================================
create table if not exists public.bite_records (
  id              uuid        primary key default gen_random_uuid(),
  dog_id          uuid        not null references public.dogs(id) on delete cascade,
  bite_date       date        null,
  dunbar_level    int         not null,  -- 0-6
  context         text        not null,  -- incoming, foster, returned_adoption
  bite_target     text        null,      -- human, dog, other
  aimed_at_face_neck boolean  not null default false,
  description     text        null,
  circumstances   text        null,

  -- Policy evaluation
  meets_exception boolean     null,
  exception_type  text        null,      -- defensive, puppy_play, accidental_breakup
  board_vote_required boolean null,
  board_vote_result text      null,      -- accepted, euthanasia, pending

  -- Evaluations required
  vet_eval_required boolean   null,
  vet_eval_date   date        null,
  behaviorist_eval_required boolean null,
  behaviorist_eval_date date  null,
  bloodwork_required boolean  null,
  bloodwork_date  date        null,

  -- Outcome
  outcome         text        null,      -- accepted, removed_from_foster, euthanized, monitoring
  reported_by     text        null,
  notes           text        null,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint bite_dunbar_level_check
    check (dunbar_level between 0 and 6),

  constraint bite_context_check
    check (context in ('incoming', 'foster', 'returned_adoption', 'unknown'))
);

comment on table public.bite_records is
  'Bite incident records per Dr. Ian Dunbar scale. Policy: Rev. 03 (06.23.2022).';

create index if not exists idx_bite_records_dog on public.bite_records (dog_id);
create index if not exists idx_bite_records_level on public.bite_records (dunbar_level);

create trigger trg_bite_records_updated_at
  before update on public.bite_records
  for each row execute function public.set_updated_at();

alter table public.bite_records enable row level security;

-- ============================================================
-- 7. FOSTER ASSIGNMENTS (current + historical)
-- ============================================================
create table if not exists public.foster_assignments (
  id              uuid        primary key default gen_random_uuid(),
  dog_id          uuid        not null references public.dogs(id) on delete cascade,
  foster_people_id uuid       not null references public.people(id),
  start_date      date        null,
  end_date        date        null,
  is_current      boolean     not null default true,
  fda_signed      boolean     null,     -- Foster Dane Agreement
  pacfa_docs_link text        null,
  notes           text        null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.foster_assignments is
  'Foster family assignments. Tracks current and past fosters per dog.';

create index if not exists idx_foster_assignments_dog on public.foster_assignments (dog_id);
create index if not exists idx_foster_assignments_foster on public.foster_assignments (foster_people_id);
create index if not exists idx_foster_assignments_current on public.foster_assignments (is_current) where is_current = true;

create trigger trg_foster_assignments_updated_at
  before update on public.foster_assignments
  for each row execute function public.set_updated_at();

alter table public.foster_assignments enable row level security;

-- ============================================================
-- 8. WAITING LIST
-- ============================================================
create table if not exists public.waiting_list (
  id              uuid        primary key default gen_random_uuid(),
  dog_id          uuid        not null references public.dogs(id) on delete cascade,
  people_id       uuid        not null references public.people(id),
  date_added      date        not null default current_date,
  status          text        not null default 'active',
  notes           text        null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint waiting_list_status_check
    check (status in ('active', 'matched', 'removed', 'expired')),

  unique(dog_id, people_id)
);

comment on table public.waiting_list is
  'Dog-to-applicant waiting list. Tracks queue position for specific dogs.';

create index if not exists idx_waiting_list_dog on public.waiting_list (dog_id);
create index if not exists idx_waiting_list_people on public.waiting_list (people_id);

create trigger trg_waiting_list_updated_at
  before update on public.waiting_list
  for each row execute function public.set_updated_at();

alter table public.waiting_list enable row level security;

-- ============================================================
-- 9. PEOPLE ROLE SUBSETS (volunteer, board, foster detail)
-- These are extension tables linked to people via people_id
-- ============================================================

-- Volunteer details
create table if not exists public.volunteer_details (
  id              uuid        primary key default gen_random_uuid(),
  people_id       uuid        unique not null references public.people(id),
  current_position text       null,
  date_started    date        null,
  past_positions  jsonb       not null default '[]'::jsonb,  -- [{position, date_started, date_resigned}]
  volunteer_application_link text null,
  additional_notes text       null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_volunteer_details_updated_at
  before update on public.volunteer_details
  for each row execute function public.set_updated_at();

alter table public.volunteer_details enable row level security;

-- Board member details
create table if not exists public.board_member_details (
  id              uuid        primary key default gen_random_uuid(),
  people_id       uuid        unique not null references public.people(id),
  current_position text       null,
  date_started    date        null,
  past_positions  jsonb       not null default '[]'::jsonb,  -- [{position, date_started, date_resigned}]
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_board_member_details_updated_at
  before update on public.board_member_details
  for each row execute function public.set_updated_at();

alter table public.board_member_details enable row level security;
