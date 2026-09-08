"use client";

import { createClient } from "@/lib/supabase/client";
import { PLANS_BUCKET } from "@/lib/data/types";

async function compressImage(
  file: File,
  maxDim = 2200,
  quality = 0.85,
): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { blob: file, width: bitmap.width, height: bitmap.height };
  ctx.drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob((b) => res(b), "image/jpeg", quality),
  );
  return { blob: blob ?? file, width, height };
}

export type UploadedPlan = { path: string; width: number | null; height: number | null };

export async function uploadPlan(
  companyId: string,
  projectId: string,
  file: File,
): Promise<UploadedPlan> {
  const supabase = createClient();
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (isPdf) {
    const path = `${companyId}/${projectId}/${crypto.randomUUID()}.pdf`;
    const { error } = await supabase.storage
      .from(PLANS_BUCKET)
      .upload(path, file, { contentType: "application/pdf", upsert: false });
    if (error) throw error;
    return { path, width: null, height: null };
  }

  const { blob, width, height } = await compressImage(file);
  const path = `${companyId}/${projectId}/${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage
    .from(PLANS_BUCKET)
    .upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) throw error;
  return { path, width, height };
}
