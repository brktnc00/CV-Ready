"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Search,
  Target,
  PenLine,
  Sparkles,
  Check,
  Loader2,
  Info,
} from "lucide-react";
import type { Dict } from "@/lib/i18n";

interface Props {
  dict: Dict;
  /** Akıştan gelen karakter sayısı — ilerlemeyi gerçek veriye bağlar */
  streamedChars: number;
}

const STAGE_ICONS = [FileText, Search, Target, PenLine, Sparkles];

// Arka planda süzülen yumuşak renk lekeleri
const BLOBS = [
  { color: "rgba(124,58,237,0.14)", size: 380, left: "8%", top: "12%", duration: 11 },
  { color: "rgba(219,39,119,0.10)", size: 300, left: "68%", top: "8%", duration: 13 },
  { color: "rgba(249,115,22,0.10)", size: 340, left: "58%", top: "62%", duration: 12 },
  { color: "rgba(16,185,129,0.10)", size: 260, left: "12%", top: "64%", duration: 14 },
];

export default function GenerationOverlay({ dict, streamedChars }: Props) {
  const stages = useMemo(
    () => [dict.stageRead, dict.stageAnalyze, dict.stageMatch, dict.stageWrite, dict.stagePolish],
    [dict],
  );

  // İlerleme: ilk %25 zamana, kalanı gerçek akışa bağlı
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 0.1), 100);
    return () => clearInterval(id);
  }, []);

  const timeProgress = Math.min(25, elapsed * 2.5);
  const streamProgress = Math.min(72, (streamedChars / 7000) * 72);
  const progress = Math.min(97, timeProgress + streamProgress);
  const activeStage = Math.min(stages.length - 1, Math.floor((progress / 100) * stages.length));

  // Bilgi rotasyonu
  const [factIndex, setFactIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFactIndex((i) => (i + 1) % dict.funFacts.length), 4500);
    return () => clearInterval(id);
  }, [dict.funFacts.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-cream dotted-bg"
    >
      {/* Yumuşak renk leke animasyonları */}
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            top: b.top,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
          }}
          animate={{ x: [0, 30, -20, 0], y: [0, -24, 18, 0], scale: [1, 1.12, 0.94, 1] }}
          transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Merkez: dönen gradyan halka + belge ikonu */}
      <div className="relative mb-12 flex h-48 w-48 items-center justify-center">
        {/* Gradyan halka */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #7C3AED, #DB2777, #F97316, #10B981, #0EA5E9, #7C3AED)",
            WebkitMask: "radial-gradient(circle, transparent 62%, black 65%)",
            mask: "radial-gradient(circle, transparent 62%, black 65%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
        {/* İkinci, zıt yönde ince halka */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-dashed border-violet/25"
          animate={{ rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />
        {/* Nefes alan merkez rozet */}
        <motion.div
          className="gradient-primary flex h-24 w-24 items-center justify-center rounded-3xl shadow-glow"
          animate={{ scale: [1, 1.07, 1], rotate: [-2, 2, -2] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <FileText className="h-11 w-11 text-white" />
        </motion.div>
      </div>

      {/* Aşama listesi */}
      <div className="mb-8 flex flex-col gap-2.5">
        {stages.map((stage, i) => {
          const Icon = STAGE_ICONS[i];
          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: i <= activeStage ? 1 : 0.35, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className="flex items-center gap-3 font-display text-base font-semibold"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                  i < activeStage
                    ? "bg-mint text-white"
                    : i === activeStage
                      ? "gradient-primary text-white"
                      : "border border-ink/10 bg-white text-ink/40"
                }`}
              >
                {i < activeStage ? (
                  <Check className="h-4 w-4" />
                ) : i === activeStage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </span>
              {stage}
            </motion.div>
          );
        })}
      </div>

      {/* İlerleme çubuğu */}
      <div className="mb-10 h-2.5 w-80 max-w-[85vw] overflow-hidden rounded-full bg-ink/10">
        <motion.div
          className="gradient-primary h-full rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      </div>

      {/* Bilgi kartı */}
      <div className="h-10 px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink/60 shadow-card"
          >
            <Info className="h-3.5 w-3.5 shrink-0 text-violet" />
            {dict.funFacts[factIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
