-- Weekly summaries for temporal queries (e.g. "what did I ask about last week?")
-- Auto-generated on-demand via Haiku, cached for fast retrieval

create table if not exists voice_weekly_summaries (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  week_start date not null,
  week_end date not null,
  summary_text text not null,
  topic_tags text[],
  turn_count int4 not null default 0,
  created_at timestamptz default now(),
  unique (user_email, week_start)
);

create index if not exists idx_weekly_summaries_user_email_week
  on voice_weekly_summaries (user_email, week_start desc);

alter table voice_weekly_summaries enable row level security;
