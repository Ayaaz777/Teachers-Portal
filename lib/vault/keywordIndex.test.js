import { describe, expect, it } from "vitest";
import {
  mergeKeywordConfig,
  tokenize,
  extractTerms,
  buildInvertedIndex,
  updateIndexForFile,
  generateKeywordEdges,
  wikiPairSetFromEdges,
  stripExcludedRegions,
} from "./keywordIndex.js";

const defaultCfg = () => mergeKeywordConfig();

describe("tokenize", () => {
  it('tokenize("Doctor appointment", default) → ["doctor", "appointment"]', () => {
    expect(tokenize("Doctor appointment", defaultCfg()).sort()).toEqual([
      "appointment",
      "doctor",
    ]);
  });

  it("drops stopwords", () => {
    expect(tokenize("the doctor and a nurse", defaultCfg()).sort()).toEqual([
      "doctor",
      "nurse",
    ]);
  });

  it("respects minLength", () => {
    expect(tokenize("be it so", mergeKeywordConfig({ minLength: 3 }))).toEqual([]);
  });

  it("drops pure numbers", () => {
    expect(tokenize("room 2026 budget", defaultCfg()).sort()).toEqual(["budget", "room"]);
  });
});

describe("exclusions", () => {
  it("excludes fenced code", () => {
    const text = "hello\n```\ndoctor\n```\nworld";
    expect(tokenize(stripExcludedRegions(text), defaultCfg())).not.toContain("doctor");
  });

  it("excludes inline code", () => {
    expect(tokenize("see `doctor` here", defaultCfg())).not.toContain("doctor");
  });

  it("excludes wikilink body from terms", () => {
    const map = extractTerms("plain\n[[Doctor Smith]]\n", defaultCfg());
    expect(map.has("doctor smith")).toBe(false);
    expect(map.has("plain")).toBe(true);
  });
});

describe("proper nouns", () => {
  it('groups "Doctor Smith said hi"', () => {
    const map = extractTerms("Doctor Smith said hi", defaultCfg());
    expect(map.has("doctor smith")).toBe(true);
  });

  it("sentence-start single Doctor is one token only", () => {
    const map = extractTerms("Doctor said hi.", defaultCfg());
    expect(map.has("doctor")).toBe(true);
    expect(map.has("doctor smith")).toBe(false);
  });
});

describe("inverted index", () => {
  it("links two files sharing doctor", () => {
    const files = [
      { id: "a", path: "A.md", content: "Doctor visit" },
      { id: "b", path: "B.md", content: "also Doctor appointment" },
    ];
    const { inverted } = buildInvertedIndex(files, defaultCfg());
    expect([...inverted.get("doctor")].sort()).toEqual(["a", "b"]);
  });

  it("drops ubiquitous terms at edge emit time", () => {
    const files = [];
    for (let i = 0; i < 51; i++) {
      files.push({ id: `f${i}`, path: `${i}.md`, content: "xyzzy term" });
    }
    const cfg = mergeKeywordConfig({ promoteToEdges: true, maxFilesPerTerm: 50 });
    const index = buildInvertedIndex(files, cfg);
    expect((index.inverted.get("xyzzy")?.size ?? 0) > 50).toBe(true);
    expect(generateKeywordEdges(index, cfg, new Set())).toHaveLength(0);
  });
});

describe("wiki dedupe", () => {
  it("skips keyword edge when wiki exists", () => {
    const files = [
      { id: "a", path: "A.md", content: "Doctor here" },
      { id: "b", path: "B.md", content: "Doctor there" },
    ];
    const cfg = mergeKeywordConfig({ promoteToEdges: true });
    const index = buildInvertedIndex(files, cfg);
    const wiki = wikiPairSetFromEdges([{ source: "a", target: "b", type: "wikilink" }]);
    const edges = generateKeywordEdges(index, cfg, wiki);
    expect(edges).toHaveLength(0);
  });
});

describe("incremental update", () => {
  it("replaces old terms when file changes", () => {
    const files = [{ id: "a", path: "A.md", content: "alpha" }];
    const cfg = defaultCfg();
    const index = buildInvertedIndex(files, cfg);
    updateIndexForFile(
      index.inverted,
      index.fileTerms,
      "a",
      extractTerms("beta only", cfg),
    );
    expect(index.inverted.has("alpha")).toBe(false);
    expect(index.inverted.get("beta")).toEqual(new Set(["a"]));
  });
});
