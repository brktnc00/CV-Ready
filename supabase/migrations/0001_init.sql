-- CV-Ready — Aday İlan Paneli MVP şeması
-- Supabase SQL editöründe çalıştırın (veya `supabase db push`).
-- Maskeli iletişim: iletişim bilgisi AYRI tabloda (cv_contacts) tutulur;
-- HR rolünün o tabloya hiçbir RLS policy'si yoktur → hiçbir koşulda okuyamaz.

-- ilike aramalarını hızlandırmak için trigram.
create extension if not exists pg_trgm;

-- ============================================================
-- profiles: auth.users'ı rol ve temel bilgiyle genişletir
-- ============================================================
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  role         text not null check (role in ('candidate', 'recruiter')),
  full_name    text,
  company_name text,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: kendi profilini görür"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: kendi profilini oluşturur"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: kendi profilini günceller"
  on public.profiles for update
  using (auth.uid() = id);

-- Yeni kullanıcı kaydında signup metadata'sından profili otomatik oluştur.
-- role/full_name/company_name, signup sırasında options.data ile gönderilir.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, company_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'candidate'),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'company_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- published_cvs: yayınlanan aday profili (İLETİŞİM HARİÇ)
-- ============================================================
create table if not exists public.published_cvs (
  id              uuid primary key default gen_random_uuid(),
  candidate_id    uuid not null references auth.users (id) on delete cascade,
  status          text not null default 'published' check (status in ('published', 'withdrawn')),
  -- TailoredCV'nin contact hariç tamamı:
  public_data     jsonb not null,
  -- Arama/filtre için denormalize kolonlar (publishCV içinde doldurulur):
  full_name       text,
  headline        text,
  location        text,
  skills_text     text,
  languages       text[] not null default '{}',
  match_score     int not null default 0,
  -- KVKK:
  kvkk_accepted   boolean not null default false,
  consent_at      timestamptz,
  consent_version text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists published_cvs_status_idx on public.published_cvs (status);
create index if not exists published_cvs_score_idx on public.published_cvs (match_score desc);
create index if not exists published_cvs_candidate_idx on public.published_cvs (candidate_id);
create index if not exists published_cvs_skills_trgm on public.published_cvs using gin (skills_text gin_trgm_ops);
create index if not exists published_cvs_headline_trgm on public.published_cvs using gin (headline gin_trgm_ops);

alter table public.published_cvs enable row level security;

-- Giriş yapmış herkes YAYINLANMIŞ CV'leri görür; aday kendi tüm satırlarını görür.
create policy "published_cvs: yayınlananları veya kendini görür"
  on public.published_cvs for select
  to authenticated
  using (status = 'published' or candidate_id = auth.uid());

create policy "published_cvs: aday kendi CV'sini yayınlar"
  on public.published_cvs for insert
  to authenticated
  with check (candidate_id = auth.uid());

create policy "published_cvs: aday kendi CV'sini günceller"
  on public.published_cvs for update
  to authenticated
  using (candidate_id = auth.uid());

create policy "published_cvs: aday kendi CV'sini siler"
  on public.published_cvs for delete
  to authenticated
  using (candidate_id = auth.uid());

-- ============================================================
-- cv_contacts: maskelenen iletişim bilgisi — SADECE aday erişir
-- ============================================================
create table if not exists public.cv_contacts (
  cv_id        uuid primary key references public.published_cvs (id) on delete cascade,
  candidate_id uuid not null references auth.users (id) on delete cascade,
  contact      jsonb not null -- { email, phone, linkedin, website }
);

alter table public.cv_contacts enable row level security;

-- Yalnızca sahibi aday. HR rolüne HİÇBİR policy verilmez → erişemez.
create policy "cv_contacts: yalnızca sahibi aday"
  on public.cv_contacts for all
  to authenticated
  using (candidate_id = auth.uid())
  with check (candidate_id = auth.uid());

-- ============================================================
-- contact_requests: HR → aday, platform içi maskeli iletişim
-- ============================================================
create table if not exists public.contact_requests (
  id                uuid primary key default gen_random_uuid(),
  cv_id             uuid not null references public.published_cvs (id) on delete cascade,
  candidate_id      uuid not null references auth.users (id) on delete cascade,
  recruiter_id      uuid not null references auth.users (id) on delete cascade,
  recruiter_company text,
  recruiter_contact text not null, -- HR'ın kendi dönüş bilgisi (aday görür)
  message           text not null,
  status            text not null default 'sent' check (status in ('sent', 'accepted', 'declined')),
  created_at        timestamptz not null default now()
);

create index if not exists contact_requests_candidate_idx on public.contact_requests (candidate_id);
create index if not exists contact_requests_recruiter_idx on public.contact_requests (recruiter_id);

alter table public.contact_requests enable row level security;

create policy "contact_requests: taraflar görür"
  on public.contact_requests for select
  to authenticated
  using (recruiter_id = auth.uid() or candidate_id = auth.uid());

create policy "contact_requests: HR talep oluşturur"
  on public.contact_requests for insert
  to authenticated
  with check (recruiter_id = auth.uid());

-- Aday talebi kabul/ret ile günceller.
create policy "contact_requests: aday durumu günceller"
  on public.contact_requests for update
  to authenticated
  using (candidate_id = auth.uid());
