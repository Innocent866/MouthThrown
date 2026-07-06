-- Answered — initial schema (Supabase / Postgres)
-- Auth users live in auth.users (managed by Supabase Auth).

create extension if not exists "pgcrypto";

create table if not exists public.courts (
  id text primary key,
  name text not null,
  county text not null,
  clerk_address text not null,
  filing_notes text
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  defendant_name text,
  court_id text references public.courts (id),
  case_number text,
  plaintiff_name text,
  amount_claimed numeric(12, 2),
  date_served date,
  deadline_date date,
  status text not null default 'draft' check (status in ('draft', 'paid', 'filed')),
  created_at timestamptz not null default now()
);

create table if not exists public.interview_answers (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  question_key text not null,
  answer_value text not null,
  created_at timestamptz not null default now(),
  unique (case_id, question_key)
);

create table if not exists public.defenses (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  defense_key text not null,
  included boolean not null default false,
  unique (case_id, defense_key)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases (id) on delete set null,
  stripe_session_id text unique,
  amount integer,
  status text,
  created_at timestamptz not null default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  email text not null,
  send_on date not null,
  days_before integer not null,
  sent_at timestamptz
);

create index if not exists reminders_due_idx on public.reminders (send_on) where sent_at is null;
create index if not exists cases_user_idx on public.cases (user_id);

-- Row Level Security: users can only see their own cases; server routes use
-- the service-role key and bypass RLS.
alter table public.cases enable row level security;
alter table public.interview_answers enable row level security;
alter table public.defenses enable row level security;
alter table public.payments enable row level security;
alter table public.reminders enable row level security;

create policy "own cases" on public.cases
  for select using (auth.uid() = user_id);
create policy "own answers" on public.interview_answers
  for select using (exists (select 1 from public.cases c where c.id = case_id and c.user_id = auth.uid()));
create policy "own defenses" on public.defenses
  for select using (exists (select 1 from public.cases c where c.id = case_id and c.user_id = auth.uid()));

-- Courts are public reference data.
alter table public.courts enable row level security;
create policy "courts are public" on public.courts for select using (true);
