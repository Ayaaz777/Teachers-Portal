/**
 * Turn Notion property payloads into plain strings for table cells.
 * @param {{ type: string }} prop
 */

const SHORT_MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * @param {number} y full year
 * @param {number} month1to12
 * @param {number} day
 * @returns {string} e.g. Mar 31 / 2006
 */
function formatYmdPartsAsMarDdYy(y, month1to12, day) {
  const d = new Date(y, month1to12 - 1, day);
  if (Number.isNaN(d.getTime())) {
    return "";
  }
  const mo = SHORT_MONTH_NAMES[d.getMonth()];
  return `${mo} ${d.getDate()} / ${d.getFullYear()}`;
}

/**
 * @param {string | undefined | null} isoLike Notion date start/end or ISO datetime
 * @returns {string} e.g. Mar 31 / 2006
 */
function formatNotionDateForDisplay(isoLike) {
  if (isoLike == null || isoLike === "") {
    return "";
  }
  const s = String(isoLike).trim();

  const plain = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (plain) {
    const out = formatYmdPartsAsMarDdYy(
      Number(plain[1]),
      Number(plain[2]),
      Number(plain[3]),
    );
    return out || s;
  }

  /** Notion often encodes date-only as midnight UTC. */
  if (
    /^(\d{4})-(\d{2})-(\d{2})T00:00:00(?:\.0+)?Z$/.test(s) ||
    /^(\d{4})-(\d{2})-(\d{2})T00:00:00(?:\.0+)?[+-]00:?00$/.test(s)
  ) {
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const out = formatYmdPartsAsMarDdYy(
        Number(m[1]),
        Number(m[2]),
        Number(m[3]),
      );
      return out || s;
    }
  }

  const d = new Date(s);
  if (Number.isNaN(d.getTime())) {
    return s;
  }
  return (
    formatYmdPartsAsMarDdYy(
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
    ) || s
  );
}

function propertyToString(prop) {
  if (!prop) {
    return "";
  }
  switch (prop.type) {
    case "title":
      return richTextToPlain(prop.title);
    case "rich_text":
      return richTextToPlain(prop.rich_text);
    case "number":
      return prop.number == null ? "" : String(prop.number);
    case "select":
      return prop.select?.name ?? "";
    case "multi_select":
      return (prop.multi_select ?? []).map((s) => s.name).join(", ");
    case "date": {
      if (!prop.date) {
        return "";
      }
      const { start, end } = prop.date;
      if (!start) {
        return "";
      }
      const startFmt = formatNotionDateForDisplay(start);
      if (end) {
        return `${startFmt} → ${formatNotionDateForDisplay(end)}`;
      }
      return startFmt;
    }
    case "people":
      return (prop.people ?? [])
        .map((p) => p.name || p.id)
        .filter(Boolean)
        .join(", ");
    case "files":
      return (prop.files ?? []).map((f) => f.name || "(file)").join(", ");
    case "checkbox":
      return prop.checkbox ? "Yes" : "No";
    case "url":
      return prop.url ?? "";
    case "email":
      return prop.email ?? "";
    case "phone_number":
      return prop.phone_number ?? "";
    case "status":
      return prop.status?.name ?? "";
    case "created_time":
      return formatNotionDateForDisplay(prop.created_time ?? "");
    case "last_edited_time":
      return formatNotionDateForDisplay(prop.last_edited_time ?? "");
    case "created_by":
      return prop.created_by?.name ?? prop.created_by?.id ?? "";
    case "last_edited_by":
      return prop.last_edited_by?.name ?? prop.last_edited_by?.id ?? "";
    case "formula":
      return formulaToString(prop.formula);
    case "relation":
      return (prop.relation ?? [])
        .map((r) => {
          if (r && typeof r === "object") {
            // Populated server-side via enrichRelationTitlesOnPages (linked DB title).
            const named =
              typeof r.display_name === "string"
                ? r.display_name.trim()
                : "";
            if (named) {
              return named;
            }
            if (typeof r.id === "string" && r.id.trim()) {
              return r.id.trim();
            }
          }
          return "";
        })
        .filter(Boolean)
        .join(", ");
    case "rollup":
      return rollupToString(prop.rollup);
    case "unique_id":
      if (!prop.unique_id) {
        return "";
      }
      const p = prop.unique_id.prefix;
      const n = prop.unique_id.number;
      return p ? `${p}-${n}` : String(n);
    default:
      return "";
  }
}

function richTextToPlain(chunks) {
  if (!chunks || !chunks.length) {
    return "";
  }
  return chunks.map((c) => c.plain_text || "").join("");
}

function formulaToString(formula) {
  if (!formula) {
    return "";
  }
  switch (formula.type) {
    case "string":
      return formula.string ?? "";
    case "number":
      return formula.number == null ? "" : String(formula.number);
    case "boolean":
      return formula.boolean ? "Yes" : "No";
    case "date":
      return formatNotionDateForDisplay(formula.date?.start ?? "");
    default:
      return "";
  }
}

