import type { ContentUnit } from './types.ts';

// Level, position and code move together: the code is `<level>.<position>`. A unit with no
// published lesson is simply not shown on the course path. The units follow the owner's course
// plan (arabic-classroom/curriculum): A0 is the script track; A1 and A2 keep the plan's sub-levels.
export const contentUnits: ContentUnit[] = [
  {
    code: 'A0.1',
    level: 'A0',
    position: 1,
    title: 'Letters 1',
    summary: 'I can read my first letters, the vowels, and say hello and thank you.',
  },
  {
    code: 'A0.2',
    level: 'A0',
    position: 2,
    title: 'Letters 2',
    summary: 'I can read every letter of the alphabet, a menu and simple signs.',
  },
  {
    code: 'A1.1',
    level: 'A1',
    position: 1,
    title: 'First conversations',
    summary: 'I can greet people, introduce myself, order a drink and find my way.',
  },
  {
    code: 'A1.2',
    level: 'A1',
    position: 2,
    title: 'Me and you',
    summary: 'I can talk about my family, my work, my home and my day.',
  },
  {
    code: 'A1.3',
    level: 'A1',
    position: 3,
    title: 'Out and about',
    summary: 'I can ask the way, shop, eat out and talk about the weather and time.',
  },
  {
    code: 'A2.1',
    level: 'A2',
    position: 1,
    title: 'Everyday present',
    summary: 'I can compare things, rent a room, talk about hobbies and work.',
  },
  {
    code: 'A2.2',
    level: 'A2',
    position: 2,
    title: 'Yesterday',
    summary: 'I can tell what happened: my weekend, a trip, a small problem.',
  },
  {
    code: 'A2.3',
    level: 'A2',
    position: 3,
    title: 'Tomorrow and travel',
    summary: 'I can make plans, book a hotel, travel and talk about holidays.',
  },
];
