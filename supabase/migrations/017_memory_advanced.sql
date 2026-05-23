-- Advanced memory: confidence, access tracking, staleness, contradiction support

alter table voice_facts
  add column if not exists confidence float4 not null default 1.0,
  add column if not exists access_count int4 not null default 0,
  add column if not exists last_accessed_at timestamptz,
  add column if not exists previous_value text;

alter table voice_page_refs
  add column if not exists access_count int4 not null default 0,
  add column if not exists last_accessed_at timestamptz;

create index if not exists idx_voice_facts_user_email_updated
  on voice_facts (user_email, updated_at desc);

create index if not exists idx_voice_page_refs_user_email_updated
  on voice_page_refs (user_email, updated_at desc);
