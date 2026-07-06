import {
  PDFDocument,
  PDFFont,
  PDFPage,
  StandardFonts,
  degrees,
  rgb,
} from "pdf-lib";
import type { Defense } from "@/lib/defenses";

/**
 * Generates the Answer as a formatted pleading, plus a Certificate of Service
 * page. Runs in both Node (final paid PDF) and the browser via a Web Worker
 * (watermarked preview).
 *
 * ⚠️ When the official state court Answer form PDF is provided, replace this
 * programmatic layout with pdf-lib form-filling of that template: load the
 * template bytes with PDFDocument.load(), fill fields via doc.getForm(), and
 * keep `watermark` support. The data contract (AnswerPdfData) stays the same.
 */

export interface AnswerPdfData {
  courtName: string;
  county: string;
  caseNumber: string;
  plaintiffName: string;
  defendantName: string;
  amountClaimed: number;
  defenses: Defense[];
  /** ISO date the document is generated/signed. */
  date: string;
  plaintiffAttorneyAddress?: string;
}

export interface AnswerPdfOptions {
  watermark?: boolean;
}

const PAGE = { width: 612, height: 792 }; // US Letter
const MARGIN = 72;
const BODY_SIZE = 12;
const LINE_HEIGHT = 18;

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

class PdfWriter {
  y = PAGE.height - MARGIN;
  page: PDFPage;

  constructor(
    private doc: PDFDocument,
    private font: PDFFont,
    private bold: PDFFont,
  ) {
    this.page = doc.addPage([PAGE.width, PAGE.height]);
  }

  newPage() {
    this.page = this.doc.addPage([PAGE.width, PAGE.height]);
    this.y = PAGE.height - MARGIN;
  }

  ensureRoom(lines: number) {
    if (this.y - lines * LINE_HEIGHT < MARGIN) this.newPage();
  }

  text(text: string, opts: { bold?: boolean; center?: boolean; size?: number } = {}) {
    const font = opts.bold ? this.bold : this.font;
    const size = opts.size ?? BODY_SIZE;
    const maxWidth = PAGE.width - 2 * MARGIN;
    const lines = text ? wrapText(text, font, size, maxWidth) : [""];
    for (const line of lines) {
      this.ensureRoom(1);
      const width = font.widthOfTextAtSize(line, size);
      const x = opts.center ? (PAGE.width - width) / 2 : MARGIN;
      this.page.drawText(line, { x, y: this.y, size, font });
      this.y -= LINE_HEIGHT;
    }
  }

  blank(lines = 1) {
    this.y -= LINE_HEIGHT * lines;
    if (this.y < MARGIN) this.newPage();
  }

  rule() {
    this.ensureRoom(1);
    this.page.drawLine({
      start: { x: MARGIN, y: this.y + 6 },
      end: { x: PAGE.width - MARGIN, y: this.y + 6 },
      thickness: 0.5,
    });
    this.y -= LINE_HEIGHT / 2;
  }
}

function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function drawCaption(w: PdfWriter, data: AnswerPdfData) {
  w.text(`CAUSE NO. ${data.caseNumber || "____________"}`, { center: true, bold: true });
  w.blank();
  w.text(`${data.plaintiffName.toUpperCase()},`, {});
  w.text("        Plaintiff,");
  w.text("v.");
  w.text(`${data.defendantName.toUpperCase()},`);
  w.text("        Defendant.");
  w.blank();
  w.text(`IN THE ${data.courtName.toUpperCase()}`, { center: true });
  w.text(`${data.county.toUpperCase()} COUNTY, TEXAS`, { center: true });
  w.blank();
  w.rule();
  w.blank();
}

function drawWatermark(doc: PDFDocument, font: PDFFont) {
  for (const page of doc.getPages()) {
    page.drawText("PREVIEW — NOT FOR FILING", {
      x: 90,
      y: 280,
      size: 40,
      font,
      color: rgb(0.85, 0.2, 0.2),
      opacity: 0.25,
      rotate: degrees(45),
    });
  }
}

export async function buildAnswerPdf(
  data: AnswerPdfData,
  options: AnswerPdfOptions = {},
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.TimesRoman);
  const bold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const w = new PdfWriter(doc, font, bold);

  // --- Answer -------------------------------------------------------------
  drawCaption(w, data);
  w.text("DEFENDANT'S ANSWER", { center: true, bold: true });
  w.blank();
  w.text(
    `Defendant ${data.defendantName} files this Answer to Plaintiff's petition and states as follows:`,
  );
  w.blank();

  let n = 1;
  if (data.defenses.length === 0) {
    w.text(
      `${n++}. Defendant appears in this case and requests that Plaintiff be required to prove each element of its claims, including the amount claimed of ${formatUsd(data.amountClaimed)}.`,
    );
    w.blank();
  }
  for (const defense of data.defenses) {
    w.text(`${n++}. ${defense.pleadingText}`);
    w.blank();
  }

  w.text("PRAYER", { center: true, bold: true });
  w.blank();
  w.text(
    "For these reasons, Defendant requests that the Court deny Plaintiff's claims, that Plaintiff take nothing by this suit, and that Defendant be granted all other relief to which Defendant is entitled.",
  );
  w.blank(2);

  w.text("Respectfully submitted,");
  w.blank(2);
  w.text("_________________________________");
  w.text(`${data.defendantName}, Defendant, Pro Se`);
  w.text(`Date: ${data.date}`);

  // --- Certificate of Service ----------------------------------------------
  w.newPage();
  drawCaption(w, data);
  w.text("CERTIFICATE OF SERVICE", { center: true, bold: true });
  w.blank();
  w.text(
    `I certify that a true copy of Defendant's Answer was served on ${data.plaintiffName}` +
      (data.plaintiffAttorneyAddress
        ? `, by mail addressed to Plaintiff's attorney of record at ${data.plaintiffAttorneyAddress},`
        : ", by mail addressed to Plaintiff's attorney of record at the address shown on the citation,") +
      ` on ${data.date}.`,
  );
  w.blank(3);
  w.text("_________________________________");
  w.text(`${data.defendantName}, Defendant, Pro Se`);

  if (options.watermark) drawWatermark(doc, font);

  return doc.save();
}
