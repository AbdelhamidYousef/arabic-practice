import type { ContentLesson } from '../types.ts';

// A0-04: ج ح خ (one body, the dot decides) and "how are you?", by ear. Made-up for this app from
// the Classroom plan (curriculum/a0.md); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a0-letters-jim-ha-kha',
  unit: 'A0.1',
  kind: 'letters',
  title: 'One shape, three letters: ج ح خ',
  topic: 'Three letters with one body, and asking how someone is',
  summary: 'Tell ج, ح and خ apart by their dot, read new words and ask “How are you?”.',
  goals: [
    'Recognise ج ح خ: one body, and the dot decides',
    'Read words like حُوتٌ، تَاجٌ، حَبِيبٌ، جُبْنٌ',
    'Ask “How are you?” and answer “Fine, thank God”',
  ],
  grammarFocus: 'ج has a dot below, خ a dot above, ح no dot: the same body, three sounds.',
  scenario:
    'You are Adam, a friendly neighbour who meets the learner on the stairs of a building in ' +
    'Cairo. Greet them and ask how they are, then answer the same question about yourself. Use ' +
    'only two to four words per sentence and only words from the lessons so far: greetings, how ' +
    'are you, fine, thank God, yes, no, please, thank you. Reply only in Arabic with full harakat, ' +
    'one short question at a time, and never correct the learner yourself: a separate step does that.',
  openingLine: 'السَّلَامُ عَلَيْكُمْ! كَيْفَ حَالُكَ؟',
  vocab: [
    { arabic: 'حُوتٌ', translit: 'ḥūt', english: 'whale', note: 'Starts with ح, no dot.' },
    { arabic: 'تَاجٌ', translit: 'tāj', english: 'crown', note: 'Ends with ج, dot below.' },
    { arabic: 'حَبِيبٌ', translit: 'ḥabīb', english: 'dear, beloved' },
    { arabic: 'جُبْنٌ', translit: 'jubn', english: 'cheese' },
    {
      arabic: 'كَيْفَ حَالُكَ',
      translit: 'kayfa ḥāluka',
      english: 'how are you? (to a man)',
      note: 'To a woman: كَيْفَ حَالُكِ (kayfa ḥāluki).',
    },
    { arabic: 'بِخَيْرٍ', translit: 'bi-khayr', english: 'fine, well', note: 'Spot the خ.' },
    {
      arabic: 'الْحَمْدُ لِلَّهِ',
      translit: 'al-ḥamdu lillāh',
      english: 'thank God',
      note: 'Often added after بِخَيْرٍ.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which letter has its dot below?',
      options: ['خ', 'ح', 'ج'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which letter sounds like “ch” in the Scottish “loch”?',
      options: ['ح', 'خ', 'ج'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which letter is the breathy “ḥ” from deep in the throat, with no dot?',
      options: ['ح', 'ج', 'خ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which letter does this word start with?',
      promptArabic: 'حُوتٌ',
      options: ['خ', 'ج', 'ح'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which word means “crown”?',
      options: ['تَاجٌ', 'حُوتٌ', 'جُبْنٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'جُبْنٌ',
      options: ['حَبِيبٌ', 'جُبْنٌ', 'تَاجٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'بِخَيْرٍ',
      options: ['بِخَيْرٍ', 'حَبِيبٌ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each Arabic word with its meaning.',
      pairs: [
        { arabic: 'حُوتٌ', english: 'whale' },
        { arabic: 'جُبْنٌ', english: 'cheese' },
        { arabic: 'تَاجٌ', english: 'crown' },
        { arabic: 'بِخَيْرٍ', english: 'fine' },
      ],
    },
    {
      type: 'build',
      prompt: 'Put the words in order.',
      english: 'Fine, thank God.',
      words: ['بِخَيْرٍ', 'الْحَمْدُ', 'لِلَّهِ'],
      distractors: ['كَيْفَ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'كَيْفَ',
      after: '',
      english: 'How are you? (to a woman)',
      options: ['حَالُكَ', 'حَالُكِ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'ج, ح and خ share one body. The dot decides the letter: below for ج, none for ح, above for خ. All three join on both sides.',
    },
    {
      type: 'table',
      head: ['Letter', 'Sound', 'Alone', 'Start', 'Middle', 'End'],
      rows: [
        ['ج jīm', 'j, as in “jam”', 'ج', 'جـ', 'ـجـ', 'ـج'],
        ['ح ḥāʾ', 'ḥ, a breathy h from deep in the throat', 'ح', 'حـ', 'ـحـ', 'ـح'],
        ['خ khāʾ', 'kh, as in the Scottish “loch”', 'خ', 'خـ', 'ـخـ', 'ـخ'],
      ],
    },
    {
      type: 'p',
      text: 'At the start or in the middle of a word only the top of the body is written; the round tail shows at the end or when the letter stands alone.',
    },
    { type: 'example', arabic: 'حُوتٌ', translit: 'ḥūt', english: 'whale: ح, و, ت' },
    { type: 'example', arabic: 'تَاجٌ', translit: 'tāj', english: 'crown: ت, ا, ج' },
  ],
  cultureTip: {
    title: 'Thank God, every day',
    body: 'Ask كَيْفَ حَالُكَ and you will often hear بِخَيْرٍ، الْحَمْدُ لِلَّهِ, “fine, thank God”. People say الْحَمْدُ لِلَّهِ on good days and on hard ones alike: it is part of the answer, and a learner who says it sounds natural at once.',
  },
};
