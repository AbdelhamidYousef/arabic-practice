import type { ContentUnit } from './types.ts';

// Level, position and code move together: the code is `<level>.<position>`. A unit with no
// published lesson is simply not shown on the course path.
export const contentUnits: ContentUnit[] = [
  {
    code: 'A0.1',
    level: 'A0',
    position: 1,
    title: 'Letters 1',
    summary: 'I can read my first five letters and say hello and thank you.',
  },
  {
    code: 'A1.1',
    level: 'A1',
    position: 1,
    title: 'Hello and who you are',
    summary: 'I can greet someone, say my name and ask how they are.',
  },
];
