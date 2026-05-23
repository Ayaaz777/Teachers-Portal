import { describe, expect, it } from "vitest";
import {
  parseLinks,
  parseTodoLine,
  buildAliasIndex,
  findUnlinkedMentions,
  plainTextForMatching,
  resolveNoteId,
  extractYmdMentionEdges,
  findUnlinkedMentionsFromText,
  extractPlannerReferenceEdges,
} from "./obsidian-links.js";

/** @param {Array<[string, string]>} pairs title, id */
function aliasFor(...pairs) {
  const notes = new Map();
  for (const [title, id] of pairs) {
    notes.set(id, {
      id,
      title,
      path: `${title}.md`,
      folder: "",
      kind: "note",
      content: "",
    });
  }
  return buildAliasIndex(notes);
}

describe("parseTodoLine", () => {
  it("detects - * + task markers", () => {
    expect(parseTodoLine("- [ ] task")).toEqual({ done: false, rest: "task" });
    expect(parseTodoLine("* [x] done")).toEqual({ done: true, rest: "done" });
    expect(parseTodoLine("+ [X] done")).toEqual({ done: true, rest: "done" });
  });
});

describe("parseLinks", () => {
  const alias = aliasFor(["Note", "note-id"], ["A", "a-id"], ["B", "b-id"]);

  it("parses open todo wikilink", () => {
    const edges = parseLinks("- [ ] do thing [[Note]]", "src", alias);
    expect(edges).toHaveLength(1);
    expect(edges[0]).toMatchObject({
      type: "todo",
      source: "src",
      target: "note-id",
      todoDone: false,
      lineNumber: 1,
    });
  });

  it("parses completed todo wikilink", () => {
    const edges = parseLinks("- [x] [[Note]]", "src", alias);
    expect(edges).toHaveLength(1);
    expect(edges[0]).toMatchObject({
      type: "todo",
      todoDone: true,
    });
  });

  it("detects * and + task lines", () => {
    expect(parseLinks("* [ ] [[Note]]", "src", alias)[0]?.type).toBe("todo");
    expect(parseLinks("+ [X] [[Note]]", "src", alias)[0]?.todoDone).toBe(true);
  });

  it("emits one edge per wikilink on the same todo line", () => {
    const edges = parseLinks("- [ ] task with [[A]] and [[B]]", "src", alias);
    expect(edges).toHaveLength(2);
    expect(edges.every((e) => e.type === "todo" && e.todoDone === false)).toBe(true);
    expect(edges.every((e) => e.lineNumber === 1)).toBe(true);
    expect(edges.map((e) => e.target).sort()).toEqual(["a-id", "b-id"]);
  });

  it("dedupes body wikilink over todo for the same target", () => {
    const content = "See [[Note]] in prose.\n- [ ] [[Note]]";
    const edges = parseLinks(content, "src", alias);
    const toNote = edges.filter((e) => e.target === "note-id");
    expect(toNote).toHaveLength(1);
    expect(toNote[0].type).toBe("wikilink");
  });

  it("updates todoDone on rescan without duplicating", () => {
    let edges = parseLinks("- [ ] [[Note]]", "src", alias);
    expect(edges).toHaveLength(1);
    expect(edges[0].todoDone).toBe(false);

    edges = parseLinks("- [x] [[Note]]", "src", alias);
    expect(edges).toHaveLength(1);
    expect(edges[0].type).toBe("todo");
    expect(edges[0].todoDone).toBe(true);
  });
});

describe("findUnlinkedMentions", () => {
  /** @param {Array<{ id: string; title: string; content: string; kind?: string; path?: string }>} list */
  function notesMap(list) {
    const m = new Map();
    for (const n of list) {
      m.set(n.id, {
        path: `${n.title}.md`,
        folder: "",
        kind: "note",
        ...n,
      });
    }
    return m;
  }

  it("matches note titles in to-do text", () => {
    const notes = notesMap([
      { id: "src", title: "Monday", content: "- [ ] call Dentist about forms" },
      { id: "dent", title: "Dentist", content: "# Dentist\n\nAppt." },
    ]);
    const hits = findUnlinkedMentions("src", notes, buildAliasIndex(notes));
    expect(hits.map((h) => h.id)).toEqual(["dent"]);
  });

  it("uses word boundaries (no dentistry → Dentist)", () => {
    const notes = notesMap([
      { id: "src", title: "Log", content: "dentistry billing codes" },
      { id: "dent", title: "Dentist", content: "" },
    ]);
    const hits = findUnlinkedMentions("src", notes, buildAliasIndex(notes));
    expect(hits).toHaveLength(0);
  });

  it("matches multi-word phrases", () => {
    const notes = notesMap([
      { id: "src", title: "Plan", content: "Kickoff for project alpha next week" },
      { id: "proj", title: "Project Alpha", content: "" },
    ]);
    const hits = findUnlinkedMentions("src", notes, buildAliasIndex(notes));
    expect(hits.map((h) => h.id)).toEqual(["proj"]);
  });

  it("skips targets that already have an explicit link", () => {
    const notes = notesMap([
      { id: "src", title: "Day", content: "See Dentist soon" },
      { id: "dent", title: "Dentist", content: "" },
    ]);
    const explicit = new Set(["dent"]);
    const hits = findUnlinkedMentions("src", notes, buildAliasIndex(notes), explicit);
    expect(hits).toHaveLength(0);
  });

  it("includes to-do line text in plainTextForMatching", () => {
    const text = plainTextForMatching("- [ ] finish Budget review\n\n## Notes\n\n_nothing_");
    expect(text).toContain("finish budget review");
  });
});

