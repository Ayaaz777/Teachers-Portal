-- Run in Supabase SQL Editor after 004 (or any time after 002).
-- Bank details and national / ID number on teacher profile.

alter table public.teachers
  add column if not exists bank_details text,
  add column if not exists national_id text;
