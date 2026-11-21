import type { ContentLesson } from '../types.ts';

// A0-06: س ش ص ض (light against heavy) and ordering tea or water, by ear. Made-up for this app
// from the Classroom plan (curriculum/a0.md); the owner reviews the Arabic before real learners
// see it. The plan's سوق needs ق (A0-08), so this lesson reads صَحْنٌ and سَرِيرٌ instead.
export const lesson: ContentLesson = {
  slug: 'a0-letters-sin-sad',
  unit: 'A0.2',
  kind: 'letters',
  title: 'Light and heavy: س ش ص ض',
  topic: 'Two light letters, two heavy ones, and ordering a drink',
  summary: 'Read س ش ص ض, hear light against heavy, and ask for tea or water.',
  goals: [
    'Recognise س ش ص ض and tell light س from heavy ص',
    'Read words like شَايٌ، بَيْضٌ، صَحْنٌ، سَرِيرٌ',
    'Order tea or water politely',
  ],
  grammarFocus: 'ص and ض are “heavy”: the back of the tongue rises and the vowels sound darker.',
  scenario:
    'You are Hassan, a waiter at a small café in Cairo. Welcome the learner and offer tea or ' +
    'water, ask about sugar, and bring the drink. Use only two to four words per sentence and only ' +
    'words from the lessons so far: tea, water, please, without sugar, here you are, thank you, ' +
    'yes, no. Reply only in Arabic with full harakat, one short question at a time, and never ' +
    'correct the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا وَسَهْلًا! شَايٌ؟',
  vocab: [
    { arabic: 'شَايٌ', translit: 'shāy', english: 'tea', note: 'ش has three dots.' },
    { arabic: 'بَيْضٌ', translit: 'bayḍ', english: 'eggs', note: 'Ends with the heavy ض.' },
    { arabic: 'صَحْنٌ', translit: 'ṣaḥn', english: 'plate', note: 'Starts with the heavy ص.' },
    { arabic: 'سَرِيرٌ', translit: 'sarīr', english: 'bed', note: 'Starts with the light س.' },
    {
      arabic: 'مَاءٌ',
      translit: 'māʾ',
      english: 'water',
      note: 'By ear for now: you learn to read م and ء in A0-09.',
    },
    { arabic: 'بِدُونِ سُكَّرٍ', translit: 'bidūn sukkar', english: 'without sugar' },
    {
      arabic: 'تَفَضَّلْ',
      translit: 'tafaḍḍal',
      english: 'here you are (to a man)',
      note: 'Said when handing something over; also “please, come in”.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which letter has three dots?',
      options: ['س', 'ش', 'ص', 'ض'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which letter is the heavy “ṣ”?',
      options: ['س', 'ش', 'ص'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which letter is the heavy “ḍ”?',
      options: ['ض', 'د', 'ص', 'ذ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which letter does this word end with?',
      promptArabic: 'بَيْضٌ',
      options: ['ص', 'ض', 'ز'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which word means “tea”?',
      options: ['مَاءٌ', 'شَايٌ', 'صَحْنٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'صَحْنٌ',
      options: ['سَرِيرٌ', 'بَيْضٌ', 'صَحْنٌ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'مَاءٌ',
      options: ['مَاءٌ', 'شَايٌ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each Arabic word with its meaning.',
      pairs: [
        { arabic: 'شَايٌ', english: 'tea' },
        { arabic: 'مَاءٌ', english: 'water' },
        { arabic: 'بَيْضٌ', english: 'eggs' },
        { arabic: 'صَحْنٌ', english: 'plate' },
      ],
    },
    {
      type: 'build',
      prompt: 'Put the words in order.',
      english: 'Tea, please (to a man).',
      words: ['شَايٌ', 'مِنْ', 'فَضْلِكَ'],
      distractors: ['فَضْلِكِ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'شَايٌ',
      after: 'سُكَّرٍ',
      english: 'Tea without sugar.',
      options: ['بِدُونِ', 'مِنْ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'مَاءٌ مِنْ',
      after: '',
      english: 'Water, please (to a woman).',
      options: ['فَضْلِكِ', 'فَضْلِكَ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'س and ش share one body: ش is س with three dots, and says sh. ص and ض share another: ض is ص with one dot. All four join on both sides.',
    },
    {
      type: 'table',
      head: ['Letter', 'Sound', 'Alone', 'Start', 'Middle', 'End'],
      rows: [
        ['س sīn', 's, light', 'س', 'سـ', 'ـسـ', 'ـس'],
        ['ش shīn', 'sh', 'ش', 'شـ', 'ـشـ', 'ـش'],
        ['ص ṣād', 'ṣ, a heavy s', 'ص', 'صـ', 'ـصـ', 'ـص'],
        ['ض ḍād', 'ḍ, a heavy d', 'ض', 'ضـ', 'ـضـ', 'ـض'],
      ],
    },
    {
      type: 'p',
      text: 'Heavy letters are said with the back of the tongue raised and the mouth a little rounded, so the vowels next to them sound darker. Say س then ص: the light one is thin, the heavy one is full.',
    },
    { type: 'example', arabic: 'سَرِيرٌ', translit: 'sarīr', english: 'bed: light س' },
    { type: 'example', arabic: 'صَحْنٌ', translit: 'ṣaḥn', english: 'plate: heavy ص' },
  ],
  cultureTip: {
    title: 'Tea your way',
    body: 'In a Cairo café tea comes strong, in a small glass, and often very sweet. Say how you like it: شَايٌ بِدُونِ سُكَّرٍ if you want none. When the waiter puts it down he may say تَفَضَّلْ, “here you are”, and you answer شُكْرًا.',
  },
};
