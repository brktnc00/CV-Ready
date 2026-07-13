-- CV-Ready — Admin rolü + admin erişimi
-- Supabase SQL editöründe çalıştırın (0001_init.sql'den sonra).
-- Admin sayfaları service_role ile çalışır; aşağıdaki RLS policy'leri ek
-- güvenlik/esneklik içindir (ör. admin normal istemciyle de veri görebilsin).

-- ============================================================
-- 1) profiles.role artık 'admin' değerini de kabul eder
-- ============================================================
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('candidate', 'recruiter', 'admin'));

-- ============================================================
-- 2) is_admin(): oturumdaki kullanıcı admin mi?
-- security definer → profiles'ı RLS'e takılmadan okur (recursion yok).
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- 3) Admin, tüm verileri RLS altında da görebilsin/yönetebilsin
-- ============================================================
create policy "profiles: admin hepsini görür"
  on public.profiles for select to authenticated
  using (public.is_admin());

create policy "published_cvs: admin hepsini görür"
  on public.published_cvs for select to authenticated
  using (public.is_admin());

create policy "published_cvs: admin günceller"
  on public.published_cvs for update to authenticated
  using (public.is_admin());

create policy "published_cvs: admin siler"
  on public.published_cvs for delete to authenticated
  using (public.is_admin());

create policy "contact_requests: admin hepsini görür"
  on public.contact_requests for select to authenticated
  using (public.is_admin());

-- ============================================================
-- 4) Kendini admin yap (KENDİ e-postanı yaz ve bu satırı çalıştır)
-- ============================================================
-- update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'safaburak.tunc@outlook.com');
