function computeFirstChunk(text) {
  const ttsBuffer = [];
  let chunksFlushedThisTurn = 0;
  function flush() {
    if (!ttsBuffer.length) return null;
    const combined = ttsBuffer.join(' ');
    ttsBuffer.length = 0;
    return combined;
  }
  function schedule(sentence) {
    let line = sentence.trim();
    if (!line) return null;
    const splitCap = 30;
    const minSplit = 15;
    while (line.length > splitCap) {
      const m = line.slice(minSplit).search(/[,;:—–]/);
      if (m < 0) break;
      const splitIdx = minSplit + m + 1;
      const head = line.slice(0, splitIdx).trim();
      const tail = line.slice(splitIdx).trim();
      if (!head) break;
      ttsBuffer.push(head);
      const c = flush();
      if (c) return c;
      chunksFlushedThisTurn++;
      if (!tail) return null;
      line = tail;
    }
    ttsBuffer.push(line);
    const minChars = chunksFlushedThisTurn < 3 ? 50 : 80;
    const maxChars = chunksFlushedThisTurn < 3 ? 120 : 250;
    const total = ttsBuffer.reduce((s, x) => s + x.length, 0);
    if (total >= maxChars) {
      const c = flush();
      if (c) return c;
    }
    const buf = ttsBuffer.join(' ');
    const hasSentenceEnd = /[.!?]\s*$/.test(buf);
    const hasClauseBreak = /[,;:—-]\s*$/.test(buf);
    if (hasSentenceEnd || (total >= 20 && hasClauseBreak) || total >= 35) {
      const c = flush();
      if (c) return c;
    }
    return null;
  }
  return schedule(text);
}

const texts = [
  "Hey Ayaaz, I'm Retron, your sidekick for RME ops. I handle Discord, Notion databases, payroll, and whatever else keeps things moving—Discord reads and writes, teacher data, payslips, applicant pipeline, school accounting. Ask me anything about the system or the schools.",
  "I don't have real-time weather data. You'd need to check a weather app or website for that.",
  "Payroll's a weekly heartbeat — get it right, teachers stay happy."
];

texts.forEach((t, i) => {
  const c = computeFirstChunk(t);
  console.log('Turn', i + 1, 'firstChunkLen=', c ? c.length : 0, 'chunk=', JSON.stringify(c));
});
