"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { PHOTOS, PHOTOS_YESTERDAY, PHOTO_FILTERS } from "@/lib/seed";
import DemoBadge from "@/components/app/DemoBadge";

function Grid({ items }: { items: { at: string; gps: string; tint: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-[5px]">
      {items.map((p, i) => (
        <div
          key={i}
          className="relative aspect-square overflow-hidden rounded-[8px] border"
          style={{ background: p.tint }}
        >
          <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(0,0,0,0.6))] px-1 py-[3px] font-mono text-[7px] text-white">
            {p.at}
            {p.gps ? ` · ${p.gps}` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function FotosUI() {
  const [active, setActive] = useState("Todas");

  return (
    <div>
      <div className="mt-2 flex flex-col">
        <h1 className="font-display text-[16px] font-semibold">Fotos GPS</h1>
        <p className="text-[10px] text-ink-3">
          {PHOTOS.length + PHOTOS_YESTERDAY.length} fotos · fecha, hora y coordenadas
        </p>
        <DemoBadge />
      </div>

      <div className="my-2.5 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PHOTO_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={
              "flex-none rounded-full border px-2.5 py-1.5 text-[10.5px] font-semibold " +
              (active === f ? "border-accent bg-accent text-accent-ink" : "bg-surface text-ink-2")
            }
          >
            {f}
          </button>
        ))}
      </div>

      <Grid items={PHOTOS} />

      <p className="mx-0.5 mb-2 mt-5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
        Ayer · {PHOTOS_YESTERDAY.length} fotos
      </p>
      <Grid items={PHOTOS_YESTERDAY} />

      <button
        aria-label="Tomar foto"
        className="fixed bottom-[76px] right-[calc(50%-230px+16px)] grid h-[46px] w-[46px] place-items-center rounded-full bg-[linear-gradient(180deg,color-mix(in_oklab,#fff_20%,var(--accent)),var(--accent))] text-accent-ink shadow-[0_10px_22px_color-mix(in_oklab,var(--accent)_38%,transparent)] max-[460px]:right-4"
      >
        <Camera className="h-[20px] w-[20px]" strokeWidth={2} />
      </button>
    </div>
  );
}
