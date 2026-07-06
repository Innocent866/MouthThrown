import {
  COURT_HOLIDAYS,
  JURISDICTION,
  type JurisdictionConfig,
} from "@/config/jurisdiction";

/**
 * All deadline math operates on ISO date strings (YYYY-MM-DD) and UTC to
 * avoid timezone drift — a served-on date has no time component in law.
 */

const HOLIDAY_SET = new Set(COURT_HOLIDAYS);

export function isValidISODate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
}

function toUTC(iso: string): Date {
  if (!isValidISODate(iso)) throw new Error(`Invalid ISO date: ${iso}`);
  return new Date(`${iso}T00:00:00Z`);
}

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const d = toUTC(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toISO(d);
}

export function isWeekend(iso: string): boolean {
  const dow = toUTC(iso).getUTCDay();
  return dow === 0 || dow === 6;
}

export function isCourtHoliday(
  iso: string,
  holidays: ReadonlySet<string> | readonly string[] = HOLIDAY_SET,
): boolean {
  const set = holidays instanceof Set ? holidays : new Set(holidays);
  return set.has(iso);
}

export function isBusinessDay(
  iso: string,
  holidays: ReadonlySet<string> | readonly string[] = HOLIDAY_SET,
): boolean {
  return !isWeekend(iso) && !isCourtHoliday(iso, holidays);
}

/**
 * Compute the Answer deadline: `answerDeadlineDays` calendar days after the
 * day of service; if that lands on a weekend or court holiday and the
 * jurisdiction rolls forward, advance to the next business day.
 */
export function calculateAnswerDeadline(
  dateServed: string,
  config: JurisdictionConfig = JURISDICTION,
  holidays: readonly string[] = COURT_HOLIDAYS,
): string {
  const holidaySet = new Set(holidays);
  let deadline = addDays(dateServed, config.answerDeadlineDays);
  if (config.rollToNextBusinessDay) {
    while (!isBusinessDay(deadline, holidaySet)) {
      deadline = addDays(deadline, 1);
    }
  }
  return deadline;
}

/** Whole days from `today` until `deadline` (negative if passed). */
export function daysUntil(deadline: string, today: string): number {
  const ms = toUTC(deadline).getTime() - toUTC(today).getTime();
  return Math.round(ms / 86_400_000);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function hasDeadlinePassed(deadline: string, today = todayISO()): boolean {
  return daysUntil(deadline, today) < 0;
}

export function formatLongDate(iso: string): string {
  return toUTC(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
