import { Users, Mail, Clock, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { adminDeleteUser } from "@/app/actions/admin";
import ConfirmActionButton from "@/components/admin/ConfirmActionButton";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, { text: string; cls: string }> = {
  candidate: { text: "Aday", cls: "bg-violet-soft text-violet" },
  recruiter: { text: "İşveren", cls: "bg-mint-soft text-mint" },
  admin: { text: "Admin", cls: "bg-rose/10 text-rose" },
};

export default async function AdminUsersPage() {
  const { admin, userId: me } = await requireAdmin();

  const { data: authData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, role, full_name, company_name");

  const byId = new Map(
    (profiles ?? []).map((p) => [p.id as string, p as { role: string; full_name: string | null; company_name: string | null }]),
  );

  const users = (authData?.users ?? []).map((u) => {
    const p = byId.get(u.id);
    return {
      id: u.id,
      email: u.email ?? "—",
      role: p?.role ?? "candidate",
      name: p?.full_name ?? null,
      company: p?.company_name ?? null,
      created_at: u.created_at,
    };
  });

  return (
    <>
      <h2 className="mb-1 flex items-center gap-2 font-display text-xl font-bold">
        <Users className="h-5 w-5 text-violet" /> Kullanıcılar
        <span className="text-sm font-semibold text-ink/40">({users.length})</span>
      </h2>
      <p className="mb-6 text-sm text-ink/50">Tüm kayıtlı adaylar ve işverenler.</p>

      <div className="overflow-x-auto rounded-3xl border border-ink/5 bg-white/[0.06] shadow-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-ink/8 text-xs uppercase tracking-wide text-ink/45">
            <tr>
              <th className="px-5 py-3 font-bold">Kullanıcı</th>
              <th className="px-5 py-3 font-bold">Rol</th>
              <th className="px-5 py-3 font-bold">Şirket</th>
              <th className="px-5 py-3 font-bold">Kayıt</th>
              <th className="px-5 py-3 font-bold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {users.map((u) => {
              const rl = ROLE_LABEL[u.role] ?? ROLE_LABEL.candidate;
              return (
                <tr key={u.id} className="hover:bg-cream/40">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-ink/85">{u.name ?? "—"}</p>
                    <p className="flex items-center gap-1 text-xs text-ink/50">
                      <Mail className="h-3 w-3" /> {u.email}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${rl.cls}`}>
                      {rl.text}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink/60">{u.company ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1 text-xs text-ink/45">
                      <Clock className="h-3 w-3" />
                      {new Date(u.created_at).toLocaleDateString("tr-TR")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {u.id === me ? (
                      <span className="text-xs text-ink/35">sen</span>
                    ) : (
                      <ConfirmActionButton
                        action={async () => {
                          "use server";
                          await adminDeleteUser(u.id);
                        }}
                        confirmText="Kalıcı silinsin mi?"
                        label={
                          <span className="flex items-center gap-1 text-xs font-semibold text-rose hover:underline">
                            <Trash2 className="h-3.5 w-3.5" /> Sil
                          </span>
                        }
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
