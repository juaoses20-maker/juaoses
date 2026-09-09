"use client";

import {
  useActionState,
  useMemo,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Hand,
  MapPin,
  Maximize2,
  Spline,
  Trash2,
  Type as TypeIcon,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { addPlanMark, deletePlanMark, type MarkSaveState } from "@/lib/data/actions";
import {
  MARK_COLORS,
  PLAN_ACTIVITIES,
  type Crew,
  type MarkGeom,
  type Plan,
  type PlanMark,
} from "@/lib/data/types";

const initial: MarkSaveState = { error: null };
const nf = new Intl.NumberFormat("en-US");
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type XY = [number, number];
type Tool = "draw" | "marker" | "note" | "pan";
type View = { zoom: number; tx: number; ty: number };

type NormMark =
  | { shape: "path"; pts: XY[]; color: string }
  | { shape: "seg"; a: XY; b: XY; color: string }
  | { shape: "pt"; p: XY; label: string; color: string }
  | { shape: "text"; p: XY; text: string };

function norm(g: MarkGeom, fallbackColor: string): NormMark {
  if ("t" in g) {
    if (g.t === "path") return { shape: "path", pts: g.pts, color: g.color || fallbackColor };
    if (g.t === "seg") return { shape: "seg", a: g.a, b: g.b, color: g.color || fallbackColor };
    if (g.t === "pt")
      return { shape: "pt", p: g.p, label: g.label ?? "", color: g.color || fallbackColor };
    return { shape: "text", p: g.p, text: g.text };
  }
  if ("a" in g) return { shape: "seg", a: g.a, b: g.b, color: fallbackColor };
  return { shape: "pt", p: g.p, label: "", color: fallbackColor };
}

const TOOLS: { id: Tool; label: string; Icon: typeof Spline }[] = [
  { id: "draw", label: "Pincel", Icon: Spline },
  { id: "marker", label: "Marcador", Icon: MapPin },
  { id: "note", label: "Nota", Icon: TypeIcon },
  { id: "pan", label: "Mover", Icon: Hand },
];

export default function PlanEditor({
  plan,
  marks,
  crews,
}: {
  plan: Plan;
  marks: PlanMark[];
  crews: Crew[];
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const panRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  const [tool, setTool] = useState<Tool>("draw");
  const [color, setColor] = useState<string>(MARK_COLORS[0]);
  const [view, setView] = useState<View>({ zoom: 1, tx: 0, ty: 0 });
  const [ar, setAr] = useState<number>(
    plan.width && plan.height ? plan.width / plan.height : 4 / 3,
  );
  const [drawing, setDrawing] = useState<XY[] | null>(null);
  const [pendingPath, setPendingPath] = useState<XY[] | null>(null);
  const [pendingPoint, setPendingPoint] = useState<{ p: XY; kind: "marker" | "note" } | null>(null);

  const [activity, setActivity] = useState<string>(PLAN_ACTIVITIES[0]);
  const [feet, setFeet] = useState("");
  const [crewId, setCrewId] = useState("");
  const [label, setLabel] = useState("");
  const [noteText, setNoteText] = useState("");

  const [state, formAction] = useActionState(addPlanMark, initial);
  const [seenNonce, setSeenNonce] = useState<string | undefined>(undefined);

  const crewColor = useMemo(() => {
    const m = new Map(crews.map((c) => [c.id, c.color]));
    return (id: string | null) => (id && m.get(id)) || MARK_COLORS[0];
  }, [crews]);

  const normed = useMemo(
    () => marks.map((m) => ({ m, n: norm(m.geom, crewColor(m.crew_id)) })),
    [marks, crewColor],
  );
  const ptCount = normed.filter(({ n }) => n.shape === "pt").length;

  if (state.nonce && state.nonce !== seenNonce) {
    setSeenNonce(state.nonce);
    setPendingPath(null);
    setPendingPoint(null);
    setDrawing(null);
    setFeet("");
    setLabel("");
    setNoteText("");
  }

  const formOpen = pendingPath !== null || pendingPoint !== null;

  function ptFromEvent(e: RPointerEvent): XY {
    const r = imgRef.current?.getBoundingClientRect();
    if (!r || r.width === 0) return [0, 0];
    return [
      clamp((e.clientX - r.left) / r.width, 0, 1),
      clamp((e.clientY - r.top) / r.height, 0, 1),
    ];
  }

  function onPointerDown(e: RPointerEvent) {
    if (formOpen || plan.is_pdf) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    if (tool === "pan") {
      panRef.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
      return;
    }
    const p = ptFromEvent(e);
    if (tool === "draw") setDrawing([p]);
    else if (tool === "marker") {
      setLabel(String.fromCharCode(65 + (ptCount % 26)));
      setActivity("Handhole");
      setPendingPoint({ p, kind: "marker" });
    } else if (tool === "note") {
      setNoteText("");
      setPendingPoint({ p, kind: "note" });
    }
  }

  function onPointerMove(e: RPointerEvent) {
    if (tool === "pan" && panRef.current) {
      const s = panRef.current;
      setView((v) => ({ ...v, tx: s.tx + (e.clientX - s.x), ty: s.ty + (e.clientY - s.y) }));
      return;
    }
    if (tool === "draw" && drawing) {
      const p = ptFromEvent(e);
      const last = drawing[drawing.length - 1];
      if (Math.hypot(p[0] - last[0], p[1] - last[1]) > 0.004) setDrawing([...drawing, p]);
    }
  }

  function onPointerUp() {
    panRef.current = null;
    if (tool === "draw" && drawing) {
      if (drawing.length >= 2) setPendingPath(drawing);
      setDrawing(null);
    }
  }

  function zoomBy(factor: number) {
    setView((v) => {
      const zoom = clamp(v.zoom * factor, 1, 8);
      // origen de la transformación = centro: al alejar del todo, recentra.
      return zoom === 1 ? { zoom, tx: 0, ty: 0 } : { ...v, zoom };
    });
  }
  const resetView = () => setView({ zoom: 1, tx: 0, ty: 0 });

  const pathGeom = pendingPath
    ? JSON.stringify({ t: "path", pts: pendingPath, color })
    : "";
  const pointGeom = pendingPoint
    ? pendingPoint.kind === "marker"
      ? JSON.stringify({ t: "pt", p: pendingPoint.p, label: label.trim() || "•", color })
      : JSON.stringify({ t: "text", p: pendingPoint.p, text: noteText.trim() })
    : "";

  return (
    <div className="pb-2">
      <div className="flex items-center gap-2 pt-1">
        <Link href="/app/planos" className="grid h-8 w-8 place-items-center rounded-[8px] text-ink-3 hover:text-ink">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[14px] font-semibold">{plan.name}</div>
          <div className="text-[10px] text-ink-3">
            {marks.length} {marks.length === 1 ? "marca" : "marcas"} · {nf.format(plan.ft_marked)} ft marcados
          </div>
        </div>
      </div>

      {plan.is_pdf ? (
        <div className="mt-3 rounded-[12px] border bg-surface p-4 text-center shadow-[var(--shadow-1)]">
          <FileText className="mx-auto h-9 w-9 text-ink-3" strokeWidth={1.5} />
          <p className="mx-auto mt-2 max-w-[32ch] text-[12px] text-ink-2">
            Este plano es un PDF. Para dibujar la ruta encima, toma una foto de la hoja del plano y súbela.
          </p>
          {plan.url && (
            <a
              href={plan.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-btn border px-3 text-[12px] font-semibold text-ink"
            >
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} /> Abrir PDF
            </a>
          )}
        </div>
      ) : (
        <>
          {/* barra de herramientas */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {TOOLS.map(({ id, label: l, Icon }) => (
              <button
                key={id}
                onClick={() => setTool(id)}
                className={
                  "inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold " +
                  (tool === id ? "border-accent bg-accent text-accent-ink" : "bg-surface text-ink-2")
                }
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2} /> {l}
              </button>
            ))}
            <span className="mx-0.5 h-5 w-px bg-line" />
            <button onClick={() => zoomBy(1 / 1.4)} aria-label="Alejar" className="grid h-8 w-8 place-items-center rounded-full border bg-surface text-ink-2">
              <ZoomOut className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <button onClick={() => zoomBy(1.4)} aria-label="Acercar" className="grid h-8 w-8 place-items-center rounded-full border bg-surface text-ink-2">
              <ZoomIn className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <button onClick={resetView} aria-label="Ajustar" className="grid h-8 w-8 place-items-center rounded-full border bg-surface text-ink-2">
              <Maximize2 className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>

          {tool === "draw" && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-ink-3">Color</span>
              {MARK_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                  className={
                    "h-6 w-6 rounded-full border-2 " + (color === c ? "border-ink" : "border-white")
                  }
                  style={{ background: c }}
                />
              ))}
            </div>
          )}

          {/* lienzo */}
          <div
            className="relative mt-2 grid place-items-center overflow-hidden rounded-[12px] border bg-white"
            style={{ height: "min(68vh, 560px)", touchAction: "none", overscrollBehavior: "contain" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div
              className="relative origin-center will-change-transform"
              style={{
                aspectRatio: String(ar),
                maxWidth: "100%",
                maxHeight: "100%",
                width: ar >= 1 ? "100%" : "auto",
                height: ar >= 1 ? "auto" : "100%",
                transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.zoom})`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={plan.url ?? ""}
                alt={plan.name}
                onLoad={(e) => {
                  const el = e.currentTarget;
                  if (el.naturalWidth && el.naturalHeight)
                    setAr(el.naturalWidth / el.naturalHeight);
                }}
                className="block h-full w-full select-none"
                draggable={false}
              />
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
              >
                {normed.map(({ m, n }) =>
                  n.shape === "path" ? (
                    <polyline
                      key={m.id}
                      points={n.pts.map((p) => `${p[0]},${p[1]}`).join(" ")}
                      fill="none"
                      stroke={n.color}
                      strokeWidth={0.013}
                      strokeOpacity={0.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : n.shape === "seg" ? (
                    <line
                      key={m.id}
                      x1={n.a[0]}
                      y1={n.a[1]}
                      x2={n.b[0]}
                      y2={n.b[1]}
                      stroke={n.color}
                      strokeWidth={0.013}
                      strokeOpacity={0.6}
                      strokeLinecap="round"
                    />
                  ) : null,
                )}
                {drawing && drawing.length > 1 && (
                  <polyline
                    points={drawing.map((p) => `${p[0]},${p[1]}`).join(" ")}
                    fill="none"
                    stroke={color}
                    strokeWidth={0.013}
                    strokeOpacity={0.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {pendingPath && (
                  <polyline
                    points={pendingPath.map((p) => `${p[0]},${p[1]}`).join(" ")}
                    fill="none"
                    stroke={color}
                    strokeWidth={0.013}
                    strokeOpacity={0.85}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>

              {/* marcadores y notas (contra-escalados para tamaño constante) */}
              {normed.map(({ m, n }) => {
                if (n.shape !== "pt" && n.shape !== "text") return null;
                return (
                  <span
                    key={m.id}
                    className="absolute"
                    style={{
                      left: `${n.p[0] * 100}%`,
                      top: `${n.p[1] * 100}%`,
                      transform: `translate(-50%, -50%) scale(${1 / view.zoom})`,
                    }}
                  >
                    {n.shape === "pt" ? (
                      <span
                        className="grid h-6 min-w-6 place-items-center rounded-full border-2 border-white px-1 font-mono text-[10px] font-bold text-white shadow"
                        style={{ background: n.color }}
                      >
                        {n.label}
                      </span>
                    ) : (
                      <span className="whitespace-nowrap rounded-[6px] border bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-semibold text-ink shadow">
                        {n.text}
                      </span>
                    )}
                  </span>
                );
              })}
              {pendingPoint && (
                <span
                  className="absolute h-3 w-3 rounded-full border-2 border-white shadow"
                  style={{
                    left: `${pendingPoint.p[0] * 100}%`,
                    top: `${pendingPoint.p[1] * 100}%`,
                    background: color,
                    transform: `translate(-50%, -50%) scale(${1 / view.zoom})`,
                  }}
                />
              )}
            </div>

            {view.zoom > 1.02 && (
              <span className="pointer-events-none absolute bottom-1.5 right-2 rounded-full bg-black/45 px-2 py-0.5 font-mono text-[9px] text-white">
                {Math.round(view.zoom * 100)}%
              </span>
            )}
          </div>

          {!formOpen && (
            <div className="mt-2 flex items-center gap-2 rounded-[8px] bg-[var(--chip)] px-2.5 py-2 text-[11.5px] font-semibold text-accent">
              {tool === "draw"
                ? "Traza la ruta con el dedo, siguiendo la calle"
                : tool === "marker"
                  ? "Toca donde va el hub o handhole"
                  : tool === "note"
                    ? "Toca donde quieres una nota"
                    : "Arrastra para mover · usa + y − para acercar"}
            </div>
          )}

          {/* formulario: trazo terminado */}
          {pendingPath && (
            <form action={formAction} className="mt-2 space-y-2 rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]">
              <input type="hidden" name="planId" value={plan.id} />
              <input type="hidden" name="kind" value="seg" />
              <input type="hidden" name="geom" value={pathGeom} />
              <input type="hidden" name="activity" value={activity} />
              <input type="hidden" name="crewId" value={crewId} />
              <input type="hidden" name="qty" value={feet.replace(/[^\d.]/g, "") || "0"} />

              <div className="font-display text-[13px] font-semibold">¿Qué se construyó en esa ruta?</div>
              <div className="flex flex-wrap gap-1.5">
                {PLAN_ACTIVITIES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setActivity(a)}
                    className={
                      "rounded-full border px-2.5 py-1.5 text-[12px] font-semibold " +
                      (activity === a ? "border-accent bg-accent text-accent-ink" : "bg-surface text-ink-2")
                    }
                  >
                    {a}
                  </button>
                ))}
              </div>
              <label className="block">
                <span className="text-[11px] font-semibold text-ink-2">Pies construidos</span>
                <input
                  inputMode="numeric"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  placeholder="0"
                  className="mt-1 w-full rounded-[10px] border bg-surface px-3 py-2 font-mono text-[14px] font-semibold outline-none placeholder:text-ink-3"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold text-ink-2">Cuadrilla</span>
                <select
                  value={crewId}
                  onChange={(e) => setCrewId(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border bg-surface px-3 py-2 text-[13px] outline-none"
                >
                  <option value="">Sin asignar</option>
                  {crews.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              {state.error && <p className="text-[11px] text-[var(--crit)]">{state.error}</p>}
              <div className="flex gap-2 pt-0.5">
                <button type="submit" className="h-9 rounded-btn bg-accent px-3 text-[12px] font-bold text-accent-ink">
                  Guardar ruta
                </button>
                <button
                  type="button"
                  onClick={() => setPendingPath(null)}
                  className="h-9 px-3 text-[12px] font-semibold text-ink-3"
                >
                  Borrar y repetir
                </button>
              </div>
            </form>
          )}

          {/* formulario: marcador */}
          {pendingPoint?.kind === "marker" && (
            <form action={formAction} className="mt-2 space-y-2 rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]">
              <input type="hidden" name="planId" value={plan.id} />
              <input type="hidden" name="kind" value="pt" />
              <input type="hidden" name="geom" value={pointGeom} />
              <input type="hidden" name="activity" value={activity} />
              <input type="hidden" name="crewId" value={crewId} />
              <input type="hidden" name="qty" value="0" />

              <div className="font-display text-[13px] font-semibold">Marcador en el plano</div>
              <div className="flex gap-2">
                <label className="block w-24">
                  <span className="text-[11px] font-semibold text-ink-2">Etiqueta</span>
                  <input
                    value={label}
                    onChange={(e) => setLabel(e.target.value.slice(0, 6))}
                    className="mt-1 w-full rounded-[10px] border bg-surface px-3 py-2 text-center font-mono text-[14px] font-bold outline-none"
                  />
                </label>
                <label className="block flex-1">
                  <span className="text-[11px] font-semibold text-ink-2">Tipo</span>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    className="mt-1 w-full rounded-[10px] border bg-surface px-3 py-2 text-[13px] outline-none"
                  >
                    {PLAN_ACTIVITIES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-[11px] font-semibold text-ink-2">Cuadrilla</span>
                <select
                  value={crewId}
                  onChange={(e) => setCrewId(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border bg-surface px-3 py-2 text-[13px] outline-none"
                >
                  <option value="">Sin asignar</option>
                  {crews.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              {state.error && <p className="text-[11px] text-[var(--crit)]">{state.error}</p>}
              <div className="flex gap-2 pt-0.5">
                <button type="submit" className="h-9 rounded-btn bg-accent px-3 text-[12px] font-bold text-accent-ink">
                  Guardar marcador
                </button>
                <button
                  type="button"
                  onClick={() => setPendingPoint(null)}
                  className="h-9 px-3 text-[12px] font-semibold text-ink-3"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* formulario: nota */}
          {pendingPoint?.kind === "note" && (
            <form action={formAction} className="mt-2 space-y-2 rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]">
              <input type="hidden" name="planId" value={plan.id} />
              <input type="hidden" name="kind" value="pt" />
              <input type="hidden" name="geom" value={pointGeom} />
              <input type="hidden" name="activity" value="Nota" />
              <input type="hidden" name="qty" value="0" />

              <div className="font-display text-[13px] font-semibold">Nota en el plano</div>
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value.slice(0, 80))}
                placeholder="Ej. Roca a 4 ft, pedir hidrovac"
                className="w-full rounded-[10px] border bg-surface px-3 py-2 text-[13px] outline-none placeholder:text-ink-3"
              />
              {state.error && <p className="text-[11px] text-[var(--crit)]">{state.error}</p>}
              <div className="flex gap-2 pt-0.5">
                <button
                  type="submit"
                  disabled={noteText.trim().length === 0}
                  className="h-9 rounded-btn bg-accent px-3 text-[12px] font-bold text-accent-ink disabled:opacity-50"
                >
                  Guardar nota
                </button>
                <button
                  type="button"
                  onClick={() => setPendingPoint(null)}
                  className="h-9 px-3 text-[12px] font-semibold text-ink-3"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {marks.length > 0 && (
        <>
          <p className="mx-0.5 mb-2 mt-5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
            Marcas de producción
          </p>
          <div className="overflow-hidden rounded-[12px] border bg-surface shadow-[var(--shadow-1)]">
            {normed.map(({ m, n }) => {
              const crew = crews.find((c) => c.id === m.crew_id);
              const title =
                n.shape === "text"
                  ? `Nota: ${n.text}`
                  : n.shape === "pt"
                    ? `${n.label} · ${m.activity}`
                    : `${nf.format(m.qty)} ft · ${m.activity}`;
              return (
                <div key={m.id} className="flex items-center gap-2.5 border-b px-3 py-2.5 text-[11.5px] last:border-b-0">
                  <span
                    className="h-2.5 w-2.5 flex-none rounded-[3px]"
                    style={{ background: "color" in n ? n.color : "var(--ink-3)" }}
                  />
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{title}</div>
                    <div className="text-[10px] text-ink-2">{crew ? crew.name : "Sin cuadrilla"}</div>
                  </div>
                  <form action={deletePlanMark} className="ml-auto flex-none">
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="planId" value={plan.id} />
                    <button
                      type="submit"
                      aria-label="Eliminar marca"
                      className="grid h-7 w-7 place-items-center rounded-[7px] text-ink-3 hover:text-[var(--crit)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
