import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, MapPin, Target } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import ContactButton from "@/components/ContactButton";
import type { TailoredCV } from "@/lib/cv-schema";

export const dynamic = "force-dynamic";

type PublicData = Omit<TailoredCV, "contact">;

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isSupabaseConfigured()) redirect("/isverenler");
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/isverenler");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, company_name")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "recruiter") redirect("/isverenler");

  const { data: row } = await supabase
    .from("published_cvs")
    .select("id, full_name, public_data, location, match_score, status")
    .eq("id", id)
    .single();

  if (!row || row.status !== "published") notFound();

  const cv = row.public_data as PublicData;

  return (
    <main className="min-h-screen dotted-bg">
      <div className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8">
        <Link
          href="/panel"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/50 transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Aday havuzuna dön
        </Link>

        <div className="rounded-3xl border border-ink/5 bg-white/[0.06] p-8 shadow-card-lg sm:p-10">
          {/* Başlık */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">{cv.fullName}</h1>
              <p className="mt-1 font-semibold text-violet">{cv.headline}</p>
              {row.location && (
                <p className="mt-1.5 flex items-center gap-1 text-sm text-ink/50">
                  <MapPin className="h-3.5 w-3.5" /> {row.location}
                </p>
              )}
            </div>
            <span className="flex flex-col items-center rounded-2xl bg-mint-soft px-4 py-2 font-display leading-none text-mint">
              <span className="text-2xl font-bold">{row.match_score}</span>
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">uyum</span>
            </span>
          </div>

          <div className="mt-6">
            <ContactButton cvId={row.id} candidateName={cv.fullName} />
          </div>

          <hr className="my-8 border-t border-ink/10" />

          {/* Özet */}
          {cv.summary && (
            <Section title="Özet">
              <p className="text-sm leading-relaxed text-ink/80">{cv.summary}</p>
            </Section>
          )}

          {/* Deneyim */}
          {cv.experience?.length > 0 && (
            <Section title="Deneyim">
              {cv.experience.map((exp, i) => (
                <div key={i} className="mb-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-bold">
                      {exp.role} <span className="font-medium text-violet">· {exp.company}</span>
                    </span>
                    <span className="text-xs text-ink/45">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2 text-sm leading-relaxed text-ink/80">
                        <span className="text-violet">›</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Section>
          )}

          {/* Yetenekler */}
          {cv.skills?.length > 0 && (
            <Section title="Yetenekler">
              {cv.skills.map((g, i) => (
                <p key={i} className="text-sm leading-relaxed">
                  <span className="font-bold">{g.category}:</span>{" "}
                  <span className="text-ink/65">{g.items.join(" • ")}</span>
                </p>
              ))}
            </Section>
          )}

          {/* Eğitim */}
          {cv.education?.length > 0 && (
            <Section title="Eğitim">
              {cv.education.map((edu, i) => (
                <div key={i} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span>
                    <span className="font-bold">{edu.degree}</span>{" "}
                    <span className="text-ink/55">· {edu.institution}</span>
                  </span>
                  <span className="text-xs text-ink/45">{edu.dates}</span>
                </div>
              ))}
            </Section>
          )}

          {/* Diller */}
          {cv.languages?.length > 0 && (
            <Section title="Diller">
              <p className="text-sm text-ink/80">
                {cv.languages.map((l) => `${l.language} (${l.level})`).join("  •  ")}
              </p>
            </Section>
          )}

          {/* Sertifikalar */}
          {cv.certifications?.length > 0 && (
            <Section title="Sertifikalar">
              <ul className="flex flex-col gap-1 text-sm text-ink/80">
                {cv.certifications.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Eşleşen anahtar kelimeler */}
          {cv.match?.matchedKeywords?.length > 0 && (
            <Section title="Öne çıkan yetkinlikler">
              <div className="flex flex-wrap gap-2">
                {cv.match.matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 rounded-full bg-violet-soft px-3 py-1 text-sm font-semibold text-violet"
                  >
                    <Target className="h-3 w-3" /> {kw}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-violet">
        {title}
      </h2>
      {children}
    </div>
  );
}
