# Restores RME_* voice paths in .env from tools/voice/ and Kokoro defaults (no downloads).
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$VoiceRoot = Join-Path $Root "tools\voice"
$KokoroVoices = Join-Path $Root "node_modules\kokoro-js\voices"

$WhisperExe = Get-ChildItem -Path (Join-Path $VoiceRoot "whisper") -Recurse -Filter "whisper-cli.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
$WhisperServerExe = Get-ChildItem -Path (Join-Path $VoiceRoot "whisper") -Recurse -Filter "whisper-server.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
$WhisperModel = Join-Path $VoiceRoot "models\ggml-small.en.bin"
$FfmpegExe = Join-Path $VoiceRoot "ffmpeg\bin\ffmpeg.exe"

if (-not $WhisperExe) { throw "Missing tools/voice/whisper. Run: npm run setup:voice" }
if (-not (Test-Path $WhisperModel)) { throw "Missing ggml-small.en.bin. Run: npm run setup:voice" }
if (-not (Test-Path $FfmpegExe)) { throw "Missing ffmpeg. Run: npm run setup:ffmpeg" }
if (-not (Test-Path (Join-Path $KokoroVoices "af_heart.bin"))) {
  throw "Missing Kokoro voices. Run: npm install kokoro-js"
}

$map = @{
  "RME_WHISPER_BIN"    = $WhisperExe.FullName
  "RME_WHISPER_MODEL"  = $WhisperModel
  "RME_FFMPEG_BIN"     = $FfmpegExe
  "RME_KOKORO_MODEL"   = "onnx-community/Kokoro-82M-v1.0-ONNX"
  "RME_KOKORO_VOICES"  = $KokoroVoices
  "RME_KOKORO_VOICE"   = "af_heart"
  "RME_KOKORO_SPEED"   = "1.05"
  "RME_KOKORO_DEVICE"  = "cuda"
  "RME_WHISPER_SERVER_URL" = "http://127.0.0.1:8780"
  "RME_WHISPER_SERVER_BIN" = $(if ($WhisperServerExe) { $WhisperServerExe.FullName } else { "" })
  "RME_WHISPER_MODEL_FAST" = ""
  "RME_WHISPER_SERVER_GPU" = "auto"
  "RME_CLAUDE_PROMPT_CACHE" = "1"
  "RME_VOICE_ANTHROPIC_MODEL" = "claude-opus-4-7"
  "RME_VOICE_MAX_TOKENS" = "700"
  "RME_VOICE_ACK" = "0"
  "RME_ANTHROPIC_MODEL_FAST" = "claude-opus-4-7"
  "ANTHROPIC_MODEL"    = "claude-opus-4-7"
}

$removeKeys = @("RME_PIPER_BIN", "RME_PIPER_VOICE")

$EnvFile = Join-Path $Root ".env"
$lines = if (Test-Path $EnvFile) { Get-Content $EnvFile -Encoding UTF8 } else { @() }
$seen = @{}
$out = foreach ($line in $lines) {
  if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$') {
    $key = $Matches[1]
    if ($removeKeys -contains $key) { continue }
    if ($map.ContainsKey($key)) {
      $seen[$key] = $true
      "$key=$($map[$key])"
      continue
    }
  }
  $line
}
foreach ($key in $map.Keys) {
  if (-not $seen[$key]) { $out += "$key=$($map[$key])" }
}
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllLines($EnvFile, $out, $utf8)
Write-Host "Patched voice paths in .env (saved UTF-8, no BOM)."
Write-Host "Keep this file saved (Ctrl+S). Placeholder paths like C:\path\to\... break Whisper."
