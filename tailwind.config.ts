import type { Config } from "tailwindcss";

const config: Config = {
  future: {
    // Dokunmatik cihazlarda tap, hover'ı yanlışlıkla tetiklemesin
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mono/outline tema: ink = mürekkep, cream = nötr beyaz zemin.
        // "violet" token'ı artık mürekkep — tüm eski mor aksanlar otomatik
        // mono'ya döner. mint/amber/rose yalnızca durum/skor anlamı taşır.
        cream: "#FAFAFA",
        ink: "#1A1523",
        violet: {
          DEFAULT: "#1A1523",
          soft: "#EFEEF2",
        },
        rose: "#E11D48",
        amber: "#D97706",
        mint: {
          DEFAULT: "#0F9D6E",
          soft: "#E4F6EE",
        },
        skyblue: "#0284C7",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        // Açık tema: yumuşak, mürekkep tonlu gölgeler — sert siyah yok
        card: "0 1px 2px rgba(26,21,35,0.05), 0 8px 24px -8px rgba(26,21,35,0.10)",
        "card-lg": "0 2px 4px rgba(26,21,35,0.06), 0 16px 48px -12px rgba(26,21,35,0.16)",
        glow: "0 8px 32px -8px rgba(26,21,35,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
