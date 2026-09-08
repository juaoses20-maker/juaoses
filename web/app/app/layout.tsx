import BottomNav from "@/components/app/BottomNav";
import { PROJECT } from "@/lib/seed";
import { ChevronDown } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
          <div className="truncate font-mono text-[12.5px] font-semibold">{PROJECT.name}</div>
          <div className="text-[10px] text-ink-3">
            {PROJECT.client} · {PROJECT.location}
          </div>
        </div>
        <ChevronDown className="h-4 w-4 flex-none text-ink-3" strokeWidth={2} />
      </header>

      <main className="flex-1 overflow-x-hidden px-4 pb-4">{children}</main>

      <BottomNav />
    </div>
  );
}
