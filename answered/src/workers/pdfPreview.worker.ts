import { buildAnswerPdf, type AnswerPdfData } from "@/lib/pdf/answerDocument";

/**
 * Web Worker: generates the watermarked preview PDF off the main thread so
 * the UI never janks while pdf-lib runs (important on low-end phones).
 */
self.onmessage = async (event: MessageEvent<AnswerPdfData>) => {
  try {
    const bytes = await buildAnswerPdf(event.data, { watermark: true });
    self.postMessage({ ok: true as const, bytes }, { transfer: [bytes.buffer] });
  } catch (error) {
    self.postMessage({ ok: false as const, error: String(error) });
  }
};
