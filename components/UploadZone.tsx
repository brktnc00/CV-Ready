"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { CheckCircle2, FileUp } from "lucide-react";
import type { Dict } from "@/lib/i18n";

interface Props {
  dict: Dict;
  file: File | null;
  onFile: (file: File | null) => void;
}

const MAX_SIZE = 10 * 1024 * 1024;

export default function UploadZone({ dict, file, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const accept = useCallback(
    (f: File | undefined) => {
      if (!f || f.type !== "application/pdf") return;
      if (f.size > MAX_SIZE) {
        setSizeError(true);
        return;
      }
      setSizeError(false);
      onFile(f);
    },
    [onFile],
  );

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => accept(e.target.files?.[0])}
      />
      <motion.button
        type="button"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files?.[0]);
        }}
        className={`w-full rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          file
            ? "border-mint/60 bg-mint-soft"
            : dragging
              ? "border-violet bg-violet-soft"
              : "border-ink/15 bg-cream/60 hover:border-violet/50 hover:bg-violet-soft/50"
        }`}
      >
        {file ? (
          <div className="flex flex-col items-center gap-1.5">
            <CheckCircle2 className="h-9 w-9 text-mint" />
            <span className="font-display text-base font-bold">{dict.uploadReady}</span>
            <span className="max-w-full truncate text-sm text-ink/55">{file.name}</span>
            <span className="mt-1 rounded-full border border-ink/15 bg-white px-3 py-0.5 text-xs font-semibold text-ink/70">
              {dict.uploadChange}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-soft"
            >
              <FileUp className="h-6 w-6 text-violet" />
            </motion.span>
            <span className="font-display text-base font-bold">{dict.uploadTitle}</span>
            <span className="text-sm text-ink/50">{dict.uploadHint}</span>
            {sizeError && (
              <span className="mt-1 text-sm font-semibold text-rose">Max 10 MB</span>
            )}
          </div>
        )}
      </motion.button>
    </div>
  );
}
