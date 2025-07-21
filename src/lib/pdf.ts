// src/lib/pdf.ts
import * as pdfjs from "pdfjs-dist";
import type { PDFDocumentProxy, TextItem } from "pdfjs-dist/types/src/display/api";

// Set workerSrc to avoid issues with Next.js.
// This points to the worker file provided by the pdfjs-dist package.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

async function getPageText(pdf: PDFDocumentProxy, pageNo: number): Promise<string> {
    const page = await pdf.getPage(pageNo);
    const tokenizedText = await page.getTextContent();
    const pageText = tokenizedText.items.map(token => (token as TextItem).str).join("");
    return pageText;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pageTexts = Array.from({ length: pdf.numPages }, async (_, i) => {
    return getPageText(pdf, i + 1);
  });

  const allPagesText = (await Promise.all(pageTexts)).join('\n');
  return allPagesText;
}
