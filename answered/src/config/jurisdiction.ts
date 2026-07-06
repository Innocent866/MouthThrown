/**
 * Jurisdiction configuration — TEXAS (justice court "debt claim" cases).
 *
 * ⚠️ LEGAL REVIEW REQUIRED: every value in this file must be verified by a
 * licensed attorney in the target state before launch. Deadline rules,
 * statutes of limitations, and court holiday calendars change.
 *
 * To support a second state, add another config object here and swap
 * `JURISDICTION` — no application code should hardcode state rules.
 */

export interface JurisdictionConfig {
  stateCode: string;
  stateName: string;
  /**
   * Calendar days the defendant has to file an Answer, counted from the day
   * AFTER the day of service. Texas: Tex. R. Civ. P. 502.5(d) — answer due by
   * the end of the 14th day after the day of service.
   */
  answerDeadlineDays: number;
  /**
   * If the deadline lands on a Saturday, Sunday, or court holiday, it rolls
   * forward to the next business day (Tex. R. Civ. P. 500.5(b)).
   */
  rollToNextBusinessDay: boolean;
  /**
   * Statute of limitations for consumer debt actions, in years.
   * Texas: 4 years (Tex. Civ. Prac. & Rem. Code §§ 16.004, 16.051).
   */
  statuteOfLimitationsYears: number;
  /** Official name of the responsive pleading in this state. */
  answerFormName: string;
  legalAidName: string;
  legalAidUrl: string;
  courtSelfHelpUrl: string;
}

export const JURISDICTION: JurisdictionConfig = {
  stateCode: "TX",
  stateName: "Texas",
  answerDeadlineDays: 14,
  rollToNextBusinessDay: true,
  statuteOfLimitationsYears: 4,
  answerFormName: "Answer to a Debt Claim Case (Justice Court)",
  legalAidName: "TexasLawHelp.org",
  legalAidUrl: "https://texaslawhelp.org",
  courtSelfHelpUrl: "https://www.txcourts.gov/programs-services/self-help/",
};

/**
 * Days state courts are closed, as ISO dates (YYYY-MM-DD).
 * Source: Texas state holiday schedule. ⚠️ VERIFY yearly and per county —
 * individual counties may observe additional local holidays.
 */
export const COURT_HOLIDAYS: readonly string[] = [
  // 2026
  "2026-01-01", // New Year's Day
  "2026-01-19", // MLK Jr. Day
  "2026-02-16", // Presidents' Day
  "2026-03-02", // Texas Independence Day
  "2026-04-21", // San Jacinto Day
  "2026-05-25", // Memorial Day
  "2026-06-19", // Emancipation Day (Juneteenth)
  "2026-07-03", // Independence Day (observed — Jul 4 falls on Saturday)
  "2026-08-27", // LBJ Day
  "2026-09-07", // Labor Day
  "2026-11-11", // Veterans Day
  "2026-11-26", // Thanksgiving
  "2026-11-27", // Day after Thanksgiving
  "2026-12-24", // Christmas Eve
  "2026-12-25", // Christmas Day
  // 2027
  "2027-01-01",
  "2027-01-18",
  "2027-02-15",
  "2027-03-02",
  "2027-04-21",
  "2027-05-31",
  "2027-06-18", // Juneteenth observed (Jun 19 falls on Saturday)
  "2027-07-05", // Independence Day observed (Jul 4 falls on Sunday)
  "2027-08-27",
  "2027-09-06",
  "2027-11-11",
  "2027-11-25",
  "2027-11-26",
  "2027-12-23",
  "2027-12-24",
];

export const DISCLAIMER =
  "Answered is not a law firm and does not provide legal advice.";

export const PRICE_USD_CENTS = 9900;
