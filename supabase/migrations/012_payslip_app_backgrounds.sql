-- Curated full-screen background images for the desktop app (admin + teachers).
-- `image_url` must be a full public URL (see migration 014: Storage bucket
-- `payslip_app_backgrounds`). Authenticated users can read active rows only.

create table if not exists public.payslip_app_backgrounds (
  id uuid primary key default gen_random_uuid(),
  label text,
  sort_order integer not null default 0,
  image_url text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists payslip_app_backgrounds_active_sort_idx
  on public.payslip_app_backgrounds (is_active, sort_order);

comment on table public.payslip_app_backgrounds is
  'Catalog of background photos; image_url is a public Supabase Storage URL (see migration 014).';

alter table public.payslip_app_backgrounds enable row level security;

drop policy if exists "Authenticated users read active app backgrounds"
  on public.payslip_app_backgrounds;
create policy "Authenticated users read active app backgrounds"
  on public.payslip_app_backgrounds
  for select
  to authenticated
  using (is_active = true);

-- Optional seed removed: wallpapers live in Storage (014). Use
-- `npm run sync:app-backgrounds` or Dashboard uploads, then insert/update rows here.
