-- Run in Supabase SQL Editor after 001_teachers.sql.
-- Adds first / last name, auto updated_at, public avatar storage, and RLS on storage.

alter table public.teachers
  add column if not exists first_name text,
  add column if not exists last_name text;

create or replace function public.set_teachers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists teachers_set_updated_at on public.teachers;
create trigger teachers_set_updated_at
  before update on public.teachers
  for each row
  execute procedure public.set_teachers_updated_at();

create or replace function public.handle_new_teacher()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  fn text;
  ln text;
  combined text;
begin
  fn := coalesce(new.raw_user_meta_data->>'first_name', '');
  ln := coalesce(new.raw_user_meta_data->>'last_name', '');
  combined := trim(
    both from concat_ws(
      ' ',
      nullif(trim(fn), ''),
      nullif(trim(ln), '')
    )
  );
  if combined = '' then
    combined := coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    );
  end if;

  insert into public.teachers (id, email, first_name, last_name, full_name, avatar_url)
  values (
    new.id,
    new.email,
    nullif(trim(fn), ''),
    nullif(trim(ln), ''),
    combined,
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    )
  );
  return new;
end;
$$;

insert into storage.buckets (id, name, public)
values ('teacher-avatars', 'teacher-avatars', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read teacher avatars" on storage.objects;
create policy "Public read teacher avatars"
  on storage.objects for select
  using (bucket_id = 'teacher-avatars');

drop policy if exists "Teachers insert own avatar" on storage.objects;
create policy "Teachers insert own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'teacher-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Teachers update own avatar" on storage.objects;
create policy "Teachers update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'teacher-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'teacher-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Teachers delete own avatar" on storage.objects;
create policy "Teachers delete own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'teacher-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
