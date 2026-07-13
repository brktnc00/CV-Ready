import { Send, ArrowRight, Clock, Hourglass, CheckCircle2, XCircle } from "lucide-react";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

interface ReqRow {
  id: string;
  message: string;
  status: "sent" | "accepted" | "declined";
  recruiter_company: string | null;
  recruiter_contact: string;
  created_at: string;
  published_cvs: { full_name: string | null; headline: string | null } | null;
}

const STATUS = {
  sent: { text: "Beklemede", cls: "bg-violet-soft text-violet", icon: Hourglass },
  accepted: { text: "Kabul", cls: "bg-mint-soft text-mint", icon: CheckCircle2 },
  declined: { text: "Ret", cls: "bg-ink/10 text-ink/50", icon: XCircle },
} as const;

export default async function AdminRequestsPage() {
  const { admin } = await requireAdmin();

  const { data } = await admin
    .from("contact_requests")
    .select(
      "id, message, status, recruiter_company, recruiter_contact, created_at, published_cvs(full_name, headline)",
    )
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as ReqRow[];

  return (
    <>
      <h2 className="mb-1 flex items-center gap-2 font-display text-xl font-bold">
        <Send className="h-5 w-5 text-violet" /> Temas talepleri
        <span className="text-sm font-semibold text-ink/40">({rows.length})</span>
      </h2>
      <p className="mb-6 text-sm text-ink/50">İşveren → aday platform içi iletişim trafiği.</p>

      {rows.length === 0 ? (
        <div className="rounded-3xl border border-ink/5 bg-white p-10 text-center text-ink/55 shadow-card">
          Henüz temas talebi yok.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((r) => {
            const s = STATUS[r.status];
            return (
              <div
                key={r.id}
                className="rounded-3xl border border-ink/5 bg-white p-4 shadow-card sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-display font-bold">
                    {r.recruiter_company || "İşveren"}
                    <ArrowRight className="h-4 w-4 text-ink/30" />
                    {r.published_cvs?.full_name ?? "Aday"}
                    {r.published_cvs?.headline && (
                      <span className="text-sm font-semibold text-violet">
                        {r.published_cvs.headline}
                      </span>
                    )}
                  </span>
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${s.cls}`}
                  >
                    <s.icon className="h-3.5 w-3.5" /> {s.text}
                  </span>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/70">
                  {r.message}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/45">
                  <span>İşveren dönüş: {r.recruiter_contact}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(r.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
