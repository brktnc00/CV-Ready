import Link from "next/link";
import { Building2, LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth";

export default function HrHeader({ company }: { company?: string | null }) {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
      <Link href="/hr/panel" className="flex items-center gap-2.5 font-display text-xl font-bold">
        <span className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-glow">
          <Building2 className="h-5 w-5 text-white" />
        </span>
        CV<span className="gradient-text">Ready</span> <span className="text-ink/40">İK</span>
      </Link>
      <div className="flex items-center gap-4">
        {company && <span className="hidden text-sm font-semibold text-ink/50 sm:block">{company}</span>}
        <form action={signOut}>
          <button className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 py-1.5 text-sm font-semibold text-ink/60 shadow-card transition-colors hover:text-ink">
            <LogOut className="h-4 w-4" /> Çıkış
          </button>
        </form>
      </div>
    </header>
  );
}
