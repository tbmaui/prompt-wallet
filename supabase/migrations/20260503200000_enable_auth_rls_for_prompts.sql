-- Enable Supabase Auth-backed row-level security for Prompt Wallet prompts.
--
-- This replaces the temporary anonymous localStorage user_id model. The app now
-- writes public.prompts.user_id from the authenticated Supabase user id.

alter table public.prompts enable row level security;

drop policy if exists "Users can read own prompts" on public.prompts;
drop policy if exists "Users can insert own prompts" on public.prompts;
drop policy if exists "Users can update own prompts" on public.prompts;
drop policy if exists "Users can delete own prompts" on public.prompts;

create policy "Users can read own prompts"
  on public.prompts
  for select
  to authenticated
  using (auth.uid()::text = user_id);

create policy "Users can insert own prompts"
  on public.prompts
  for insert
  to authenticated
  with check (auth.uid()::text = user_id);

create policy "Users can update own prompts"
  on public.prompts
  for update
  to authenticated
  using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);

create policy "Users can delete own prompts"
  on public.prompts
  for delete
  to authenticated
  using (auth.uid()::text = user_id);
