import { describe, expect, it } from "vitest";
import {
  addDays,
  calculateAnswerDeadline,
  daysUntil,
  hasDeadlinePassed,
  isBusinessDay,
  isValidISODate,
} from "./deadline";
import { JURISDICTION } from "@/config/jurisdiction";

// Texas config under test: 14 calendar days, roll forward on weekend/holiday.

describe("calculateAnswerDeadline", () => {
  it("adds 14 calendar days when the result is a business day", () => {
    // Served Mon 2026-08-03 → +14 = Mon 2026-08-17 (business day)
    expect(calculateAnswerDeadline("2026-08-03")).toBe("2026-08-17");
  });

  it("rolls a Saturday deadline to the following Monday", () => {
    // Served Sat 2026-08-08 → +14 = Sat 2026-08-22 → Mon 2026-08-24
    expect(calculateAnswerDeadline("2026-08-08")).toBe("2026-08-24");
  });

  it("rolls a Sunday deadline to the following Monday", () => {
    // Served Sun 2026-08-09 → +14 = Sun 2026-08-23 → Mon 2026-08-24
    expect(calculateAnswerDeadline("2026-08-09")).toBe("2026-08-24");
  });

  it("rolls through consecutive holidays and a weekend (Thanksgiving)", () => {
    // Served Thu 2026-11-12 → +14 = Thu 2026-11-26 (Thanksgiving)
    // → Fri 11-27 (holiday) → Sat → Sun → Mon 2026-11-30
    expect(calculateAnswerDeadline("2026-11-12")).toBe("2026-11-30");
  });

  it("rolls through the Christmas holiday block", () => {
    // Served Thu 2026-12-10 → +14 = Thu 2026-12-24 (Christmas Eve, holiday)
    // → Fri 12-25 (holiday) → Sat → Sun → Mon 2026-12-28
    expect(calculateAnswerDeadline("2026-12-10")).toBe("2026-12-28");
  });

  it("rolls a single-day holiday (New Year's) to the next business day", () => {
    // Served Fri 2026-12-18 → +14 = Fri 2027-01-01 (holiday) → Mon 2027-01-04
    expect(calculateAnswerDeadline("2026-12-18")).toBe("2027-01-04");
  });

  it("does not roll when the jurisdiction disables roll-forward", () => {
    const config = { ...JURISDICTION, rollToNextBusinessDay: false };
    expect(calculateAnswerDeadline("2026-08-08", config)).toBe("2026-08-22");
  });

  it("respects a custom day count", () => {
    const config = { ...JURISDICTION, answerDeadlineDays: 30 };
    // Served 2026-08-03 → +30 = Wed 2026-09-02
    expect(calculateAnswerDeadline("2026-08-03", config)).toBe("2026-09-02");
  });

  it("crosses month boundaries correctly", () => {
    // Served 2026-01-20 → +14 = Tue 2026-02-03
    expect(calculateAnswerDeadline("2026-01-20")).toBe("2026-02-03");
  });

  it("throws on malformed dates", () => {
    expect(() => calculateAnswerDeadline("08/03/2026")).toThrow();
    expect(() => calculateAnswerDeadline("2026-02-30")).toThrow();
  });
});

describe("daysUntil / hasDeadlinePassed", () => {
  it("counts days remaining", () => {
    expect(daysUntil("2026-08-17", "2026-08-03")).toBe(14);
    expect(daysUntil("2026-08-17", "2026-08-17")).toBe(0);
  });

  it("is negative once the deadline has passed", () => {
    expect(daysUntil("2026-08-17", "2026-08-20")).toBe(-3);
    expect(hasDeadlinePassed("2026-08-17", "2026-08-18")).toBe(true);
    expect(hasDeadlinePassed("2026-08-17", "2026-08-17")).toBe(false);
  });
});

describe("helpers", () => {
  it("identifies weekends and holidays as non-business days", () => {
    expect(isBusinessDay("2026-08-22")).toBe(false); // Saturday
    expect(isBusinessDay("2026-11-26")).toBe(false); // Thanksgiving
    expect(isBusinessDay("2026-08-17")).toBe(true); // Monday
  });

  it("validates ISO dates strictly", () => {
    expect(isValidISODate("2026-08-03")).toBe(true);
    expect(isValidISODate("2026-13-01")).toBe(false);
    expect(isValidISODate("2026-02-30")).toBe(false);
    expect(isValidISODate("not-a-date")).toBe(false);
  });

  it("addDays handles leap years", () => {
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2027-02-28", 1)).toBe("2027-03-01");
  });
});
