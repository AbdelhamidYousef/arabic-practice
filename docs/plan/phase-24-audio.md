# Phase 24 — Audio with Piper

See `08-production-plan.md` for the decision.

## Step 24.1 — sample
- Install Piper in a venv under `work/` (untracked); generate 20 words; he listens. If it's not
  good enough, stop and decide (his voice, or a paid TTS).

## Step 24.2 — generator script
- `pnpm audio:build`: collects every Arabic string the app can play (vocab, grammar examples,
  listen and choose prompts, the homepage word) from the content files, hashes the vowelled text,
  generates only missing clips, encodes 32 kbps mono MP3 with ffmpeg, copies overrides over them,
  and writes `audio/manifest.json` (hash → file). Clips land in `apps/web/public/audio/`.
- Commit: `feat(content): generate lesson audio with piper`

## Step 24.3 — player
- `playArabic(text)`: plays the clip when the manifest has it, otherwise the browser voice. The play
  button now shows on every device that has a clip. `/audio/*` gets a one-year immutable cache.
- Commit: `feat(web): play recorded audio with a voice fallback`
