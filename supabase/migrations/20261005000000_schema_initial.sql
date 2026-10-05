-- Fantômes — schéma initial.
-- À exécuter une seule fois dans Supabase : SQL Editor → New query → coller → Run.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- Un profil par utilisateur, créé automatiquement à l'inscription.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text check (char_length(full_name) <= 120),
  postal_address text check (char_length(postal_address) <= 400),
  access text not null default 'free'
    check (access in ('free', 'audit', 'monthly', 'manual')),
  access_until timestamptz,
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

-- Un enregistrement par dépôt de relevé. Le fichier lui-même n'est jamais conservé.
create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  source text not null check (source in ('pdf', 'csv', 'ofx')),
  period_start date,
  period_end date,
  transactions_count integer not null default 0 check (transactions_count >= 0),
  detected_count integer not null default 0 check (detected_count >= 0),
  created_at timestamptz not null default now()
);

create index analyses_user_created_idx on public.analyses (user_id, created_at desc);

-- Les prélèvements réguliers détectés.
create table public.charges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  merchant_key text not null,
  label text not null check (char_length(label) <= 120),
  raw_label text not null check (char_length(raw_label) <= 200),
  amount_cents integer not null check (amount_cents > 0),
  frequency text not null check (frequency in ('weekly', 'monthly', 'quarterly', 'yearly')),
  annual_cents integer generated always as (
    amount_cents * case frequency
      when 'weekly' then 52
      when 'monthly' then 12
      when 'quarterly' then 4
      else 1
    end
  ) stored,
  occurrences integer not null default 1 check (occurrences >= 1),
  first_seen date not null,
  last_seen date not null,
  status text not null default 'to_review'
    check (status in ('to_review', 'keep', 'to_cancel', 'cancelled', 'ignored')),
  customer_ref text check (char_length(customer_ref) <= 80),
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, merchant_key)
);

create index charges_user_annual_idx on public.charges (user_id, annual_cents desc);

-- Journal des événements Stripe déjà traités (évite d'activer deux fois le même paiement).
create table public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Automatismes
-- ---------------------------------------------------------------------------

-- Crée le profil dès qu'un compte est créé (inscription, lien de connexion ou admin).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Tient à jour updated_at et la date de résiliation.
create function public.charges_before_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  if new.status = 'cancelled' and old.status is distinct from 'cancelled' then
    new.cancelled_at := now();
  elsif new.status <> 'cancelled' then
    new.cancelled_at := null;
  end if;
  return new;
end;
$$;

create trigger charges_before_update
  before update on public.charges
  for each row execute function public.charges_before_update();

-- ---------------------------------------------------------------------------
-- Sécurité : chacun ne voit que ses données, et ne peut modifier que ce qui le regarde.
-- Les champs d'accès payant ne sont modifiables que par le serveur (clé secrète).
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.analyses enable row level security;
alter table public.charges enable row level security;
alter table public.stripe_events enable row level security;

revoke all on public.profiles, public.analyses, public.charges, public.stripe_events
  from anon, authenticated;

grant select on public.profiles, public.analyses, public.charges to authenticated;
grant update (full_name, postal_address) on public.profiles to authenticated;
grant update (status, customer_ref) on public.charges to authenticated;

grant all on public.profiles, public.analyses, public.charges, public.stripe_events
  to service_role;

create policy "Lecture de son propre profil"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Modification de son propre profil"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Lecture de ses propres analyses"
  on public.analyses for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Lecture de ses propres prélèvements"
  on public.charges for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Modification de ses propres prélèvements"
  on public.charges for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- stripe_events : aucune règle d'accès, donc invisible pour les utilisateurs.
