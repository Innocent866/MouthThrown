/**
 * Guided interview definition. One question per screen; every answer maps to
 * defenses/denials via `mapAnswersToDefenses` in defenses.ts.
 *
 * ⚠️ LEGAL REVIEW REQUIRED: all on-screen language must be reviewed by a
 * licensed attorney for unauthorized-practice-of-law risk before launch.
 */

export type QuestionKey =
  | "recognize_debt"
  | "plaintiff_relationship"
  | "last_payment"
  | "amount_correct"
  | "identity_theft"
  | "military_service"
  | "service_method";

export interface InterviewOption {
  value: string;
  label: string;
}

export interface InterviewQuestion {
  key: QuestionKey;
  /** May contain {plaintiff} / {amount} placeholders filled at render time. */
  prompt: string;
  helpText?: string;
  type: "choice" | "date-or-unknown";
  options?: InterviewOption[];
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    key: "recognize_debt",
    prompt: "Do you recognize this debt?",
    helpText:
      "It's okay to say \"not sure\" — many lawsuits are filed over old or resold accounts.",
    type: "choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    key: "plaintiff_relationship",
    prompt:
      "Is {plaintiff} the company you originally owed, or a company you've never dealt with?",
    helpText:
      "Debts are often sold to collection companies. If the name is unfamiliar, that matters.",
    type: "choice",
    options: [
      { value: "original", label: "The original company" },
      { value: "never_heard", label: "I've never heard of them" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    key: "last_payment",
    prompt: "When did you last make a payment on this debt?",
    helpText:
      "Your best estimate is fine. Very old debts may be too old to sue on.",
    type: "date-or-unknown",
  },
  {
    key: "amount_correct",
    prompt: "Is the amount they're claiming ({amount}) correct?",
    type: "choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No, it's too high" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    key: "identity_theft",
    prompt:
      "Were you ever a victim of identity theft related to this account?",
    type: "choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    key: "military_service",
    prompt: "Were you serving in the military when this lawsuit was filed?",
    helpText:
      "Servicemembers have extra protections under federal law (the SCRA).",
    type: "choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    key: "service_method",
    prompt: "How did you receive the court papers?",
    type: "choice",
    options: [
      { value: "handed_to_me", label: "Handed to me in person" },
      { value: "left_with_someone", label: "Left with someone else" },
      { value: "mailed", label: "Mailed to me" },
      { value: "found_another_way", label: "I found them another way" },
    ],
  },
];

export type InterviewAnswers = Partial<Record<QuestionKey, string>>;
