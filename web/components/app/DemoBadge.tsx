/** Marca visible: la pantalla todavía muestra datos de ejemplo (se conecta a datos reales en el paso 3). */
export default function DemoBadge() {
  return (
    <span className="mt-1 inline-flex w-fit self-start items-center gap-1 rounded-full border border-dashed bg-surface px-2 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.06em] text-ink-3">
      Datos de ejemplo
    </span>
  );
}
