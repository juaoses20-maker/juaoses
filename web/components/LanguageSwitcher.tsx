"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { setLanguage } from "@/lib/i18n-actions";
import type { Locale } from "@/lib/i18n";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [pending, start] = useTransition();
  const next: Locale = locale === "es" ? "en" : "es";

  return (
    <button
      type="button"
      disabled={pending}
      aria-label={locale === "es" ? "Switch to English" : "Cambiar a Español"}
      onClick={() =>
        start(async () => {
          await setLanguage(next);
          router.refresh();
        })
      }
      className={
        "inline-flex h-8 items-center gap-1 rounded-full border bg-surface px-2.5 font-mono text-[11px] font-semibold text-ink-2 transition-colors hover:text-ink disabled:opacity-50 " +
        className
      }
    >
      <Languages className="h-3.5 w-3.5" strokeWidth={2} />
      {next.toUpperCase()}
    </button>
  );
}
