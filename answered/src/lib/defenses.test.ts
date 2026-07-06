import { describe, expect, it } from "vitest";
import { mapAnswersToDefenses } from "./defenses";
import type { InterviewAnswers } from "./interview";

const TODAY = "2026-07-05";

function keys(answers: InterviewAnswers) {
  return mapAnswersToDefenses(answers, { today: TODAY }).map((d) => d.key);
}

describe("mapAnswersToDefenses", () => {
  it("includes nothing when the user disputes nothing", () => {
    expect(
      keys({
        recognize_debt: "yes",
        plaintiff_relationship: "original",
        last_payment: "2026-01-15",
        amount_correct: "yes",
        identity_theft: "no",
        military_service: "no",
        service_method: "handed_to_me",
      }),
    ).toEqual([]);
  });

  it("never auto-selects a defense without a supporting answer", () => {
    expect(keys({})).toEqual([]);
  });

  it("maps 'no' on debt recognition to a general denial", () => {
    expect(keys({ recognize_debt: "no" })).toContain("general_denial");
  });

  it("maps 'not sure' to a lack-of-knowledge denial, not a general denial", () => {
    const k = keys({ recognize_debt: "not_sure" });
    expect(k).toContain("denial_lack_of_knowledge");
    expect(k).not.toContain("general_denial");
  });

  it("maps unknown plaintiff to lack of standing, but 'not sure' does not", () => {
    expect(keys({ plaintiff_relationship: "never_heard" })).toContain(
      "lack_of_standing",
    );
    expect(keys({ plaintiff_relationship: "not_sure" })).not.toContain(
      "lack_of_standing",
    );
  });

  it("flags statute of limitations only when last payment is older than the SOL", () => {
    // TX SOL = 4 years; today is 2026-07-05, cutoff 2022-07-05
    expect(keys({ last_payment: "2022-07-04" })).toContain(
      "statute_of_limitations",
    );
    expect(keys({ last_payment: "2022-07-06" })).not.toContain(
      "statute_of_limitations",
    );
    expect(keys({ last_payment: "unknown" })).not.toContain(
      "statute_of_limitations",
    );
  });

  it("maps amount disputes to a denial of amount", () => {
    expect(keys({ amount_correct: "no" })).toContain("denial_of_amount");
    expect(keys({ amount_correct: "not_sure" })).toContain("denial_of_amount");
    expect(keys({ amount_correct: "yes" })).not.toContain("denial_of_amount");
  });

  it("maps identity theft and military service answers", () => {
    expect(keys({ identity_theft: "yes" })).toContain("identity_theft");
    expect(keys({ identity_theft: "no" })).not.toContain("identity_theft");
    expect(keys({ military_service: "yes" })).toContain("scra_protections");
  });

  it("flags improper service for anything other than personal delivery", () => {
    expect(keys({ service_method: "left_with_someone" })).toContain(
      "improper_service",
    );
    expect(keys({ service_method: "mailed" })).toContain("improper_service");
    expect(keys({ service_method: "handed_to_me" })).not.toContain(
      "improper_service",
    );
  });

  it("phrases plain language as information, never advice", () => {
    const defenses = mapAnswersToDefenses(
      {
        recognize_debt: "no",
        plaintiff_relationship: "never_heard",
        last_payment: "2020-01-01",
        amount_correct: "no",
        identity_theft: "yes",
        military_service: "yes",
        service_method: "mailed",
      },
      { today: TODAY },
    );
    for (const d of defenses) {
      expect(d.plainLanguage.toLowerCase()).not.toContain("you should");
      expect(d.plainLanguage.toLowerCase()).not.toContain("we advise");
    }
  });
});
