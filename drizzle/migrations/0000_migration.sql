create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null default '',
  daerah text not null default '',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_data (
  user_id uuid primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.user_data to authenticated;
grant all on public.user_data to service_role;
alter table public.user_data enable row level security;
create policy "own data select" on public.user_data for select to authenticated using (auth.uid() = user_id);
create policy "own data insert" on public.user_data for insert to authenticated with check (auth.uid() = user_id);
create policy "own data update" on public.user_data for update to authenticated using (auth.uid() = user_id);
create policy "own data delete" on public.user_data for delete to authenticated using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nama, daerah)
  values (new.id,
    coalesce(new.raw_user_meta_data->>'nama', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'daerah', ''));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();