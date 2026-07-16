"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Target, Lightbulb, Eye, RotateCcw, LayoutTemplate, Rocket } from "lucide-react";
import type { TailoredCV } from "@/lib/cv-schema";
import type { Dict, Lang } from "@/lib/i18n";
import type { TemplateId } from "./CVDocument";
import DownloadButton from "./DownloadButton";
import PublishDialog from "./PublishDialog";

interface Props {
  cv: TailoredCV;
  dict: Dict;
  lang: Lang;
  onReset: () => void;
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1500);
      setDisplay(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const r = 54;
  const circumference = 2 * Math.PI * r;
  const color = score >= 75 ? "#10B981" : score >= 50 ? "#F97316" : "#DB2777";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle cx="64" cy="64" r={r} fill="none" stroke="#E8E6EE" strokeOpacity="0.12" strokeWidth="11" />
          <motion.circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-4xl font-bold">
          {display}
        </div>
      </div>
      <span className="font-display text-sm font-bold text-ink/70">{label}</span>
    </div>
  );
}

/* Şablon seçim kartı — mini CSS mockup ile */
function TemplateCard({
  id,
  name,
  active,
  onSelect,
}: {
  id: TemplateId;
  name: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`group flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all ${
        active
          ? "border-violet bg-violet-soft shadow-glow"
          : "border-white/10 bg-white/[0.06] hover:border-violet/40"
      }`}
    >
      {/* Mini mockup */}
      <div className="h-24 w-[4.5rem] overflow-hidden rounded-md border border-ink/10 bg-white shadow-sm">
        {id === "modern" && (
          <div className="p-1.5">
            <div className="h-1.5 w-8 rounded-full bg-[#1e1b2e]/80" />
            <div className="mt-0.5 h-1 w-10 rounded-full bg-[#7c3aed]" />
            <div className="mt-1 h-px w-full bg-[#7c3aed]" />
            {[7, 10, 9, 10, 6].map((w, i) => (
              <div key={i} className="mt-1 h-0.5 rounded-full bg-[#1e1b2e]/20" style={{ width: `${w * 6}%` }} />
            ))}
            <div className="mt-1.5 h-1 w-6 rounded-full bg-[#7c3aed]/60" />
            {[9, 8].map((w, i) => (
              <div key={i} className="mt-1 h-0.5 rounded-full bg-[#1e1b2e]/20" style={{ width: `${w * 6}%` }} />
            ))}
          </div>
        )}
        {id === "classic" && (
          <div className="flex flex-col items-center p-1.5">
            <div className="h-1.5 w-9 rounded-full bg-[#1e1b2e]/80" />
            <div className="mt-0.5 h-0.5 w-11 rounded-full bg-[#1e1b2e]/30" />
            <div className="mt-1 h-px w-full bg-[#1e1b2e]/60" />
            {[10, 9, 10, 7].map((w, i) => (
              <div key={i} className="mt-1 h-0.5 self-start rounded-full bg-[#1e1b2e]/20" style={{ width: `${w * 6}%` }} />
            ))}
            <div className="mt-1 h-px w-full bg-[#1e1b2e]/30" />
            {[9, 8].map((w, i) => (
              <div key={i} className="mt-1 h-0.5 self-start rounded-full bg-[#1e1b2e]/20" style={{ width: `${w * 6}%` }} />
            ))}
          </div>
        )}
        {id === "sidebar" && (
          <div className="flex h-full">
            <div className="flex w-1/3 flex-col gap-1 bg-[#1e1b2e] p-1">
              <div className="h-1 w-full rounded-full bg-white/80" />
              <div className="h-0.5 w-3/4 rounded-full bg-mint" />
              <div className="mt-1 h-0.5 w-full rounded-full bg-white/30" />
              <div className="h-0.5 w-full rounded-full bg-white/30" />
              <div className="mt-1 h-0.5 w-3/4 rounded-full bg-mint/70" />
              <div className="h-0.5 w-full rounded-full bg-white/30" />
            </div>
            <div className="flex-1 p-1">
              {[10, 8, 10, 6, 9, 10, 7].map((w, i) => (
                <div key={i} className="mt-1 h-0.5 rounded-full bg-[#1e1b2e]/20" style={{ width: `${w * 9}%` }} />
              ))}
            </div>
          </div>
        )}
      </div>
      <span
        className={`text-xs font-bold ${active ? "text-violet" : "text-ink/60 group-hover:text-ink"}`}
      >
        {name}
      </span>
    </button>
  );
}

