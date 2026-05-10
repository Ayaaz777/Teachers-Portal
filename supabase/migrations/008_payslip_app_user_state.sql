-- Per-user JSON document for desktop app preferences and workspace data (replaces localStorage).
-- Run after 001–007. Authenticated users may read/update only their own row.

create table if not exists public.payslip_app_user_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists payslip_app_user_state_updated_idx
  on public.payslip_app_user_state (updated_at desc);

comment on table public.payslip_app_user_state is
  'Key/value JSON state for payslip desktop app (workspace pages, drafts, UI prefs). One row per auth user.';

alter table public.payslip_app_user_state enable row level security;

drop policy if exists "Users read own payslip app state" on public.payslip_app_user_state;
create policy "Users read own payslip app state"
  on public.payslip_app_user_state
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users insert own payslip app state" on public.payslip_app_user_state;
create policy "Users insert own payslip app state"
  on public.payslip_app_user_state
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users update own payslip app state" on public.payslip_app_user_state;
create policy "Users update own payslip app state"
  on public.payslip_app_user_state
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Users delete own payslip app state" on public.payslip_app_user_state;
create policy "Users delete own payslip app state"
  on public.payslip_app_user_state
  for delete
  to authenticated
  using (user_id = auth.uid());
