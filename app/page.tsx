import Link from "next/link";
import {
  Sparkles,
  Wand2,
  Upload,
  Rocket,
  Search,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "CV Ready — Yapay zekayla ilana özel CV + aday havuzu",
  description:
    "CV'ni ilana göre saniyeler içinde yeniden yazdır, dilersen aday havuzunda yayınla. İşverenler KVKK korumalı havuzda seni bulsun.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen dotted-bg">
      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-16 pt-14 text-center sm:pt-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/20 bg-violet-soft px-4 py-1.5 text-sm font-semibold text-violet">
          <Sparkles className="h-3.5 w-3.5" /> Yapay zeka destekli kariyer platformu
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          İlana özel <span className="gradient-text">mükemmel CV</span>, sonra doğru işverenle buluşma
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink/55">
          CV'ni yükle, ilanı yapıştır — yapay zeka o ilana göre yeniden yazsın. Dilersen tek
          tıkla aday havuzunda yayınla, işverenler seni bulsun.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/olustur"
            className="gradient-primary flex items-center gap-2 rounded-2xl px-7 py-4 font-display text-lg font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
          >
            <Wand2 className="h-5 w-5" /> CV oluştur
          </Link>
          <Link
            href="/isverenler"
            className="flex items-center gap-2 rounded-2xl border-2 border-ink/10 bg-white px-7 py-4 font-display text-lg font-bold text-ink/70 transition-colors hover:border-violet/40 hover:text-ink"
          >
            <Search className="h-5 w-5 text-violet" /> Aday ara
          </Link>
        </div>
      </section>

      {/* İki taraf */}
      <section className="mx-auto grid w-full max-w-5xl gap-5 px-6 pb-16 md:grid-cols-2">
        <AudienceCard
          icon={<Users className="h-5 w-5 text-violet" />}
          eyebrow="Aday isen"
          title="CV'ni ilana göre uyarla, yayınla"
          items={[
            "Yapay zeka CV'ni her ilana göre yeniden yazar",
            "Uyum skorun ve eksiklerin anında görünür",
            "İstersen KVKK onayıyla havuzda yayınla",
          ]}
          href="/olustur"
          cta="Hemen dene"
        />
        <AudienceCard
          icon={<ShieldCheck className="h-5 w-5 text-violet" />}
          eyebrow="İşveren isen"
          title="Hazır adayları ara ve güvenle iletişime geç"
          items={[
            "Yetenek, konum ve dile göre filtrele",
            "Adayların iletişim bilgisi KVKK ile korunur",
            "Platform üzerinden maskeli temas kur",
          ]}
          href="/isverenler"
          cta="İşveren paneli"
        />
      </section>

      {/* Nasıl çalışır */}
      <section id="nasil-calisir" className="mx-auto w-full max-w-5xl px-6 pb-24">
        <h2 className="mb-8 text-center font-display text-3xl font-bold tracking-tight">
          Nasıl çalışır?
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: Upload, title: "1 · Yükle", text: "CV'ni yükle ve hedef ilanı ekle." },
            { icon: Wand2, title: "2 · Uyarla", text: "Yapay zeka CV'ni ilana göre yeniden yazar." },
            { icon: Rocket, title: "3 · Yayınla", text: "PDF indir ya da havuzda yayınla." },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-3xl border border-ink/5 bg-white p-6 text-center shadow-card"
            >
              <span className="gradient-primary mx-auto flex h-12 w-12 items-center justify-center rounded-2xl shadow-glow">
                <s.icon className="h-6 w-6 text-white" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/55">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/olustur"
            className="inline-flex items-center gap-2 font-display text-lg font-bold text-violet hover:underline"
          >
            Ücretsiz başla <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-ink/5 py-8">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 text-sm text-ink/45">
          <span className="font-display font-bold text-ink/60">CVReady</span>
          <span>KVKK uyumlu · İletişim bilgileri maskeli</span>
        </div>
      </footer>
    </main>
  );
}

function AudienceCard({
  icon,
  eyebrow,
  title,
  items,
  href,
  cta,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  items: string[];
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-ink/5 bg-white p-7 shadow-card">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-soft">
        {icon}
      </span>
      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-violet">{eyebrow}</p>
      <h3 className="mt-1 font-display text-xl font-bold tracking-tight">{title}</h3>
      <ul className="mt-4 flex flex-1 flex-col gap-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink/70">
            <span className="mt-0.5 font-bold text-violet">✓</span> {it}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-1.5 self-start rounded-2xl border-2 border-violet/25 bg-violet-soft px-5 py-2.5 font-display font-bold text-violet transition-colors hover:border-violet"
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
