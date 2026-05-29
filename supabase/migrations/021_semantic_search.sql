-- 021: Semantic search across planner data via pgvector
-- Requires pgvector extension (already enabled for voice_facts).
-- Adds planner_note_embeddings table + match function + RLS.

-- Confirm extension
create extension if not exists vector with schema extensions;

-- ============================================================
-- planner_note_embeddings
-- ============================================================
create table if not exists public.planner_note_embeddings (
  id          uuid not null default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  email       text,
  source      text not null,              -- 'obsidian' | 'reminder' | 'day_note'
  source_id   text not null,              -- note uuid / event id / 'YYYY-MM-DD'
  chunk_index int not null default 0,
  chunk_text  text not null,
  embedding   vector(384),
  updated_at  timestamptz not null default now(),
  primary key (id)
);

alter table public.planner_note_embeddings enable row level security;

create policy "Users can select own embeddings"
  on public.planner_note_embeddings for select
  using (auth.uid() = user_id);

create policy "Users can insert own embeddings"
  on public.planner_note_embeddings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own embeddings"
  on public.planner_note_embeddings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own embeddings"
  on public.planner_note_embeddings for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists planner_note_embeddings_user_id_idx
  on public.planner_note_embeddings (user_id);
create index if not exists planner_note_embeddings_source_idx
  on public.planner_note_embeddings (user_id, source, source_id);

-- HNSW vector index for cosine similarity search
create index if not exists planner_note_embeddings_embedding_idx
  on public.planner_note_embeddings
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 200);

-- ============================================================
-- match_planner_notes — semantic search via admin client (user_id param)
-- Used with admin/service-role client where auth.uid() is NULL.
-- The caller must supply the scoped user_id explicitly.
create or replace function match_planner_notes(
  query_embedding vector(384),
  match_user_id uuid,
  match_count int default 10,
  match_threshold float default 0.45
)
returns table (
  id uuid,
  source text,
  source_id text,
  chunk_text text,
  similarity float
)
language sql
stable
parallel safe
as $$
  select
    pne.id,
    pne.source,
    pne.source_id,
    pne.chunk_text,
    1 - (pne.embedding <=> query_embedding) as similarity
  from public.planner_note_embeddings pne
  where
    pne.user_id = match_user_id
    and pne.embedding is not null
    and 1 - (pne.embedding <=> query_embedding) > match_threshold
  order by pne.embedding <=> query_embedding
  limit match_count;
$$;
