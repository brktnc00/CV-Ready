"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  action: () => Promise<void>;
  confirmText: string;
  label: React.ReactNode;
  className?: string;
}

// Yıkıcı/kritik admin işlemleri için: tıkla → onay iste → server action çalıştır.
export default function ConfirmActionButton({ action, confirmText, label, className }: Props) {
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();

  if (armed) {
    return (
      <span className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-ink/55">{confirmText}</span>
        <button
          onClick={() => startTransition(() => action())}
          disabled={pending}
          className="flex items-center gap-1 rounded-full bg-rose px-2.5 py-1 text-xs font-bold text-white disabled:opacity-50"
        >
          {pending && <Loader2 className="h-3 w-3 animate-spin" />} Evet
        </button>
        <button
          onClick={() => setArmed(false)}
          disabled={pending}
          className="rounded-full border border-ink/10 px-2.5 py-1 text-xs font-semibold text-ink/55"
        >
          Vazgeç
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setArmed(true)}
      className={className ?? "text-xs font-semibold text-rose hover:underline"}
    >
      {label}
    </button>
  );
}
