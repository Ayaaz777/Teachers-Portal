-- Run this in the Supabase SQL Editor (Dashboard → SQL).
--
-- Enable Authentication → Providers → Email for sign-in in the desktop app.
-- (Disable "Confirm email" in Auth settings if you want instant sign-up during dev.)
--
create table if not exists public.teachers (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.teachers enable row level security;

drop policy if exists "Teachers select own row" on public.teachers;

create policy "Teachers select own row"
  on public.teachers
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Teachers update own row" on public.teachers;

create policy "Teachers update own row"
  on public.teachers
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Allow authenticated users to insert their own row if the trigger did not run (repair).
drop policy if exists "Teachers insert own row" on public.teachers;

create policy "Teachers insert own row"
  on public.teachers
  for insert
  to authenticated
  with check (auth.uid() = id);

create or replace function public.handle_new_teacher()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.teachers (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_teacher on auth.users;

create trigger on_auth_user_created_teacher
  after insert on auth.users
  for each row
  execute procedure public.handle_new_teacher();
