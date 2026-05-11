-- Persistent chat history so the AI assistant feels like a continuing
-- companion across sessions instead of a stranger every time the user opens
-- the widget. The chat route reads the last N rows on every request to seed
-- model context and appends user + assistant turns as the stream completes.
--
-- Run this in the Supabase SQL Editor against the production database.

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  model text,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_patient_created_idx
  on public.chat_messages(patient_id, created_at desc);

alter table public.chat_messages enable row level security;

drop policy if exists "own chat messages select" on public.chat_messages;
drop policy if exists "own chat messages insert" on public.chat_messages;

create policy "own chat messages select" on public.chat_messages
  for select using (auth.uid() = patient_id);

create policy "own chat messages insert" on public.chat_messages
  for insert with check (auth.uid() = patient_id);
