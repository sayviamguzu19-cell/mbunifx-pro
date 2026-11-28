-- CASHRUSH NITRO V11 · Supabase schema
-- Run in the SQL Editor of the Supabase project you own.
-- This stores practice progress and read-only VIP status only.
-- It does NOT create a real-money wallet, accept deposits, or enable payouts.

create table if not exists public.player_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  best_score integer not null default 0 check (best_score >= 0),
  total_practice_coins bigint not null default 0 check (total_practice_coins >= 0),
  demo_wallet numeric(14,2) not null default 5.00 check (demo_wallet >= 0),
  selected_car text not null default 'RAPTOR'
    check (selected_car in ('RAPTOR','FALCON','VIPER')),
  updated_at timestamptz not null default now()
);

alter table public.player_progress alter column demo_wallet set default 5.00;
update public.player_progress
set demo_wallet = 5.00
where demo_wallet = 5000.00 and best_score = 0 and total_practice_coins = 0;

create table if not exists public.vip_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'inactive'
    check (status in ('inactive','active','revoked')),
  activated_at timestamptz,
  updated_at timestamptz not null default now()
);
create table if not exists public.vip_activation_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  assigned_user_id uuid references auth.users(id) on delete set null,
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.player_progress enable row level security;
alter table public.vip_entitlements enable row level security;
alter table public.vip_activation_codes enable row level security;
drop policy if exists "players read own progress" on public.player_progress;
create policy "players read own progress" on public.player_progress for select to authenticated using (auth.uid() = user_id);
drop policy if exists "players insert own progress" on public.player_progress;
create policy "players insert own progress" on public.player_progress for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "players update own progress" on public.player_progress;
create policy "players update own progress" on public.player_progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "players read own vip status" on public.vip_entitlements;
create policy "players read own vip status" on public.vip_entitlements for select to authenticated using (auth.uid() = user_id);

revoke all on public.player_progress from anon, authenticated;
grant select, insert, update on public.player_progress to authenticated;
revoke all on public.vip_entitlements from anon, authenticated;
grant select on public.vip_entitlements to authenticated;
revoke all on public.vip_activation_codes from anon, authenticated;
grant usage on schema public to authenticated;

create or replace function public.crn_create_player_rows()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.player_progress (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.vip_entitlements (user_id, status) values (new.id, 'inactive') on conflict (user_id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created_crn on auth.users;
create trigger on_auth_user_created_crn after insert on auth.users for each row execute procedure public.crn_create_player_rows();
insert into public.player_progress (user_id) select id from auth.users on conflict (user_id) do nothing;
insert into public.vip_entitlements (user_id, status) select id, 'inactive' from auth.users on conflict (user_id) do nothing;

create or replace function public.crn_touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists crn_player_progress_updated_at on public.player_progress;
create trigger crn_player_progress_updated_at before update on public.player_progress for each row execute procedure public.crn_touch_updated_at();
drop trigger if exists crn_vip_entitlements_updated_at on public.vip_entitlements;
create trigger crn_vip_entitlements_updated_at before update on public.vip_entitlements for each row execute procedure public.crn_touch_updated_at();

revoke all on function public.crn_create_player_rows() from public, anon, authenticated;
revoke all on function public.crn_touch_updated_at() from public, anon, authenticated;
comment on table public.player_progress is 'CASHRUSH NITRO practice progress only; demo_wallet is simulated USD, not real money.';
comment on column public.player_progress.demo_wallet is 'SIM USD practice balance only. Never use as a cash ledger.';
comment on table public.vip_activation_codes is 'Hashed one-use VIP codes. Server/Edge Function only; no client access.';
