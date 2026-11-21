import type { ContentLesson } from '../types.ts';

// A0-09: م ه ة and the hamza ء أ (the alphabet is complete) and saying goodbye, by ear. Made-up
// for this app from the Classroom plan (curriculum/a0.md); the owner reviews the Arabic before
// real learners see it.
export const lesson: ContentLesson = {
  slug: 'a0-letters-mim-ha',
  unit: 'A0.2',
  kind: 'letters',
  title: 'The last letters: م ه ة ء',
  topic: 'The last letters of the alphabet, and saying goodbye',
  summary: 'Read م ه ة and the hamza ء أ, finish the alphabet and say goodbye two ways.',
  goals: [
    'Recognise م ه ة, and the hamza alone ء or on an alif أ',
    'Read words like مَاءٌ، مَدِينَةٌ، قَهْوَةٌ، مَطْعَمٌ، أَبٌ',
    'Say goodbye: إِلَى اللِّقَاءِ and مَعَ السَّلَامَةِ',
  ],
  grammarFocus: 'ة comes only at the end of a word and is said -a at a pause.',
  scenario:
    'You are Mona, a waitress at a small restaurant in Cairo in the evening. Greet the learner, ' +
    'offer coffee, water or fish, and say goodbye when they leave. Use only two to four words per ' +
    'sentence and only words from the lessons so far: good evening, coffee, water, tea, please, ' +
    'thank you, yes, no, goodbye. Reply only in Arabic with full harakat, one short question at a ' +
    'time, and never correct the learner yourself: a separate step does that.',
  openingLine: 'مَسَاءُ الْخَيْرِ! قَهْوَةٌ؟',
  vocab: [
    { arabic: 'مَاءٌ', translit: 'māʾ', english: 'water', note: 'Ends with the hamza alone: ء.' },
    { arabic: 'مَدِينَةٌ', translit: 'madīna', english: 'city', note: 'Ends with ة.' },
    { arabic: 'قَهْوَةٌ', translit: 'qahwa', english: 'coffee', note: 'Spot ه and ة.' },
    {
      arabic: 'مَطْعَمٌ',
      translit: 'maṭʿam',
      english: 'restaurant',
      note: 'م at the start and the end.',
    },
    { arabic: 'أَبٌ', translit: 'ab', english: 'father', note: 'The hamza sits on an alif: أ.' },
    { arabic: 'سَمَكٌ', translit: 'samak', english: 'fish' },
    { arabic: 'إِلَى اللِّقَاءِ', translit: 'ilā l-liqāʾ', english: 'goodbye (until we meet)' },
    {
      arabic: 'مَعَ السَّلَامَةِ',
      translit: 'maʿa s-salāma',
      english: 'goodbye (go safely)',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which letter makes the sound “m”?',
      options: ['ن', 'م', 'ه'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which letter only ever comes at the end of a word?',
      options: ['ه', 'ت', 'م', 'ة'],
      answer: 3,
    },
    {
      type: 'choose',
      prompt: 'Which one is the hamza sitting on an alif?',
      options: ['ء', 'ا', 'أ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which letter in this word is the light “h”?',
      promptArabic: 'قَهْوَةٌ',
      options: ['ه', 'ح', 'ق'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which word means “city”?',
      options: ['مَطْعَمٌ', 'مَدِينَةٌ', 'قَهْوَةٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'مَطْعَمٌ',
      options: ['مَطْعَمٌ', 'مَدِينَةٌ', 'سَمَكٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the phrase you hear.',
      audio: 'مَعَ السَّلَامَةِ',
      options: ['إِلَى اللِّقَاءِ', 'مَعَ السَّلَامَةِ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each Arabic word with its meaning.',
      pairs: [
        { arabic: 'مَاءٌ', english: 'water' },
        { arabic: 'قَهْوَةٌ', english: 'coffee' },
        { arabic: 'أَبٌ', english: 'father' },
        { arabic: 'مَطْعَمٌ', english: 'restaurant' },
      ],
    },
    {
      type: 'build',
      prompt: 'Put the words in order.',
      english: 'Goodbye (until we meet).',
      words: ['إِلَى', 'اللِّقَاءِ'],
      distractors: ['مَعَ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'مَعَ',
      after: '',
      english: 'Goodbye (go safely).',
      options: ['اللِّقَاءِ', 'السَّلَامَةِ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'م and ه join on both sides. ه changes shape a lot, so look at it in every position. ة (tāʾ marbūṭa) is a ه with the two dots of ت: it only ends a word and is said -a when you stop there.',
    },
    {
      type: 'table',
      head: ['Letter', 'Sound', 'Alone', 'Start', 'Middle', 'End'],
      rows: [
        ['م mīm', 'm', 'م', 'مـ', 'ـمـ', 'ـم'],
        ['ه hāʾ', 'h, a light breath', 'ه', 'هـ', 'ـهـ', 'ـه'],
        ['ة tāʾ marbūṭa', '-a at a pause', 'ة', '', '', 'ـة'],
      ],
    },
    {
      type: 'p',
      text: 'The hamza ء is a catch in the throat, as in “uh-oh”. It is a small sign more than a letter shape: it stands alone (ء, as at the end of مَاءٌ) or sits on a seat, most often an alif (أ). With م, ه, ة and ء you have met every letter of the alphabet.',
    },
    { type: 'example', arabic: 'أَبٌ', translit: 'ab', english: 'father: hamza on an alif' },
    {
      type: 'example',
      arabic: 'مَدِينَةٌ',
      translit: 'madīna',
      english: 'city: ة at the end, said -a',
    },
    {
      type: 'p',
      text: 'Keep ه apart from ح: ه is a light breath, like the h in “hat”; ح is pushed from deep in the throat.',
    },
  ],
  cultureTip: {
    title: 'Two ways to say goodbye',
    body: 'إِلَى اللِّقَاءِ means “until we meet”; مَعَ السَّلَامَةِ means “go safely”, literally “with safety”. Both work for the one who leaves and the one who stays, and the same words often come back as the answer.',
  },
};
