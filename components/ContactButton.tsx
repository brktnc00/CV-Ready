"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquarePlus, X, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { sendContactRequest } from "@/app/actions/recruiter";

export default function ContactButton({ cvId, candidateName }: { cvId: string; candidateName: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setBusy(true);
    const res = await sendContactRequest(cvId, message, contact);
    setBusy(false);
    if ("ok" in res) setDone(true);
    else setError("Talep gönderilemedi. Lütfen tekrar dene.");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="gradient-primary flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-display text-base font-bold text-white shadow-glow"
      >
        <MessageSquarePlus className="h-5 w-5" />
        İletişime geç
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl border border-ink/5 bg-white/[0.06] p-7 shadow-card-lg"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-ink/40 hover:bg-ink/5 hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>

              {done ? (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <CheckCircle2 className="h-12 w-12 text-mint" />
                  <h4 className="font-display text-xl font-bold">Talep gönderildi</h4>
                  <p className="text-sm text-ink/60">
                    {candidateName} talebini gelen kutusunda görecek. İlgilenirse senin bıraktığın
                    bilgiden ulaşacak.
                  </p>
                </div>
              ) : (
                <>
                  <h4 className="mb-1 font-display text-xl font-bold">{candidateName} ile iletişim</h4>
                  <p className="mb-4 flex items-center gap-1.5 text-xs text-ink/50">
                    <ShieldCheck className="h-3.5 w-3.5 text-violet" />
                    Adayın iletişim bilgisi gizli; talebin ona platform üzerinden ulaşır.
                  </p>

                  <label className="mb-1 block text-sm font-semibold text-ink/70">Mesajın</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Merhaba, açık pozisyonumuz için profilini beğendik..."
                    className="input-base resize-none"
                  />

                  <label className="mb-1 mt-3 block text-sm font-semibold text-ink/70">
                    Sana nasıl dönsün? (e-posta / telefon)
                  </label>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="ik@sirket.com"
                    className="input-base"
                  />

                  {error && <p className="mt-3 text-sm font-semibold text-rose">{error}</p>}

                  <button
                    onClick={submit}
                    disabled={busy || !message.trim() || !contact.trim()}
                    className="gradient-primary mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-display text-base font-bold text-white shadow-glow disabled:opacity-50"
                  >
                    {busy && <Loader2 className="h-5 w-5 animate-spin" />}
                    Talebi gönder
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
