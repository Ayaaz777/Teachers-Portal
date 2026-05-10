-- Online presence for the desktop app.
-- Adds last_seen_at to public.teachers and stops the updated_at trigger from
-- bumping when only last_seen_at changes (so "Last profile update" is unaffected
-- by heartbeats).
--
-- Run after 009_user_workspace_draft_databases.sql.

alter table public.teachers
  add column if not exists last_seen_at timestamptz;

comment on column public.teachers.last_seen_at is
  'Most recent heartbeat from the signed-in teacher app. Admin uses this to show online / offline.';

create index if not exists teachers_last_seen_at_idx
  on public.teachers (last_seen_at desc);

create or replace function public.set_teachers_updated_at()
returns trigger
language plpgsql
as $$
begin
  if (
    new.email is distinct from old.email
    or new.first_name is distinct from old.first_name
    or new.last_name is distinct from old.last_name
    or new.full_name is distinct from old.full_name
    or new.avatar_url is distinct from old.avatar_url
    or new.phone_number is distinct from old.phone_number
    or new.bank_details is distinct from old.bank_details
    or new.national_id is distinct from old.national_id
    or new.notion_database_id is distinct from old.notion_database_id
    or new.notion_data_source_id is distinct from old.notion_data_source_id
  ) then
    new.updated_at = now();
  end if;
  return new;
end;
$$;
