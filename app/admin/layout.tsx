import Link from "next/link";
import { ShieldAlert, LayoutDashboard, TrendingUp, Users, FileStack, Send } from "lucide-react";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const TABS = [
  { href: "/admin", label: "Özet", icon: LayoutDashboard },
  { href: "/admin/analitik", label: "Analitik", icon: TrendingUp },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users },
  { href: "/admin/cvler", label: "CV'ler", icon: FileStack },
  { href: "/admin/talepler", label: "Talepler", icon: Send },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin(); // Admin değilse anasayfaya yönlendirir.

  return (
    <main className="min-h-screen dotted-bg">
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-8">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose/10">
            <ShieldAlert className="h-5 w-5 text-rose" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Yönetim paneli</h1>
            <p className="text-sm text-ink/50">Yalnızca admin — dikkatli kullan.</p>
          </div>
        </div>

        <nav className="mb-8 flex flex-wrap gap-1.5 border-b border-ink/10 pb-3">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-ink/60 transition-colors hover:bg-white/[0.06] hover:text-ink"
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </main>
  );
}
