import Link from "next/link";
import { FileText, LogOut, Sparkles } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

type Role = "recruiter" | "candidate" | null;

// Oturuma duyarlı global üst-bar. Tüm sayfalarda root layout üzerinden render edilir.
// Supabase yapılandırılmamışsa yalnızca marka + "CV oluştur" gösterir (araç modu).
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
      role = profile?.role === "recruiter" ? "recruiter" : "candidate";
      company = profile?.company_name ?? null;
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold">
          <span className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-glow">
            <FileText className="h-5 w-5 text-white" />
          </span>
          CV<span className="gradient-text">Ready</span>
          {role === "recruiter" && <span className="text-ink/40">İK</span>}
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {role === "recruiter" ? (
            <>
              <NavLink href="/panel">Aday havuzu</NavLink>
              <NavLink href="/panel/talepler">Taleplerim</NavLink>
              {company && (
                <span className="hidden px-2 text-sm font-semibold text-ink/50 sm:inline">
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
              <NavLink href="/isverenler">İşverenler</NavLink>
              <Link
                href="/olustur"
                className="gradient-primary flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white shadow-glow"
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
      className="rounded-full px-3 py-2 text-sm font-semibold text-ink/60 transition-colors hover:text-ink"
    >
      {children}
    </Link>
  );
}

function SignOutButton() {
  return (
    <form action={signOut}>
      <button className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-ink/60 shadow-card transition-colors hover:text-ink">
        <LogOut className="h-4 w-4" /> Çıkış
      </button>
    </form>
  );
}
