export const ACTIVE_PROJECT_COOKIE = "eaft_project";

export const CREW_COLORS = ["#e8590c", "#3c6a89", "#5f7248", "#8a4f22", "#5a6b7a", "#7a5a1f"];

export type Project = {
  id: string;
  name: string;
  client: string | null;
  location: string | null;
  status: string;
};

export type Crew = {
  id: string;
  name: string;
  color: string;
  foreman: string | null;
  people: number;
  equipment: string[];
};

export type Ticket811 = {
  id: string;
  number: string;
  location: string | null;
  dig_start: string | null;
  expiration: string | null;
  life_days: number;
  status_manual: string | null;
  notes: string | null;
};

export type TicketStatus = "activo" | "por-vencer" | "vencido" | "cerrado";

/** Estado del ticket: manual "cerrado" manda; si no, se deriva de la fecha de vencimiento. */
export function ticketStatus(t: Pick<Ticket811, "expiration" | "status_manual">): {
  status: TicketStatus;
  label: string;
  daysLeft: number | null;
} {
  if (t.status_manual === "cerrado") return { status: "cerrado", label: "Cerrado", daysLeft: null };
  if (!t.expiration) return { status: "activo", label: "Activo", daysLeft: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(t.expiration + "T00:00:00");
  const daysLeft = Math.round((exp.getTime() - today.getTime()) / 86_400_000);

  if (daysLeft < 0) return { status: "vencido", label: "Vencido", daysLeft };
  if (daysLeft <= 3) return { status: "por-vencer", label: "Por vencer", daysLeft };
  return { status: "activo", label: "Activo", daysLeft };
}

/** ISO yyyy-mm-dd de hoy + n días. */
export function isoPlusDays(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export type Photo = {
  id: string;
  storage_path: string;
  url: string | null;
  lat: number | null;
  lng: number | null;
  taken_at: string;
  activity: string | null;
};

export const PHOTOS_BUCKET = "photos";

export type ProjectFormState = { error: string | null };
export type CrewFormState = { error: string | null; ok?: boolean };
export type TicketFormState = { error: string | null; ok?: boolean };
