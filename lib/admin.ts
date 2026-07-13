import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createClient,
  createAdminClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export interface AdminContext {
  userId: string;
  admin: SupabaseClient;
}

// Oturumdaki kullanıcının profiles.role === 'admin' olduğunu normal (çerez)
// istemciyle doğrular. Doğruysa RLS'i by-pass eden service-role istemcisini
// döndürür. Değilse null. Yetki kararı DAİMA sunucuda verilir.
export async function getAdminOrNull(): Promise<AdminContext | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return null;
  return { userId: user.id, admin: createAdminClient() };
}

// Sayfalar için: admin değilse anasayfaya yönlendir.
export async function requireAdmin(): Promise<AdminContext> {
  const ctx = await getAdminOrNull();
  if (!ctx) redirect("/");
  return ctx;
}

// Server action'lar için: admin değilse hata fırlat.
export async function assertAdmin(): Promise<AdminContext> {
  const ctx = await getAdminOrNull();
  if (!ctx) throw new Error("Yetkisiz: bu işlem yalnızca admin içindir.");
  return ctx;
}
