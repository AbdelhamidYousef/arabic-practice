// Recorded audio: every Arabic line the app can play has a clip named by a hash of its text
// (`/audio/<key>.mp3`). The build script (apps/api/scripts/audio-build.ts) and the browser both
// call `audioKey`, so the browser finds a clip without asking the server.
//
// The hash is cyrb53 (a small public-domain 53-bit string hash), not SHA-256: it is synchronous,
// so the browser needs no async crypto before it can press play. 53 bits for about a thousand clips
// makes a collision vanishingly unlikely, and the build script refuses to run if one ever happens.

/** The text as spoken: Unicode NFC, trimmed, inner whitespace collapsed. Harakat are kept. */
export function audioText(text: string): string {
  return text.normalize('NFC').trim().replace(/\s+/g, ' ');
}

function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/** 14 hex characters naming the clip of this text. Different harakat give a different key. */
export function audioKey(text: string): string {
  return cyrb53(audioText(text)).toString(16).padStart(14, '0');
}

/** The manifest the build writes to `/audio/manifest.json`: the keys that have a clip. */
export interface AudioManifest {
  version: 1;
  keys: string[];
}
