import { FileStack, MapPin, Clock, EyeOff, Eye, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { adminWithdrawCV, adminRepublishCV, adminDeleteCV } from "@/app/actions/admin";
import ConfirmActionButton from "@/components/admin/ConfirmActionButton";

export const dynamic = "force-dynamic";

interface CvRow {
  id: string;
  status: "published" | "withdrawn";
  full_name: string | null;
  headline: string | null;
  location: string | null;
  match_score: number;
  created_at: string;
}

export default async function AdminCvsPage() {
  const { admin } = await requireAdmin();

  const { data } = await admin
    .from("published_cvs")
    .select("id, status, full_name, headline, location, match_score, created_at")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as CvRow[];

  return (
    <>
      <h2 className="mb-1 flex items-center gap-2 font-display text-xl font-bold">
        <FileStack className="h-5 w-5 text-violet" /> Yayınlanan CV'ler
        <span className="text-sm font-semibold text-ink/40">({rows.length})</span>
      </h2>
      <p className="mb-6 text-sm text-ink/50">
        Moderasyon: uygunsuz CV'yi yayından kaldır veya kalıcı sil.
      </p>

      {rows.length === 0 ? (
        <div className="rounded-3xl border border-ink/5 bg-white/[0.06] p-10 text-center text-ink/55 shadow-card">
          Henüz yayınlanmış CV yok.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-ink/5 bg-white/[0.06] p-4 shadow-card sm:p-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display font-bold">{r.full_name ?? "Aday"}</span>
                  {r.headline && (
                    <span className="text-sm font-semibold text-violet">{r.headline}</span>
                  )}
                  {r.status === "withdrawn" && (
                    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs font-bold text-ink/45">
                      Yayında değil
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/50">
                  {r.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {r.location}
                    </span>
                  )}
                  <span>Uyum: {r.match_score}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(r.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {r.status === "published" ? (
                  <form action={adminWithdrawCV.bind(null, r.id)}>
                    <button className="flex items-center gap-1 text-xs font-semibold text-ink/60 hover:text-ink">
                      <EyeOff className="h-3.5 w-3.5" /> Yayından kaldır
                    </button>
                  </form>
                ) : (
                  <form action={adminRepublishCV.bind(null, r.id)}>
                    <button className="flex items-center gap-1 text-xs font-semibold text-mint hover:underline">
                      <Eye className="h-3.5 w-3.5" /> Tekrar yayınla
                    </button>
                  </form>
                )}
                <ConfirmActionButton
                  action={async () => {
                    "use server";
                    await adminDeleteCV(r.id);
                  }}
                  confirmText="Kalıcı silinsin mi?"
                  label={
                    <span className="flex items-center gap-1 text-xs font-semibold text-rose hover:underline">
                      <Trash2 className="h-3.5 w-3.5" /> Sil
                    </span>
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
