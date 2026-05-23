import { describe, expect, it } from "vitest";
import { normalizeForTts } from "./normalize.js";

describe("normalizeForTts", () => {
  it("strips voice prosody tags without speaking tag names", () => {
    const text =
      "Mmm, [slow]roughly forty-two thousand rand[/slow] [pause=300] is draft only. [emph]Flag[/emph] it.";
    const normalized = normalizeForTts(text);

    expect(normalized).toContain("roughly forty-two thousand rand");
    expect(normalized).toContain("Flag it.");
    expect(normalized).not.toMatch(/\bslow\b|\bemph\b|\bpause\b/i);
    expect(normalized).not.toContain("[");
    expect(normalized).not.toContain("]");
  });
});
