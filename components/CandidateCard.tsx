import Link from "next/link";
import { MapPin, Clock, Languages, Briefcase } from "lucide-react";

export interface CandidateCardData {
  id: string;
  full_name: string | null;
  headline: string | null;
  location: string | null;
  skills_text: string | null;
  languages: string[];
  match_score: number;
  created_at: string;
  experience_count?: number | null;
}

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Bugün";
  if (days === 1) return "Dün";
  if (days < 30) return `${days} gün önce`;
  const months = Math.floor(days / 30);
  return `${months} ay önce`;
}

function initials(name: string | null): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function scoreColor(score: number): string {
  if (score >= 75) return "bg-mint-soft text-mint";
  if (score >= 50) return "bg-amber/10 text-amber";
  return "bg-rose/10 text-rose";
}

// Sahibinden tarzı ilan kartı: galeri düzeninde, başlık + konum + öne çıkan
// özellikler + belirgin "uyum" rozeti. Sunucu bileşeni (hover CSS ile).
export default function CandidateCard({ c, demo = false }: { c: CandidateCardData; demo?: boolean }) {
  const skills = (c.skills_text ?? "")
    .split(/[,•]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);

  const href = demo ? "#" : `/panel/aday/${c.id}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-card transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-violet/30 hover:shadow-card-lg"
    >
      {/* Üst şerit — avatar + isim + uyum rozeti */}
      <div className="relative flex items-start gap-3 bg-gradient-to-br from-violet-soft to-cream/40 px-5 pb-4 pt-5">
        <span className="gradient-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-bold text-white shadow-glow">
          {initials(c.full_name)}
        </span>
        <div className="min-w-0 flex-1 pr-14">
          <h3 className="truncate font-display text-lg font-bold leading-tight group-hover:text-violet">
            {c.full_name ?? "Aday"}
          </h3>
          {c.headline && (
            <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-violet">
              {c.headline}
            </p>
          )}
        </div>
        {/* Uyum rozeti — ilan fiyatı gibi sağ üstte vurgulu */}
        <div className="absolute right-4 top-4 text-right">
          <span
            className={`flex flex-col items-center rounded-xl px-2.5 py-1 font-display leading-none ${scoreColor(
              c.match_score,
            )}`}
          >
            <span className="text-lg font-bold">{c.match_score}</span>
            <span className="text-[9px] font-bold uppercase tracking-wide opacity-70">uyum</span>
          </span>
        </div>
      </div>

      {/* Gövde — konum, tarih, yetenekler, diller */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/50">
          {c.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {c.location}
            </span>
          )}
          {typeof c.experience_count === "number" && c.experience_count > 0 && (
            <span className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" /> {c.experience_count} deneyim
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {timeAgo(c.created_at)}
          </span>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s, i) => (
              <span
                key={i}
                className="rounded-full bg-violet-soft px-2.5 py-0.5 text-xs font-semibold text-violet"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {c.languages.length > 0 && (
          <p className="flex items-center gap-1.5 text-xs text-ink/55">
            <Languages className="h-3.5 w-3.5 text-ink/40" />
            {c.languages.join(" · ")}
          </p>
        )}
      </div>

      {/* Alt — ilan CTA'sı */}
      <div className="mt-auto border-t border-ink/5 px-5 py-3 text-sm font-bold text-violet">
        Profili incele
        <span className="ml-1 transition-transform group-hover:translate-x-0.5 inline-block">→</span>
      </div>
    </Link>
  );
}
