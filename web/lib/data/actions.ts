"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserContext } from "@/lib/supabase/context";
import {
  ACTIVE_PROJECT_COOKIE,
  CREW_COLORS,
  isoPlusDays,
  PHOTOS_BUCKET,
  PLANS_BUCKET,
  type CrewFormState,
  type ProjectFormState,
  type TicketFormState,
} from "@/lib/data/types";

const YEAR = 60 * 60 * 24 * 365;

function eq(raw: FormDataEntryValue | null) {
  return String(raw ?? "").trim();
}

// ───────────────────────── proyectos ─────────────────────────

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const ctx = await getUserContext();
  if (!ctx?.companyId) redirect("/bienvenido");

  const name = eq(formData.get("name"));
  const client = eq(formData.get("client"));
  const location = eq(formData.get("location"));
  if (name.length < 2) return { error: "Escribe el nombre del proyecto." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({ company_id: ctx.companyId, name, client: client || null, location: location || null })
    .select("id")
    .single();

  if (error || !data) return { error: "No pudimos crear el proyecto. Inténtalo de nuevo." };

  (await cookies()).set(ACTIVE_PROJECT_COOKIE, data.id, { path: "/", maxAge: YEAR });
  revalidatePath("/app", "layout");
  redirect("/app");
}

export async function renameProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const id = eq(formData.get("id"));
  const name = eq(formData.get("name"));
  const client = eq(formData.get("client"));
  const location = eq(formData.get("location"));
  if (!id) return { error: "Proyecto no encontrado." };
  if (name.length < 2) return { error: "Escribe el nombre del proyecto." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ name, client: client || null, location: location || null })
    .eq("id", id);

  if (error) return { error: "No pudimos guardar los cambios." };
  revalidatePath("/app", "layout");
  return { error: null };
}

export async function setActiveProject(formData: FormData): Promise<void> {
  const id = eq(formData.get("id"));
  if (id) (await cookies()).set(ACTIVE_PROJECT_COOKIE, id, { path: "/", maxAge: YEAR });
  revalidatePath("/app", "layout");
  redirect("/app");
}

// ───────────────────────── cuadrillas ─────────────────────────

function parseEquipment(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export async function createCrew(
  _prev: CrewFormState,
  formData: FormData,
): Promise<CrewFormState> {
  const ctx = await getUserContext();
  if (!ctx?.companyId) redirect("/bienvenido");

  const projectId = eq(formData.get("projectId"));
  const name = eq(formData.get("name"));
  const foreman = eq(formData.get("foreman"));
  const people = Number.parseInt(eq(formData.get("people")) || "0", 10) || 0;
  const equipment = parseEquipment(eq(formData.get("equipment")));
  if (!projectId) return { error: "Elige un proyecto primero." };
  if (name.length < 2) return { error: "Escribe el nombre de la cuadrilla." };

  const supabase = await createClient();
  const { count } = await supabase
    .from("crews")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId);

  const { error } = await supabase.from("crews").insert({
    company_id: ctx.companyId,
    project_id: projectId,
    name,
    foreman: foreman || null,
    people,
    equipment,
    color: CREW_COLORS[(count ?? 0) % CREW_COLORS.length],
  });

  if (error) return { error: "No pudimos crear la cuadrilla. Inténtalo de nuevo." };
  revalidatePath("/app/cuadrillas");
  return { error: null, ok: true };
}

