import { Users, Briefcase, FileStack, Send, CheckCircle2, EyeOff } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

type QueryFilter = (q: ReturnType<ReturnType<SupabaseClient["from"]>["select"]>) => unknown;

async function count(admin: SupabaseClient, table: string, filter?: QueryFilter): Promise<number> {
  const base = admin.from(table).select("*", { count: "exact", head: true });
  const { count: c } = (await (filter ? filter(base) : base)) as { count: number | null };
  return c ?? 0;
}

export default async function AdminOverviewPage() {
  const { admin } = await requireAdmin();

  const [
    candidates,
    recruiters,
    cvsPublished,
    cvsWithdrawn,
    reqSent,
    reqAccepted,
  ] = await Promise.all([
    count(admin, "profiles", (q) => q.eq("role", "candidate")),
    count(admin, "profiles", (q) => q.eq("role", "recruiter")),
    count(admin, "published_cvs", (q) => q.eq("status", "published")),
    count(admin, "published_cvs", (q) => q.eq("status", "withdrawn")),
    count(admin, "contact_requests"),
    count(admin, "contact_requests", (q) => q.eq("status", "accepted")),
  ]);

  const stats = [
    { label: "Aday", value: candidates, icon: Users, cls: "bg-violet-soft text-violet" },
    { label: "İşveren", value: recruiters, icon: Briefcase, cls: "bg-mint-soft text-mint" },
    { label: "Yayında CV", value: cvsPublished, icon: FileStack, cls: "bg-violet-soft text-violet" },
    { label: "Yayından kaldırılan", value: cvsWithdrawn, icon: EyeOff, cls: "bg-ink/5 text-ink/50" },
    { label: "Temas talebi", value: reqSent, icon: Send, cls: "bg-amber/10 text-amber" },
    { label: "Kabul edilen talep", value: reqAccepted, icon: CheckCircle2, cls: "bg-mint-soft text-mint" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-3xl border border-ink/5 bg-white p-5 shadow-card"
        >
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.cls}`}>
            <s.icon className="h-5 w-5" />
          </span>
          <p className="mt-3 font-display text-3xl font-bold tracking-tight">{s.value}</p>
          <p className="text-sm text-ink/55">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