function rollupToString(rollup) {
  if (!rollup) {
    return "";
  }
  switch (rollup.type) {
    case "number":
      return rollup.number == null ? "" : String(rollup.number);
    case "date":
      return formatNotionDateForDisplay(rollup.date?.start ?? "");
    case "array": {
      const items = rollup.array ?? [];
      return items
        .map((item) => {
          if (item.type === "title") {
            return richTextToPlain(item.title);
          }
          if (item.type === "rich_text") {
            return richTextToPlain(item.rich_text);
          }
          if (item.type === "select") {
            return item.select?.name ?? "";
          }
          if (item.type === "multi_select") {
            return (item.multi_select ?? []).map((s) => s.name).join(", ");
          }
          return "";
        })
        .filter(Boolean)
        .join(", ");
    }
    default:
      return "";
  }
}

function normalizePageId(raw) {
  if (!raw) {
    return "";
  }
  const s = String(raw).trim();
  const hex = s.replace(/-/g, "");
  if (hex.length !== 32) {
    return s;
  }
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * @param {Array<{ id?: string; properties?: Record<string, unknown> }>} pages
 */
/**
 * Put the main column first: property named "Name" (any casing), else Notion `title` type.
 * @param {string[]} columns sorted names
 * @param {Record<string, { type?: string }> | null} sampleProps properties from any page
 */
function orderColumnsMainFirst(columns, sampleProps) {
  const nameIdx = columns.findIndex(
    (c) =>
      c.trim().localeCompare("name", undefined, { sensitivity: "base" }) === 0,
  );
  let leadIdx = nameIdx;
  if (leadIdx < 0 && sampleProps) {
    leadIdx = columns.findIndex((col) => sampleProps[col]?.type === "title");
  }
  if (leadIdx > 0) {
    const [lead] = columns.splice(leadIdx, 1);
    columns.unshift(lead);
  }
  return columns;
}

/**
 * Property names shown right after the title column on the admin sheet (aligned with pay slip email matching in main.js).
 * @param {string} col
 * @returns {boolean}
 */
function isEmailLikeColumnName(col) {
  const s = String(col).trim();
  if (!s) {
    return false;
  }
  if (/^e-?mails?$/i.test(s)) {
    return true;
  }
  if (/\b(e-?mails?|email\s+address)\b/i.test(s)) {
    return true;
  }
  if (/\be\s*mail\b/i.test(s)) {
    return true;
  }
  if (/\bemail\b/i.test(s)) {
    return true;
  }
  if (/\b(e-?mail|electronic\s+mail)\b/i.test(s)) {
    return true;
  }
  return (
    /\b(teacher|contact|work|staff|payee|pay\s*roll|payroll)\b/i.test(s) &&
    /\b(e-?mail|email)\b/i.test(s)
  );
}

/**
 * After Name / title, place email-related columns so new Notion email fields are visible without scrolling.
 * @param {string[]} columns
 * @returns {string[]}
 */
function orderEmailColumnsAfterLead(columns) {
  if (columns.length <= 1) {
    return columns;
  }
  const lead = columns[0];
  const rest = columns.slice(1);
  const emailCols = [];
  const other = [];
  for (const c of rest) {
    if (isEmailLikeColumnName(c)) {
      emailCols.push(c);
    } else {
      other.push(c);
    }
  }
  emailCols.sort((a, b) => a.localeCompare(b));
  return [lead, ...emailCols, ...other];
}

/** Normalized (`trim`, lower-case, collapsed spaces). */
function normalizedNotionSheetColumnLabel(col) {
  return String(col ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** Omitted entirely from exported tables (still exists in Notion). */
const OMITTED_NOTION_SHEET_COLUMN_LABELS_NORMALIZED = new Set([
  "adults classes",
]);

function omitNotionSheetColumnByLabel(col) {
  return OMITTED_NOTION_SHEET_COLUMN_LABELS_NORMALIZED.has(
    normalizedNotionSheetColumnLabel(col),
  );
}

/**
 * Visible column title in sheets and PDF. Notion updates still use the raw property name.
 * @param {string | undefined | null} col
 * @returns {string}
 */
function displayNotionSheetColumnLabel(col) {
  const n = normalizedNotionSheetColumnLabel(col);
  if (n === "adults") {
    return "ADULTS CLASSES";
  }
  if (n === "kid" || n === "kids") {
    return "KIDS CLASSES";
  }
  if (n === "trial" || n === "trials") {
    return "TRIAL CLASSES";
  }
  return String(col ?? "");
}

function pagesToTable(pages) {
  /** @type {Set<string>} */
  const colSet = new Set();
  /** @type {Record<string, unknown> | null} */
  let sampleProps = null;
  for (const page of pages) {
    if ("properties" in page && page.properties) {
      Object.keys(page.properties).forEach((k) => colSet.add(k));
      if (!sampleProps && Object.keys(page.properties).length) {
        sampleProps = page.properties;
      }
    }
  }
  const columns = orderEmailColumnsAfterLead(
    orderColumnsMainFirst(
      Array.from(colSet).sort((a, b) => a.localeCompare(b)),
      sampleProps,
    ),
  ).filter((c) => !omitNotionSheetColumnByLabel(c));
  const rows = pages.map((page) => {
    const props = "properties" in page && page.properties ? page.properties : {};
    return columns.map((col) => propertyToString(props[col]));
  });
  const pageIds = pages.map((page) =>
    page && page.id ? normalizePageId(page.id) : "",
  );
  return { columns, rows, pageIds };
}

module.exports = {
  propertyToString,
  pagesToTable,
  normalizePageId,
  isEmailLikeColumnName,
  displayNotionSheetColumnLabel,
};
