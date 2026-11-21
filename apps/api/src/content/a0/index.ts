import type { ContentLesson } from '../types.ts';

import { lesson as l01 } from './01-letters-alif-ba.ts';
import { lesson as l02 } from './02-long-vowels.ts';
import { lesson as l03 } from './03-short-vowels.ts';
import { lesson as l04 } from './04-letters-jim-ha-kha.ts';
import { lesson as l05 } from './05-letters-dal-ra.ts';
import { lesson as l06 } from './06-letters-sin-sad.ts';
import { lesson as l07 } from './07-letters-ayn-ta.ts';
import { lesson as l08 } from './08-letters-fa-lam.ts';
import { lesson as l09 } from './09-letters-mim-ha.ts';
import { lesson as l10 } from './10-shadda-signs.ts';

// A0 lessons in course order (lane: A0). Only this lane edits this file.
export const a0Lessons: ContentLesson[] = [l01, l02, l03, l04, l05, l06, l07, l08, l09, l10];
