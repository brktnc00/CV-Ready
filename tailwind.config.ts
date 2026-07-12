import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FDFAF5",
        ink: "#1E1B2E",
        // Rafine marka paleti: mor birincil, pembe/turuncu vurgu, yeşil başarı
        violet: {
          DEFAULT: "#7C3AED",
          soft: "#F3EDFD",
        },
        rose: "#DB2777",
        amber: "#F97316",
        mint: {
          DEFAULT: "#10B981",
          soft: "#E7F8F1",
        },
        skyblue: "#0EA5E9",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(30,27,46,0.04), 0 8px 24px -8px rgba(30,27,46,0.10)",
        "card-lg": "0 2px 4px rgba(30,27,46,0.04), 0 16px 48px -12px rgba(30,27,46,0.16)",
        glow: "0 8px 32px -8px rgba(124,58,237,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
