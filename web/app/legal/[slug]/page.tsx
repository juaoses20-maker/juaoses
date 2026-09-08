import Link from "next/link";
import { notFound } from "next/navigation";

const DOCS: Record<string, string> = {
  terminos: "Términos y Condiciones",
  privacidad: "Política de Privacidad",
  reembolso: "Política de Reembolso",
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = DOCS[slug];
  if (!title) notFound();

  return (
    <main className="min-h-dvh bg-bg text-ink">
      <div className="mx-auto max-w-[640px] px-6 py-12">
        <Link href="/" className="font-mono text-[12px] text-ink-3">
          ← EA Fiber Track
        </Link>
        <h1 className="mt-6 text-[26px] font-semibold">{title}</h1>
        <p className="mt-4 rounded-[10px] border border-dashed bg-surface px-4 py-3 text-[13px] text-ink-2">
          Documento en preparación. Se publicará antes de abrir la venta.
        </p>
        <p className="mt-6 text-[13px] leading-relaxed text-ink-2">
          Mientras tanto, para cualquier consulta escríbenos a{" "}
          <a href="mailto:hola@eafibertrack.com" className="underline underline-offset-2">
            hola@eafibertrack.com
          </a>
          .
        </p>
        <p className="mt-8 rounded-[10px] bg-surface-2 px-4 py-3 text-[12px] text-ink-3">
          EA Fiber Track no reemplaza la llamada al 811 ni confirma el estado oficial de un locate. Verifica siempre con el centro 811 de tu estado antes de excavar.
        </p>
      </div>
    </main>
  );
}
