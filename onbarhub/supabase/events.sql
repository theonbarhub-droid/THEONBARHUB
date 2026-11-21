-- The OnBar Hub: product analytics events + admin read access.
-- Run in Supabase: SQL Editor > New query > paste all > Run. Safe to re-run.

-- Who counts as the site owner (can read everyone's data).
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce((auth.jwt() ->> 'email') in (
    'kumarkartik9582@gmail.com',
    'theonbarhub@gmail.com'
  ), false)
$$;

create table if not exists public.events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  anon_id text,
  kind text not null,
  path text,
  meta jsonb,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

-- Anyone, signed in or not, may record an event. Nobody but the owner may read.
drop policy if exists "events insert" on public.events;
drop policy if exists "events admin select" on public.events;
create policy "events insert" on public.events for insert with check (true);
create policy "events admin select" on public.events for select using (public.is_admin());

create index if not exists events_created_idx on public.events (created_at desc);
create index if not exists events_kind_idx on public.events (kind);

-- Let the owner read every attempt for the dashboard (owners still see only
-- their own through the existing policy; this adds admin-wide read).
drop policy if exists "admin reads all attempts" on public.attempts;
create policy "admin reads all attempts" on public.attempts for select using (public.is_admin());
