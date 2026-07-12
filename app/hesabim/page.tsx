import Link from "next/link";
import { FileText, Inbox } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import AccountCvCard from "@/components/AccountCvCard";
import InboxCard, { type RequestRow } from "@/components/InboxCard";

export const dynamic = "force-dynamic";

export interface PublishedRow {
  id: string;
  status: "published" | "withdrawn";
  full_name: string | null;
  headline: string | null;
  location: string | null;
  match_score: number;
  created_at: string;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen dotted-bg">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold">
          <span className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-glow">
            <FileText className="h-5 w-5 text-white" />
          </span>
          CV<span className="gradient-text">Ready</span>
        </Link>
        <Link
          href="/"
          className="rounded-full border border-ink/10 bg-white px-4 py-1.5 text-sm font-semibold text-ink/60 shadow-card transition-colors hover:text-ink"
        >
          ← Ana sayfa
        </Link>
      </header>
      <div className="mx-auto w-full max-w-4xl px-6 pb-24">{children}</div>
    </main>
  );
}

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    return (
      <Shell>
        <p className="rounded-2xl border border-amber/20 bg-amber/5 px-5 py-4 text-sm text-ink/70">
          Panel özellikleri için Supabase yapılandırması gerekiyor (.env.local).
        </p>
      </Shell>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Shell>
        <div className="rounded-3xl border border-ink/5 bg-white p-8 text-center shadow-card">
          <h1 className="font-display text-2xl font-bold">Hesabım</h1>
          <p className="mt-2 text-ink/60">
            CV'ni yayınlamak ve yönetmek için önce ana sayfadan bir CV oluştur.
          </p>
          <Link
            href="/"
            className="gradient-primary mt-5 inline-block rounded-2xl px-6 py-3 font-display font-bold text-white shadow-glow"
          >
            CV oluştur
          </Link>
        </div>
      </Shell>
    );
  }

  const { data: cvs } = await supabase
    .from("published_cvs")
    .select("id, status, full_name, headline, location, match_score, created_at")
    .eq("candidate_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (cvs ?? []) as PublishedRow[];

  const { data: reqs } = await supabase
    .from("contact_requests")
    .select("id, recruiter_company, recruiter_contact, message, status, created_at")
    .eq("candidate_id", user.id)
    .order("created_at", { ascending: false });

  const requests = (reqs ?? []) as RequestRow[];

  return (
    <Shell>
      <h1 className="mb-1 font-display text-3xl font-bold tracking-tight">Hesabım</h1>
      <p className="mb-8 text-ink/55">Yayınlanan CV'lerini buradan yönetebilirsin.</p>

      {rows.length === 0 ? (
        <div className="rounded-3xl border border-ink/5 bg-white p-8 text-center shadow-card">
          <p className="text-ink/60">Henüz yayınlanmış bir CV'n yok.</p>
          <Link
            href="/"
            className="gradient-primary mt-5 inline-block rounded-2xl px-6 py-3 font-display font-bold text-white shadow-glow"
          >
            CV oluştur ve yayınla
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <AccountCvCard key={row.id} row={row} />
          ))}
        </div>
      )}

      {/* Gelen kutusu — İK temas talepleri */}
      <div className="mt-12">
        <h2 className="mb-1 flex items-center gap-2 font-display text-2xl font-bold tracking-tight">
          <Inbox className="h-6 w-6 text-violet" /> Gelen kutusu
        </h2>
        <p className="mb-6 text-ink/55">Seninle iletişime geçmek isteyen işverenler.</p>

        {requests.length === 0 ? (
          <div className="rounded-3xl border border-ink/5 bg-white p-8 text-center text-ink/55 shadow-card">
            Henüz temas talebin yok. CV'n yayında kaldıkça işverenler sana ulaşabilir.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map((req) => (
              <InboxCard key={req.id} req={req} />
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
