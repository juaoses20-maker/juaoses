"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PencilRuler, Camera, Hexagon, Users } from "lucide-react";

const ITEMS = [
  { href: "/app", label: "Hoy", icon: Home, exact: true },
  { href: "/app/planos", label: "Planos", icon: PencilRuler },
  { href: "/app/fotos", label: "Fotos", icon: Camera },
  { href: "/app/811", label: "811", icon: Hexagon },
  { href: "/app/cuadrillas", label: "Cuadrillas", icon: Users },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="sticky bottom-0 z-20 flex justify-around border-t bg-surface px-1 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2">
      {ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? path === href : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={
              "flex flex-col items-center gap-[3px] font-mono text-[9px] font-semibold " +
              (active ? "text-accent" : "text-ink-3")
            }
          >
            <span className={"grid h-7 w-[30px] place-items-center rounded-[8px] " + (active ? "bg-[var(--chip)]" : "")}>
              <Icon className="h-[17px] w-[17px]" strokeWidth={2} />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
