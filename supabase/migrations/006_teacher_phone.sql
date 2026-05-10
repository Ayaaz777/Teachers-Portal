-- Run in Supabase SQL Editor after prior migrations.

alter table public.teachers
  add column if not exists phone_number text;
