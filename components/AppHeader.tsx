import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import AppHeaderNav, { type Role } from "./AppHeaderNav";

// Oturuma duyarlı global üst-bar. Veriyi burada (sunucuda) çeker, görünümü
// route'a göre AppHeaderNav (client) karara bağlar.
export default async function AppHeader() {
  let role: Role = null;
  let company: string | null = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, company_name")
        .eq("id", user.id)
        .single();
      role =
        profile?.role === "recruiter"
          ? "recruiter"
          : profile?.role === "admin"
            ? "admin"
            : "candidate";
      company = profile?.company_name ?? null;
    }
  }

  return <AppHeaderNav role={role} company={company} />;
}
