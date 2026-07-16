"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Sparkles, Wand2, PenLine, Globe } from "lucide-react";
import { t, type Lang } from "@/lib/i18n";
import type { TailoredCV } from "@/lib/cv-schema";
import { DEMO_CV } from "@/lib/demo-cv";
import UploadZone from "@/components/UploadZone";
import JobInput from "@/components/JobInput";
import GenerationOverlay from "@/components/GenerationOverlay";
import ResultView from "@/components/ResultView";

type Phase = "form" | "generating" | "result";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("tr");
  const dict = t[lang];

  const [phase, setPhase] = useState<Phase>("form");
  const [file, setFile] = useState<File | null>(null);
  const [jobMode, setJobMode] = useState<"url" | "text">("url");
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [outputLang, setOutputLang] = useState<"auto" | "tr" | "en">("auto");
  const [streamedChars, setStreamedChars] = useState(0);
  const [cv, setCv] = useState<TailoredCV | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cvready-lang");
    if (saved === "en" || saved === "tr") setLang(saved);
    setDemoMode(new URLSearchParams(window.location.search).has("demo"));
  }, []);

  const switchLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("cvready-lang", l);
  };

  const canGenerate =
    demoMode ||
    (!!file &&
      (jobMode === "url" ? jobUrl.trim().startsWith("http") : jobText.trim().length > 100));

  const generate = useCallback(async () => {
    if (!file && !demoMode) return;
    setError(null);
    setStreamedChars(0);
    setPhase("generating");

    // Demo modu (?demo=1): API harcamadan animasyonu + sonucu göster
    if (demoMode) {
      for (let chars = 0; chars <= 7000; chars += 350) {
        setStreamedChars(chars);
        await new Promise((r) => setTimeout(r, 400));
      }
      setCv(DEMO_CV);
      setPhase("result");
      return;
    }

    try {
      // Demo modu yukarıda döndüğü için burada file kesin dolu
      const cvBase64 = await fileToBase64(file!);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvBase64,
          jobUrl: jobMode === "url" ? jobUrl.trim() : undefined,
          jobText: jobMode === "text" ? jobText.trim() : undefined,
          extraNotes: extraNotes.trim() || undefined,
          outputLang,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "fetch_failed") {
          setError(dict.errorFetch);
          setJobMode("text");
        } else if (data.error === "no_api_key") {
          setError(dict.errorNoKey);
        } else {
          setError(dict.errorGeneric);
        }
        setPhase("form");
        return;
      }

      // NDJSON akışını satır satır işle
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let result: TailoredCV | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line);
          if (event.type === "progress") setStreamedChars(event.chars);
          else if (event.type === "complete") result = event.cv;
        }
      }

      if (result) {
        setCv(result);
        setPhase("result");
      } else {
        setError(dict.errorGeneric);
        setPhase("form");
      }
    } catch {
      setError(dict.errorGeneric);
      setPhase("form");
    }
  }, [file, demoMode, jobMode, jobUrl, jobText, extraNotes, outputLang, dict]);

  const reset = () => {
    setCv(null);
    setFile(null);
    setJobUrl("");
    setJobText("");
    setExtraNotes("");
    setError(null);
    setPhase("form");
  };

  return (
    <main className="min-h-screen dotted-bg">
      {/* Dil değiştirici (global header markanın altında) */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-end px-6 pt-5">
        <div className="flex items-center gap-0.5 rounded-full border border-ink/10 bg-white/[0.06] p-1 shadow-card">
          {(["tr", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              className={`rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wide transition-colors ${
                lang === l ? "bg-ink text-white" : "text-ink/50 hover:text-ink"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "result" && cv ? (
          <ResultView key="result" cv={cv} dict={dict} lang={lang} onReset={reset} />
        ) : (
          <motion.div
            key="form"
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto w-full max-w-3xl px-6 pb-24"
          >
            {/* Hero */}
            <div className="py-10 text-center sm:py-14">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-violet/20 bg-violet-soft px-4 py-1.5 text-sm font-semibold text-violet"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {dict.tagline}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl"
              >
                {dict.heroA} <span className="gradient-text">{dict.heroB}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink/55"
              >
                {dict.heroSub}
              </motion.p>
            </div>

            {/* Form kartı */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="flex flex-col gap-9 rounded-3xl border border-ink/5 bg-white/[0.06] p-6 shadow-card-lg sm:p-10"
            >
              <StepBlock num={1} title={dict.step1}>
                <UploadZone dict={dict} file={file} onFile={setFile} />
              </StepBlock>

              <StepBlock num={2} title={dict.step2}>
                <JobInput
                  dict={dict}
                  mode={jobMode}
                  onModeChange={setJobMode}
                  jobUrl={jobUrl}
                  onJobUrl={setJobUrl}
                  jobText={jobText}
                  onJobText={setJobText}
                />
              </StepBlock>

              <StepBlock num={3} title={dict.step3}>
                <div className="flex flex-col gap-5">
                  {/* Ek notlar */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink/70">
                      <PenLine className="h-4 w-4 text-violet" />
                      {dict.extraLabel}
                    </label>
                    <textarea
                      value={extraNotes}
                      onChange={(e) => setExtraNotes(e.target.value)}
                      placeholder={dict.extraPlaceholder}
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-ink/10 bg-cream/60 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-ink/30 focus:border-violet/40 focus:bg-white/[0.06]"
                    />
                    <p className="mt-1 text-xs text-ink/40">{dict.extraHint}</p>
                  </div>

                  {/* Dil seçimi */}
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-ink/70">
                      <Globe className="h-4 w-4 text-violet" />
                      {dict.outputLang}
                    </span>
                    <div className="flex gap-0.5 rounded-full border border-ink/10 bg-white/[0.06] p-1">
                      {(["auto", "tr", "en"] as const).map((l) => (
                        <button
                          key={l}
                          onClick={() => setOutputLang(l)}
                          className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                            outputLang === l ? "bg-ink text-white" : "text-ink/50 hover:text-ink"
                          }`}
                        >
                          {l === "auto" ? dict.outputAuto : l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={canGenerate ? { y: -2 } : {}}
                    whileTap={canGenerate ? { scale: 0.99 } : {}}
                    disabled={!canGenerate}
                    onClick={generate}
                    className="gradient-primary flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 font-display text-lg font-bold text-white shadow-glow transition-all disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
                  >
                    <Wand2 className="h-5 w-5" />
                    {dict.generate}
                  </motion.button>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-2xl border border-rose/20 bg-rose/5 px-4 py-3 text-center text-sm font-semibold text-rose"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
              </StepBlock>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "generating" && (
          <GenerationOverlay dict={dict} streamedChars={streamedChars} />
        )}
      </AnimatePresence>
    </main>
  );
}

function StepBlock({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg font-display text-sm font-bold text-white">
          {num}
        </span>
        <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  );
}
