import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Supabase anahtarları .env.local'de tanımlı mı? Panel/oturum sayfaları
// yapılandırma yoksa kibarca uyarır, çökmezler.
export function isSupabaseConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Sunucu (Server Component / Server Action / Route Handler) tarafı istemci.
// Kullanıcı oturumunu çereze bağlar; RLS bu oturuma göre uygulanır.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component içinden çağrıldığında cookie set edilemez;
            // oturum tazeleme middleware tarafından yapılır. Sessizce geç.
          }
        },
      },
    },
  );
}

// Service-role istemci: RLS'i by-pass eder. SADECE sunucuda, güvenilir
// işlemler için (ör. KVKK kapsamında kalıcı silme). Asla tarayıcıya sızmamalı.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
