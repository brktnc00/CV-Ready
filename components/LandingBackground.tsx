"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

export default function LandingBackground() {
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
    let raf = 0;
    let cancelled = false;

    (async () => {
      const [lottie, res] = await Promise.all([
        import("lottie-web/build/player/lottie_light"),
        fetch("/landing-bg-mono.json"),
      ]);
      const animationData = await res.json();
      if (cancelled) return;

      anim = lottie.default.loadAnimation({
        container: box,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
      });
      const total = anim.totalFrames;

      // Kare scroll konumuna bağlı: sayfa başı = ilk, sayfa sonu = son kare.
      // Lerp ile yumuşatılır; hedefe oturunca çizim durur.
      let current = 0;
      const step = () => {
        raf = requestAnimationFrame(step);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        const target = progress * (total - 1);
        if (Math.abs(target - current) < 0.05) return;
        current += (target - current) * 0.08;
        anim?.goToAndStop(current, true);
      };
      raf = requestAnimationFrame(step);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      anim?.destroy();
    };
  }, []);

  return (
    <div
      aria-hidden
      // Açık tema: multiply — animasyonun beyaz zemini sayfaya karışır,
      // yalnızca violet şekiller görünür.
      className="pointer-events-none fixed inset-0 -z-10 opacity-30 mix-blend-multiply"
      style={{
        // İçeriğin yoğun olduğu sol taraf sönük kalsın, animasyon sağda nefes alsın.
        maskImage: "linear-gradient(100deg, transparent 15%, rgba(0,0,0,0.55) 45%, black 75%)",
        WebkitMaskImage:
          "linear-gradient(100deg, transparent 15%, rgba(0,0,0,0.55) 45%, black 75%)",
      }}
    >
      <div ref={boxRef} className="h-full w-full" />
    </div>
  );
}
