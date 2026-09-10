"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { Camera, MapPin, Trash2 } from "lucide-react";
import { savePhoto, deletePhoto, type PhotoSaveState } from "@/lib/data/actions";
import { getCoords, uploadPhoto } from "@/lib/photo-upload";
import type { Photo } from "@/lib/data/types";

const initial: PhotoSaveState = { error: null };

type Pending = { path: string; lat: number | null; lng: number | null };

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

function dateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("es-US", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function FotosUI({
  companyId,
  companyName,
  projectId,
  projectName,
  photos,
}: {
  companyId: string;
  companyName: string;
  projectId: string;
  projectName: string;
  photos: Photo[];
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [state, formAction] = useActionState(savePhoto, initial);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [where, setWhere] = useState("");
  const [seenNonce, setSeenNonce] = useState<string | undefined>(undefined);

  if (state.nonce && state.nonce !== seenNonce) {
    setSeenNonce(state.nonce);
    setPending(null);
    setWhere("");
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setErr(null);
    try {
      const { lat, lng } = await getCoords();
      const path = await uploadPhoto(companyId, projectId, file);
      setPending({ path, lat, lng });
      setWhere("");
    } catch {
      setErr("No se pudo subir la foto. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  function submitPending(skipLocation = false) {
    if (!pending) return;
    const fd = new FormData();
    fd.set("projectId", projectId);
    fd.set("storagePath", pending.path);
    if (pending.lat != null) fd.set("lat", String(pending.lat));
    if (pending.lng != null) fd.set("lng", String(pending.lng));
    if (!skipLocation && where.trim()) fd.set("location", where.trim());
    startTransition(() => formAction(fd));
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
            : `${photos.length} ${photos.length === 1 ? "foto" : "fotos"} · ${companyName} · ${projectName}`}
        </p>
      </div>

      {(err || state.error) && (
        <p className="mt-2 rounded-[10px] border border-[color:color-mix(in_oklab,var(--crit)_40%,transparent)] bg-[color:color-mix(in_oklab,var(--crit)_8%,transparent)] px-3 py-2 text-[12px] text-[var(--crit)]">
          {err ?? state.error}
        </p>
      )}

      {pending && (
        <div className="mt-3 rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]">
          <div className="font-display text-[13px] font-semibold">¿Dónde se tomó esta foto?</div>
          <p className="mt-0.5 text-[10px] text-ink-3">
            Queda con la fecha, {pending.lat != null ? "las coordenadas" : "sin GPS"} y el nombre {companyName}.
          </p>
          <input
            autoFocus
            value={where}
            onChange={(e) => setWhere(e.target.value.slice(0, 120))}
            placeholder="Ej. Frederica St & Parrish Ave"
            className="mt-2 w-full rounded-[10px] border bg-surface px-3 py-2 text-[13px] outline-none placeholder:text-ink-3"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitPending();
              }
            }}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => submitPending()}
              disabled={busy}
              className="h-9 rounded-btn bg-accent px-4 text-[12px] font-bold text-accent-ink disabled:opacity-50"
            >
              {busy ? "Guardando…" : "Guardar foto"}
            </button>
            <button
              onClick={() => submitPending(true)}
              disabled={busy}
              className="h-9 px-3 text-[12px] font-semibold text-ink-3 disabled:opacity-50"
            >
              Omitir lugar
            </button>
          </div>
        </div>
      )}

      {photos.length === 0 && !busy && !pending && (
        <div className="mt-8 grid place-items-center py-12 text-center">
          <div>
            <Camera className="mx-auto h-9 w-9 text-ink-3" strokeWidth={1.5} />
            <div className="mt-2.5 font-display text-[15px] font-semibold">Toma tu primera foto</div>
            <p className="mx-auto mt-1.5 max-w-[28ch] text-[11.5px] text-ink-2">
              Cada foto queda con fecha, ubicación y el nombre {companyName}. Sirve de prueba de lo que se construyó.
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
          {uploading ? "Subiendo foto…" : "Guardando…"}
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
                <span className="absolute inset-x-0 top-0 truncate bg-[linear-gradient(rgba(0,0,0,0.6),transparent)] px-1 py-[3px] font-mono text-[7px] font-semibold uppercase tracking-[0.04em] text-white">
                  {companyName}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex flex-col gap-[1px] bg-[linear-gradient(transparent,rgba(0,0,0,0.7))] px-1 py-[3px] font-mono text-[7px] text-white">
                  <span>{dateLabel(p.taken_at)} · {timeLabel(p.taken_at)}</span>
                  <span className="flex items-center gap-0.5 truncate">
                    {(p.location || p.lat != null) && <MapPin className="h-2 w-2 flex-none" strokeWidth={2.5} />}
                    {p.location
                      ? p.location
                      : p.lat != null && p.lng != null
                        ? `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`
                        : "Sin ubicación"}
                  </span>
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
