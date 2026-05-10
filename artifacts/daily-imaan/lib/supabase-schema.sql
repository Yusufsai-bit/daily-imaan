-- Daily Imaan — Supabase schema for anonymous user state mirroring.
--
-- Run this once in your Supabase project's SQL Editor (Project → SQL Editor →
-- New query). It is idempotent — safe to run multiple times.
--
-- WHAT IT DOES
--   1. Creates a `user_state` table that holds one row per anonymous user.
--      The full AppState JSON lives in `state jsonb`; `updated_at` is used
--      for last-write-wins conflict resolution by the client.
--   2. Enables Row Level Security so a user can only read/write their own row.
--      Without RLS, anyone with the anon key could read every user's state.
--
-- IMPORTANT: do NOT skip the RLS policies. Without them, your users' streaks
-- and bookmarks become public the moment you ship.

create table if not exists public.user_state (
  user_id    uuid        primary key references auth.users(id) on delete cascade,
  state      jsonb       not null,
  updated_at timestamptz not null default now()
);

-- Enable RLS. Default-deny: nothing can read or write until a policy allows it.
alter table public.user_state enable row level security;

-- Allow each authenticated user (incl. anonymous sessions) to read their own row.
drop policy if exists "user_state_self_read" on public.user_state;
create policy "user_state_self_read"
  on public.user_state
  for select
  using (auth.uid() = user_id);

-- Allow each authenticated user to insert their own row (used on first sync).
drop policy if exists "user_state_self_insert" on public.user_state;
create policy "user_state_self_insert"
  on public.user_state
  for insert
  with check (auth.uid() = user_id);

-- Allow each authenticated user to update only their own row.
drop policy if exists "user_state_self_update" on public.user_state;
create policy "user_state_self_update"
  on public.user_state
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index on updated_at to speed up future "users active in the last X days"
-- analytics queries. Cheap and harmless to add now.
create index if not exists user_state_updated_at_idx
  on public.user_state (updated_at desc);
