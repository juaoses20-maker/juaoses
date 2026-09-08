"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { Camera, MapPin, Trash2 } from "lucide-react";
import { savePhoto, deletePhoto, type PhotoSaveState } from "@/lib/data/actions";
import { getCoords, uploadPhoto } from "@/lib/photo-upload";
import type { Photo } from "@/lib/data/types";

const initial: PhotoSaveState = { error: null };

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const y = new Date();
  y.setDate(today.getDate() - 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(d, today)) return "Hoy";
  if (same(d, y)) return "Ayer";
  return d.toLocaleDateString("es-US", { day: "numeric", month: "short", year: "numeric" });
}

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-US", { hour: "2-digit", minute: "2-digit" });
}

export default function FotosUI({
  companyId,
  projectId,
  projectName,
  photos,
}: {
  companyId: string;
  projectId: string;
  projectName: string;
  photos: Photo[];
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [state, formAction] = useActionState(savePhoto, initial);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setErr(null);
    try {
      const { lat, lng } = await getCoords();
      const path = await uploadPhoto(companyId, projectId, file);
      const fd = new FormData();
      fd.set("projectId", projectId);
      fd.set("storagePath", path);
      if (lat != null) fd.set("lat", String(lat));
      if (lng != null) fd.set("lng", String(lng));
      startTransition(() => formAction(fd));
    } catch {
      setErr("No se pudo subir la foto. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  const busy = uploading || isPending;
  const groups = photos.reduce<Record<string, Photo[]>>((acc, p) => {
    const k = dayLabel(p.taken_at);
    (acc[k] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div>
      <div className="mt-2 flex flex-col">
        <h1 className="font-display text-[16px] font-semibold">Fotos GPS</h1>
        <p className="text-[10px] text-ink-3">
          {photos.length === 0
            ? projectName
            : `${photos.length} ${photos.length === 1 ? "foto" : "fotos"} · fecha, hora y coordenadas · ${projectName}`}
        </p>
      </div>

      {(err || state.error) && (
        <p className="mt-2 rounded-[10px] border border-[color:color-mix(in_oklab,var(--crit)_40%,transparent)] bg-[color:color-mix(in_oklab,var(--crit)_8%,transparent)] px-3 py-2 text-[12px] text-[var(--crit)]">
          {err ?? state.error}
        </p>
      )}

      {photos.length === 0 && !busy && (
        <div className="mt-8 grid place-items-center py-12 text-center">
          <div>
            <Camera className="mx-auto h-9 w-9 text-ink-3" strokeWidth={1.5} />
            <div className="mt-2.5 font-display text-[15px] font-semibold">Toma tu primera foto</div>
            <p className="mx-auto mt-1.5 max-w-[28ch] text-[11.5px] text-ink-2">
              Cada foto queda con fecha, hora y ubicación. Sirve de prueba de lo que se construyó.
            </p>
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-3.5 inline-flex h-[38px] items-center gap-1.5 rounded-btn bg-accent px-4 text-[12px] font-bold text-accent-ink"
            >
              <Camera className="h-4 w-4" strokeWidth={2.2} /> Tomar foto
            </button>
          </div>
        </div>
      )}

      {busy && (
        <div className="mt-3 flex items-center gap-2 rounded-[10px] border bg-surface px-3 py-2.5 text-[12px] text-ink-2">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-line border-t-accent" />
          Subiendo foto…
        </div>
      )}

      {Object.entries(groups).map(([label, items]) => (
        <div key={label}>
          <p className="mx-0.5 mb-2 mt-5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
            {label} · {items.length} {items.length === 1 ? "foto" : "fotos"}
          </p>
          <div className="grid grid-cols-3 gap-[5px]">
            {items.map((p) => (
              <div key={p.id} className="group relative aspect-square overflow-hidden rounded-[8px] border bg-surface-2">
                {p.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                )}
                <span className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-[linear-gradient(transparent,rgba(0,0,0,0.65))] px-1 py-[3px] font-mono text-[7px] text-white">
                  {p.lat != null && <MapPin className="h-2 w-2 flex-none" strokeWidth={2.5} />}
                  {timeLabel(p.taken_at)}
                  {p.lat != null && p.lng != null ? ` · ${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}` : ""}
                </span>
                <form action={deletePhoto} className="absolute right-1 top-1">
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="storagePath" value={p.storage_path} />
                  <button
                    type="submit"
                    aria-label="Eliminar foto"
                    className="grid h-6 w-6 place-items-center rounded-full bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" strokeWidth={2.2} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      ))}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFile}
      />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        aria-label="Tomar foto"
        className="fixed bottom-[76px] right-[calc(50%-230px+16px)] grid h-[46px] w-[46px] place-items-center rounded-full bg-[linear-gradient(180deg,color-mix(in_oklab,#fff_20%,var(--accent)),var(--accent))] text-accent-ink shadow-[0_10px_22px_color-mix(in_oklab,var(--accent)_38%,transparent)] disabled:opacity-50 max-[460px]:right-4"
      >
        <Camera className="h-[20px] w-[20px]" strokeWidth={2} />
      </button>
    </div>
  );
}
