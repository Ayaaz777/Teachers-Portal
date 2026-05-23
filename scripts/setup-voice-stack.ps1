# Downloads whisper.cpp (Windows x64), ggml-small.en, and portable ffmpeg into tools/voice/.
# TTS: npm install kokoro-js (Kokoro-82M). Use -WriteEnv to patch project .env.

param(
  [switch]$WriteEnv,
  [switch]$FfmpegOnly
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$VoiceRoot = Join-Path $Root "tools\voice"
$WhisperDir = Join-Path $VoiceRoot "whisper"
$FfmpegDir = Join-Path $VoiceRoot "ffmpeg"
$ModelsDir = Join-Path $VoiceRoot "models"
$KokoroVoices = Join-Path $Root "node_modules\kokoro-js\voices"

New-Item -ItemType Directory -Force -Path $WhisperDir, $ModelsDir, $FfmpegDir | Out-Null

function Get-Download {
  param([string]$Url, [string]$OutFile)
  if (Test-Path $OutFile) {
    $len = (Get-Item $OutFile).Length
    if ($len -gt 1000) {
      Write-Host "  skip (exists): $OutFile"
      return
    }
  }
  Write-Host "  download: $Url"
  Invoke-WebRequest -Uri $Url -OutFile $OutFile -UseBasicParsing
}

# --- ffmpeg (portable; no winget needed) ---
$FfmpegZip = Join-Path $FfmpegDir "ffmpeg-win64.zip"
Get-Download -Url "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip" -OutFile $FfmpegZip
$FfmpegExtract = Join-Path $FfmpegDir "_extract"
if (Test-Path $FfmpegExtract) { Remove-Item -Recurse -Force $FfmpegExtract }
Expand-Archive -Path $FfmpegZip -DestinationPath $FfmpegExtract -Force
$FfmpegExeSrc = Get-ChildItem -Path $FfmpegExtract -Recurse -Filter "ffmpeg.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $FfmpegExeSrc) { throw "ffmpeg.exe not found in FFmpeg zip" }
$FfmpegBinDir = Join-Path $FfmpegDir "bin"
New-Item -ItemType Directory -Force -Path $FfmpegBinDir | Out-Null
Copy-Item -Path (Join-Path $FfmpegExeSrc.DirectoryName "*") -Destination $FfmpegBinDir -Recurse -Force
$FfmpegExe = Join-Path $FfmpegBinDir "ffmpeg.exe"
Remove-Item -Recurse -Force $FfmpegExtract -ErrorAction SilentlyContinue

if ($FfmpegOnly) {
  Write-Host ""
  Write-Host "ffmpeg ready: $FfmpegExe"
  if ($WriteEnv) {
    $EnvFile = Join-Path $Root ".env"
    $lines = if (Test-Path $EnvFile) { Get-Content $EnvFile -Encoding UTF8 } else { @() }
    $key = "RME_FFMPEG_BIN"
    $found = $false
    $out = foreach ($line in $lines) {
      if ($line -match "^\s*RME_FFMPEG_BIN=") { $found = $true; "$key=$FfmpegExe"; continue }
      $line
    }
    if (-not $found) { $out += "$key=$FfmpegExe" }
    Set-Content -Path $EnvFile -Value $out -Encoding UTF8
    Write-Host "Updated $EnvFile"
  }
  exit 0
}

# --- whisper.cpp binary ---
$WhisperZip = Join-Path $WhisperDir "whisper-bin-x64.zip"
Get-Download -Url "https://github.com/ggml-org/whisper.cpp/releases/download/v1.8.3/whisper-bin-x64.zip" -OutFile $WhisperZip
Expand-Archive -Path $WhisperZip -DestinationPath $WhisperDir -Force
$WhisperExe = Get-ChildItem -Path $WhisperDir -Recurse -Filter "whisper-cli.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $WhisperExe) {
  $WhisperExe = Get-ChildItem -Path $WhisperDir -Recurse -Filter "main.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
}
if (-not $WhisperExe) {
  throw "whisper-cli.exe / main.exe not found after extracting whisper-bin-x64.zip"
}

# --- whisper model ---
$WhisperModel = Join-Path $ModelsDir "ggml-small.en.bin"
Get-Download -Url "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.en.bin" -OutFile $WhisperModel

$WhisperBinPath = $WhisperExe.FullName

if (-not (Test-Path (Join-Path $KokoroVoices "af_bella.bin"))) {
  Write-Host ""
  Write-Host "Kokoro voices missing. Run: npm install kokoro-js"
}

Write-Host ""
Write-Host "Voice stack ready:"
Write-Host "  RME_WHISPER_BIN=$WhisperBinPath"
Write-Host "  RME_WHISPER_MODEL=$WhisperModel"
Write-Host "  RME_FFMPEG_BIN=$FfmpegExe"
Write-Host "  RME_KOKORO_MODEL=onnx-community/Kokoro-82M-v1.0-ONNX"
Write-Host "  RME_KOKORO_VOICES=$KokoroVoices"
Write-Host "  RME_KOKORO_VOICE=af_bella"

if ($WriteEnv) {
  $EnvFile = Join-Path $Root ".env"
  $lines = @()
  if (Test-Path $EnvFile) {
    $lines = Get-Content $EnvFile -Encoding UTF8
  }
  $map = @{
    "RME_WHISPER_BIN"    = $WhisperBinPath
    "RME_WHISPER_MODEL"  = $WhisperModel
    "RME_FFMPEG_BIN"     = $FfmpegExe
    "RME_KOKORO_MODEL"   = "onnx-community/Kokoro-82M-v1.0-ONNX"
    "RME_KOKORO_VOICES"  = $KokoroVoices
    "RME_KOKORO_VOICE"   = "af_bella"
    "ANTHROPIC_MODEL"    = "claude-opus-4-7"
  }
  $removeKeys = @("RME_PIPER_BIN", "RME_PIPER_VOICE")
  $seen = @{}
  $out = foreach ($line in $lines) {
    $m = $line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$'
    if ($m) {
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
    if (-not $seen[$key]) {
      $out += "$key=$($map[$key])"
    }
  }
  Set-Content -Path $EnvFile -Value $out -Encoding UTF8
  Write-Host ""
  Write-Host "Updated $EnvFile (voice paths + ANTHROPIC_MODEL=claude-opus-4-7)."
} else {
  Write-Host ""
  Write-Host "Run with -WriteEnv to patch .env automatically:"
  Write-Host "  powershell -ExecutionPolicy Bypass -File scripts\setup-voice-stack.ps1 -WriteEnv"
}