export default function ResultView({ cv, dict, lang, onReset }: Props) {
  const [template, setTemplate] = useState<TemplateId>("modern");
  const [showPublish, setShowPublish] = useState(false);

  const templates: { id: TemplateId; name: string }[] = [
    { id: "modern", name: dict.templateModern },
    { id: "classic", name: dict.templateClassic },
    { id: "sidebar", name: dict.templateSidebar },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-5xl px-6 pb-24"
    >
      <h2 className="mb-10 text-center font-display text-4xl font-bold tracking-tight sm:text-5xl">
        {dict.resultTitle} <span className="gradient-text">🎉</span>
      </h2>

      <div className="mb-8 grid gap-6 md:grid-cols-[auto_1fr]">
        {/* Skor kartı */}
        <div className="flex flex-col items-center justify-center rounded-3xl border border-ink/5 bg-white/[0.06] p-8 shadow-card">
          <ScoreRing score={cv.match.score} label={dict.matchScore} />
        </div>

        {/* Anahtar kelimeler + öneriler */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-ink/5 bg-white/[0.06] p-6 shadow-card">
            <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-soft">
                <Target className="h-4 w-4 text-violet" />
              </span>
              {dict.matchedKeywords}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cv.match.matchedKeywords.map((kw, i) => (
                <motion.span
                  key={kw}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.06, type: "spring", stiffness: 300 }}
                  className="rounded-full bg-violet-soft px-3 py-1 text-sm font-semibold text-violet"
                >
                  {kw}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-ink/5 bg-white/[0.06] p-6 shadow-card">
            <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber/10">
                <Lightbulb className="h-4 w-4 text-amber" />
              </span>
              {dict.improvements}
            </h3>
            <ul className="flex flex-col gap-2">
              {cv.match.improvements.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink/75">
                  <span className="font-bold text-amber">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Şablon seçimi + aksiyonlar */}
      <div className="mb-10 rounded-3xl border border-ink/5 bg-white/[0.06] p-6 shadow-card sm:p-8">
        <h3 className="mb-4 flex items-center gap-2 font-display text-base font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-soft">
            <LayoutTemplate className="h-4 w-4 text-violet" />
          </span>
          {dict.templateLabel}
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex gap-3">
            {templates.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                id={tpl.id}
                name={tpl.name}
                active={template === tpl.id}
                onSelect={() => setTemplate(tpl.id)}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DownloadButton cv={cv} dict={dict} template={template} />
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReset}
              className="flex items-center gap-2 rounded-xl border border-ink/15 bg-white/[0.06] px-6 py-3.5 font-display text-base font-bold text-ink/70 transition-colors hover:border-ink/30 hover:text-ink"
            >
              <RotateCcw className="h-4 w-4" />
              {dict.startOver}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Panelde yayınla CTA — yalnızca Supabase yapılandırılmışsa */}
      {process.env.NEXT_PUBLIC_SUPABASE_URL && (
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setShowPublish(true)}
          className="mb-10 flex w-full items-center justify-center gap-2.5 rounded-3xl border-2 border-violet/30 bg-violet-soft px-6 py-5 font-display text-lg font-bold text-violet transition-colors hover:border-violet hover:bg-violet/10"
        >
          <Rocket className="h-5 w-5" />
          {dict.publishCta}
        </motion.button>
      )}

      {/* CV önizleme */}
      <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
        <Eye className="h-5 w-5 text-violet" />
        {dict.preview}
      </h3>
      <div className="rounded-3xl border border-ink/5 bg-white/[0.06] p-8 shadow-card sm:p-12">
        <h4 className="font-display text-3xl font-bold tracking-tight">{cv.fullName}</h4>
        <p className="mt-1 font-semibold text-violet">{cv.headline}</p>
        <p className="mt-1.5 text-sm text-ink/55">
          {[cv.contact.email, cv.contact.phone, cv.contact.location]
            .filter(Boolean)
            .join("  •  ")}
        </p>
        <hr className="my-6 border-t border-ink/10" />

        <Section title={dict.summaryTitle}>
          <p className="text-sm leading-relaxed text-ink/80">{cv.summary}</p>
        </Section>

        <Section title={dict.experience}>
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

        <Section title={dict.skills}>
          {cv.skills.map((g, i) => (
            <p key={i} className="text-sm leading-relaxed">
              <span className="font-bold">{g.category}:</span>{" "}
              <span className="text-ink/65">{g.items.join(" • ")}</span>
            </p>
          ))}
        </Section>

        <Section title={dict.education}>
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

        {cv.languages.length > 0 && (
          <Section title={dict.langs}>
            <p className="text-sm text-ink/80">
              {cv.languages.map((l) => `${l.language} (${l.level})`).join("  •  ")}
            </p>
          </Section>
        )}

        {cv.certifications.length > 0 && (
          <Section title={dict.certs}>
            <ul className="flex flex-col gap-1 text-sm text-ink/80">
              {cv.certifications.map((c, i) => (
                <li key={i}>• {c}</li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      <AnimatePresence>
        {showPublish && (
          <PublishDialog cv={cv} lang={lang} onClose={() => setShowPublish(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h5 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-violet">
        {title}
      </h5>
      {children}
    </div>
  );
}
