-- Prompt Wallet initial cloud-sync schema.
--
-- Current app behavior:
-- - Prompts are stored locally in Dexie first.
-- - Cloud sync upserts rows into public.prompts using a browser-local user_id.
-- - This is a temporary anonymous-sync model. It does not protect one user's
--   prompts from another anon client if someone knows or guesses row data.
-- - Move to Supabase Auth + RLS before treating cloud sync as private storage.

create table if not exists public.prompts (
  id text primary key,
  user_id text not null,
  content_raw text not null,
  content_normalized text not null,
  title text not null,
  description text,
  tags text[] not null default '{}',
  variables text[] not null default '{}',
  source_type text not null,
  discipline text not null,
  domain text[] not null default '{}',
  format text,
  model text,
  created_at bigint not null,
  updated_at bigint not null,
  collection_id text,
  is_favorite boolean not null default false,
  is_archived boolean not null default false,
  constraint prompts_source_type_check
    check (source_type in ('MANUAL', 'OCR', 'CLIPBOARD', 'IMPORT')),
  constraint prompts_discipline_check
    check (
      discipline in (
        'Website',
        'Sales',
        'Marketing',
        'SAAS',
        'Strategy',
        'Personal',
        'Music',
        'Image Generation',
        'SEO',
        'Content Creation',
        'Business Planning',
        'Other'
      )
    )
);

create index if not exists prompts_user_id_idx
  on public.prompts (user_id);

create index if not exists prompts_user_id_updated_at_idx
  on public.prompts (user_id, updated_at desc);

create index if not exists prompts_user_id_created_at_idx
  on public.prompts (user_id, created_at desc);

create index if not exists prompts_user_id_is_archived_idx
  on public.prompts (user_id, is_archived);

create index if not exists prompts_tags_gin_idx
  on public.prompts using gin (tags);

create index if not exists prompts_domain_gin_idx
  on public.prompts using gin (domain);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.prompts to anon, authenticated;

-- RLS intentionally remains disabled for the current anonymous localStorage
-- identity model. Enabling RLS safely requires replacing user_id with a value
-- derived from Supabase Auth, for example auth.uid().
alter table public.prompts disable row level security;
