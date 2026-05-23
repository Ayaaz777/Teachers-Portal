-- Voice agent persistent memory for Recruit My English
-- Layer 1: conversation transcript, Layer 2: distilled facts
-- Embeddings via Xenova/bge-small-en-v1.5 (384-dim, local, no API key)

create extension if not exists vector;

create table if not exists voice_conversations (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  turn_role text not null check (turn_role in ('user', 'assistant')),
  content text not null,
  embedding vector(384),
  cid text,
  created_at timestamptz default now()
);

create table if not exists voice_facts (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  fact_key text not null,
  fact_value text not null,
  embedding vector(384),
  source_cid text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_email, fact_key)
);

create index if not exists idx_voice_conversations_embedding
  on voice_conversations using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index if not exists idx_voice_facts_embedding
  on voice_facts using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create or replace function match_voice_memories(
  query_embedding vector(384),
  match_count int default 5,
  user_email_filter text default ''
)
returns table (
  source_table text,
  id uuid,
  content text,
  similarity double precision,
  created_at timestamptz
)
language plpgsql
as $$
begin
  return query
  select * from (
    select
      'voice_conversations'::text as source_table,
      vc.id,
      vc.content,
      1 - (vc.embedding <=> query_embedding) as similarity,
      vc.created_at
    from voice_conversations vc
    where vc.user_email = user_email_filter
      and vc.embedding is not null

    union all

    select
      'voice_facts'::text as source_table,
      vf.id,
      vf.fact_key || ': ' || vf.fact_value as content,
      1 - (vf.embedding <=> query_embedding) as similarity,
      vf.created_at
    from voice_facts vf
    where vf.user_email = user_email_filter
      and vf.embedding is not null
  ) combined
  order by combined.similarity desc
  limit match_count;
end;
$$;

-- RLS: deny all by default; service-role bypasses
alter table voice_conversations enable row level security;
alter table voice_facts enable row level security;
