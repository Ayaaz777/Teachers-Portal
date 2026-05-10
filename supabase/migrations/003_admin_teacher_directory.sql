-- Run in Supabase SQL after 002_teacher_profile.sql (or anytime after 001).
-- Lets the allowlisted app admin list every row in public.teachers from the app.

create table if not exists public.app_admins (
  email text primary key
);

alter table public.app_admins enable row level security;

drop policy if exists "Admins read own app_admins row" on public.app_admins;
create policy "Admins read own app_admins row"
  on public.app_admins
  for select
  to authenticated
  using (
    lower(trim(email)) =
    lower(trim(coalesce((select auth.jwt()->>'email'), '')))
  );

drop policy if exists "Admins select all teachers" on public.teachers;
create policy "Admins select all teachers"
  on public.teachers
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

-- After running this script, add your admin email once (same as auth-store.js ALLOWED_ADMIN_EMAIL):
--   insert into public.app_admins (email) values ('you@example.com')
--   on conflict (email) do nothing;
