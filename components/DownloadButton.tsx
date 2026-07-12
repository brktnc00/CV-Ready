"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import type { TailoredCV } from "@/lib/cv-schema";
import type { Dict } from "@/lib/i18n";
import type { TemplateId } from "./CVDocument";

// @react-pdf/renderer SSR ile uyumsuz — tamamen istemcide, tıklama anında yüklenir
export default function DownloadButton({
  cv,
  dict,
  template,
}: {
  cv: TailoredCV;
  dict: Dict;
  template: TemplateId;
}) {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const [{ pdf }, { default: CVDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./CVDocument"),
      ]);
      const blob = await pdf(
        <CVDocument cv={cv} dict={dict} template={template} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cv.fullName.replace(/\s+/g, "_")}_CV.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF oluşturulamadı:", err);
      alert("PDF oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={download}
      disabled={busy}
      className="flex items-center gap-2.5 rounded-xl bg-ink px-7 py-3.5 font-display text-base font-bold text-white shadow-lg shadow-ink/20 transition-shadow hover:shadow-xl hover:shadow-ink/25 disabled:opacity-60"
    >
      {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
      {dict.downloadPdf}
    </motion.button>
  );
}
