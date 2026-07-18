"use client";

import { Link2 } from "lucide-react";
import type { Dict } from "@/lib/i18n";

interface Props {
  dict: Dict;
  mode: "url" | "text";
  onModeChange: (mode: "url" | "text") => void;
  jobUrl: string;
  onJobUrl: (v: string) => void;
  jobText: string;
  onJobText: (v: string) => void;
}

export default function JobInput({
  dict,
  mode,
  onModeChange,
  jobUrl,
  onJobUrl,
  jobText,
  onJobText,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      {mode === "url" ? (
        <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-cream/60 px-4 py-3.5 transition-colors focus-within:border-violet/40 focus-within:bg-white">
          <Link2 className="h-5 w-5 shrink-0 text-violet" />
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => onJobUrl(e.target.value)}
            placeholder={dict.jobUrlPlaceholder}
            className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-ink/30"
          />
        </div>
      ) : (
        <textarea
          value={jobText}
          onChange={(e) => onJobText(e.target.value)}
          placeholder={dict.jobTextPlaceholder}
          rows={6}
          className="w-full resize-none rounded-2xl border border-ink/10 bg-cream/60 px-4 py-3.5 text-sm font-medium leading-relaxed outline-none transition-colors placeholder:text-ink/30 focus:border-violet/40 focus:bg-white"
        />
      )}
      <button
        type="button"
        onClick={() => onModeChange(mode === "url" ? "text" : "url")}
        className="self-start text-xs font-semibold text-violet underline decoration-violet/30 underline-offset-4 transition-colors hover:text-rose"
      >
        {mode === "url" ? dict.jobPasteToggle : dict.jobUrlToggle}
      </button>
    </div>
  );
}
