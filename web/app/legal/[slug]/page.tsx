import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

const SLUGS = ["terminos", "privacidad", "reembolso"] as const;
type Slug = (typeof SLUGS)[number];

const CONTACT_EMAIL = "eafibertrack@gmail.com";

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!SLUGS.includes(slug as Slug)) notFound();

  const t = await getTranslations("legal");

  return (
    <main className="min-h-dvh bg-bg text-ink">
      <div className="mx-auto max-w-[640px] px-6 py-12">
        <Link href="/" className="font-mono text-[12px] text-ink-3">
          {t("backHome")}
        </Link>
        <h1 className="mt-6 text-[26px] font-semibold">{t(slug as Slug)}</h1>
        <p className="mt-4 rounded-[10px] border border-dashed bg-surface px-4 py-3 text-[13px] text-ink-2">
          {t("draft")}
        </p>
        <p className="mt-6 text-[13px] leading-relaxed text-ink-2">
          {t.rich("contact", {
            mail: () => (
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
            ),
          })}
        </p>
        <p className="mt-8 rounded-[10px] bg-surface-2 px-4 py-3 text-[12px] text-ink-3">
          {t("disclaimer")}
        </p>
      </div>
    </main>
  );
}
