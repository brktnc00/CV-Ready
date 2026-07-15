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
  FileText,
  Target,
  Building2,
} from "lucide-react";

export const metadata = {
  title: "CV Ready — Yapay zekayla ilana özel CV + aday havuzu",
  description:
    "CV'ni ilana göre saniyeler içinde yeniden yazdır, dilersen aday havuzunda yayınla. İşverenler KVKK korumalı havuzda seni bulsun.",
};

export default function LandingPage() {
  return (
    <main className="landing min-h-screen overflow-hidden">
      {/* Hero — solda tez, sağda ürünün mekaniğini gösteren yörünge */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-12 lg:grid-cols-2 lg:gap-8 lg:pt-20">
        <div>
          <span className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold text-[#d0bcff]">
            <Sparkles className="h-3.5 w-3.5" /> Yapay zeka destekli kariyer platformu
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            İlana özel <span className="nexus-text">mükemmel CV</span>, sonra doğru işverenle
            buluşma
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[color:var(--lx-muted)]">
            CV'ni yükle, ilanı yapıştır — yapay zeka o ilana göre yeniden yazsın. Dilersen tek
            tıkla aday havuzunda yayınla, işverenler seni bulsun.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/olustur"
              className="nexus-btn flex items-center gap-2 rounded-2xl px-7 py-4 font-display text-lg font-bold text-white"
            >
              <Wand2 className="h-5 w-5 text-[#d0bcff]" /> CV oluştur
            </Link>
            <Link
              href="/isverenler"
              className="glass glass-hover flex items-center gap-2 rounded-2xl px-7 py-4 font-display text-lg font-bold text-[color:var(--lx-text)]"
            >
              <Search className="h-5 w-5 text-[#ffb77c]" /> Aday ara
            </Link>
          </div>
        </div>

        <OrbitDiagram />
      </section>

      {/* İki taraf */}
      <section className="mx-auto grid w-full max-w-6xl gap-5 px-6 pb-20 md:grid-cols-2">
        <AudienceCard
          icon={<Users className="h-5 w-5 text-[#d0bcff]" />}
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
          icon={<ShieldCheck className="h-5 w-5 text-[#ffb77c]" />}
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

      {/* Nasıl çalışır — gerçek bir sıra olduğu için numaralı */}
      <section id="nasil-calisir" className="mx-auto w-full max-w-6xl px-6 pb-24">
        <h2 className="mb-9 text-center font-display text-3xl font-bold tracking-tight">
          Nasıl çalışır?
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: Upload, step: "01", title: "Yükle", text: "CV'ni yükle ve hedef ilanı ekle." },
            {
              icon: Wand2,
              step: "02",
              title: "Uyarla",
              text: "Yapay zeka CV'ni ilana göre yeniden yazar.",
            },
            {
              icon: Rocket,
              step: "03",
              title: "Yayınla",
              text: "PDF indir ya da havuzda yayınla.",
            },
          ].map((s) => (
            <div key={s.step} className="glass glass-hover rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <span className="glass flex h-11 w-11 items-center justify-center rounded-xl">
                  <s.icon className="h-5 w-5 text-[#d0bcff]" />
                </span>
                <span className="font-display text-sm font-bold text-white/20">{s.step}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[color:var(--lx-muted)]">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/olustur"
            className="inline-flex items-center gap-2 font-display text-lg font-bold text-[#d0bcff] hover:underline"
          >
            Ücretsiz başla <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 text-sm text-white/35">
          <span className="font-display font-bold text-white/50">CVReady</span>
          <span>KVKK uyumlu · İletişim bilgileri maskeli</span>
        </div>
      </footer>
    </main>
  );
}

// Ürünün gerçek mekaniğini gösteren yörünge: CV merkezde, ilan/uyum/havuz/işveren
// çevresinde. Dönen noktalar dekoratif; etiketler sabit ve okunur kalır.
function OrbitDiagram() {
  const nodes = [
    { icon: Target, label: "İlan", pos: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" },
    {
      icon: Sparkles,
      label: "Uyum skoru",
      pos: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
    },
    {
      icon: Users,
      label: "Aday havuzu",
      pos: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    },
    { icon: Building2, label: "İşveren", pos: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2" },
  ];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
      {/* Halkalar */}
      <div className="orbit-ring" />
      <div className="orbit-ring" style={{ inset: "16%" }} />
      <div className="orbit-ring" style={{ inset: "32%" }} />

      {/* Dönen dekoratif parlak noktalar — hareketi görünür kılar */}
      <div className="orbit-spin absolute inset-0">
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d0bcff] shadow-[0_0_14px_4px_rgba(208,188,255,0.6)]" />
      </div>
      <div className="orbit-spin-rev absolute" style={{ inset: "16%" }}>
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffb77c] shadow-[0_0_12px_3px_rgba(255,183,124,0.55)]" />
      </div>

      {/* Merkez — ürünün kalbi */}
      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full">
        <span className="glass flex h-full w-full flex-col items-center justify-center rounded-full">
          <FileText className="h-6 w-6 text-[#d0bcff]" />
          <span className="mt-1 font-display text-lg font-bold">CV</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
            senin
          </span>
        </span>
      </div>

      {/* Sabit etiketli düğümler */}
      {nodes.map((n) => (
        <div key={n.label} className={`absolute ${n.pos}`}>
          <span className="glass flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold">
            <n.icon className="h-3.5 w-3.5 text-[#ffb77c]" /> {n.label}
          </span>
        </div>
      ))}
    </div>
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
    <div className="glass glass-hover flex flex-col rounded-3xl p-7">
      <span className="glass flex h-11 w-11 items-center justify-center rounded-xl">{icon}</span>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#d0bcff]">{eyebrow}</p>
      <h3 className="mt-1.5 font-display text-xl font-bold tracking-tight">{title}</h3>
      <ul className="mt-4 flex flex-1 flex-col gap-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-[color:var(--lx-muted)]">
            <span className="mt-0.5 font-bold text-[#ffb77c]">✓</span> {it}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="nexus-btn mt-6 inline-flex items-center gap-1.5 self-start rounded-2xl px-5 py-2.5 font-display font-bold text-white"
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
