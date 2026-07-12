import Link from "next/link";
import { redirect } from "next/navigation";
import { Search, MapPin, Languages, SlidersHorizontal, Frown } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import HrHeader from "@/components/HrHeader";
import CandidateCard, { type CandidateCardData } from "@/components/CandidateCard";
import { DEMO_CANDIDATES } from "@/lib/demo-candidates";

export const dynamic = "force-dynamic";

// PostgREST .or() virgül/parantezle ayrıştırdığı için kullanıcı girdisini sadeleştir.
function sanitize(v: string) {
  return v.replace(/[,()]/g, " ").trim();
}

interface SP {
  q?: string;
  location?: string;
  lang?: string;
  minScore?: string;
  demo?: string;
}

export default async function PanelPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const demo = sp.demo === "1";

  let candidates: CandidateCardData[] = [];
  let company: string | null = null;

  if (demo) {
    // Supabase olmadan tasarımı görmek için örnek adaylar.
    company = "Demo Şirket";
    const q = sanitize(sp.q ?? "").toLowerCase();
    const location = sanitize(sp.location ?? "").toLowerCase();
    const lang = sanitize(sp.lang ?? "").toLowerCase();
    const minScore = Number(sp.minScore) || 0;
    candidates = DEMO_CANDIDATES.filter((c) => {
      if (q && !`${c.headline} ${c.skills_text}`.toLowerCase().includes(q)) return false;
      if (location && !(c.location ?? "").toLowerCase().includes(location)) return false;
      if (lang && !c.languages.join(" ").toLowerCase().includes(lang)) return false;
      if (minScore && c.match_score < minScore) return false;
      return true;
    });
  } else {
    if (!isSupabaseConfigured()) redirect("/hr");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/hr");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, company_name")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "recruiter") redirect("/hr");
    company = profile?.company_name ?? null;

    const q = sanitize(sp.q ?? "");
    const location = sanitize(sp.location ?? "");
    const lang = sanitize(sp.lang ?? "");
    const minScore = Number(sp.minScore) || 0;

    let query = supabase
      .from("published_cvs")
      .select("id, full_name, headline, location, skills_text, languages, match_score, created_at")
      .eq("status", "published")
      .order("match_score", { ascending: false })
      .limit(50);

    if (q) query = query.or(`headline.ilike.%${q}%,skills_text.ilike.%${q}%`);
    if (location) query = query.ilike("location", `%${location}%`);
    if (lang) query = query.contains("languages", [lang]);
    if (minScore > 0) query = query.gte("match_score", minScore);

    const { data } = await query;
    candidates = (data ?? []) as CandidateCardData[];
  }

  return (
    <main className="min-h-screen dotted-bg">
      {demo ? (
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <Link href="/" className="font-display text-xl font-bold">
            CV<span className="gradient-text">Ready</span> <span className="text-ink/40">İK</span>
          </Link>
          <span className="rounded-full bg-amber/10 px-3 py-1 text-xs font-bold text-amber">
            DEMO GÖRÜNÜM
          </span>
        </header>
      ) : (
        <HrHeader company={company} />
      )}

      <div className="mx-auto w-full max-w-6xl px-6 pb-24">
        <h1 className="mb-1 font-display text-3xl font-bold tracking-tight">Aday havuzu</h1>
        <p className="mb-6 text-ink/55">{candidates.length} aday listeleniyor</p>

        {/* Filtreler — sunucu tarafı GET formu */}
        <form className="mb-8 grid gap-3 rounded-3xl border border-ink/5 bg-white p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4">
          {demo && <input type="hidden" name="demo" value="1" />}
          <FilterField icon={<Search className="h-3.5 w-3.5 text-violet" />} label="Yetenek / unvan">
            <input name="q" defaultValue={sp.q ?? ""} placeholder="React, ürün müdürü..." className="input-base" />
          </FilterField>
          <FilterField icon={<MapPin className="h-3.5 w-3.5 text-violet" />} label="Konum">
            <input name="location" defaultValue={sp.location ?? ""} placeholder="İstanbul" className="input-base" />
          </FilterField>
          <FilterField icon={<Languages className="h-3.5 w-3.5 text-violet" />} label="Dil">
            <input name="lang" defaultValue={sp.lang ?? ""} placeholder="İngilizce" className="input-base" />
          </FilterField>
          <FilterField
            icon={<SlidersHorizontal className="h-3.5 w-3.5 text-violet" />}
            label="Min. uyum"
          >
            <div className="flex gap-2">
              <input
                name="minScore"
                type="number"
                min={0}
                max={100}
                defaultValue={sp.minScore ?? ""}
                placeholder="0"
                className="input-base"
              />
              <button className="gradient-primary shrink-0 rounded-2xl px-5 font-display text-sm font-bold text-white shadow-glow">
                Filtrele
              </button>
            </div>
          </FilterField>
        </form>

        {candidates.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-ink/5 bg-white py-16 text-center shadow-card">
            <Frown className="h-10 w-10 text-ink/30" />
            <p className="font-semibold text-ink/60">Bu filtrelerle aday bulunamadı.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((c) => (
              <CandidateCard key={c.id} c={c} demo={demo} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function FilterField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink/50">
        {icon} {label}
      </span>
      {children}
    </label>
  );
}
