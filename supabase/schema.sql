-- PhonomeFrequency cloud archive bridge
-- Run this in the Supabase SQL editor after enabling anonymous sign-ins.

create table if not exists public.phonome_profiles (
  id text primary key,
  owner_id uuid not null default auth.uid(),
  name text not null,
  species text not null,
  temperament text not null default 'early profile',
  recording_ids text[] not null default '{}',
  confirmed_context_labels text[] not null default '{}',
  strongest_repeated_signal text not null default 'early profile forming',
  confidence_trend integer[] not null default '{}',
  profile_maturity integer not null default 0 check (profile_maturity between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.phonome_recordings (
  id text primary key,
  owner_id uuid not null default auth.uid(),
  animal_id text not null references public.phonome_profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('upload', 'recording')),
  file_name text not null,
  duration_label text not null,
  size_label text not null,
  created_at timestamptz not null default now(),
  context_note text not null default '',
  spectrogram_seed integer not null default 19,
  acoustic_features jsonb,
  analysis jsonb not null,
  feedback jsonb
);

alter table public.phonome_profiles enable row level security;
alter table public.phonome_recordings enable row level security;

drop policy if exists "Owners can read their Phonome profiles" on public.phonome_profiles;
drop policy if exists "Owners can insert their Phonome profiles" on public.phonome_profiles;
drop policy if exists "Owners can update their Phonome profiles" on public.phonome_profiles;
drop policy if exists "Owners can delete their Phonome profiles" on public.phonome_profiles;

create policy "Owners can read their Phonome profiles"
on public.phonome_profiles for select to authenticated
using (owner_id = auth.uid());

create policy "Owners can insert their Phonome profiles"
on public.phonome_profiles for insert to authenticated
with check (owner_id = auth.uid());

create policy "Owners can update their Phonome profiles"
on public.phonome_profiles for update to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Owners can delete their Phonome profiles"
on public.phonome_profiles for delete to authenticated
using (owner_id = auth.uid());

drop policy if exists "Owners can read their Phonome recordings" on public.phonome_recordings;
drop policy if exists "Owners can insert their Phonome recordings" on public.phonome_recordings;
drop policy if exists "Owners can update their Phonome recordings" on public.phonome_recordings;
drop policy if exists "Owners can delete their Phonome recordings" on public.phonome_recordings;

create policy "Owners can read their Phonome recordings"
on public.phonome_recordings for select to authenticated
using (owner_id = auth.uid());

create policy "Owners can insert their Phonome recordings"
on public.phonome_recordings for insert to authenticated
with check (owner_id = auth.uid());

create policy "Owners can update their Phonome recordings"
on public.phonome_recordings for update to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Owners can delete their Phonome recordings"
on public.phonome_recordings for delete to authenticated
using (owner_id = auth.uid());

create index if not exists phonome_profiles_owner_created_idx
on public.phonome_profiles (owner_id, created_at desc);

create index if not exists phonome_recordings_owner_created_idx
on public.phonome_recordings (owner_id, created_at desc);

create index if not exists phonome_recordings_animal_created_idx
on public.phonome_recordings (animal_id, created_at desc);
