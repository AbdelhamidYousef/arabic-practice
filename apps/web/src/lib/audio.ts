import { audioKey, type AudioManifest } from '@arabic/shared';
import { useCallback, useEffect, useState } from 'react';

import { speakArabic, useArabicVoice } from './speech';

// Recorded clips first, the browser's voice second.
//
// `pnpm audio:build` puts one MP3 per Arabic line in /audio/<audioKey(text)>.mp3, plus a manifest
// of the keys it made. The browser loads the manifest once (the CDN caches it, the PWA keeps it
// offline), then plays the clip when there is one. A line with no clip (new content not built yet)
// falls back to the device's Arabic voice, and when the device has none either, no play button shows.

let keys: Set<string> | null = null;
let loading: Promise<Set<string>> | null = null;
const listeners = new Set<() => void>();

function loadManifest(): Promise<Set<string>> {
  if (keys) return Promise.resolve(keys);
  // Unit tests set the manifest with `primeAudioManifest` instead: a real request would land in
  // the fetch stubs that tests use for the API.
  if (import.meta.env.MODE === 'test') return Promise.resolve(new Set());
  loading ??= fetch('/audio/manifest.json')
    .then((r) => (r.ok ? (r.json() as Promise<AudioManifest>) : { version: 1 as const, keys: [] }))
    .catch(() => ({ version: 1 as const, keys: [] }))
    .then((m) => {
      keys = new Set(m.keys);
      listeners.forEach((l) => l());
      return keys;
    });
  return loading;
}

/** Tests only: pretend the manifest has these lines. `null` forgets it again. */
export function primeAudioManifest(lines: string[] | null): void {
  keys = lines ? new Set(lines.map(audioKey)) : null;
  loading = null;
  listeners.forEach((l) => l());
}

export function hasClip(text: string): boolean {
  return keys?.has(audioKey(text)) ?? false;
}

let current: HTMLAudioElement | null = null;

/** Plays the line's clip, or reads it with the device voice when there is no clip or it fails. */
export function playArabic(text: string): void {
  if (!hasClip(text)) {
    speakArabic(text);
    return;
  }
  current?.pause(); // a second tap restarts instead of overlapping
  const el = new Audio(`/audio/${audioKey(text)}.mp3`);
  current = el;
  el.play().catch(() => speakArabic(text));
}

/**
 * `canPlay(text)`: whether a play button for this line would make a sound (a clip, or an Arabic
 * device voice). Re-renders when the manifest arrives.
 */
export function useArabicAudio(): {
  canPlay: (text: string) => boolean;
  play: (text: string) => void;
} {
  const hasVoice = useArabicVoice();
  const [, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    listeners.add(bump);
    void loadManifest();
    return () => {
      listeners.delete(bump);
    };
  }, []);
  const canPlay = useCallback((text: string) => hasVoice || hasClip(text), [hasVoice]);
  return { canPlay, play: playArabic };
}
