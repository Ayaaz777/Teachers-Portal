-- Voice agent page references: auto-stored mapping from teacher/page names to Notion page IDs
-- Created automatically after successful notion_create_page / notion_update_page
-- Enables Claude to reference pages by name after app restarts

create table if not exists voice_page_refs (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  page_id text not null,
  page_name text not null,
  database_id text,
  source_cid text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_email, page_name)
);

alter table voice_page_refs enable row level security;
