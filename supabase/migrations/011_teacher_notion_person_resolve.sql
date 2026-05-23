-- Optional explicit link + name-based resolve for teacher payslip filtering.
-- Run after 007_payslip_notion_person_links.sql and 002_teacher_profile.sql.
--
-- Admin directory table in Supabase: public.payslip_notion_person_links
-- (row_key, given_name, family_name, notion_record_id, sort_order).

alter table public.teachers
  add column if not exists notion_person_record_id text;

comment on column public.teachers.notion_person_record_id is
  'Notion page/row UUID for this teacher (from admin Names & Notion row IDs). When set, the app filters the payslip database to rows referencing this id. If null, get_my_notion_person_record_id() matches payslip_notion_person_links by first + last name.';

-- Teachers cannot SELECT payslip_notion_person_links (admin RLS). This RPC runs
-- as definer and returns at most one notion_record_id for the signed-in teacher.
create or replace function public.get_my_notion_person_record_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select pl.notion_record_id::text
  from public.payslip_notion_person_links pl
  join public.teachers t on t.id = auth.uid()
  where
    nullif(trim(pl.notion_record_id), '') is not null
    and lower(trim(coalesce(pl.given_name, ''))) = lower(trim(coalesce(t.first_name, '')))
    and lower(trim(coalesce(pl.family_name, ''))) = lower(trim(coalesce(t.last_name, '')))
  order by pl.sort_order nulls last, pl.row_key
  limit 1;
$$;

revoke all on function public.get_my_notion_person_record_id() from public;
grant execute on function public.get_my_notion_person_record_id() to authenticated;
