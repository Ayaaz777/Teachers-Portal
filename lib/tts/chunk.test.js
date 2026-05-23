import { describe, expect, it } from "vitest";
import { assertChunkCoverage, chunkForTts, wordCount } from "./chunk.js";

describe("chunkForTts", () => {
  it("preserves all words across multiple chunks", () => {
    const text = Array(30)
      .fill(
        "Recruit My English helps teachers with voice AI tools and pronunciation feedback for learners.",
      )
      .join(" ");
    const chunks = chunkForTts(text);
    expect(chunks.length).toBeGreaterThan(1);
    assertChunkCoverage(text, chunks);
    expect(wordCount(chunks.join(" "))).toBe(wordCount(text));
  });

  it("covers four-sentence reply like the dashboard prompt", () => {
    const text =
      "Recruit My English is a recruitment platform connecting English speaking talent with global opportunities. Voice AI can automate scheduling, answer applicant questions, and provide pronunciation feedback for learners. Recruiters benefit from voice-driven dashboard commands, hands-free data entry, and instant analytics summaries. By adopting multilingual voice models, sentiment analysis, and accent recognition, Recruit My English can scale faster while giving candidates a smoother, more personal experience.";
    const chunks = chunkForTts(text);
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    assertChunkCoverage(text, chunks);
    expect(chunks.some((c) => c.includes("Recruiters benefit"))).toBe(true);
    expect(chunks.some((c) => c.includes("By adopting"))).toBe(true);
  });
});
