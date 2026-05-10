-- Person ↔ Notion page/row ID mappings for admin "Names and Notion row IDs" table.
-- Run in Supabase SQL after 003_admin_teacher_directory.sql (uses app_admins for RLS).

create table if not exists public.payslip_notion_person_links (
  row_key text primary key,
  given_name text not null default '',
  family_name text not null default '',
  notion_record_id text not null default '',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists payslip_notion_person_links_sort_idx
  on public.payslip_notion_person_links (sort_order, row_key);

comment on table public.payslip_notion_person_links is
  'Admin-only mapping: given name, surname, Notion row/page id for pay-slip sync (desktop app).';

alter table public.payslip_notion_person_links enable row level security;

drop policy if exists "Admins select payslip notion links" on public.payslip_notion_person_links;
create policy "Admins select payslip notion links"
  on public.payslip_notion_person_links
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.app_admins a
      where
        lower(trim(a.email)) =
        lower(trim(coalesce((select auth.jwt()->>'email'), '')))
    )
  );

drop policy if exists "Admins insert payslip notion links" on public.payslip_notion_person_links;
create policy "Admins insert payslip notion links"
  on public.payslip_notion_person_links
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.app_admins a
      where
        lower(trim(a.email)) =
        lower(trim(coalesce((select auth.jwt()->>'email'), '')))
    )
  );

drop policy if exists "Admins update payslip notion links" on public.payslip_notion_person_links;
create policy "Admins update payslip notion links"
  on public.payslip_notion_person_links
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.app_admins a
      where
        lower(trim(a.email)) =
        lower(trim(coalesce((select auth.jwt()->>'email'), '')))
    )
  )
  with check (
    exists (
      select 1
      from public.app_admins a
      where
        lower(trim(a.email)) =
        lower(trim(coalesce((select auth.jwt()->>'email'), '')))
    )
  );

drop policy if exists "Admins delete payslip notion links" on public.payslip_notion_person_links;
create policy "Admins delete payslip notion links"
  on public.payslip_notion_person_links
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.app_admins a
      where
        lower(trim(a.email)) =
        lower(trim(coalesce((select auth.jwt()->>'email'), '')))
    )
  );
