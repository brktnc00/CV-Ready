import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, Clock, CheckCircle2, XCircle, Hourglass } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface SentRow {
  id: string;
  message: string;
  status: "sent" | "accepted" | "declined";
  recruiter_contact: string;
  created_at: string;
  published_cvs: { full_name: string | null; headline: string | null } | null;
}

const STATUS = {
  sent: { text: "Beklemede", cls: "bg-violet-soft text-violet", icon: Hourglass },
  accepted: { text: "Kabul edildi", cls: "bg-mint-soft text-mint", icon: CheckCircle2 },
  declined: { text: "Reddedildi", cls: "bg-ink/10 text-ink/50", icon: XCircle },
} as const;

export default async function TaleplerPage() {
  if (!isSupabaseConfigured()) redirect("/isverenler");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/isverenler");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "recruiter") redirect("/isverenler");

  const { data } = await supabase
    .from("contact_requests")
    .select("id, message, status, recruiter_contact, created_at, published_cvs(full_name, headline)")
    .eq("recruiter_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as SentRow[];

  return (
    <main className="min-h-screen dotted-bg">
      <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-8">
        <h1 className="mb-1 flex items-center gap-2 font-display text-3xl font-bold tracking-tight">
          <Inbox className="h-7 w-7 text-violet" /> Taleplerim
        </h1>
        <p className="mb-8 text-ink/55">Adaylara gönderdiğin temas talepleri ve durumları.</p>

        {rows.length === 0 ? (
          <div className="rounded-3xl border border-ink/5 bg-white p-10 text-center shadow-card">
            <p className="text-ink/60">Henüz temas talebi göndermedin.</p>
            <Link
              href="/panel"
              className="gradient-primary mt-5 inline-block rounded-2xl px-6 py-3 font-display font-bold text-white shadow-glow"
            >
              Aday havuzuna git
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {rows.map((r) => {
              const s = STATUS[r.status];
              return (
                <div
                  key={r.id}
                  className="rounded-3xl border border-ink/5 bg-white p-5 shadow-card sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display font-bold">
                      {r.published_cvs?.full_name ?? "Aday"}
                      {r.published_cvs?.headline && (
                        <span className="ml-2 text-sm font-semibold text-violet">
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

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/75">
                    {r.message}
                  </p>

                  {r.status === "accepted" ? (
                    <p className="mt-4 rounded-2xl border border-mint/30 bg-mint-soft px-4 py-3 text-sm font-semibold text-ink/75">
                      Aday talebini kabul etti. Bıraktığın iletişim üzerinden sana dönecek:{" "}
                      <span className="text-mint">{r.recruiter_contact}</span>
                    </p>
                  ) : r.status === "declined" ? (
                    <p className="mt-4 text-sm text-ink/45">Aday bu talebi reddetti.</p>
                  ) : (
                    <p className="mt-4 text-sm text-ink/45">
                      Aday henüz yanıtlamadı. Kabul ederse burada göreceksin.
                    </p>
                  )}

                  <p className="mt-3 flex items-center gap-1 text-xs text-ink/40">
                    <Clock className="h-3 w-3" />
                    {new Date(r.created_at).toLocaleDateString("tr-TR")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
