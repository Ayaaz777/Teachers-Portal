-- 020: Planner storage — migrate from local JSON files to Supabase
-- Tables: planner_events, planner_day_pages, planner_obsidian_notes, planner_kv
-- All tables have RLS enabled with per-user policies via auth.uid()

-- ============================================================
-- planner_events — one row per calendar reminder/event
-- ============================================================
create table if not exists public.planner_events (
  id          text not null,
  user_id     uuid not null references auth.users(id) on delete cascade,
  email       text,
  title       text not null,
  start       text not null,
  end_time    text,
  description text,
  priority    smallint default 0,        -- 0=low, 1=medium, 2=high
  color       text,
  deferred_at text,
  deferred_reason text,
  reminder_repeat text,                  -- 'daily' | 'weekly' | null
  repeat_weekdays integer[],             -- [0..6] for weekly repeat
  extra_times text[],                    -- HH:MM strings
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (id, user_id)
);

alter table public.planner_events enable row level security;

create policy "Users can select own events"
  on public.planner_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own events"
  on public.planner_events for insert
  with check (auth.uid() = user_id);

create policy "Users can update own events"
  on public.planner_events for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own events"
  on public.planner_events for delete
  using (auth.uid() = user_id);

-- ============================================================
-- planner_day_pages — one row per YYYY-MM-DD day
-- ============================================================
create table if not exists public.planner_day_pages (
  id          text not null,             -- YYYY-MM-DD
  user_id     uuid not null references auth.users(id) on delete cascade,
  email       text,
  title       text,
  notes       text,                       -- markdown content
  todos       jsonb not null default '[]'::jsonb,  -- [{id, text, done}]
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (id, user_id)
);

alter table public.planner_day_pages enable row level security;

create policy "Users can select own day_pages"
  on public.planner_day_pages for select
  using (auth.uid() = user_id);

create policy "Users can insert own day_pages"
  on public.planner_day_pages for insert
  with check (auth.uid() = user_id);

create policy "Users can update own day_pages"
  on public.planner_day_pages for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own day_pages"
  on public.planner_day_pages for delete
  using (auth.uid() = user_id);

-- ============================================================
-- planner_obsidian_notes — one row per Obsidian note
-- ============================================================
create table if not exists public.planner_obsidian_notes (
  id          text not null,             -- uuid
  user_id     uuid not null references auth.users(id) on delete cascade,
  email       text,
  title       text not null,
  content     text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (id, user_id)
);

alter table public.planner_obsidian_notes enable row level security;

create policy "Users can select own obsidian_notes"
  on public.planner_obsidian_notes for select
  using (auth.uid() = user_id);

create policy "Users can insert own obsidian_notes"
  on public.planner_obsidian_notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own obsidian_notes"
  on public.planner_obsidian_notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own obsidian_notes"
  on public.planner_obsidian_notes for delete
  using (auth.uid() = user_id);

-- ============================================================
-- planner_kv — key-value store for settings, trash, deferrals, meta
-- ============================================================
create table if not exists public.planner_kv (
  id          text not null,             -- 'settings' | 'trash' | 'deferrals' | 'meta'
  user_id     uuid not null references auth.users(id) on delete cascade,
  email       text,
  json        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (id, user_id)
);

alter table public.planner_kv enable row level security;

create policy "Users can select own kv"
  on public.planner_kv for select
  using (auth.uid() = user_id);

create policy "Users can insert own kv"
  on public.planner_kv for insert
  with check (auth.uid() = user_id);

create policy "Users can update own kv"
  on public.planner_kv for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own kv"
  on public.planner_kv for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Indexes for common query patterns
-- ============================================================
create index if not exists planner_events_user_id_idx on public.planner_events (user_id);
create index if not exists planner_day_pages_user_id_idx on public.planner_day_pages (user_id);
create index if not exists planner_obsidian_notes_user_id_idx on public.planner_obsidian_notes (user_id);
create index if not exists planner_kv_user_id_idx on public.planner_kv (user_id);
