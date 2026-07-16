"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { X, ShieldCheck, Mail, KeyRound, Loader2, PartyPopper } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { publishCV } from "@/app/actions/publish";
import { legal } from "@/lib/legal";
import type { Lang } from "@/lib/i18n";
import type { TailoredCV } from "@/lib/cv-schema";

type Step = "consent" | "email" | "code" | "publishing" | "done";

interface Props {
  cv: TailoredCV;
  lang: Lang;
  onClose: () => void;
}

export default function PublishDialog({ cv, lang, onClose }: Props) {
  const L = legal[lang];
  const supabase = createClient();

  const [step, setStep] = useState<Step>("consent");
  const [consent, setConsent] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const published = useRef(false);

  const doPublish = async () => {
    if (published.current) return;
    published.current = true;
    setError(null);
    setStep("publishing");
    const res = await publishCV(cv, true);
    if ("id" in res) {
      setStep("done");
    } else {
      published.current = false;
      setError(L.errGeneric);
      setStep("code");
    }
  };

  // Maildeki bağlantı başka sekmede oturum açar; oturum tarayıcıda ortak
  // olduğundan bu sekme SIGNED_IN olayını yakalayıp yayına otomatik devam eder.
  useEffect(() => {
    if (step !== "code") return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") void doPublish();
    });
    const interval = setInterval(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) void doPublish();
    }, 2000);
    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Rıza sonrası: zaten giriş yapılmışsa doğrudan yayınla, değilse e-posta iste.
  const afterConsent = async () => {
    if (!consent) {
      setError(L.errConsent);
      return;
    }
    setError(null);
    setBusy(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setBusy(false);
    if (user) {
      await doPublish();
    } else {
      setStep("email");
    }
  };

  const sendCode = async () => {
    setError(null);
    setBusy(true);
    const { error: authErr } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/hesabim`,
        data: { role: "candidate", full_name: cv.fullName },
      },
    });
    setBusy(false);
    if (authErr) {
      setError(L.errAuth);
      return;
    }
    setStep("code");
  };

  const verifyAndPublish = async () => {
    setError(null);
    setBusy(true);
    const { error: vErr } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "email",
    });
    setBusy(false);
    if (vErr) {
      setError(L.errCode);
      return;
    }
    await doPublish();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#16121f] p-7 shadow-card-lg sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
          aria-label={L.cancelBtn}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex items-center gap-2.5">
          <span className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl shadow-glow">
            <ShieldCheck className="h-5 w-5 text-white" />
          </span>
          <h3 className="font-display text-xl font-bold tracking-tight">{L.publishTitle}</h3>
        </div>

        <AnimatePresence mode="wait">
          {step === "consent" && (
            <motion.div
              key="consent"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
            >
              <p className="text-sm leading-relaxed text-ink/70">{L.publishIntro}</p>

              <div className="mt-4 rounded-2xl border border-ink/10 bg-cream/50 p-4">
                <h4 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-violet">
                  {L.clarificationTitle}
                </h4>
                <ul className="flex flex-col gap-2">
                  {L.clarification.map((c, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed text-ink/65">
                      <span className="text-violet">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-ink/10 p-3.5 transition-colors hover:border-violet/40">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-violet"
                />
                <span className="text-sm font-medium leading-relaxed text-ink/80">
                  {L.consentLabel}
                </span>
              </label>

              {error && <p className="mt-3 text-sm font-semibold text-rose">{error}</p>}

              <button
                onClick={afterConsent}
                disabled={busy}
                className="gradient-primary mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-display text-base font-bold text-white shadow-glow transition-all disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                {L.continueBtn}
              </button>
            </motion.div>
          )}

          {step === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
            >
              <p className="text-sm leading-relaxed text-ink/70">{L.rightsNote}</p>
              <label className="mb-1.5 mt-4 flex items-center gap-1.5 text-sm font-semibold text-ink/70">
                <Mail className="h-4 w-4 text-violet" />
                {L.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={L.emailPlaceholder}
                className="w-full rounded-2xl border border-ink/10 bg-cream/60 px-4 py-3 text-sm outline-none transition-colors focus:border-violet/40 focus:bg-white/[0.06]"
              />
              {error && <p className="mt-3 text-sm font-semibold text-rose">{error}</p>}
              <button
                onClick={sendCode}
                disabled={busy || !email.includes("@")}
                className="gradient-primary mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-display text-base font-bold text-white shadow-glow transition-all disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                {L.sendCodeBtn}
              </button>
            </motion.div>
          )}

          {step === "code" && (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
            >
              <p className="text-sm leading-relaxed text-ink/70">{L.codeSentNote}</p>
              <label className="mb-1.5 mt-4 flex items-center gap-1.5 text-sm font-semibold text-ink/70">
                <KeyRound className="h-4 w-4 text-violet" />
                {L.codeLabel}
              </label>
              <input
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder={L.codePlaceholder}
                className="w-full rounded-2xl border border-ink/10 bg-cream/60 px-4 py-3 text-center text-lg font-bold tracking-[0.5em] outline-none transition-colors focus:border-violet/40 focus:bg-white/[0.06]"
              />
              {error && <p className="mt-3 text-sm font-semibold text-rose">{error}</p>}
              <button
                onClick={verifyAndPublish}
                disabled={busy || code.length < 6}
                className="gradient-primary mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-display text-base font-bold text-white shadow-glow transition-all disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                {L.verifyPublishBtn}
              </button>
            </motion.div>
          )}

          {step === "publishing" && (
            <motion.div
              key="publishing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 py-10"
            >
              <Loader2 className="h-10 w-10 animate-spin text-violet" />
              <p className="font-display font-semibold text-ink/70">{L.publishingLabel}</p>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-6 text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mint-soft">
                <PartyPopper className="h-8 w-8 text-mint" />
              </span>
              <h4 className="font-display text-xl font-bold">{L.successTitle}</h4>
              <p className="max-w-sm text-sm leading-relaxed text-ink/65">{L.successBody}</p>
              <Link
                href="/hesabim"
                className="gradient-primary mt-2 rounded-2xl px-6 py-3 font-display text-base font-bold text-white shadow-glow"
              >
                {L.goToAccountBtn}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
