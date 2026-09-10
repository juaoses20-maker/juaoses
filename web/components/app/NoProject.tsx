import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FolderPlus } from "lucide-react";

type What = "registros" | "fotos" | "planos" | "tickets" | "cuadrillas";

export default async function NoProject({ what }: { what: What }) {
  const t = await getTranslations("noProject");
  return (
    <div className="grid flex-1 place-items-center py-16 text-center">
      <div>
        <FolderPlus className="mx-auto h-9 w-9 text-ink-3" strokeWidth={1.5} />
        <div className="mt-2.5 font-display text-[15px] font-semibold">{t("title")}</div>
        <p className="mx-auto mt-1.5 max-w-[28ch] text-[11.5px] text-ink-2">
          {t("body", { what: t(`what.${what}`) })}
        </p>
        <Link
          href="/app/proyectos"
          className="mt-3.5 inline-flex h-[38px] items-center rounded-btn bg-accent px-4 text-[12px] font-bold text-accent-ink"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
