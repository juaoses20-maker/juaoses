import Link from "next/link";
import { FolderPlus } from "lucide-react";

export default function NoProject({ what }: { what: string }) {
  return (
    <div className="grid flex-1 place-items-center py-16 text-center">
      <div>
        <FolderPlus className="mx-auto h-9 w-9 text-ink-3" strokeWidth={1.5} />
        <div className="mt-2.5 font-display text-[15px] font-semibold">Crea tu primer proyecto</div>
        <p className="mx-auto mt-1.5 max-w-[28ch] text-[11.5px] text-ink-2">
          Los {what} viven dentro de un proyecto. Crea uno para empezar.
        </p>
        <Link
          href="/app/proyectos"
          className="mt-3.5 inline-flex h-[38px] items-center rounded-btn bg-accent px-4 text-[12px] font-bold text-accent-ink"
        >
          Ir a Proyectos
        </Link>
      </div>
    </div>
  );
}
