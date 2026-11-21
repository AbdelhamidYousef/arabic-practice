import { normalizeArabic, tokenizeArabic } from './arabic.ts';

export interface DiffWord {
  /** The word as written in the corrected text (harakat and punctuation kept). */
  text: string;
  /** True when the learner did not write this word (it is new or was changed). */
  changed: boolean;
}

// What two words are compared by: their Arabic tokens folded with normalizeArabic, so a missing
// fatha or a أ/ا difference does not make an otherwise identical word "different" in the match.
// A chunk with no Arabic token (a lone "؟") is compared as written.
function key(word: string): string {
  const tokens = tokenizeArabic(word);
  return tokens.length === 0 ? word : tokens.map(normalizeArabic).join('');
}

/**
 * Word diff of a learner's sentence against its corrected form, for highlighting: returns the
 * words of the CORRECTED text, each flagged when it was not in the learner's text.
 *
 * Words are matched by their normalized form with a longest-common-subsequence, so one inserted
 * word does not flag everything after it. A matched pair is never flagged: a difference in harakat,
 * hamza (ا or أ) or ta marbuta alone is not a change worth highlighting (the corrected text always
 * carries full harakat and the learner usually types none). The mistakes list names those fixes.
 */
export function diffWords(original: string, corrected: string): DiffWord[] {
  const a = original.split(/\s+/).filter(Boolean);
  const b = corrected.split(/\s+/).filter(Boolean);
  const ka = a.map(key);
  const kb = b.map(key);

  // lcs[i][j] = length of the LCS of a[i..] and b[j..]
  const lcs: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      lcs[i]![j] =
        ka[i] === kb[j] ? lcs[i + 1]![j + 1]! + 1 : Math.max(lcs[i + 1]![j]!, lcs[i]![j + 1]!);
    }
  }

  const result: DiffWord[] = b.map((text) => ({ text, changed: true }));
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (ka[i] === kb[j]) {
      result[j] = { text: b[j]!, changed: false };
      i += 1;
      j += 1;
    } else if (lcs[i + 1]![j]! >= lcs[i]![j + 1]!) {
      i += 1;
    } else {
      j += 1;
    }
  }
  return result;
}
