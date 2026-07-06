import { JURISDICTION, type JurisdictionConfig } from "@/config/jurisdiction";
import { isValidISODate, todayISO } from "@/lib/deadline";
import type { InterviewAnswers } from "@/lib/interview";

/**
 * Maps interview answers to defenses/denials.
 *
 * Business rules enforced here:
 *  - A defense is only included when an affirmative user answer supports it.
 *    "Not sure" produces a denial "for lack of knowledge," never an
 *    affirmative defense.
 *  - The Answer general-denies only what the user actually disputed.
 *  - All language is information ("Many defendants raise..."), never advice.
 *
 * ⚠️ LEGAL REVIEW REQUIRED for every string in this file.
 */

export type DefenseKey =
  | "general_denial"
  | "denial_lack_of_knowledge"
  | "denial_of_amount"
  | "lack_of_standing"
  | "statute_of_limitations"
  | "identity_theft"
  | "scra_protections"
  | "improper_service";

export interface Defense {
  key: DefenseKey;
  title: string;
  /** Plain-language explanation shown on the summary screen. */
  plainLanguage: string;
  /** Formal text inserted into the generated Answer. */
  pleadingText: string;
}

export function mapAnswersToDefenses(
  answers: InterviewAnswers,
  opts: {
    config?: JurisdictionConfig;
    today?: string;
    plaintiffName?: string;
  } = {},
): Defense[] {
  const config = opts.config ?? JURISDICTION;
  const today = opts.today ?? todayISO();
  const plaintiff = opts.plaintiffName || "the plaintiff";
  const defenses: Defense[] = [];

  // --- Denials -------------------------------------------------------------
  if (answers.recognize_debt === "no") {
    defenses.push({
      key: "general_denial",
      title: "General denial",
      plainLanguage:
        "You said you don't recognize this debt, so your Answer denies the plaintiff's claims and requires them to prove their case with evidence.",
      pleadingText:
        "Defendant generally denies each and every allegation in Plaintiff's petition and demands strict proof thereof.",
    });
  } else if (answers.recognize_debt === "not_sure") {
    defenses.push({
      key: "denial_lack_of_knowledge",
      title: "Denial for lack of knowledge",
      plainLanguage:
        "You said you're not sure about this debt. Your Answer states that you lack enough information to admit the claims, which requires the plaintiff to prove them.",
      pleadingText:
        "Defendant is without knowledge or information sufficient to form a belief as to the truth of the allegations in Plaintiff's petition and therefore denies them.",
    });
  }

  if (answers.amount_correct === "no") {
    defenses.push({
      key: "denial_of_amount",
      title: "The amount claimed is disputed",
      plainLanguage:
        "You said the amount is too high. Your Answer denies that you owe the amount claimed and requires the plaintiff to prove how it was calculated, including any added interest and fees.",
      pleadingText:
        "Defendant denies that the amount claimed is owed. Plaintiff has failed to accurately state the amount allegedly due, including any credits, payments, offsets, interest, or fees, and Defendant demands strict proof of the amount claimed.",
    });
  } else if (answers.amount_correct === "not_sure") {
    defenses.push({
      key: "denial_of_amount",
      title: "The amount claimed is not verified",
      plainLanguage:
        "You said you're not sure the amount is right. Your Answer states that you cannot confirm the amount and requires the plaintiff to prove how it was calculated.",
      pleadingText:
        "Defendant is without knowledge or information sufficient to form a belief as to the accuracy of the amount claimed, and therefore denies it and demands strict proof of the amount claimed.",
    });
  }

  // --- Affirmative defenses ------------------------------------------------
  if (answers.plaintiff_relationship === "never_heard") {
    defenses.push({
      key: "lack_of_standing",
      title: "Lack of standing (debt-buyer defense)",
      plainLanguage: `You said you've never dealt with ${plaintiff}. Many debt lawsuits are filed by companies that bought the debt. Your Answer requires the plaintiff to prove it actually owns this debt and has the right to sue you on it.`,
      pleadingText:
        "Defendant asserts that Plaintiff lacks standing to bring this action. Plaintiff is not the original creditor, and Defendant demands strict proof of a complete and valid chain of assignment establishing Plaintiff's ownership of the alleged debt.",
    });
  }

  const lastPayment = answers.last_payment;
  if (lastPayment && isValidISODate(lastPayment)) {
    const solCutoff = new Date(`${today}T00:00:00Z`);
    solCutoff.setUTCFullYear(
      solCutoff.getUTCFullYear() - config.statuteOfLimitationsYears,
    );
    if (new Date(`${lastPayment}T00:00:00Z`) < solCutoff) {
      defenses.push({
        key: "statute_of_limitations",
        title: "Statute of limitations",
        plainLanguage: `Based on the last-payment date you gave, this debt may be older than ${config.stateName}'s ${config.statuteOfLimitationsYears}-year time limit for filing a debt lawsuit. Many defendants in this situation raise the statute of limitations as a defense.`,
        pleadingText: `Defendant asserts the affirmative defense of the statute of limitations. Plaintiff's claims are barred because the action was not commenced within the ${config.statuteOfLimitationsYears}-year limitations period applicable under ${config.stateName} law.`,
      });
    }
  }

  if (answers.identity_theft === "yes") {
    defenses.push({
      key: "identity_theft",
      title: "Identity theft",
      plainLanguage:
        "You said this account is connected to identity theft. Your Answer states that the account was opened or used without your authorization.",
      pleadingText:
        "Defendant asserts that the account at issue was opened or used as a result of identity theft, without Defendant's knowledge or authorization, and Defendant is not liable for the alleged debt.",
    });
  }

  if (answers.military_service === "yes") {
    defenses.push({
      key: "scra_protections",
      title: "Servicemembers Civil Relief Act (SCRA)",
      plainLanguage:
        "You said you were serving in the military when this lawsuit was filed. Federal law (the SCRA) gives active-duty servicemembers extra protections in civil lawsuits, and your Answer notifies the court of your service.",
      pleadingText:
        "Defendant states that Defendant was in military service at the time this action was filed and invokes all applicable rights and protections of the Servicemembers Civil Relief Act, 50 U.S.C. § 3901 et seq.",
    });
  }

  if (
    answers.service_method &&
    answers.service_method !== "handed_to_me"
  ) {
    defenses.push({
      key: "improper_service",
      title: "Possible improper service",
      plainLanguage:
        "Based on how you received the court papers, the delivery may not have followed the court's rules. Your Answer preserves this issue so the court can consider it. Raising it does not delay your deadline.",
      pleadingText:
        "Defendant asserts, without waiving any other defense, that service of citation may not have complied with the applicable rules of civil procedure, and Defendant does not waive any objection to the sufficiency of service.",
    });
  }

  return defenses;
}

/** True if the answers dispute anything at all (used for UI messaging). */
export function hasAnyDispute(defenses: Defense[]): boolean {
  return defenses.length > 0;
}
