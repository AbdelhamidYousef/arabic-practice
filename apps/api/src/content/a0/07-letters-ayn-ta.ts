import type { ContentLesson } from '../types.ts';

// A0-07: ع غ and ط ظ (the dot decides again) and saying sorry, by ear. Made-up for this app from
// the Classroom plan (curriculum/a0.md); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a0-letters-ayn-ta',
  unit: 'A0.2',
  kind: 'letters',
  title: 'Throat and heavy letters: ع غ ط ظ',
  topic: 'Two throat letters, two heavy ones, and saying sorry',
  summary: 'Read ع غ ط ظ, hear the throat sound ʿayn and the heavy ṭ, and say sorry.',
  goals: [
    'Recognise ع غ and ط ظ: two pairs, the dot decides',
    'Read words like عَيْنٌ، طَبِيبٌ، عَصِيرٌ، غَرِيبٌ',
    'Say sorry as a man or as a woman, and answer someone who says it',
  ],
  grammarFocus: 'ع and غ share one body, ط and ظ another: one dot makes the second letter.',
  scenario:
    'You are Huda, a woman in a doctor’s waiting room in Cairo who bumps into the learner by ' +
    'accident. Say sorry, then greet them and ask how they are and their name. Use only two to ' +
    'four words per sentence and only words from the lessons so far: sorry, excuse me, greetings, ' +
    'how are you, fine, name, doctor, juice, yes, no, thank you. Reply only in Arabic with full ' +
    'harakat, one short question at a time, and never correct the learner yourself: a separate ' +
    'step does that.',
  openingLine: 'آسِفَةٌ! أَنَا هُدَى.',
  vocab: [
    { arabic: 'عَيْنٌ', translit: 'ʿayn', english: 'eye', note: 'Starts with the throat sound ع.' },
    { arabic: 'طَبِيبٌ', translit: 'ṭabīb', english: 'doctor', note: 'Starts with the heavy ط.' },
    { arabic: 'عَصِيرٌ', translit: 'ʿaṣīr', english: 'juice' },
    { arabic: 'غَرِيبٌ', translit: 'gharīb', english: 'strange; a stranger' },
    { arabic: 'ظَبْيٌ', translit: 'ẓaby', english: 'gazelle', note: 'Spot the ظ.' },
    { arabic: 'آسِفٌ', translit: 'āsif', english: 'sorry (a man speaking)' },
    { arabic: 'آسِفَةٌ', translit: 'āsifa', english: 'sorry (a woman speaking)' },
    {
      arabic: 'عَفْوًا',
      translit: 'ʿafwan',
      english: 'excuse me; no problem',
      note: 'Also the answer to شُكْرًا.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which letter is the throat sound ʿayn, with no dot?',
      options: ['غ', 'ع', 'ط'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which letter sounds like a French “r” (gh)?',
      options: ['ع', 'ظ', 'غ', 'خ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which letter is the heavy “ṭ”?',
      options: ['ط', 'ت', 'ظ', 'ث'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which letter does this word start with?',
      promptArabic: 'ظَبْيٌ',
      options: ['ط', 'ض', 'ظ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which word means “doctor”?',
      options: ['طَبِيبٌ', 'حَبِيبٌ', 'غَرِيبٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'عَيْنٌ',
      options: ['بَيْنَ', 'عَيْنٌ', 'زَيْتٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'آسِفَةٌ',
      options: ['آسِفٌ', 'آسِفَةٌ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each Arabic word with its meaning.',
      pairs: [
        { arabic: 'عَيْنٌ', english: 'eye' },
        { arabic: 'عَصِيرٌ', english: 'juice' },
        { arabic: 'طَبِيبٌ', english: 'doctor' },
        { arabic: 'غَرِيبٌ', english: 'strange' },
      ],
    },
    {
      type: 'gap',
      prompt: 'A woman says sorry. Fill the gap.',
      before: 'أَنَا',
      after: '',
      english: 'I am sorry (a woman speaking).',
      options: ['آسِفٌ', 'آسِفَةٌ'],
      answer: 1,
    },
    {
      type: 'build',
      prompt: 'Put the words in order.',
      english: 'Sorry, I don’t understand (a man speaking).',
      words: ['آسِفٌ', 'لَا', 'أَفْهَمُ'],
      distractors: ['عَفْوًا'],
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'Two more pairs where the dot decides. ع and غ share one body; ط and ظ share another. All four join on both sides.',
    },
    {
      type: 'table',
      head: ['Letter', 'Sound', 'Alone', 'Start', 'Middle', 'End'],
      rows: [
        ['ع ʿayn', 'ʿ, a squeeze deep in the throat', 'ع', 'عـ', 'ـعـ', 'ـع'],
        ['غ ghayn', 'gh, like a French r', 'غ', 'غـ', 'ـغـ', 'ـغ'],
        ['ط ṭāʾ', 'ṭ, a heavy t', 'ط', 'طـ', 'ـطـ', 'ـط'],
        ['ظ ẓāʾ', 'ẓ, a heavy dh', 'ظ', 'ظـ', 'ـظـ', 'ـظ'],
      ],
    },
    {
      type: 'p',
      text: 'ع and غ change shape the most: open at the start, closed in the middle, with a tail at the end. ط and ظ keep their upright stroke everywhere.',
    },
    { type: 'example', arabic: 'عَيْنٌ', translit: 'ʿayn', english: 'eye: ع at the start' },
    {
      type: 'example',
      arabic: 'طَبِيبٌ',
      translit: 'ṭabīb',
      english: 'doctor: the heavy ط at the start',
    },
  ],
  cultureTip: {
    title: 'Sorry and excuse me',
    body: 'Arabic has two easy words for small moments. آسِفٌ (or آسِفَةٌ for a woman) is “I am sorry”. عَفْوًا is the all-rounder: “excuse me” to get past someone, “no problem” when someone says sorry to you, and “you are welcome” after شُكْرًا.',
  },
};