export async function updateCrew(
  _prev: CrewFormState,
  formData: FormData,
): Promise<CrewFormState> {
  const id = eq(formData.get("id"));
  const name = eq(formData.get("name"));
  const foreman = eq(formData.get("foreman"));
  const people = Number.parseInt(eq(formData.get("people")) || "0", 10) || 0;
  const equipment = parseEquipment(eq(formData.get("equipment")));
  if (!id) return { error: "Cuadrilla no encontrada." };
  if (name.length < 2) return { error: "Escribe el nombre de la cuadrilla." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("crews")
    .update({ name, foreman: foreman || null, people, equipment })
    .eq("id", id);

  if (error) return { error: "No pudimos guardar los cambios." };
  revalidatePath("/app/cuadrillas");
  return { error: null, ok: true };
}

export async function deleteCrew(formData: FormData): Promise<void> {
  const id = eq(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("crews").delete().eq("id", id);
  revalidatePath("/app/cuadrillas");
}

// ───────────────────────── tickets 811 ─────────────────────────

const LIFE_DAYS = 21; // Kentucky 811: ticket válido 21 días calendario

export async function createTicket(
  _prev: TicketFormState,
  formData: FormData,
): Promise<TicketFormState> {
  const ctx = await getUserContext();
  if (!ctx?.companyId) redirect("/bienvenido");

  const projectId = eq(formData.get("projectId"));
  const number = eq(formData.get("number"));
  const location = eq(formData.get("location"));
  const digStart = eq(formData.get("dig_start")) || isoPlusDays(0);
  const planPage = eq(formData.get("plan_page"));
  if (!projectId) return { error: "Elige un proyecto primero." };
  if (number.length < 4) return { error: "Escribe el número del ticket 811." };

  const expiration = eq(formData.get("expiration")) || isoPlusDaysFrom(digStart, LIFE_DAYS);
  if (expiration < digStart) return { error: "La fecha de expiración no puede ser antes de la de inicio." };

  const supabase = await createClient();
  const { error } = await supabase.from("tickets811").insert({
    company_id: ctx.companyId,
    project_id: projectId,
    number,
    location: location || null,
    dig_start: digStart,
    expiration,
    life_days: LIFE_DAYS,
    plan_page: planPage || null,
  });

  if (error) return { error: "No pudimos guardar el ticket. Inténtalo de nuevo." };
  revalidatePath("/app/811");
  revalidatePath("/app");
  return { error: null, ok: true };
}

export async function updateTicket(
  _prev: TicketFormState,
  formData: FormData,
): Promise<TicketFormState> {
  const id = eq(formData.get("id"));
  const number = eq(formData.get("number"));
  const location = eq(formData.get("location"));
  const digStart = eq(formData.get("dig_start"));
  const expiration = eq(formData.get("expiration"));
  const planPage = eq(formData.get("plan_page"));
  const closed = eq(formData.get("closed")) === "on";
  if (!id) return { error: "Ticket no encontrado." };
  if (number.length < 4) return { error: "Escribe el número del ticket 811." };
  if (digStart && expiration && expiration < digStart)
    return { error: "La fecha de expiración no puede ser antes de la de inicio." };

  const patch: Record<string, unknown> = {
    number,
    location: location || null,
    status_manual: closed ? "cerrado" : null,
    plan_page: planPage || null,
  };
  if (digStart) patch.dig_start = digStart;
  if (expiration) patch.expiration = expiration;
  else if (digStart) patch.expiration = isoPlusDaysFrom(digStart, LIFE_DAYS);

  const supabase = await createClient();
  const { error } = await supabase.from("tickets811").update(patch).eq("id", id);

  if (error) return { error: "No pudimos guardar los cambios." };
  revalidatePath("/app/811");
  revalidatePath("/app");
  return { error: null, ok: true };
}

export async function renewTicket(formData: FormData): Promise<void> {
  const id = eq(formData.get("id"));
  if (!id) return;
  const digStart = isoPlusDays(0);
  const supabase = await createClient();
  await supabase
    .from("tickets811")
    .update({
      dig_start: digStart,
      expiration: isoPlusDaysFrom(digStart, LIFE_DAYS),
      status_manual: null,
    })
    .eq("id", id);
  revalidatePath("/app/811");
  revalidatePath("/app");
}

export async function deleteTicket(formData: FormData): Promise<void> {
  const id = eq(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("tickets811").delete().eq("id", id);
  revalidatePath("/app/811");
  revalidatePath("/app");
}

/** yyyy-mm-dd = base + n días. */
function isoPlusDaysFrom(baseIso: string, days: number): string {
  const d = new Date(baseIso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ───────────────────────── fotos GPS ─────────────────────────

export type PhotoSaveState = { error: string | null; ok?: boolean };

/** Guarda la fila de la foto. El archivo ya se subió a Storage desde el navegador. */
export async function savePhoto(
  _prev: PhotoSaveState,
  formData: FormData,
): Promise<PhotoSaveState> {
  const ctx = await getUserContext();
  if (!ctx?.companyId) redirect("/bienvenido");

  const projectId = eq(formData.get("projectId"));
  const storagePath = eq(formData.get("storagePath"));
  const latRaw = eq(formData.get("lat"));
  const lngRaw = eq(formData.get("lng"));
  const activity = eq(formData.get("activity"));
  if (!projectId || !storagePath) return { error: "Falta la foto o el proyecto." };
  if (!storagePath.startsWith(ctx.companyId + "/")) return { error: "Ruta de archivo inválida." };

  const supabase = await createClient();
  const { error } = await supabase.from("photos").insert({
    company_id: ctx.companyId,
    project_id: projectId,
    storage_path: storagePath,
    lat: latRaw ? Number(latRaw) : null,
    lng: lngRaw ? Number(lngRaw) : null,
    activity: activity || null,
  });

  if (error) {
    await supabase.storage.from(PHOTOS_BUCKET).remove([storagePath]);
    return { error: "No pudimos guardar la foto. Inténtalo de nuevo." };
  }
  revalidatePath("/app/fotos");
  return { error: null, ok: true };
}

export async function deletePhoto(formData: FormData): Promise<void> {
  const id = eq(formData.get("id"));
  const path = eq(formData.get("storagePath"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("photos").delete().eq("id", id);
  if (path) await supabase.storage.from(PHOTOS_BUCKET).remove([path]);
  revalidatePath("/app/fotos");
}

// ───────────────────────── planos + marcas ─────────────────────────

export type PlanSaveState = { error: string | null; ok?: boolean; planId?: string };

/** Registra el plano. El archivo ya se subió a Storage desde el navegador. */
export async function savePlan(
  _prev: PlanSaveState,
  formData: FormData,
): Promise<PlanSaveState> {
  const ctx = await getUserContext();
  if (!ctx?.companyId) redirect("/bienvenido");

  const projectId = eq(formData.get("projectId"));
  const storagePath = eq(formData.get("storagePath"));
  const name = eq(formData.get("name"));
  const width = Number(eq(formData.get("width"))) || null;
  const height = Number(eq(formData.get("height"))) || null;
  if (!projectId || !storagePath) return { error: "Falta el archivo o el proyecto." };
  if (!storagePath.startsWith(ctx.companyId + "/")) return { error: "Ruta de archivo inválida." };
  if (name.length < 2) return { error: "Ponle un nombre al plano." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plans")
    .insert({
      company_id: ctx.companyId,
      project_id: projectId,
      name,
      storage_path: storagePath,
      width,
      height,
    })
    .select("id")
    .single();

  if (error || !data) {
    await supabase.storage.from(PLANS_BUCKET).remove([storagePath]);
    return { error: "No pudimos guardar el plano. Inténtalo de nuevo." };
  }
  revalidatePath("/app/planos");
  return { error: null, ok: true, planId: data.id };
}

export async function deletePlan(formData: FormData): Promise<void> {
  const id = eq(formData.get("id"));
  const path = eq(formData.get("storagePath"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("plans").delete().eq("id", id);
  if (path) await supabase.storage.from(PLANS_BUCKET).remove([path]);
  revalidatePath("/app/planos");
  redirect("/app/planos");
}

export type MarkSaveState = { error: string | null; ok?: boolean; nonce?: string };

export async function addPlanMark(
  _prev: MarkSaveState,
  formData: FormData,
): Promise<MarkSaveState> {
  const ctx = await getUserContext();
  if (!ctx?.companyId) redirect("/bienvenido");

  const planId = eq(formData.get("planId"));
  const kind = eq(formData.get("kind")) === "pt" ? "pt" : "seg";
  const activity = eq(formData.get("activity"));
  const qty = Number(eq(formData.get("qty"))) || 0;
  const crewId = eq(formData.get("crewId"));
  const note = eq(formData.get("note"));
  const geomRaw = eq(formData.get("geom"));
  if (!planId || !geomRaw) return { error: "Marca incompleta." };
  if (!activity) return { error: "Elige la actividad." };

  let geom: Record<string, unknown>;
  try {
    geom = JSON.parse(geomRaw);
  } catch {
    return { error: "Marca inválida." };
  }
  // Limita el tamaño de los trazos a mano alzada.
  if (geom && geom.t === "path" && Array.isArray(geom.pts)) {
    if (geom.pts.length < 2) return { error: "El trazo quedó muy corto." };
    geom.pts = (geom.pts as [number, number][]).slice(0, 800);
  }
  if (geom && geom.t === "strokes" && Array.isArray(geom.paths)) {
    const paths = geom.paths as { pts: [number, number][]; color: string }[];
    if (paths.length === 0 || !paths.some((p) => p.pts?.length >= 2))
      return { error: "La ruta quedó vacía." };
    geom.paths = paths.slice(0, 40).map((p) => ({
      color: p.color,
      pts: (p.pts ?? []).slice(0, 800),
    }));
  }

  const supabase = await createClient();
  const { error } = await supabase.from("plan_marks").insert({
    company_id: ctx.companyId,
    plan_id: planId,
    kind,
    geom,
    activity,
    qty,
    unit: "ft",
    crew_id: crewId || null,
    note: note || null,
  });

  if (error) return { error: "No pudimos guardar la marca. Inténtalo de nuevo." };
  revalidatePath(`/app/planos/${planId}`);
  revalidatePath("/app/planos");
  return { error: null, ok: true, nonce: crypto.randomUUID() };
}

export async function deletePlanMark(formData: FormData): Promise<void> {
  const id = eq(formData.get("id"));
  const planId = eq(formData.get("planId"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("plan_marks").delete().eq("id", id);
  revalidatePath(`/app/planos/${planId}`);
  revalidatePath("/app/planos");
}
