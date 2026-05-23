-- Background binaries live in Supabase Storage; `payslip_app_backgrounds.image_url`
-- holds the public object URL:
--   {SUPABASE_URL}/storage/v1/object/public/payslip_app_backgrounds/<path>
--
-- After this migration, upload files to bucket `payslip_app_backgrounds` (Dashboard
-- or `npm run sync:app-backgrounds`) and ensure each row's `image_url` matches.

insert into storage.buckets (id, name, public)
values ('payslip_app_backgrounds', 'payslip_app_backgrounds', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read payslip_app_backgrounds_objects" on storage.objects;
create policy "Public read payslip_app_backgrounds_objects"
  on storage.objects
  for select
  to public
  using (bucket_id = 'payslip_app_backgrounds');

-- Idempotent upserts from the optional sync script.
create unique index if not exists payslip_app_backgrounds_image_url_key
  on public.payslip_app_backgrounds (image_url);

-- Drop catalog entries that pointed at files inside the Electron bundle.
delete from public.payslip_app_backgrounds
where image_url ~* '^(\./)?assets/';

comment on table public.payslip_app_backgrounds is
  'Catalog of background photos; image_url is a public Supabase Storage object URL (bucket payslip_app_backgrounds).';
