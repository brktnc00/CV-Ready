import { TrendingUp, UserPlus, FileUp, Send, Filter, MapPin, Sparkles } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import BarChart from "@/components/admin/BarChart";

export const dynamic = "force-dynamic";

const DAYS = 30;

// Son DAYS günün "YYYY-MM-DD" anahtarları ve kısa etiketleri.
function buildDays() {
  const keys: string[] = [];
  const labels: string[] = [];
  const now = new Date();
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    keys.push(d.toISOString().slice(0, 10));
    labels.push(`${d.getDate()}.${d.getMonth() + 1}`);
  }
  return { keys, labels };
}

// created_at listesini günlük sayıya çevirir.
function bucket(rows: { created_at: string }[], keys: string[]): number[] {
  const map = new Map<string, number>(keys.map((k) => [k, 0]));
  for (const r of rows) {
    const k = r.created_at.slice(0, 10);
    if (map.has(k)) map.set(k, (map.get(k) ?? 0) + 1);
  }
  return keys.map((k) => map.get(k) ?? 0);
}

function topN(values: (string | null)[], n: number): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const v of values) {
    const s = (v ?? "").trim();
    if (!s) continue;
    map.set(s, (map.get(s) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label, count]) => ({ label, count }));
}

export default async function AdminAnalyticsPage() {
  const { admin } = await requireAdmin();
  const { keys, labels } = buildDays();
  const since = keys[0] + "T00:00:00.000Z";

  const [{ data: profiles }, { data: cvs }, { data: reqs }] = await Promise.all([
    admin.from("profiles").select("role, created_at").gte("created_at", since),
    admin.from("published_cvs").select("status, created_at, location, skills_text").gte("created_at", since),
    admin.from("contact_requests").select("status, created_at").gte("created_at", since),
  ]);

  const P = profiles ?? [];
  const C = cvs ?? [];
  const R = reqs ?? [];

  const candidates = P.filter((p) => p.role === "candidate");
  const recruiters = P.filter((p) => p.role === "recruiter");

  // Zaman serileri
  const signupCand = bucket(candidates, keys);
  const signupRec = bucket(recruiters, keys);
  const publishSeries = bucket(C, keys);
  const reqSeries = bucket(R, keys);

  // Huni
  const published = C.filter((c) => c.status === "published").length;
  const reqSent = R.length;
  const reqAccepted = R.filter((r) => r.status === "accepted").length;
  const funnel = [
    { label: "Yayınlanan CV", value: published, color: "var(--vio)" },
    { label: "Temas talebi", value: reqSent, color: "var(--amb)" },
    { label: "Kabul edilen", value: reqAccepted, color: "var(--mnt)" },
  ];
  const funnelMax = Math.max(1, ...funnel.map((f) => f.value));

  // Dağılımlar
  const topSkills = topN(
    C.flatMap((c) => (c.skills_text ?? "").split(/[,•]/).map((s: string) => s.trim())),
    8,
  );
  const topLocations = topN(C.map((c) => c.location), 6);

  const kpis = [
    { label: "Yeni aday", value: candidates.length, icon: UserPlus, cls: "text-violet" },
    { label: "Yeni işveren", value: recruiters.length, icon: UserPlus, cls: "text-mint" },
    { label: "Yayınlanan CV", value: C.length, icon: FileUp, cls: "text-violet" },
    { label: "Temas talebi", value: R.length, icon: Send, cls: "text-amber" },
  ];

  return (
    <div
      className="flex flex-col gap-6"
      style={
        {
          // grafik renk değişkenleri (tailwind token'larıyla uyumlu)
          ["--vio" as string]: "#6d5ef0",
          ["--mnt" as string]: "#12b39a",
          ["--amb" as string]: "#e0a020",
        } as React.CSSProperties
      }
    >
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-violet" />
        <h2 className="font-display text-xl font-bold">Analitik</h2>
        <span className="text-sm font-semibold text-ink/40">son {DAYS} gün</span>
      </div>

      {/* KPI şeridi */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-ink/5 bg-white p-4 shadow-card">
            <k.icon className={`h-5 w-5 ${k.cls}`} />
            <p className="mt-2 font-display text-2xl font-bold tabular-nums">{k.value}</p>
            <p className="text-xs text-ink/55">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Zaman serileri */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Kayıtlar" legend={[{ t: "Aday", c: "#6d5ef0" }, { t: "İşveren", c: "#12b39a" }]}>
          <div className="text-ink">
            <BarChart
              labels={labels}
              series={[
                { label: "aday", color: "#6d5ef0", values: signupCand },
                { label: "isv", color: "#12b39a", values: signupRec },
              ]}
            />
          </div>
        </ChartCard>

        <ChartCard title="Yayınlanan CV'ler" legend={[{ t: "CV", c: "#6d5ef0" }]}>
          <div className="text-ink">
            <BarChart labels={labels} series={[{ label: "cv", color: "#6d5ef0", values: publishSeries }]} />
          </div>
        </ChartCard>

        <ChartCard title="Temas talepleri" legend={[{ t: "Talep", c: "#e0a020" }]}>
          <div className="text-ink">
            <BarChart labels={labels} series={[{ label: "req", color: "#e0a020", values: reqSeries }]} />
          </div>
        </ChartCard>

        {/* Dönüşüm hunisi */}
        <ChartCard title="Dönüşüm hunisi" legend={[]}>
          <div className="flex flex-col gap-3 py-1">
            {funnel.map((f) => (
              <div key={f.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink/70">{f.label}</span>
                  <span className="font-bold tabular-nums text-ink">{f.value}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-ink/5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(f.value / funnelMax) * 100}%`, background: f.color }}
                  />
                </div>
              </div>
            ))}
            <p className="mt-1 text-xs text-ink/45">
              Yayın→talep:{" "}
              <b className="text-ink/70">{published ? Math.round((reqSent / published) * 100) : 0}%</b>
              {"  ·  "}
              talep→kabul:{" "}
              <b className="text-ink/70">{reqSent ? Math.round((reqAccepted / reqSent) * 100) : 0}%</b>
            </p>
          </div>
        </ChartCard>
      </div>

      {/* Dağılımlar */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink/5 bg-white p-5 shadow-card">
          <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold">
            <Sparkles className="h-4 w-4 text-violet" /> En sık yetenekler
          </h3>
          {topSkills.length === 0 ? (
            <p className="text-xs text-ink/45">Bu dönemde veri yok.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {topSkills.map((s) => (
                <span key={s.label} className="rounded-full bg-violet-soft px-2.5 py-1 text-xs font-semibold text-violet">
                  {s.label} <span className="opacity-60">· {s.count}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-ink/5 bg-white p-5 shadow-card">
          <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold">
            <MapPin className="h-4 w-4 text-mint" /> En sık konumlar
          </h3>
          {topLocations.length === 0 ? (
            <p className="text-xs text-ink/45">Bu dönemde veri yok.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {topLocations.map((l) => (
                <div key={l.label} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink/70">{l.label}</span>
                  <span className="font-bold tabular-nums text-ink/50">{l.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-2xl border border-amber/20 bg-amber/5 px-4 py-3 text-xs leading-relaxed text-ink/60">
        <Filter className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
        <span>
          Bu veriler <b>yayınlanan</b> CV'lerden ve platform içi olaylardan gelir. Üretilen ama yayınlanmayan
          CV'ler ve ziyaretçi/sayfa trafiği burada görünmez — trafik için Vercel Web Analytics önerilir.
        </span>
      </p>
    </div>
  );
}

function ChartCard({
  title,
  legend,
  children,
}: {
  title: string;
  legend: { t: string; c: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink/5 bg-white p-5 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold">{title}</h3>
        <div className="flex gap-3">
          {legend.map((l) => (
            <span key={l.t} className="flex items-center gap-1 text-xs text-ink/55">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: l.c }} /> {l.t}
            </span>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
