/** Datos de ejemplo — proyecto de OSP en Owensboro, KY.
 *  (32 · "LA APP NUNCA SE ENSEÑA VACÍA"). Se reemplazan por datos de Supabase
 *  en la fase de servicios externos. */

export const PROJECT = {
  name: "Fibra Owensboro — Fase 2",
  client: "Owensboro Municipal Utilities",
  location: "Owensboro, KY",
};

export type Crew = {
  id: string;
  name: string;
  color: string;
  foreman: string;
  people: number;
  equipment: string[];
  lastSeen: string;
  ftToday: number;
  extraToday?: string;
};

export const CREWS: Crew[] = [
  {
    id: "a",
    name: "Cuadrilla A — Bore",
    color: "#e8590c",
    foreman: "Miguel Santos",
    people: 4,
    equipment: ["Vermeer D24x40", "Vac-Tron"],
    lastSeen: "hace 25 min",
    ftToday: 1850,
    extraToday: "3 HH hoy",
  },
  {
    id: "b",
    name: "Cuadrilla B — Zanja",
    color: "#3c6a89",
    foreman: "David Nguyen",
    people: 3,
    equipment: ["Ditch Witch RT45", "Mini-ex"],
    lastSeen: "hace 8 min",
    ftToday: 2400,
  },
  {
    id: "c",
    name: "Cuadrilla C — Splice",
    color: "#5f7248",
    foreman: "Ray Ortiz",
    people: 2,
    equipment: ["Splice trailer"],
    lastSeen: "hace 2 h",
    ftToday: 0,
    extraToday: "6 cierres hoy",
  },
];

export const TODAY_ACTIVITY = [
  { crew: "Cuadrilla A", activity: "HDD Bore", sta: "STA 12+00 → 30+50", at: "9:41", ft: 1850 },
  { crew: "Cuadrilla B", activity: "Zanja", sta: "STA 0+00 → 24+00", at: "8:15", ft: 2400 },
];

export const FT_TODAY = TODAY_ACTIVITY.reduce((s, a) => s + a.ft, 0);

export type Ticket = {
  number: string;
  location: string;
  status: "activo" | "por-vencer" | "vencido";
  detail: string;
  meta: string[];
  renewable: boolean;
};

export const TICKETS: Ticket[] = [
  {
    number: "2024-2208891",
    location: "Frederica St, 1800–2100 blk",
    status: "vencido",
    detail: "Vencido",
    meta: ["Excavó 18 ago", "Venció ayer"],
    renewable: true,
  },
  {
    number: "2024-2210455",
    location: "Parrish Ave & Triplett St",
    status: "por-vencer",
    detail: "Por vencer",
    meta: ["Vence 3 sep", "📎 2 fotos"],
    renewable: true,
  },
  {
    number: "2024-2214788",
    location: "Southtown Blvd & Carter Rd",
    status: "activo",
    detail: "Activo",
    meta: ["Vence 12 sep", "5 días"],
    renewable: false,
  },
  {
    number: "2024-2215002",
    location: "Booth Ave & Bellevue St",
    status: "activo",
    detail: "Activo",
    meta: ["Vence 18 sep", "18 días"],
    renewable: false,
  },
  {
    number: "2024-2216110",
    location: "Old Hartford Rd & Tamarack Rd",
    status: "activo",
    detail: "Activo",
    meta: ["Vence 23 sep", "23 días"],
    renewable: false,
  },
  {
    number: "2024-2201773",
    location: "Byers Ave & E 4th St",
    status: "activo",
    detail: "Cerrado",
    meta: ["Trabajo completo"],
    renewable: false,
  },
];

export const TICKETS_AT_RISK = TICKETS.filter(
  (t) => t.status === "vencido" || t.status === "por-vencer",
).length;

export const PLAN_MARKS = [
  { kind: "seg" as const, label: "1 850 ft · HDD Bore", sub: "Cuadrilla A · registro creado", ft: 1850 },
  { kind: "pt" as const, label: "1 ea · Handhole", sub: "HH-12 · Cuadrilla A", ft: 0 },
  { kind: "seg" as const, label: "1 200 ft · Zanja", sub: "Cuadrilla B", ft: 1200 },
];

export const PLANS = [
  { id: "c3", name: "Sheet C-3 — Frederica / Parrish", marks: PLAN_MARKS.length, ftMarked: 3050 },
];

export const PHOTOS = [
  { at: "9:41", gps: "37.774,−87.113", tint: "#b45a1e" },
  { at: "9:12", gps: "37.772,−87.115", tint: "#3c6a89" },
  { at: "8:47", gps: "37.776,−87.110", tint: "#7a5a1f" },
  { at: "8:20", gps: "37.771,−87.117", tint: "#2f7d3a" },
  { at: "7:58", gps: "37.777,−87.106", tint: "#8a4f22" },
  { at: "7:30", gps: "37.773,−87.114", tint: "#5a6b7a" },
];

export const PHOTOS_YESTERDAY = [
  { at: "16:40", gps: "", tint: "#9a5a2a" },
  { at: "15:10", gps: "", tint: "#4a5a6a" },
  { at: "14:02", gps: "", tint: "#6a5a3a" },
];

export const PHOTO_FILTERS = ["Todas", "Cuadrilla A", "Cuadrilla B", "Bore", "Zanja", "Hoy"];

export const STREAK_DAYS = 6;
