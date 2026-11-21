// A seeded shuffle: the same seed always gives the same order, so options do not jump around when
// a component re-renders, and tests can predict the order. Not for anything secret.

function hash(seed: string): number {
  // FNV-1a, 32 bit.
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// mulberry32: a tiny, well-spread generator.
function generator(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A new array with the items in a seed-determined order (Fisher–Yates). */
export function shuffled<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  const random = generator(hash(seed));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

/** The indexes 0..n-1 in a seed-determined order: render `options[order[k]]`, keep answers by index. */
export function shuffledOrder(length: number, seed: string): number[] {
  return shuffled(
    Array.from({ length }, (_, i) => i),
    seed,
  );
}