describe("day note linking", () => {
  /** @param {Array<{ id: string; ymd: string; content?: string }>} days */
  function dayVault(days) {
    const m = new Map();
    for (const d of days) {
      const dt = new Date(
        Number(d.ymd.slice(0, 4)),
        Number(d.ymd.slice(5, 7)) - 1,
        Number(d.ymd.slice(8, 10)),
      );
      const title = dt.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      m.set(d.id, {
        id: d.id,
        title,
        path: `Days/${d.ymd}.md`,
        folder: "Days",
        kind: "day",
        content: d.content || `# ${title}\n\n## Notes\n\n`,
        meta: { ymd: d.ymd },
      });
    }
    return m;
  }

  it("resolves wikilinks without weekday (May 12, 2005)", () => {
    const notes = dayVault([
      { id: "day:2005-05-12", ymd: "2005-05-12" },
      { id: "day:2006-05-16", ymd: "2006-05-16" },
    ]);
    const alias = buildAliasIndex(notes);
    expect(resolveNoteId("May 12, 2005", alias, notes)).toBe("day:2005-05-12");
  });

  it("resolves Tuesday, May 2006 when only one Tuesday exists that month", () => {
    const notes = dayVault([
      { id: "day:2005-05-12", ymd: "2005-05-12" },
      { id: "day:2006-05-16", ymd: "2006-05-16" },
    ]);
    const alias = buildAliasIndex(notes);
    expect(resolveNoteId("Tuesday, May 2006", alias, notes)).toBe("day:2006-05-16");
  });

  it("links notes that mention another day YYYY-MM-DD in body text", () => {
    const notes = dayVault([
      {
        id: "day:2005-05-12",
        ymd: "2005-05-12",
        content: "## Notes\n\nFollow-up on 2006-05-16\n",
      },
      { id: "day:2006-05-16", ymd: "2006-05-16" },
    ]);
    const alias = buildAliasIndex(notes);
    const edges = parseLinks(notes.get("day:2005-05-12").content, "day:2005-05-12", alias, notes);
    const ymdEdges = extractYmdMentionEdges(
      notes.get("day:2005-05-12").content,
      "day:2005-05-12",
      notes,
    );
    const all = [...edges, ...ymdEdges];
    expect(all.some((e) => e.target === "day:2006-05-16")).toBe(true);
  });

  it("resolves [[Tuesday, May 26]] without year when unique", () => {
    const notes = dayVault([
      { id: "day:2025-05-12", ymd: "2025-05-12" },
      { id: "day:2026-05-26", ymd: "2026-05-26" },
    ]);
    const alias = buildAliasIndex(notes);
    expect(resolveNoteId("Tuesday, May 26", alias, notes)).toBe("day:2026-05-26");
  });

  it("links plain text Tuesday May 26th in notes to the day node", () => {
    const notes = dayVault([
      {
        id: "day:2025-05-12",
        ymd: "2025-05-12",
        content: "## Notes\n\nPrep for Tuesday May 26th\n",
      },
      { id: "day:2026-05-26", ymd: "2026-05-26" },
    ]);
    const alias = buildAliasIndex(notes);
    const planner = "Prep for Tuesday May 26th";
    const hits = findUnlinkedMentionsFromText(planner, "day:2025-05-12", notes, alias);
    expect(hits.map((h) => h.id)).toEqual(["day:2026-05-26"]);
    const edges = extractPlannerReferenceEdges(planner, "day:2025-05-12", notes, alias);
    expect(edges.some((e) => e.target === "day:2026-05-26" && e.type === "wikilink")).toBe(
      true,
    );
  });

  it("parses [[Tuesday, May 2006]] wikilinks between day notes", () => {
    const notes = dayVault([
      {
        id: "day:2005-05-12",
        ymd: "2005-05-12",
        content: "## Notes\n\nSee [[Tuesday, May 2006]]\n",
      },
      { id: "day:2006-05-16", ymd: "2006-05-16" },
    ]);
    const alias = buildAliasIndex(notes);
    const edges = parseLinks(notes.get("day:2005-05-12").content, "day:2005-05-12", alias, notes);
    expect(edges.some((e) => e.target === "day:2006-05-16")).toBe(true);
  });
});
