-- The OnBar Hub: user data schema.
-- Run in Supabase: SQL Editor > New query > paste all of this > Run.
-- Safe to run more than once.

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  mock_id text not null,
  mock_title text,
  pct int,
  correct int,
  total int,
  total_time_sec int,
  timed boolean default false,
  detail jsonb,                       -- full per-question answers, times and flags, for deep analysis
  created_at timestamptz not null default now()
);

alter table public.attempts enable row level security;

drop policy if exists "own attempts select" on public.attempts;
drop policy if exists "own attempts insert" on public.attempts;
drop policy if exists "own attempts delete" on public.attempts;

create policy "own attempts select" on public.attempts
  for select using (auth.uid() = user_id);

create policy "own attempts insert" on public.attempts
  for insert with check (auth.uid() = user_id);

create policy "own attempts delete" on public.attempts
  for delete using (auth.uid() = user_id);

create index if not exists attempts_user_created_idx
  on public.attempts (user_id, created_at desc);
