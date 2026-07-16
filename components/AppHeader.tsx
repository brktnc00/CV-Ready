import Link from "next/link";
import { FileText, LogOut, Sparkles, ShieldAlert } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

type Role = "recruiter" | "candidate" | "admin" | null;

// Oturuma duyarlı global üst-bar — karanlık "Luminous Nexus" dilinde.
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

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0d0b14]/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold text-ink">
          <span className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-glow">
            <FileText className="h-5 w-5 text-white" />
          </span>
          CV<span className="nexus-text">Ready</span>
          {role === "recruiter" && <span className="text-white/40">İK</span>}
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {role === "admin" ? (
            <>
              <NavLink href="/admin">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-rose" /> Yönetim
                </span>
              </NavLink>
              <SignOutButton />
            </>
          ) : role === "recruiter" ? (
            <>
              <NavLink href="/panel">Aday havuzu</NavLink>
              <NavLink href="/panel/talepler">Taleplerim</NavLink>
              {company && (
                <span className="hidden px-2 text-sm font-semibold text-white/50 sm:inline">
                  {company}
                </span>
              )}
              <SignOutButton />
            </>
          ) : role === "candidate" ? (
            <>
              <NavLink href="/olustur">CV oluştur</NavLink>
              <NavLink href="/hesabim">Hesabım</NavLink>
              <SignOutButton />
            </>
          ) : (
            <>
              {/* Dar ekranda gizli: marka + CTA ile birlikte 375px'e sığmıyor.
                  İşveren yolu landing'deki "Aday ara" CTA'sı ve kartla korunuyor. */}
              <span className="hidden sm:block">
                <NavLink href="/isverenler">İşverenler</NavLink>
              </span>
              <Link
                href="/olustur"
                className="nexus-btn flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-white"
              >
                <Sparkles className="h-3.5 w-3.5" /> CV oluştur
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 text-sm font-semibold text-white/60 transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

function SignOutButton() {
  return (
    <form action={signOut}>
      <button className="glass glass-hover flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-white/70 hover:text-white">
        <LogOut className="h-4 w-4" /> Çıkış
      </button>
    </form>
  );
}
