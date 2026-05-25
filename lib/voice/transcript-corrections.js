const CORRECTIONS = [
  [/\bthus code\b/gi, 'Discord'],
  [/\bthis code\b/gi, 'Discord'],
  [/\bdis code\b/gi, 'Discord'],
  [/\bdis course\b/gi, 'Discord'],
  [/\bdiscourse\b/gi, 'Discord'],
  [/\bthe cord\b/gi, 'Discord'],
  [/\bdisc ord\b/gi, 'Discord'],
  [/\bdiscord\s+it\b/gi, 'Discord'],
  [/\bthe score\b/gi, 'Discord'],
];

function correctTranscript(text) {
  let out = String(text || '');
  for (const [pattern, replacement] of CORRECTIONS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

module.exports = { correctTranscript, CORRECTIONS };
