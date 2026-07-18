"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Trash2, Loader2, MapPin } from "lucide-react";
import { withdrawCV, republishCV, deleteCV } from "@/app/actions/publish";
import type { PublishedRow } from "@/app/hesabim/page";

export default function AccountCvCard({ row }: { row: PublishedRow }) {
  const [status, setStatus] = useState(row.status);
  const [deleted, setDeleted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (deleted) return null;

  const toggle = () =>
    startTransition(async () => {
      if (status === "published") {
        const res = await withdrawCV(row.id);
        if ("ok" in res) setStatus("withdrawn");
      } else {
        const res = await republishCV(row.id);
        if ("ok" in res) setStatus("published");
      }
    });

  const remove = () =>
    startTransition(async () => {
      const res = await deleteCV(row.id);
      if ("ok" in res) setDeleted(true);
    });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-ink/5 bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-display text-lg font-bold">{row.full_name ?? "CV"}</h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                status === "published"
                  ? "bg-mint-soft text-mint"
                  : "bg-ink/10 text-ink/50"
              }`}
            >
              {status === "published" ? "Yayında" : "Yayında değil"}
            </span>
          </div>
          {row.headline && <p className="mt-0.5 text-sm font-semibold text-violet">{row.headline}</p>}
          <p className="mt-1 flex items-center gap-3 text-xs text-ink/45">
            {row.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {row.location}
              </span>
            )}
            <span>Eşleşme: {row.match_score}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            disabled={pending}
            className="flex items-center gap-1.5 rounded-xl border border-ink/15 px-3.5 py-2 text-sm font-semibold text-ink/70 transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status === "published" ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {status === "published" ? "Yayından kaldır" : "Tekrar yayınla"}
          </button>

          {confirming ? (
            <button
              onClick={remove}
              disabled={pending}
              className="flex items-center gap-1.5 rounded-xl bg-rose px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-rose/90 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" /> Emin misin?
            </button>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="flex items-center gap-1.5 rounded-xl border border-rose/30 px-3.5 py-2 text-sm font-semibold text-rose transition-colors hover:bg-rose/5"
            >
              <Trash2 className="h-4 w-4" /> Sil
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
