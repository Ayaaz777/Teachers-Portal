import { describe, expect, it } from "vitest";
import {
  flushRemainder,
  pullCompleteSentences,
  pullSpeakableUnits,
} from "./sentence-buffer.js";

describe("pullCompleteSentences", () => {
  it("emits only complete sentences", () => {
    const r1 = pullCompleteSentences("Hello. How are");
    expect(r1.sentences).toEqual(["Hello."]);
    expect(r1.remainder).toBe("How are");

    const r2 = pullCompleteSentences(r1.remainder + " you doing today?");
    expect(r2.sentences.length).toBeGreaterThanOrEqual(1);
    expect(r2.sentences.join(" ")).toContain("today?");

    const r3 = pullCompleteSentences("Fine!");
    expect(r3.sentences).toEqual(["Fine!"]);
  });

  it("flushes tail without punctuation", () => {
    expect(flushRemainder("Thanks")).toEqual(["Thanks"]);
  });
});

describe("pullSpeakableUnits", () => {
  it("prefers complete sentences", () => {
    const r = pullSpeakableUnits("OK. Still going");
    expect(r.units).toEqual(["OK."]);
    expect(r.remainder).toBe("Still going");
  });

  it("emits early clause on comma when enabled", () => {
    const r = pullSpeakableUnits(
      "Payroll for May, roughly forty-two thousand rand across active teachers",
      { allowEarlyClause: true },
    );
    expect(r.units[0]).toMatch(/^Payroll for May,/);
    expect(r.remainder.length).toBeGreaterThan(0);
  });

  it("never splits mid-clause when there is no comma yet", () => {
    const r = pullSpeakableUnits(
      "The cleanest answer is to keep the reply streaming while Kokoro speaks",
      { allowEarlyClause: true },
    );
    expect(r.units).toEqual([]);
    expect(r.remainder.length).toBeGreaterThan(0);
  });
});
