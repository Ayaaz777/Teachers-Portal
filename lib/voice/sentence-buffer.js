/**
 * Pull complete sentences from a streaming Claude text buffer.
 */

/** @param {string} s */
function normalizeSpace(s) {
  return String(s || "").replace(/\s+/g, " ").trim();
}

/**
 * @param {string} buffer Accumulated assistant text (may end mid-sentence).
 * @returns {{ sentences: string[]; remainder: string }}
 */
function pullCompleteSentences(buffer) {
  const text = String(buffer || "");
  if (!text) return { sentences: [], remainder: "" };

  /** @type {string[]} */
  const sentences = [];
  const re = /[^.!?]*[.!?]+(?:\s+|$)/g;
  let lastIndex = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    const s = normalizeSpace(m[0]);
    if (s.length >= 2) sentences.push(s);
    lastIndex = m.index + m[0].length;
  }
  return { sentences, remainder: text.slice(lastIndex) };
}

/**
 * @param {string} remainder
 * @returns {string[]}
 */
function flushRemainder(remainder) {
  const s = normalizeSpace(remainder);
  if (!s) return [];
  return [s];
}

/**
 * Sentences first; optionally one early clause so TTS starts before a period.
 * @param {string} buffer
 * @param {{ allowEarlyClause?: boolean }} [opts]
 * @returns {{ units: string[]; remainder: string }}
 */
function pullSpeakableUnits(buffer, opts = {}) {
  const { sentences, remainder } = pullCompleteSentences(buffer);
  if (sentences.length) {
    return { units: sentences, remainder };
  }
  if (!opts.allowEarlyClause) {
    return { units: [], remainder };
  }
  const r = String(remainder || "").trim();
  if (!r) return { units: [], remainder: "" };

  const commaIdx = r.search(/[,;:]/);
  if (commaIdx >= 8 && commaIdx <= 96) {
    const chunk = normalizeSpace(r.slice(0, commaIdx + 1));
    const rest = r.slice(commaIdx + 1).trimStart();
    if (chunk.length >= 6) {
      return { units: [chunk], remainder: rest };
    }
  }

  return { units: [], remainder: r };
}

module.exports = {
  pullCompleteSentences,
  flushRemainder,
  pullSpeakableUnits,
};
