import { useEffect, useState } from 'react';

// Pronunciation through the browser's own speech engine (Web Speech API): free, no request to any
// server, works offline. Quality and availability depend on the device, so callers hide the play
// button when no Arabic voice is installed instead of showing a button that does nothing.

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
    ? window.speechSynthesis
    : null;
}

export function findArabicVoice(): SpeechSynthesisVoice | null {
  const voices = synth()?.getVoices() ?? [];
  return voices.find((v) => v.lang.toLowerCase().startsWith('ar')) ?? null;
}

/** Reads Arabic text aloud, a little slower than normal speech so a learner can follow. */
export function speakArabic(text: string): void {
  const s = synth();
  const voice = findArabicVoice();
  if (!s || !voice) return;
  s.cancel(); // a second tap restarts instead of queueing
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = 0.85;
  s.speak(u);
}

// Voices load asynchronously in Chrome (the list is empty at first, then `voiceschanged` fires).
export function useArabicVoice(): boolean {
  const [available, setAvailable] = useState(() => findArabicVoice() !== null);
  useEffect(() => {
    const s = synth();
    if (!s) return;
    const check = () => setAvailable(findArabicVoice() !== null);
    check();
    s.addEventListener('voiceschanged', check);
    return () => s.removeEventListener('voiceschanged', check);
  }, []);
  return available;
}
