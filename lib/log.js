/**
 * Minimal main-process logger (correlation ids added at IPC boundaries when needed).
 */

function redactSensitive(val) {
  if (typeof val !== "string") return val;
  return val
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[email]")
    .replace(/\b\d{10,}\b/g, "[phone]")
    .replace(/ntn_[a-zA-Z0-9]+|sk-[a-zA-Z0-9_-]{20,}|sk_car_[a-zA-Z0-9]+/g, "[token]");
}

const log = {
  /** @param {string} tag @param {Record<string, unknown>} [data] */
  info(tag, data) {
    if (data !== undefined) {
      console.log(`[${tag}]`, data);
    } else {
      console.log(`[${tag}]`);
    }
  },
  /** @param {string} tag @param {Record<string, unknown>} [data] */
  warn(tag, data) {
    if (data !== undefined) {
      console.warn(`[${tag}]`, data);
    } else {
      console.warn(`[${tag}]`);
    }
  },
  /** @param {string} tag @param {Record<string, unknown>} [data] */
  error(tag, data) {
    if (data !== undefined) {
      console.error(`[${tag}]`, data);
    } else {
      console.error(`[${tag}]`);
    }
  },
};

module.exports = { log, redactSensitive };
