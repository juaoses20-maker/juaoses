"use client";

// Renderiza páginas de un PDF a imagen en el navegador (pdfjs-dist), para poder marcar
// encima igual que con una foto. El worker se sirve como archivo estático propio
// (public/pdfjs/pdf.worker.min.mjs) — sin depender de un CDN externo.

type PdfjsModule = typeof import("pdfjs-dist");

let pdfjsPromise: Promise<PdfjsModule> | null = null;

function loadPdfjs(): Promise<PdfjsModule> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((mod) => {
      mod.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
      return mod;
    });
  }
  return pdfjsPromise;
}

export type PdfPageImage = { dataUrl: string; width: number; height: number };

/** Rasteriza una página (1-indexada) del PDF en `url`. Devuelve también el total de páginas. */
export async function renderPdfPage(
  url: string,
  pageNumber: number,
  maxDim = 1600,
): Promise<{ image: PdfPageImage; numPages: number; page: number }> {
  const pdfjsLib = await loadPdfjs();
  const doc = await pdfjsLib.getDocument({ url }).promise;
  const numPages = doc.numPages;
  const page = Math.min(Math.max(1, Math.round(pageNumber)), numPages);
  const pdfPage = await doc.getPage(page);

  const base = pdfPage.getViewport({ scale: 1 });
  const scale = Math.min(maxDim / base.width, maxDim / base.height, 3);
  const viewport = pdfPage.getViewport({ scale: Math.max(scale, 0.4) });

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(viewport.width));
  canvas.height = Math.max(1, Math.round(viewport.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo preparar el lienzo para el PDF.");

  await pdfPage.render({ canvasContext: ctx, viewport, canvas }).promise;

  return {
    image: { dataUrl: canvas.toDataURL("image/png"), width: canvas.width, height: canvas.height },
    numPages,
    page,
  };
}
