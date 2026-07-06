import type { CaseDraft } from "@/lib/caseStore";
import { findCourt } from "@/config/courts";
import { mapAnswersToDefenses } from "@/lib/defenses";
import { todayISO } from "@/lib/deadline";
import type { AnswerPdfData } from "@/lib/pdf/answerDocument";

/** Assemble the PDF data contract from a case draft (client- and server-safe). */
export function draftToAnswerPdfData(draft: CaseDraft): AnswerPdfData {
  const court = findCourt(draft.courtId);
  return {
    courtName: court?.name ?? "Justice Court",
    county: court?.county ?? "",
    caseNumber: draft.caseNumber ?? "",
    plaintiffName: draft.plaintiffName ?? "Plaintiff",
    defendantName: draft.defendantName ?? "Defendant",
    amountClaimed: draft.amountClaimed ?? 0,
    defenses: mapAnswersToDefenses(draft.answers ?? {}, {
      plaintiffName: draft.plaintiffName,
    }),
    date: todayISO(),
  };
}
