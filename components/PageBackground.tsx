"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

interface Props {
  /** public/ altındaki Lottie dosyası. */
  src?: string;
  /** Konumlandırma sınıfları — overlay içinde absolute kullanmak için. */
  className?: string;
}

// Sürekli döngüde oynayan sayfa arka planı (işveren + CV oluştur + yükleme).
// Landing'deki scroll-bağlı varyantın aksine kendi hâlinde akar.
export default function PageBackground({
  src = "/pages-bg.json",
  className = "fixed inset-0 -z-10 opacity-[0.13]",
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    // Hareket istemeyenlerde ve dar/dokunmatik ekranlarda hiç yükleme.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768
    )
      return;

    let anim: AnimationItem | null = null;
    let cancelled = false;

    (async () => {
      const [lottie, res] = await Promise.all([
        import("lottie-web/build/player/lottie_light"),
        fetch(src),
      ]);
      const animationData = await res.json();
      if (cancelled) return;
      anim = lottie.default.loadAnimation({
        container: box,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
      });
    })();

    // Sekme gizliyken durdur — boşa iş yapma.
    const onVisibility = () => {
      if (!anim) return;
      if (document.hidden) anim.pause();
      else anim.play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      anim?.destroy();
    };
  }, [src]);

  return (
    <div
      aria-hidden
      // multiply: beyaz zemin sayfaya karışır, yalnızca mürekkep şekiller kalır.
      className={`page-lottie pointer-events-none mix-blend-multiply ${className}`}
    >
      <div ref={boxRef} className="h-full w-full" />
    </div>
  );
}
