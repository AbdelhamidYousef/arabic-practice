// Made-up course data for the web tests (no real learner data, ever).

export const courseLesson = (over: object = {}) => ({
  slug: 'a1-greetings',
  title: 'Greetings and your name',
  kind: 'lesson',
  position: 1,
  steps: ['words', 'practice', 'grammar', 'culture', 'talk'],
  stepsDone: [],
  practiceScore: null,
  finished: false,
  ...over,
});

export const course = {
  levels: [
    {
      level: 'A0',
      units: [
        {
          code: 'A0.1',
          title: 'Letters 1',
          summary: 'I can read my first five letters.',
          position: 1,
          lessons: [
            courseLesson({
              slug: 'a0-letters',
              title: 'First letters',
              kind: 'letters',
              stepsDone: ['words', 'practice', 'grammar', 'culture'],
              practiceScore: 90,
              finished: true,
            }),
          ],
        },
      ],
    },
    {
      level: 'A1',
      units: [
        {
          code: 'A1.1',
          title: 'Hello and who you are',
          summary: 'I can greet someone and say my name.',
          position: 1,
          lessons: [
            courseLesson({ stepsDone: ['words', 'practice'], practiceScore: 70 }),
            courseLesson({ slug: 'a1-family', title: 'My family', position: 2 }),
          ],
        },
      ],
    },
  ],
  nextUp: 'a1-greetings',
  stats: { streak: 3, xpToday: 18, xpTotal: 120, wordsLearned: 24 },
};

export const chatLesson = (over: object = {}) => ({
  id: 'l1',
  slug: 'greetings',
  title: 'Greetings and introductions',
  level: 'A1',
  topic: 'Meeting people',
  summary: 'Say hello and ask how someone is.',
  goals: ['Greet a friend'],
  grammarFocus: 'Questions with كيف',
  conversationCount: 0,
  ...over,
});

// A course lesson as `GET /lessons/:slug` returns it, with one exercise of each type.
export const courseDetail = (over: object = {}) => ({
  lesson: {
    ...chatLesson({ id: 'cl1', slug: 'a1-greetings', title: 'Greetings and your name' }),
    unit: { code: 'A1.1', title: 'Hello and who you are' },
    kind: 'lesson',
    grammarNote: [
      { type: 'p', text: 'Arabic has no word for “am” in the present: أَنَا آدَمُ.' },
      { type: 'example', arabic: 'أَنَا آدَمُ', translit: 'anā ādam', english: 'I am Adam.' },
      {
        type: 'table',
        head: ['To', 'Arabic'],
        rows: [
          ['a man', 'كَيْفَ حَالُكَ'],
          ['a woman', 'كَيْفَ حَالُكِ'],
        ],
      },
    ],
    cultureTip: { title: 'Greetings of light', body: 'A greeting is answered with a warmer one.' },
  },
  vocab: [
    { id: 'v1', arabic: 'مَرْحَبًا', translit: 'marḥaban', english: 'hello', note: null, position: 0 },
    {
      id: 'v2',
      arabic: 'صَبَاحُ النُّورِ',
      translit: 'ṣabāḥ an-nūr',
      english: 'good morning (the reply)',
      note: 'Literally “morning of light”.',
      position: 1,
    },
  ],
  exercises: [
    { type: 'choose', prompt: 'How do you say “hello”?', options: ['مَرْحَبًا', 'شُكْرًا'], answer: 0 },
  ],
  progress: { stepsDone: [], practiceScore: null },
  conversations: [],
  ...over,
});
