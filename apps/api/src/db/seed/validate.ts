import {
  arabicLetterCount,
  cefrLevelSchema,
  countLatin,
  harakatRatio,
  normalizeArabic,
  tokenizeArabic,
} from '@arabic/shared';
import { z } from 'zod';

// The lesson content is written by hand and the owner is an Arabic teacher, so a typo in a vowel
// mark would be a visible failure. A program cannot prove the Arabic correct, but it can catch the
// slips typing marks by hand produces: a mark with no letter, two vowels on one letter, a tanwin
// in the middle of a word, a sukun on the first letter, ة or ى away from the end of a word.
const FATHATAN = 0x064b;
const KASRATAN = 0x064d;
const SHADDA = 0x0651;
const SUKUN = 0x0652;
const DAGGER_ALEF = 0x0670;

const isMark = (c: number) => (c >= 0x064b && c <= 0x0652) || c === DAGGER_ALEF;
const isTanwin = (c: number) => c >= FATHATAN && c <= KASRATAN;
// Marks that stand in for the vowel of a letter (so a letter may carry only one of them).
const isVowelSlot = (c: number) => (c >= FATHATAN && c <= 0x0650) || c === SUKUN;

interface Unit {
  letter: string;
  marks: number[];
}

function toUnits(word: string): { units: Unit[]; problems: string[] } {
  const units: Unit[] = [];
  const problems: string[] = [];
  for (const ch of word) {
    const code = ch.codePointAt(0) ?? 0;
    if (isMark(code)) {
      const last = units[units.length - 1];
      if (!last) problems.push(`a mark (U+${code.toString(16)}) with no letter before it`);
      else last.marks.push(code);
    } else {
      units.push({ letter: ch, marks: [] });
    }
  }
  return { units, problems };
}

function wordProblems(word: string): string[] {
  const { units, problems } = toUnits(word);
  units.forEach((u, i) => {
    const vowelSlots = u.marks.filter(isVowelSlot);
    if (vowelSlots.length > 1) problems.push(`"${u.letter}" has two vowel marks`);
    if (u.marks.filter((m) => m === SHADDA).length > 1)
      problems.push(`"${u.letter}" has two shaddas`);
    if (new Set(u.marks).size !== u.marks.length) problems.push(`"${u.letter}" repeats a mark`);
    const rest = units.slice(i + 1).map((x) => x.letter);
    if (u.marks.some(isTanwin)) {
      // Tanwin sits on the last letter, or fathatan on the letter before a final alef / alef
      // maqsura (كِتَابًا, مُسْتَشْفًى).
      const lastLetter = rest.length === 0;
      const beforeFinalAlef =
        rest.length === 1 && u.marks.includes(FATHATAN) && (rest[0] === 'ا' || rest[0] === 'ى');
      if (!lastLetter && !beforeFinalAlef)
        problems.push(`tanwin on "${u.letter}" is not at the word end`);
    }
    if (i === 0 && u.marks.includes(SUKUN)) problems.push('a word cannot start with a sukun');
    if (i === 0 && u.marks.includes(SHADDA)) problems.push('a word cannot start with a shadda');
    if (u.letter === 'ة' && rest.length > 0) problems.push('ta marbuta (ة) must end a word');
    if (u.letter === 'ى' && rest.length > 0) problems.push('alef maqsura (ى) must end a word');
  });
  return problems;
}

// Human-readable problems in the marks of every Arabic word of a word, phrase or sentence (empty
// when it looks well formed).
export function harakatProblems(text: string): string[] {
  return tokenizeArabic(text).flatMap((w) => wordProblems(w).map((p) => `${w}: ${p}`));
}

// Letters, harakat, spaces and the Arabic or ASCII punctuation used in the seed. No Latin letters,
// no digits: the seed is Arabic text only.
const arabicText = (min = 1) =>
  z
    .string()
    .trim()
    .min(min)
    .transform((s) => s.normalize('NFC'))
    .superRefine((s, ctx) => {
      if (arabicLetterCount(s) === 0)
        ctx.addIssue({ code: 'custom', message: 'no Arabic letters' });
      if (countLatin(s) > 0) ctx.addIssue({ code: 'custom', message: 'contains Latin letters' });
      for (const p of harakatProblems(s)) ctx.addIssue({ code: 'custom', message: p });
    });

const english = z
  .string()
  .trim()
  .min(1)
  .refine((s) => arabicLetterCount(s) === 0, 'English text must not contain Arabic letters');

const seedVocabSchema = z.object({
  arabic: arabicText().refine((s) => harakatRatio(s) >= 0.5, 'needs full harakat'),
  english,
  note: z.string().trim().min(1).optional(),
});

export const seedLessonSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'kebab-case slug'),
    title: z.string().trim().min(3).max(80),
    level: cefrLevelSchema,
    topic: z.string().trim().min(3).max(120),
    summary: z.string().trim().min(10).max(240),
    goals: z.array(z.string().trim().min(5)).min(2).max(5),
    grammarFocus: z.string().trim().min(5),
    scenario: z
      .string()
      .trim()
      .min(50)
      .refine(
        (s) => countLatin(s) > arabicLetterCount(s) * 5,
        'the scenario is English instructions (a short Arabic example is fine)',
      ),
    openingLine: arabicText(8).refine((s) => harakatRatio(s) >= 0.5, 'needs full harakat'),
    vocab: z.array(seedVocabSchema).min(8).max(12),
  })
  .superRefine((lesson, ctx) => {
    const seen = new Set<string>();
    for (const v of lesson.vocab) {
      const plain = normalizeArabic(v.arabic);
      if (seen.has(plain)) {
        ctx.addIssue({ code: 'custom', message: `duplicate vocabulary entry: ${v.arabic}` });
      }
      seen.add(plain);
    }
  });

export type ValidSeedLesson = z.output<typeof seedLessonSchema>;

// Throws a readable error naming the lesson, so a bad edit fails `db:seed` before touching the database.
export function validateLessons(lessons: unknown[]): ValidSeedLesson[] {
  const slugs = new Set<string>();
  return lessons.map((raw) => {
    const label = (raw as { slug?: string }).slug ?? '(no slug)';
    const parsed = seedLessonSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`seed lesson "${label}" is invalid:\n${z.prettifyError(parsed.error)}`);
    }
    if (slugs.has(parsed.data.slug)) throw new Error(`duplicate seed lesson slug "${label}"`);
    slugs.add(parsed.data.slug);
    return parsed.data;
  });
}
