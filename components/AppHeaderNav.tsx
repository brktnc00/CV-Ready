"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LogOut, Sparkles, ShieldAlert } from "lucide-react";
import { signOut } from "@/app/actions/auth";

export type Role = "recruiter" | "candidate" | "admin" | null;

// Görünüm route'a göre değişir: landing (/) karanlık dilde, uygulama
// ekranları aydınlık. Oturum verisi sunucudan prop olarak gelir.
export default function AppHeaderNav({ role, company }: { role: Role; company: string | null }) {
  const dark = usePathname() === "/";

  return (
    <header
      className={
        dark
          ? "sticky top-0 z-40 border-b border-white/5 bg-[#0d0b14]/70 backdrop-blur-md"
          : "sticky top-0 z-40 border-b border-ink/5 bg-cream/80 backdrop-blur-md"
      }
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
        <Link
          href="/"
          className={`flex items-center gap-2.5 font-display text-xl font-bold ${
            dark ? "text-[#e8e6ee]" : ""
          }`}
        >
          <span className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-glow">
            <FileText className="h-5 w-5 text-white" />
          </span>
          CV
          <span className={dark ? "nexus-text" : "gradient-text"}>Ready</span>
          {role === "recruiter" && (
            <span className={dark ? "text-white/40" : "text-ink/40"}>İK</span>
          )}
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {role === "admin" ? (
            <>
              <NavLink href="/admin" dark={dark}>
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-rose" /> Yönetim
                </span>
              </NavLink>
              <SignOutButton dark={dark} />
            </>
          ) : role === "recruiter" ? (
            <>
              <NavLink href="/panel" dark={dark}>
                Aday havuzu
              </NavLink>
              <NavLink href="/panel/talepler" dark={dark}>
                Taleplerim
              </NavLink>
              {company && (
                <span
                  className={`hidden px-2 text-sm font-semibold sm:inline ${
                    dark ? "text-white/50" : "text-ink/50"
                  }`}
                >
                  {company}
                </span>
              )}
              <SignOutButton dark={dark} />
            </>
          ) : role === "candidate" ? (
            <>
              <NavLink href="/olustur" dark={dark}>
                CV oluştur
              </NavLink>
              <NavLink href="/hesabim" dark={dark}>
                Hesabım
              </NavLink>
              <SignOutButton dark={dark} />
            </>
          ) : (
            <>
              {/* Dar ekranda gizli: marka + CTA ile birlikte 375px'e sığmıyor.
                  İşveren yolu landing'deki "Aday ara" CTA'sı ve kartla korunuyor. */}
              <span className="hidden sm:block">
                <NavLink href="/isverenler" dark={dark}>
                  İşverenler
                </NavLink>
              </span>
              <Link
                href="/olustur"
                className={
                  dark
                    ? "nexus-btn flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-white"
                    : "gradient-primary flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-white shadow-glow"
                }
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

function NavLink({
  href,
  dark,
  children,
}: {
  href: string;
  dark: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
        dark ? "text-white/60 hover:text-white" : "text-ink/60 hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

function SignOutButton({ dark }: { dark: boolean }) {
  return (
    <form action={signOut}>
      <button
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
          dark
            ? "glass glass-hover text-white/70 hover:text-white"
            : "border border-ink/10 bg-white text-ink/60 shadow-card hover:text-ink"
        }`}
      >
        <LogOut className="h-4 w-4" /> Çıkış
      </button>
    </form>
  );
}
