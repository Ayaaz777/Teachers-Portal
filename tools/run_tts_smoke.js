(async () => {
  const path = require('path');
  // Load .env manually to ensure API keys are present in this process
  try {
    const fs = require('fs');
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const raw = fs.readFileSync(envPath, 'utf8');
      raw.split(/\r?\n/).forEach(line => {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
        if (m) {
          const key = m[1];
          let val = m[2] || '';
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          process.env[key] = val;
        }
      });
    }
  } catch (e) {}
  console.log('Loaded ANTHROPIC_API_KEY present=', !!process.env.ANTHROPIC_API_KEY);
  const { createVoiceAgentService } = require(path.join(__dirname, '..', 'lib', 'voice-agent.js'));
  const svc = createVoiceAgentService({ anthropicKey: process.env.ANTHROPIC_API_KEY });

  let _turnT0 = 0;
  let _firstTtsAt = null;
  function onTtsChunk(detail) {
    if (!_firstTtsAt) _firstTtsAt = Date.now() - _turnT0;
    console.log('[onTtsChunk]', JSON.stringify(detail), 'firstTtsMs=', _firstTtsAt);
  }

  async function runTurn(prompt) {
    console.log('\n=== TURN:', prompt);
    const t0 = Date.now();
    try {
      _turnT0 = t0;
      _firstTtsAt = null;
      const res = await svc.runAssistantTurn({ messages: [{ role: 'user', content: prompt }], onTtsChunk });
      console.log('TURN DONE, elapsed=', Date.now()-t0, 'ms');
      console.log('FIRST_TTS_MS=', _firstTtsAt);
      console.log('RESULT:', JSON.stringify(res, null, 2));
    } catch (e) {
      console.error('TURN ERROR', e && e.stack ? e.stack : e);
    }
  }

  const prompts = [
    'Hi Retron, who are you?',
    "What's the weather in Cape Town today?",
    'Tell me a one-liner about payroll.'
  ];

  for (const p of prompts) {
    await runTurn(p);
    // small pause between turns
    await new Promise(r => setTimeout(r, 800));
  }

  process.exit(0);
})();
