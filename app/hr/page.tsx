import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, Search, ShieldCheck } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import HrAuthForm from "@/components/HrAuthForm";

export const dynamic = "force-dynamic";

export default async function HrLandingPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role === "recruiter") redirect("/hr/panel");
    }
  }

  return (
    <main className="min-h-screen dotted-bg">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold">
          <span className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-glow">
            <Building2 className="h-5 w-5 text-white" />
          </span>
          CV<span className="gradient-text">Ready</span> <span className="text-ink/40">İK</span>
        </Link>
        <Link href="/" className="text-sm font-semibold text-ink/50 hover:text-ink">
          Aday mısın? →
        </Link>
      </header>

      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 px-6 py-10 md:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Doğru adayı <span className="gradient-text">saniyeler</span> içinde bul
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/55">
            Yapay zekayla hazırlanmış, ilana uygun CV havuzunda ara ve filtrele. Adaylarla platform
            üzerinden güvenle iletişime geç.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {[
              { icon: Search, text: "Yetenek, konum ve dile göre filtrele" },
              { icon: ShieldCheck, text: "Adayların iletişim bilgisi KVKK ile korunur" },
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium text-ink/70">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-soft">
                  <f.icon className="h-4 w-4 text-violet" />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        {isSupabaseConfigured() ? (
          <HrAuthForm />
        ) : (
          <p className="rounded-2xl border border-amber/20 bg-amber/5 px-5 py-4 text-sm text-ink/70">
            İK paneli için Supabase yapılandırması gerekiyor (.env.local).
          </p>
        )}
      </div>
    </main>
  );
}
