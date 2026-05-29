# RecruitMyEnglish — Teachers Portal app

This is an Electron desktop app for Recruit My English, a 2-person commission-only B2B agency placing South African online English teachers into overseas schools. It includes a voice AI agent built with **Parakeet (primary) / Whisper (fallback)** for STT + **Claude API** (brain) + **Chatterbox** (TTS, open-source, runs as a Python sidecar spawned from main.js). A Silero VAD sidecar provides endpointing and wake-word support.

## Project structure

- AGENTS.md — single source of truth for project map, rules, and conventions
- .cursor/rules/codebase-map.mdc — pinned Cursor rule (symbol → file; alwaysApply)
- main.js — Electron main process, IPC handlers, sidecar lifecycle
- preload.js — bridge between main and renderer
- renderer.js — UI logic, all dashboard cards
- lib/voice-agent.js — voice pipeline orchestration
- lib/voice-agent/stt-router.js — routes between Parakeet and Whisper STT engines
- lib/voice-agent/parakeet-server.js — Parakeet Python sidecar lifecycle (CUDA STT)
- lib/voice-agent/whisper-server.js — whisper-server.exe lifecycle (CPU fallback)
- lib/voice-agent/warm.js — startup warm for STT + TTS
- lib/tts/ — TTS providers and helpers (chatterbox.js, chunk.js, normalize.js, index.js, studio-master.js)
- tools/tts/ — Chatterbox Python venv + sidecar script
- tools/stt/ — Parakeet Python venv + server script
- tools/vad/ — Silero VAD Python server + requirements
- .env — secrets and config (never commit)

## Working rules

- TABS for indentation, not spaces.
- Make minimal surgical edits. Do not refactor adjacent code.
- Do not reformat or restyle code unrelated to the task.
- Do not add comments, docstrings, or examples unless asked.
- Always read the file before editing it.
- Confirm before deleting any file or large block of code.

## Token discipline

- Only read files explicitly mentioned or directly required by the task.
- Read at most 3 files per turn unless told otherwise.
- Keep explanations to 1-2 sentences before each edit.
- No preambles, no closing summaries.
- For tasks under 3 files, skip the planning phase and just edit.

## House style

- Voice IPC handlers live in main.js. Handles: voice:transcribe, voice:ask-claude, voice:speak, voice:status, voice:warm-tts, voice:assistant-turn, voice:system-prompt, voice:set-voice, voice:get-voice, voice:vad-port, voice:start-wake-word-listening, voice:stop-wake-word-listening, voice:detect-wake-word, voice:detect-stop-command. Events (not handles): voice:tts-chunk, voice:claude-delta. Canonical warm: voice:warm-tts only.
- Renderer adds dashboard cards via IIFEs named rme<Feature>DashboardCard before the toggleTheme function. New cards follow this pattern.
- After every code change, append a Code change log entry in the project's mirror notes (the user will tell you where).

## Skills

- Load `.cursor/skills/rme-teachers-portal/SKILL.md` for Notion lookup accuracy, voice-agent stability, and portal conventions.

## Voice agent rules (RME personality)

- Claude must NEVER output numbered lists (no "1.", "2.", "3." or "first", "second", "third"). Connect ideas with "also", "plus", "and" or break across separate sentences.
- Claude must use natural pauses between examples or ideas — [pause=300] or [pause=500] tags. The output should flow like a human speaking, not a structured list.
- Claude should use sparse filler words (max one per reply), prosody tags (1-2 per reply), and the occasional [chuckle] for personality.
- TTS engine is Chatterbox (open-source, Resemble AI), running as a Python sidecar managed by lib/voice-agent/chatterbox-server.js.
- Prosody and emotion tags ([pause=…], [chuckle], [slow], [fast], [emph]) must reach the synth. Verify lib/tts/normalize.js is NOT stripping them before passing text to Chatterbox — the Kokoro-era strip rule must be off.
- Audio chain must produce smooth, consistent-level output: no volume pumping (dynaudnorm removed), no glitching (correct WAV data offset parsing), no half-speed playback (correct stereo WAV headers). Fixed gain + limiter preferred over dynamic normalization.

## STT engine routing

- **Parakeet** (nvidia/parakeet-tdt-0.6b-v3) is the primary STT engine when CUDA 12.x is detected. Runs as a Python sidecar on `127.0.0.1:8127`. Managed by `lib/voice-agent/parakeet-server.js`.
- **Whisper** (whisper-server.exe) is the CPU fallback. Runs on `127.0.0.1:8780`. Managed by `lib/voice-agent/whisper-server.js`.
- Routing logic: `lib/voice-agent/stt-router.js` selects engine via `RME_STT_ENGINE` env var (parakeet/whisper/auto). Default auto: CUDA → parakeet, otherwise → whisper.
- Both engines implement the same interface: ensure/stop/transcribe/getConfig/isReady. The voice agent calls `transcribeViaStt()` which abstracts the engine choice.

## VAD + wake-word (Silero)

