"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function HrAuthForm() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "login") {
        const { error: e } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (e) {
          setError("Giriş başarısız. E-posta veya şifre hatalı.");
          return;
        }
        router.push("/hr/panel");
        router.refresh();
      } else {
        const { data, error: e } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { role: "recruiter", full_name: fullName.trim(), company_name: company.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/hr/panel`,
          },
        });
        if (e) {
          setError("Kayıt başarısız. " + e.message);
          return;
        }
        // E-posta doğrulaması kapalıysa oturum döner → panele geç.
        if (data.session) {
          router.push("/hr/panel");
          router.refresh();
        } else {
          setInfo("Hesabını doğrulamak için e-postana gönderdiğimiz bağlantıya tıkla.");
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-3xl border border-ink/5 bg-white p-7 shadow-card-lg sm:p-8">
      <div className="mb-6 flex gap-1 rounded-full border border-ink/10 bg-cream/60 p-1">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              mode === m ? "gradient-primary text-white shadow-glow" : "text-ink/50 hover:text-ink"
            }`}
          >
            {m === "login" ? "Giriş yap" : "Kayıt ol"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {mode === "signup" && (
          <>
            <Field icon={<User className="h-4 w-4 text-violet" />} label="Ad soyad">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-base"
                placeholder="Ad Soyad"
              />
            </Field>
            <Field icon={<Building2 className="h-4 w-4 text-violet" />} label="Şirket">
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="input-base"
                placeholder="Şirket adı"
              />
            </Field>
          </>
        )}
        <Field icon={<Mail className="h-4 w-4 text-violet" />} label="E-posta">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base"
            placeholder="ik@sirket.com"
          />
        </Field>
        <Field icon={<Lock className="h-4 w-4 text-violet" />} label="Şifre">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-base"
            placeholder="••••••••"
          />
        </Field>
      </div>

      {error && <p className="mt-3 text-sm font-semibold text-rose">{error}</p>}
      {info && (
        <p className="mt-3 rounded-2xl border border-mint/30 bg-mint-soft px-4 py-3 text-sm font-medium text-ink/70">
          {info}
        </p>
      )}

      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={submit}
        disabled={busy || !email.includes("@") || password.length < 6}
        className="gradient-primary mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-display text-base font-bold text-white shadow-glow transition-all disabled:opacity-50"
      >
        {busy && <Loader2 className="h-5 w-5 animate-spin" />}
        {mode === "login" ? "Giriş yap" : "Hesap oluştur"}
      </motion.button>
    </div>
  );
}

function Field({
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
      <span className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-ink/70">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
