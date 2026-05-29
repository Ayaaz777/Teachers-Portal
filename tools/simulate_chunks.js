function computeFirstChunk(text) {
  const firstChunkOfTurn = true;
  let chunksFlushedThisTurn = 0;
  const ttsBuffer = [];
  function flushTtsBuffer() {
    if (!ttsBuffer.length) return null;
    const combined = ttsBuffer.join(' ');
    ttsBuffer.length = 0;
    return combined;
  }
  function scheduleSentenceTts(sentence) {
    let firstChunk = null;
    let firstChunkLocal = firstChunkOfTurn;
    let line = sentence.trim();
    if (!line) return null;
    const splitCap = firstChunkLocal ? 30 : 100;
    const minSplit = firstChunkLocal ? 15 : 60;
    while (line.length > splitCap) {
      const m = line.slice(minSplit).search(/[,;:—–]/);
      if (m < 0) break;
      const splitIdx = minSplit + m + 1;
      const head = line.slice(0, splitIdx).trim();
      const tail = line.slice(splitIdx).trim();
      if (!head) break;
      ttsBuffer.push(head);
      const combined = flushTtsBuffer();
      if (firstChunk === null) firstChunk = combined;
      chunksFlushedThisTurn++;
      if (!tail) return firstChunk;
      line = tail;
    }
    ttsBuffer.push(line);
    const minChars = chunksFlushedThisTurn < 3 ? 50 : 80;
    const maxChars = chunksFlushedThisTurn < 3 ? 120 : 250;
    const total = ttsBuffer.reduce((sum, s) => sum + s.length, 0);
    if (total >= maxChars) {
      const combined = flushTtsBuffer();
      if (firstChunk === null) firstChunk = combined;
    } else if (firstChunkLocal) {
      const buf = ttsBuffer.join(' ');
      const hasSentenceEnd = /[.!?]\s*$/.test(buf);
      const hasClauseBreak = /[,;:—-]\s*$/.test(buf);
      if (hasSentenceEnd || (total >= 20 && hasClauseBreak) || total >= 35) {
        const combined = flushTtsBuffer();
        if (firstChunk === null) firstChunk = combined;
      }
    } else if (total >= minChars) {
      const combined = flushTtsBuffer();
      if (firstChunk === null) firstChunk = combined;
    }
    return firstChunk;
  }

  // Split into sentences roughly like the server (not exact streaming recombine)
  const sentences = text.split(/([.!?]+)\s*/).reduce((acc, cur, idx, arr) => {
    if (cur === undefined) return acc;
    if (/[.!?]+/.test(cur)) {
      if (acc.length) acc[acc.length-1] += cur;
    } else {
      acc.push(cur);
    }
    return acc;
  }, []).map(s => s.trim()).filter(Boolean);

  for (const s of sentences) {
    const fc = scheduleSentenceTts(s);
    if (fc) return fc;
  }
  return null;
}

const texts = [
  "Hey Ayaaz, I'm Retron, your in-app sidekick for RME ops. I handle Notion databases, payroll, Discord, web searches, and memory across sessions. What do you need?",
  "I'll search that for you.\n<function_calls>\n<invoke name=\"web_search\">\n<parameter name=\"query\">Cape Town weather today</parameter>\n</invoke>\n</function_calls>\n\nMostly clear, around 24°C, light winds. Nothing dramatic.",
  "Payroll's done when the numbers match the contract and the bank clears it."
];

texts.forEach((t,i) => {
  const fc = computeFirstChunk(t);
  console.log('Turn', i+1, 'first chunk length=', fc ? fc.length : 'none', 'text=', JSON.stringify(fc));
});