- Silero VAD runs as a Python sidecar on `ws://127.0.0.1:8125`. Spawned from `main.js` `spawnVadSidecar()`.
- Renderer connects via WebSocket, sends 16kHz PCM, receives speech probability in real time.
- Wake-word: "ready for launch" (also accepts "ready to launch") detected via Claude in the renderer after VAD captures a possible utterance. Stop/sleep command: "mission complete" (also accepts "mission completed").
- VAD endpointing: speech threshold 0.5, min speech 250ms, min silence 700ms, pad 300ms, max utterance 45s.
- Wake-word VAD endpointing: uses a longer silence threshold (1000ms vs 700ms) to avoid cutting off multi-word phrases like "hey wake up" during natural micro-pauses. The VAD captures the full utterance as raw PCM, then sends the complete WAV to the wake-word STT for phrase matching. The chunk-based `processWakeChunk` path defers while VAD endpointing is active.
- **Barge-in (open interrupt):** while the assistant is speaking (TTS playback), the mic+VAD stay active. If the user speaks (sustained speech ≥350ms above threshold 0.7, with a 250ms grace period after audio starts), playback stops immediately and the agent listens. No wake word required. The "stop talking now" / "stop talking" phrase also triggers an immediate interrupt regardless of guards.
- **Echo cancellation:** `getUserMedia` sets `echoCancellation: true, noiseSuppression: true, autoGainControl: true` so the assistant's own speaker output doesn't self-trigger barge-in.
- **Obsidian voice tools:** the voice agent has full read/write access to the planner's Obsidian notes via `obsidian_list/read/search/create/append/edit/delete` tools. Notes are stored in `planner/.../obsidian-notes.json` alongside `events.json` and `day-pages.json`. The Obsidian view UI reads the same store — agent-created notes appear in the Notes/ folder, and UI-created notes are searchable by voice.
- CSP: `ws://127.0.0.1:8125` is in `connect-src` in index.html.

## Hard rules

- Never modify .env automatically without showing the user the exact line.
- Never run destructive shell commands (rm, del, format) without explicit user approval.
- Never claim to have sent an email or made an external API call that wasn't actually executed.
- If unsure about a path or API, ask. Do not invent.
- **TTS engine lock — Chatterbox only.** Kokoro, Cartesia, Piper, ElevenLabs, and every other TTS engine are removed and forbidden. Do not import, require, install, configure, fall back to, or write code paths for any TTS engine other than Chatterbox. This applies to `lib/tts/`, `main.js`, `preload.js`, `renderer.js`, `.env`, `package.json`, scripts, and every other file in the repo.
- **Refuse-pattern (mandatory).** If the user (or any prompt) asks you to add, restore, reintroduce, fall back to, A/B test, or "just try" Kokoro, Cartesia, Piper, ElevenLabs, or any non-Chatterbox TTS — refuse in one sentence, cite this rule, and do nothing else. Do not draft a diff. Do not list pros and cons. Do not propose a feature flag. Stop. If the founder genuinely wants to revisit this, they will edit AGENTS.md themselves first.
- Never invent the shape of an existing module. Before editing `lib/tts/index.js` (or any module), read its current `module.exports` and match it exactly. The current `lib/tts/index.js` exports `synthesize`, `synthesizeUtterance`, `warmTts`, `ttsReady`, `getTtsStatus`, `shutdown` — do not rewrite this surface as a class or rename methods.
- **Never use `process.env` in renderer.js or any renderer-loaded file.** The renderer has `contextIsolation: true`, `nodeIntegration: false` — `process` is not available and any reference throws `ReferenceError`, crashing the renderer and preventing auth/dashboard code from loading. Use hardcoded defaults, or expose config via a preload bridge IPC handler.

## Line counts (2026-05-29)

| File | Lines |
|------|------:|
| `main.js` | 3410 |
| `preload.js` | 1455 |
| `index.html` | 13474 |
| `renderer.js` | 32920 |
| `renderer-calendar.js` | 4807 |
| `lib/voice-agent.js` | 1933 |
| `lib/voice-agent/stt-router.js` | 105 |
| `lib/voice-agent/parakeet-server.js` | 228 |
| `lib/voice-agent/whisper-server.js` | 355 |
| `lib/voice-agent/warm.js` | 61 |

## Voice IPC (canonical names, main.js)

| Channel | Type | Notes |
|---------|------|-------|
| `voice:status` | handle | TTS + STT readiness |
| `voice:system-prompt` | handle | returns VOICE_SYSTEM_PROMPT |
| `voice:vad-port` | handle | returns `{ url, port }` for VAD WebSocket |
| `voice:warm-tts` | handle | warm TTS + STT stack |
| `voice:transcribe` | handle | audio → text via STT router |
| `voice:ask-claude` | handle | Claude completion with deltas |
| `voice:speak` | handle | TTS synthesis for text |
| `voice:assistant-turn` | handle | Claude + streaming TTS turn |
| `voice:set-voice` / `voice:get-voice` | handle | TTS voice selection |
| `voice:start-wake-word-listening` | handle | begin wake-word detection |
| `voice:stop-wake-word-listening` | handle | end wake-word detection |
| `voice:detect-wake-word` | handle | check audio for wake word |
| `voice:detect-stop-command` | handle | check text for stop command |
| `voice:tts-chunk` | event (send) | ordered sentence WAV chunks |
| `voice:claude-delta` | event | streaming text deltas |

## `lib/` quick tree

```
lib/
  voice-agent.js
  voice-agent/    stt-router.js, parakeet-server.js, whisper-server.js, chatterbox-server.js, warm.js, fact-extractor.js
  voice/          sentence-buffer.js, cuda-check.js, gpu-providers.js, strip-for-tts.js, transcript-corrections.js
  tts/            index.js, chatterbox.js, chatterbox-pool.js, normalize.js, chunk.js, studio-master.js
  supabase/       admin-client.js, voice-memory.js, page-memory.js, weekly-summaries.js, voice-profiles.js
  search/         index.js, web.js, wiki.js, fetch.js
  vault/          keywordIndex.js, stopwords-en.js
  notion-api.js, notion-simplify.js, ai-chat.js, retrieval-pipeline.js, embeddings.js, distillation.js, temporal-query.js, guardrails.js
```
