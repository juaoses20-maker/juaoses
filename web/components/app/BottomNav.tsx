"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, PencilRuler, Camera, Hexagon, Users } from "lucide-react";

const ITEMS = [
  { href: "/app", key: "hoy", icon: Home, exact: true },
  { href: "/app/planos", key: "planos", icon: PencilRuler, exact: false },
  { href: "/app/fotos", key: "fotos", icon: Camera, exact: false },
  { href: "/app/811", key: "ochoOnceUno", icon: Hexagon, exact: false },
  { href: "/app/cuadrillas", key: "cuadrillas", icon: Users, exact: false },
];

export default function BottomNav() {
  const path = usePathname();
  const t = useTranslations("nav");
  return (
    <nav className="sticky bottom-0 z-20 flex justify-around border-t bg-surface px-1 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2">
      {ITEMS.map(({ href, key, icon: Icon, exact }) => {
        const active = exact ? path === href : path.startsWith(href);
        const label = t(key);
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
