import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Luminous Nexus" karanlık tema: token anlamları korunur —
        // ink = ön plan (artık açık), cream = zemin (artık karanlık).
        // Böylece text-ink/60, border-ink/5, bg-cream/60 gibi yüzlerce
        // kullanım otomatik olarak doğru kontrasta oturur.
        cream: "#0D0B14",
        ink: "#E8E6EE",
        violet: {
          DEFAULT: "#B79DFF",
          soft: "#2A2150",
        },
        rose: "#FB7185",
        amber: "#FFA94D",
        mint: {
          DEFAULT: "#34D399",
          soft: "#0E2E22",
        },
        skyblue: "#38BDF8",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.35), 0 8px 24px -8px rgba(0,0,0,0.45)",
        "card-lg": "0 2px 4px rgba(0,0,0,0.35), 0 16px 48px -12px rgba(0,0,0,0.6)",
        glow: "0 8px 32px -8px rgba(151,113,255,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
