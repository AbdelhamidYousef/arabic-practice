import type { CefrLevel, CultureTip, Exercise, GrammarBlock, LessonKind } from '@arabic/shared';

// The course is written as typed content files (one lesson per file) and loaded into the database
// by the seed. The validator in validate.ts checks every file before anything is written.

export interface ContentUnit {
  /** 'A1.1': level, a dot, the unit's number in the level. */
  code: string;
  level: CefrLevel;
  position: number;
  title: string;
  /** The can-do sentence ("I can greet someone and say my name"). */
  summary: string;
}

export interface ContentVocab {
  arabic: string;
  /** Latin-letter pronunciation, in the scheme of docs/plan/03-conventions.md. */
  translit: string;
  english: string;
  note?: string;
}

export interface ContentLesson {
  slug: string;
  /** Code of the unit this lesson sits in; the lesson's level is the unit's level. */
  unit: string;
  kind: LessonKind;
  title: string;
  topic: string;
  summary: string;
  goals: string[];
  grammarFocus: string;
  /** English instructions for the AI partner of the optional "talk" step. */
  scenario: string;
  /** The partner's first message, with full harakat. */
  openingLine: string;
  vocab: ContentVocab[];
  exercises: Exercise[];
  grammarNote: GrammarBlock[];
  cultureTip: CultureTip | null;
}
