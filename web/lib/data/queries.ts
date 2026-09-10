import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  ACTIVE_PROJECT_COOKIE,
  PHOTOS_BUCKET,
  PLANS_BUCKET,
  type Crew,
  type MarkGeom,
  type Photo,
  type Plan,
  type PlanMark,
  type Project,
  type Ticket811,
} from "@/lib/data/types";

export async function listProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id, name, client, location, status")
    .order("created_at", { ascending: false });
  return data ?? [];
}

/** Proyecto activo: la cookie si sigue siendo válida, si no el más reciente. */
export async function getActiveProject(): Promise<Project | null> {
  const projects = await listProjects();
  if (projects.length === 0) return null;
  const wanted = (await cookies()).get(ACTIVE_PROJECT_COOKIE)?.value;
  return projects.find((p) => p.id === wanted) ?? projects[0];
}

export async function listCrews(projectId: string): Promise<Crew[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("crews")
    .select("id, name, color, foreman, people, equipment")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  return (data ?? []) as Crew[];
}

export async function listTickets(projectId: string): Promise<Ticket811[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tickets811")
    .select("id, number, location, dig_start, expiration, life_days, status_manual, notes, plan_page")
    .eq("project_id", projectId)
    .order("expiration", { ascending: true, nullsFirst: false });
  return (data ?? []) as Ticket811[];
}

function isPdf(path: string) {
  return path.toLowerCase().endsWith(".pdf");
}

export async function listPlans(projectId: string): Promise<Plan[]> {
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("plans")
    .select("id, name, storage_path, width, height")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  const rows = plans ?? [];
  if (rows.length === 0) return [];

  const [{ data: signed }, { data: marks }] = await Promise.all([
    supabase.storage.from(PLANS_BUCKET).createSignedUrls(rows.map((r) => r.storage_path), 60 * 60),
    supabase.from("plan_marks").select("plan_id, qty").in("plan_id", rows.map((r) => r.id)),
  ]);
  const urlByPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  const agg = new Map<string, { count: number; ft: number }>();
  for (const m of marks ?? []) {
    const cur = agg.get(m.plan_id) ?? { count: 0, ft: 0 };
    cur.count += 1;
    cur.ft += Number(m.qty) || 0;
    agg.set(m.plan_id, cur);
  }

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    storage_path: r.storage_path,
    url: urlByPath.get(r.storage_path) ?? null,
    width: r.width,
    height: r.height,
    is_pdf: isPdf(r.storage_path),
    mark_count: agg.get(r.id)?.count ?? 0,
    ft_marked: Math.round(agg.get(r.id)?.ft ?? 0),
  }));
}

export async function getPlan(
  planId: string,
): Promise<{ plan: Plan; marks: PlanMark[] } | null> {
  const supabase = await createClient();
  const { data: r } = await supabase
    .from("plans")
    .select("id, name, storage_path, width, height")
    .eq("id", planId)
    .maybeSingle();
  if (!r) return null;

  const [{ data: signed }, { data: marks }] = await Promise.all([
    supabase.storage.from(PLANS_BUCKET).createSignedUrl(r.storage_path, 60 * 60),
    supabase
      .from("plan_marks")
      .select("id, kind, geom, activity, qty, unit, note, crew_id")
      .eq("plan_id", planId)
      .order("at", { ascending: false }),
  ]);

  return {
    plan: {
      id: r.id,
      name: r.name,
      storage_path: r.storage_path,
      url: signed?.signedUrl ?? null,
      width: r.width,
      height: r.height,
      is_pdf: isPdf(r.storage_path),
      mark_count: (marks ?? []).length,
      ft_marked: Math.round((marks ?? []).reduce((s, m) => s + (Number(m.qty) || 0), 0)),
    },
    marks: (marks ?? []).map((m) => ({
      id: m.id,
      kind: m.kind as PlanMark["kind"],
      geom: m.geom as MarkGeom,
      activity: m.activity,
      qty: Number(m.qty) || 0,
      unit: m.unit,
      note: m.note,
      crew_id: m.crew_id,
    })),
  };
}

export type RecentMark = {
  id: string;
  kind: "seg" | "pt";
  activity: string;
  qty: number;
  plan_id: string;
  plan_name: string;
  at: string;
};

export async function listRecentMarks(projectId: string, limit = 6): Promise<RecentMark[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("plan_marks")
    .select("id, kind, activity, qty, plan_id, at, plans!inner(name, project_id)")
    .eq("plans.project_id", projectId)
    .order("at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((m) => {
    const rel = m.plans as unknown as { name: string } | { name: string }[];
    const plan_name = Array.isArray(rel) ? (rel[0]?.name ?? "Plano") : rel.name;
    return {
      id: m.id as string,
      kind: (m.kind as "seg" | "pt") ?? "seg",
      activity: m.activity as string,
      qty: Number(m.qty) || 0,
      plan_id: m.plan_id as string,
      plan_name,
      at: m.at as string,
    };
  });
}

export async function listPhotos(projectId: string): Promise<Photo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("photos")
    .select("id, storage_path, lat, lng, taken_at, activity, location")
    .eq("project_id", projectId)
    .order("taken_at", { ascending: false })
    .limit(120);

  const rows = data ?? [];
  if (rows.length === 0) return [];

  const { data: signed } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .createSignedUrls(
      rows.map((r) => r.storage_path),
      60 * 60,
    );
  const urlByPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  return rows.map((r) => ({
    id: r.id,
    storage_path: r.storage_path,
    url: urlByPath.get(r.storage_path) ?? null,
    lat: r.lat,
    lng: r.lng,
    taken_at: r.taken_at,
    activity: r.activity,
    location: r.location ?? null,
  }));
}
