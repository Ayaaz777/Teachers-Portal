# RecruitMyEnglish — Teachers Portal app

This is an Electron desktop app for Recruit My English, a 2-person commission-only B2B agency placing South African online English teachers into overseas schools. It includes a voice AI agent built with Whisper (STT) + Claude API (brain) + Kokoro/Cartesia (TTS).

## Project structure
- main.js — Electron main process, IPC handlers
- preload.js — bridge between main and renderer
- renderer.js — UI logic, all dashboard cards
- lib/voice-agent.js — voice pipeline orchestration
- lib/tts/ — TTS providers (kokoro.js, cartesia.js, index.js)
- lib/voice-agent/ — voice agent helpers (whisper-server, warm)
- .env — secrets and config (never commit)
- tools/voice/ — local binaries (whisper-server.exe, models)

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
- Voice agent IPC channels live in lib/voice-agent.js. The IPC channels are voice:transcribe, voice:ask-claude, voice:speak, voice:tts-chunk, voice:status, voice:warm-tts.
- Renderer adds dashboard cards via IIFEs named rme<Feature>DashboardCard before the toggleTheme function. New cards follow this pattern.
- After every code change, append a Code change log entry in the project's mirror notes (the user will tell you where).

## Skills
- Load the `rme-mcp` skill when working on MCP connection, tool descriptions, Notion lookup accuracy, or voice-agent stability. It contains the full hardening guide with drop-in patterns.

## Voice agent rules (RME personality)
- Claude must NEVER output numbered lists (no "1.", "2.", "3." or "first", "second", "third"). Connect ideas with "also", "plus", "and" or break across separate sentences.
- Claude must use natural pauses between examples or ideas — [pause=300] or [pause=500] tags. The output should flow like a human speaking, not a structured list.
- Claude should use sparse filler words (max one per reply), prosody tags (1-2 per reply), and the occasional [chuckle] for personality.
- Audio chain must produce smooth, consistent-level output: no volume pumping (dynaudnorm removed), no glitching (correct WAV data offset parsing), no half-speed playback (correct stereo WAV headers). Fixed gain + limiter preferred over dynamic normalization.

## Hard rules
- Never modify .env automatically without showing the user the exact line.
- Never run destructive shell commands (rm, del, format) without explicit user approval.
- Never claim to have sent an email or made an external API call that wasn't actually executed.
- If unsure about a path or API, ask. Do not invent.
