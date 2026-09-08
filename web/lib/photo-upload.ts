"use client";

import { createClient } from "@/lib/supabase/client";
import { PHOTOS_BUCKET } from "@/lib/data/types";

/** Reduce la imagen a máx 1600px y JPEG ~0.8 antes de subir (control de costo de Storage). */
async function compress(file: File, maxDim = 1600, quality = 0.8): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob((b) => res(b), "image/jpeg", quality),
    );
    return blob ?? file;
  } catch {
    return file;
  }
}

export async function getCoords(): Promise<{ lat: number | null; lng: number | null }> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return { lat: null, lng: null };
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve({ lat: null, lng: null }),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 },
    );
  });
}

export async function uploadPhoto(
  companyId: string,
  projectId: string,
  file: File,
): Promise<string> {
  const blob = await compress(file);
  const path = `${companyId}/${projectId}/${crypto.randomUUID()}.jpg`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) throw error;
  return path;
}
