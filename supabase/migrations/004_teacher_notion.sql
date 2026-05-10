-- Run after 003_admin_teacher_directory.sql.
-- Links each teacher to their own Notion payslip database (same property layout per teacher).
-- Set notion_database_id (and optionally notion_data_source_id) in Supabase Table Editor or SQL.
-- The same Notion internal integration must be connected to every teacher database.

alter table public.teachers
  add column if not exists notion_database_id text,
  add column if not exists notion_data_source_id text;

comment on column public.teachers.notion_database_id is
  'Notion database page UUID from the URL (hyphens optional). Desktop app queries this DB for that teacher.';
comment on column public.teachers.notion_data_source_id is
  'Optional data source UUID when GET /v1/databases returns no data_sources (wiki setups).';

-- Admins still set these via Dashboard/SQL unless you add an "Admins update teachers" policy.
