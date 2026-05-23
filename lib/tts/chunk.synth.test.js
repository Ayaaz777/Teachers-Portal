import { describe, expect, it } from "vitest";
import { normalizeForTts } from "./normalize.js";
import { assertChunkCoverage, chunkForTts, splitForSynth } from "./chunk.js";

describe("splitForSynth", () => {
  it("does not split between description and for", () => {
    const text =
      "I'd be happy to help, but I need a bit more context. Could you tell me what topic or item you'd like a 150-word description for? Once you share the details, I'll put it together for you.";
    const normalized = normalizeForTts(text);
    const parts = splitForSynth(normalized, 42, 260);
    expect(parts.length).toBeGreaterThanOrEqual(1);
    const joined = parts.join(" ");
    assertChunkCoverage(normalized, parts);
    for (const p of parts) {
      expect(p.endsWith("description")).toBe(false);
      expect(p.trim().startsWith("for")).toBe(false);
    }
    expect(joined).toContain("description for");
  });

  it("chunkForTts + splitForSynth covers agent reply", () => {
    const normalized = normalizeForTts(
      "Could you tell me what topic or item you'd like a 150-word description for? Once you share the details.",
    );
    const chunks = chunkForTts(normalized);
    const synth = chunks.flatMap((c) => splitForSynth(c, 42, 260));
    assertChunkCoverage(normalized, synth);
    expect(synth.some((p) => p.includes("description for"))).toBe(true);
  });
});
