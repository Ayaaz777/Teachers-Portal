-- Per-user published workspace draft databases (full schema + rows as JSONB).
-- Run after 008_payslip_app_user_state.sql. The app upserts here when the user clicks Save on a draft card.
--
-- Run the whole file below as-is. Do NOT use `select * from payslip_workspace_databases` — that
-- table name was never part of this repo's migrations; if you see 42P01 for it, skip that query.

create table if not exists public.user_workspace_draft_databases (
  user_id uuid not null references auth.users (id) on delete cascade,
  workspace_page_id text not null,
  replica_id text not null,
  title text not null default '',
  snapshot jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, workspace_page_id, replica_id)
);

create index if not exists user_workspace_draft_databases_user_updated_idx
  on public.user_workspace_draft_databases (user_id, updated_at desc);

comment on table public.user_workspace_draft_databases is
  'Workspace draft DB snapshots: one row per (user, workspace page, replica id). snapshot JSON matches serializeFloatingReplicaForStorage.';

alter table public.user_workspace_draft_databases enable row level security;

drop policy if exists "Users read own user_workspace_draft_databases" on public.user_workspace_draft_databases;
create policy "Users read own user_workspace_draft_databases"
  on public.user_workspace_draft_databases
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users insert own user_workspace_draft_databases" on public.user_workspace_draft_databases;
create policy "Users insert own user_workspace_draft_databases"
  on public.user_workspace_draft_databases
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users update own user_workspace_draft_databases" on public.user_workspace_draft_databases;
create policy "Users update own user_workspace_draft_databases"
  on public.user_workspace_draft_databases
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Users delete own user_workspace_draft_databases" on public.user_workspace_draft_databases;
create policy "Users delete own user_workspace_draft_databases"
  on public.user_workspace_draft_databases
  for delete
  to authenticated
  using (user_id = auth.uid());
