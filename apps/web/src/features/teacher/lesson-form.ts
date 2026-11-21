import {
  TeacherLessonInputSchema,
  type CefrLevel,
  type LessonStatus,
  type TeacherLessonDetail,
  type TeacherLessonInput,
} from '@arabic/shared';

// The editor's working copy. Everything is a string while typing (a number field is "" before it
// is a number), and rows carry a local `key` so React keeps each row's input when rows move.
export interface VocabRow {
  key: number;
  arabic: string;
  english: string;
  note: string;
}
export interface GoalRow {
  key: number;
  text: string;
}
export interface LessonForm {
  title: string;
  level: CefrLevel;
  topic: string;
  summary: string;
  goals: GoalRow[];
  grammarFocus: string;
  scenario: string;
  openingLine: string;
  status: LessonStatus;
  position: string;
  vocab: VocabRow[];
}

let nextKey = 1;
export const newKey = () => nextKey++;
export const emptyVocab = (): VocabRow => ({ key: newKey(), arabic: '', english: '', note: '' });
export const emptyGoal = (): GoalRow => ({ key: newKey(), text: '' });

export const emptyForm = (): LessonForm => ({
  title: '',
  level: 'A1',
  topic: '',
  summary: '',
  goals: [emptyGoal()],
  grammarFocus: '',
  scenario: '',
  openingLine: '',
  status: 'draft',
  position: '0',
  vocab: [emptyVocab()],
});

export const formFromLesson = (l: TeacherLessonDetail): LessonForm => ({
  title: l.title,
  level: l.level,
  topic: l.topic,
  summary: l.summary,
  goals: l.goals.map((text) => ({ key: newKey(), text })),
  grammarFocus: l.grammarFocus,
  scenario: l.scenario,
  openingLine: l.openingLine,
  status: l.status,
  position: String(l.position),
  vocab: l.vocab.map((v) => ({
    key: newKey(),
    arabic: v.arabic,
    english: v.english,
    note: v.note ?? '',
  })),
});

/** Moves the item at `from` to `to`; out-of-range is a no-op. */
export function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  if (item === undefined) return list;
  copy.splice(to, 0, item);
  return copy;
}

const isBlankVocab = (v: VocabRow) =>
  v.arabic.trim() === '' && v.english.trim() === '' && v.note.trim() === '';

/** What goes to the API. Blank goal and vocab rows are dropped (the spare rows "add" leaves). */
export function toInput(form: LessonForm): TeacherLessonInput {
  return {
    title: form.title,
    level: form.level,
    topic: form.topic,
    summary: form.summary,
    goals: form.goals.map((g) => g.text).filter((g) => g.trim() !== ''),
    grammarFocus: form.grammarFocus,
    scenario: form.scenario,
    openingLine: form.openingLine,
    status: form.status,
    position: form.position.trim() === '' ? NaN : Number(form.position),
    vocab: form.vocab
      .filter((v) => !isBlankVocab(v))
      .map((v) => ({ arabic: v.arabic, english: v.english, note: v.note })),
  };
}

export type FieldErrors = Record<string, string>;

/**
 * Validates with the shared schema (the API's own). Keys are dotted paths like `vocab.1.english`,
 * numbered by the row on screen (blank rows were dropped before validating, so the schema's
 * indexes are translated back). Values are the plain-English reason.
 */
export function validateForm(
  form: LessonForm,
  reason: (code: 'required' | 'tooLong' | 'invalid') => string,
): { input?: TeacherLessonInput; errors: FieldErrors } {
  const input = toInput(form);
  const parsed = TeacherLessonInputSchema.safeParse(input);
  if (parsed.success) return { input, errors: {} };
  const keptVocab = form.vocab.flatMap((v, i) => (isBlankVocab(v) ? [] : [i]));
  const keptGoals = form.goals.flatMap((g, i) => (g.text.trim() === '' ? [] : [i]));
  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const path = issue.path.map(String);
    const [head, index] = path;
    if (head === 'vocab' && index !== undefined)
      path[1] = String(keptVocab[Number(index)] ?? index);
    if (head === 'goals' && index !== undefined)
      path[1] = String(keptGoals[Number(index)] ?? index);
    const code =
      issue.code === 'too_small' ? 'required' : issue.code === 'too_big' ? 'tooLong' : 'invalid';
    errors[path.join('.')] ??= reason(code);
  }
  return { errors };
}

/** Field paths of the API's 400 (`details.fieldErrors`: top-level names only), else none. */
export function serverFieldErrors(details: unknown): FieldErrors {
  const fieldErrors = (details as { fieldErrors?: Record<string, string[]> } | null)?.fieldErrors;
  const out: FieldErrors = {};
  for (const [field, messages] of Object.entries(fieldErrors ?? {})) {
    if (messages[0]) out[field] = messages[0];
  }
  return out;
}
