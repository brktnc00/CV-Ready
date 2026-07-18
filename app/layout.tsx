import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import AppHeader from "@/components/AppHeader";
import AnimatedBackground from "@/components/AnimatedBackground";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "CV Ready — Her ilana mükemmel CV",
  description:
    "CV'ni yükle, iş ilanının linkini yapıştır. Yapay zeka CV'ni o ilana göre yeniden yazsın.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${display.variable} ${body.variable} font-body antialiased`}>
        <AnimatedBackground />
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
