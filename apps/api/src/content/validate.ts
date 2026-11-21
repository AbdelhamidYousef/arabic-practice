import {
  EXERCISE_TYPES,
  arabicLetterCount,
  countLatin,
  harakatRatio,
  normalizeArabic,
  type Exercise,
} from '@arabic/shared';

import { harakatProblems } from '../db/seed/validate.ts';

import type { ContentLesson, ContentUnit } from './types.ts';

// Checks every content file before the seed writes anything. A program cannot prove the Arabic
// right, but it catches what hand-typing produces: Latin letters in Arabic, missing vowel marks,
// an answer index that points nowhere, two identical options. Pure: it returns the problems as
// readable strings, each starting with where it is.

const MIN_VOCAB = 6;
const MIN_EXERCISES = 6;
const MIN_EXERCISE_TYPES = 3;
// Share of letters that carry a mark (see harakatRatio): perfect text scores 0.5 to 0.8, because
// long vowels take no mark. Anything under 0.5 is missing its marks.
const MIN_HARAKAT_RATIO = 0.5;

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const UNIT_CODE = /^(A0|A1|A2|B1|B2|C1|C2)\.[1-9]\d*$/;
// Letters of any script (ʿ and ʾ are modifier letters), combining marks for ā ī ū ḥ ṣ ḍ ṭ ẓ, spaces,
// hyphens and apostrophes.
const TRANSLIT_CHARS = /^[\p{L}\p{M}\s'’-]+$/u;

type Report = (where: string, message: string) => void;

// An Arabic field: has Arabic, no Latin letters, well-formed marks. `marks` asks for vowel marks too
// (not for a lone letter, which is a letter and not a word).
function checkArabic(report: Report, where: string, text: string, marks = true): void {
  if (arabicLetterCount(text) === 0) return report(where, `"${text}" has no Arabic letters`);
  if (countLatin(text) > 0) report(where, `"${text}" contains Latin letters`);
  for (const p of harakatProblems(text)) report(where, p);
  if (marks && arabicLetterCount(text) >= 2 && harakatRatio(text) < MIN_HARAKAT_RATIO)
    report(where, `"${text}" needs full harakat`);
}

function checkEnglish(report: Report, where: string, text: string): void {
  if (text.trim() === '') report(where, 'is empty');
  else if (arabicLetterCount(text) > 0) report(where, `"${text}" contains Arabic letters`);
}

function checkUnique(report: Report, where: string, values: string[], what: string): void {
  const seen = new Set<string>();
  for (const v of values) {
    const key = v.normalize('NFC');
    if (seen.has(key)) report(where, `duplicate ${what} "${v}"`);
    seen.add(key);
  }
}

function checkOptions(
  report: Report,
  where: string,
  options: string[],
  answer: number,
  marks: boolean,
): void {
  options.forEach((o, i) => checkArabic(report, `${where}.options[${i}]`, o, marks));
  checkUnique(report, `${where}.options`, options, 'option');
  if (!Number.isInteger(answer) || answer < 0 || answer >= options.length)
    report(`${where}.answer`, `${answer} is not an index into the ${options.length} options`);
}

function checkExercise(report: Report, where: string, e: Exercise): void {
  switch (e.type) {
    case 'choose':
      if (e.promptArabic !== undefined)
        checkArabic(report, `${where}.promptArabic`, e.promptArabic);
      checkOptions(report, where, e.options, e.answer, true);
      break;
    case 'listen':
      checkArabic(report, `${where}.audio`, e.audio);
      checkOptions(report, where, e.options, e.answer, true);
      // The audio has to be one of the options, or the exercise has no right answer.
      if (!e.options.includes(e.audio) || e.options[e.answer] !== e.audio)
        report(where, 'the correct option must be the text that is read aloud');
      break;
    case 'gap':
      if (e.before.trim() === '' && e.after.trim() === '')
        report(where, 'needs text before or after the gap');
      for (const [k, t] of [
        ['before', e.before],
        ['after', e.after],
      ] as const)
        if (t.trim() !== '') checkArabic(report, `${where}.${k}`, t);
      checkEnglish(report, `${where}.english`, e.english);
      checkOptions(report, where, e.options, e.answer, true);
      break;
    case 'build':
      if (e.words.length === 0) report(`${where}.words`, 'is empty');
      e.words.forEach((w, i) => checkArabic(report, `${where}.words[${i}]`, w));
      e.distractors.forEach((w, i) => checkArabic(report, `${where}.distractors[${i}]`, w));
      // A sentence may repeat a word, but a distractor must not be one of the answer's words.
      checkUnique(report, `${where}.distractors`, e.distractors, 'distractor');
      for (const d of e.distractors)
        if (e.words.includes(d)) report(`${where}.distractors`, `"${d}" is also an answer word`);
      checkEnglish(report, `${where}.english`, e.english);
      break;
    case 'match':
      e.pairs.forEach((p, i) => {
        checkArabic(report, `${where}.pairs[${i}].arabic`, p.arabic);
        checkEnglish(report, `${where}.pairs[${i}].english`, p.english);
      });
      checkUnique(
        report,
        `${where}.pairs`,
        e.pairs.map((p) => p.arabic),
        'Arabic side',
      );
      checkUnique(
        report,
        `${where}.pairs`,
        e.pairs.map((p) => p.english.toLowerCase()),
        'English side',
      );
      break;
  }
}

function checkLesson(report: Report, lesson: ContentLesson, unitCodes: Set<string>): void {
  const at = (path: string) => `${lesson.slug}.${path}`;
  if (!SLUG.test(lesson.slug)) report(lesson.slug, 'slug must be kebab-case');
  if (!unitCodes.has(lesson.unit)) report(at('unit'), `unit "${lesson.unit}" does not exist`);
  if (lesson.openingLine.trim() === '') report(at('openingLine'), 'is empty');
  else checkArabic(report, at('openingLine'), lesson.openingLine);

  if (lesson.vocab.length < MIN_VOCAB)
    report(at('vocab'), `needs at least ${MIN_VOCAB} words, has ${lesson.vocab.length}`);
  const plain = new Set<string>();
  lesson.vocab.forEach((v, i) => {
    const w = at(`vocab[${i}]`);
    checkArabic(report, `${w}.arabic`, v.arabic);
    checkEnglish(report, `${w}.english`, v.english);
    if (v.translit.trim() === '') report(`${w}.translit`, 'is empty');
    else if (
      !TRANSLIT_CHARS.test(v.translit) ||
      countLatin(v.translit) === 0 ||
      arabicLetterCount(v.translit) > 0
    )
      report(`${w}.translit`, `"${v.translit}" must be Latin letters only`);
    const key = normalizeArabic(v.arabic);
    if (plain.has(key)) report(w, `duplicate word "${v.arabic}"`);
    plain.add(key);
  });

  if (lesson.exercises.length < MIN_EXERCISES)
    report(
      at('exercises'),
      `needs at least ${MIN_EXERCISES} exercises, has ${lesson.exercises.length}`,
    );
  const types = new Set(lesson.exercises.map((e) => e.type));
  if (types.size < MIN_EXERCISE_TYPES)
    report(
      at('exercises'),
      `needs at least ${MIN_EXERCISE_TYPES} different types (${EXERCISE_TYPES.join(', ')}), has ${types.size}`,
    );
  lesson.exercises.forEach((e, i) => checkExercise(report, at(`exercises[${i}]`), e));

  lesson.grammarNote.forEach((b, i) => {
    if (b.type === 'example') checkArabic(report, at(`grammarNote[${i}].arabic`), b.arabic);
    if (b.type === 'table' && b.rows.some((r) => r.length !== b.head.length))
      report(at(`grammarNote[${i}]`), 'every table row needs one cell per heading');
  });
}

export function contentProblems(lessons: ContentLesson[], units: ContentUnit[]): string[] {
  const problems: string[] = [];
  const report: Report = (where, message) => problems.push(`${where}: ${message}`);

  const unitCodes = new Set<string>();
  const positions = new Set<string>();
  for (const u of units) {
    if (!UNIT_CODE.test(u.code)) report(u.code, 'unit code must look like A1.1');
    else if (u.code !== `${u.level}.${u.position}`)
      report(u.code, `code must be level.position (${u.level}.${u.position})`);
    if (unitCodes.has(u.code)) report(u.code, 'duplicate unit code');
    unitCodes.add(u.code);
    const pos = `${u.level}#${u.position}`;
    if (positions.has(pos)) report(u.code, `two units at ${pos}`);
    positions.add(pos);
  }

  const slugs = new Set<string>();
  for (const lesson of lessons) {
    if (slugs.has(lesson.slug)) report(lesson.slug, 'duplicate lesson slug');
    slugs.add(lesson.slug);
    checkLesson(report, lesson, unitCodes);
  }
  return problems;
}

// Throws one readable error listing every problem, so a bad edit fails `db:seed` before any write.
export function assertValidContent(lessons: ContentLesson[], units: ContentUnit[]): void {
  const problems = contentProblems(lessons, units);
  if (problems.length > 0)
    throw new Error(`course content is invalid:\n- ${problems.join('\n- ')}`);
}
