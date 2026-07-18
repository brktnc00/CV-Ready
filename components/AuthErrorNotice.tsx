"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

// E-posta bağlantısı başarısız olduğunda callback ?error=... ile geri döner.
// Bu olmadan kullanıcı sessizce yönlendirilir ve neden giremediğini bilemez.
const MESSAGES: Record<string, string> = {
  missing_token: "Bağlantı eksik ya da bozuk görünüyor. Yeni bir doğrulama e-postası iste.",
};

function Notice() {
  const raw = useSearchParams().get("error");
  if (!raw) return null;

  const message =
    MESSAGES[raw] ??
    (/expired|invalid/i.test(raw)
      ? "Bağlantının süresi dolmuş ya da daha önce kullanılmış. Yeni bir doğrulama e-postası iste."
      : "Giriş tamamlanamadı. Lütfen tekrar dene.");

  return (
    <div
      role="alert"
      className="mx-auto mb-6 flex w-full max-w-5xl items-start gap-2.5 rounded-2xl border border-rose/20 bg-rose/5 px-4 py-3 text-sm text-ink/75"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
      <span>{message}</span>
    </div>
  );
}

export default function AuthErrorNotice() {
  return (
    <Suspense fallback={null}>
      <Notice />
    </Suspense>
  );
}
