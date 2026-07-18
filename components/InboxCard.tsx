"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Building2, Mail, Check, X, Loader2, Clock } from "lucide-react";
import { respondToRequest } from "@/app/actions/inbox";

export interface RequestRow {
  id: string;
  recruiter_company: string | null;
  recruiter_contact: string;
  message: string;
  status: "sent" | "accepted" | "declined";
  created_at: string;
}

export default function InboxCard({ req }: { req: RequestRow }) {
  const [status, setStatus] = useState(req.status);
  const [pending, startTransition] = useTransition();

  const respond = (next: "accepted" | "declined") =>
    startTransition(async () => {
      const res = await respondToRequest(req.id, next);
      if ("ok" in res) setStatus(next);
    });

  const badge = {
    sent: { text: "Yeni", cls: "bg-violet-soft text-violet" },
    accepted: { text: "Kabul edildi", cls: "bg-mint-soft text-mint" },
    declined: { text: "Reddedildi", cls: "bg-ink/10 text-ink/50" },
  }[status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-ink/5 bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-display font-bold">
          <Building2 className="h-4 w-4 text-violet" />
          {req.recruiter_company || "Bir işveren"}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badge.cls}`}>
          {badge.text}
        </span>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/75">{req.message}</p>

      {status === "accepted" ? (
        <p className="mt-4 flex items-center gap-2 rounded-2xl border border-mint/30 bg-mint-soft px-4 py-3 text-sm font-semibold text-ink/75">
          <Mail className="h-4 w-4 text-mint" />
          İletişim: {req.recruiter_contact}
        </p>
      ) : status === "sent" ? (
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => respond("accepted")}
            disabled={pending}
            className="gradient-primary flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-glow disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Kabul et
          </button>
          <button
            onClick={() => respond("declined")}
            disabled={pending}
            className="flex items-center gap-1.5 rounded-xl border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/60 transition-colors hover:border-ink/30 disabled:opacity-50"
          >
            <X className="h-4 w-4" /> Reddet
          </button>
        </div>
      ) : null}

      <p className="mt-3 flex items-center gap-1 text-xs text-ink/40">
        <Clock className="h-3 w-3" />
        {new Date(req.created_at).toLocaleDateString("tr-TR")}
      </p>
    </motion.div>
  );
}
