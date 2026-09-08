import { redirect } from "next/navigation";
import BottomNav from "@/components/app/BottomNav";
import { getUserContext } from "@/lib/supabase/context";
import { createClient } from "@/lib/supabase/server";
import { ChevronDown, LogOut } from "lucide-react";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getUserContext();
  if (!ctx) redirect("/entrar");
  if (!ctx.companyId) redirect("/bienvenido");

  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("name, location")
    .eq("id", ctx.companyId)
    .maybeSingle();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[460px] flex-col bg-bg text-ink">
      <header className="flex items-center gap-2.5 px-4 pb-2.5 pt-[max(12px,env(safe-area-inset-top))]">
        <span className="grid h-[26px] w-[26px] flex-none place-items-center rounded-[8px] border bg-[var(--chip)] [border-color:color-mix(in_oklab,var(--accent)_24%,transparent)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round">
            <path d="M4 20V10l8-6 8 6v10" />
            <path d="M4 20h16" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-mono text-[12.5px] font-semibold">
            {company?.name ?? "Mi empresa"}
          </div>
          {company?.location && <div className="text-[10px] text-ink-3">{company.location}</div>}
        </div>
        <ChevronDown className="h-4 w-4 flex-none text-ink-3" strokeWidth={2} />
        <form action="/auth/signout" method="post" className="flex-none">
          <button
            type="submit"
            aria-label="Salir"
            className="grid h-8 w-8 place-items-center rounded-[8px] text-ink-3 transition-colors hover:text-ink"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
          </button>
        </form>
      </header>

      <main className="flex-1 overflow-x-hidden px-4 pb-4">{children}</main>

      <BottomNav />
    </div>
  );
}
