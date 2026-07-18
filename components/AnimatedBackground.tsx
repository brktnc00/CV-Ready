"use client";

import { useEffect, useRef } from "react";

interface Props {
  /** Kapatmak için false ver. */
  enabled?: boolean;
  /** Parçacık yoğunluğu: 1 = varsayılan (~60 nokta @1440px). */
  density?: number;
  /** Hareket hızı çarpanı: 1 = varsayılan (çok yavaş, sakin). */
  speed?: number;
}

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: 0 | 1; // 0 = violet, 1 = amber
}

// Mono palet — mürekkep tonlu gri noktalar/çizgiler.
const VIOLET = "26, 21, 35"; // ink
const AMBER = "90, 85, 99"; // açık mürekkep grisi

const LINK_DIST = 130; // parçacıklar arası bağlantı eşiği (px)
const MOUSE_DIST = 200; // imlecin etki yarıçapı (px)

export default function AnimatedBackground({ enabled = true, density = 1, speed = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas) return;

    // Erişilebilirlik + mobil: hareket istemeyenlerde ve dokunmatik/dar
    // ekranlarda hiç çalıştırma — statik glow'lar zaten body'de.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduced.matches || coarse.matches || window.innerWidth < 768) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let particles: P[] = [];
    let raf = 0;
    // İmleç: hedef (gerçek) ve lerp'lenen (çizimde kullanılan) konum.
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(((w * h) / 22000) * density);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * speed,
        vy: (Math.random() - 0.5) * 0.25 * speed,
        r: 1 + Math.random() * 1.4,
        hue: Math.random() < 0.82 ? 0 : 1, // ağırlıklı violet, seyrek amber
      }));
    };

    const step = () => {
      raf = requestAnimationFrame(step);
      // İmleci yumuşat (lerp) — ani sıçrama yok.
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        // İmleç yakın parçacıkları çok hafif çeker.
        const dxm = mouse.x - p.x;
        const dym = mouse.y - p.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < MOUSE_DIST && dm > 0.001) {
          const f = ((MOUSE_DIST - dm) / MOUSE_DIST) * 0.012 * speed;
          p.vx += (dxm / dm) * f;
          p.vy += (dym / dm) * f;
        }
        // Sürtünme + hız sınırı — sakin kalsın.
        p.vx *= 0.985;
        p.vy *= 0.985;
        const vmax = 0.5 * speed;
        const v = Math.hypot(p.vx, p.vy);
        if (v > vmax) {
          p.vx = (p.vx / v) * vmax;
          p.vy = (p.vy / v) * vmax;
        }
        p.x += p.vx;
        p.y += p.vy;
        // Kenarlardan sar.
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // Bağlantı çizgileri.
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (Math.abs(dx) > LINK_DIST || Math.abs(dy) > LINK_DIST) continue;
          const d = Math.hypot(dx, dy);
          if (d > LINK_DIST) continue;
          const alpha = (1 - d / LINK_DIST) * 0.14;
          ctx.strokeStyle = `rgba(${a.hue || b.hue ? AMBER : VIOLET}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        // İmleçten yakın parçacıklara bağlantı — etkileşim hissi.
        const dm = Math.hypot(mouse.x - a.x, mouse.y - a.y);
        if (dm < MOUSE_DIST) {
          const alpha = (1 - dm / MOUSE_DIST) * 0.22;
          ctx.strokeStyle = `rgba(${VIOLET}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(a.x, a.y);
          ctx.stroke();
        }
        // Nokta: imlece yaklaştıkça hafif parlar.
        const glow = dm < MOUSE_DIST ? (1 - dm / MOUSE_DIST) * 0.5 : 0;
        ctx.fillStyle = `rgba(${a.hue ? AMBER : VIOLET}, ${0.35 + glow})`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r + glow, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const onMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };
    // Sekme gizliyken dur — boşa iş yapma.
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(step);
    };

    resize();
    raf = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, density, speed]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="particle-bg pointer-events-none fixed inset-0 -z-10"
    />
  );
}
