import type { ContentLesson } from '../types.ts';

// A1 L01: first greetings. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L01); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-greetings',
  unit: 'A1.1',
  kind: 'lesson',
  title: 'Greetings and your name',
  topic: 'Meeting someone for the first time',
  summary: 'Greet someone at different times of the day, say your name and ask how they are.',
  goals: [
    'Greet someone in the morning and in the evening',
    'Say your name and ask for theirs',
    'Ask “How are you?” and answer it',
  ],
  grammarFocus: 'No word for “am / is / are” in the present: أَنَا آدَمُ.',
  scenario:
    'You are Salma, a friendly woman the learner meets for the first time in a café in Cairo. ' +
    'Greet them, ask their name and how they are, and answer the same questions about yourself. ' +
    'Use very short present-tense sentences with no verb and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'السَّلَامُ عَلَيْكُمْ! أَنَا سَلْمَى. مَا اسْمُكَ؟',
  vocab: [
    { arabic: 'مَرْحَبًا', translit: 'marḥaban', english: 'hello' },
    { arabic: 'صَبَاحُ الْخَيْرِ', translit: 'ṣabāḥ al-khayr', english: 'good morning' },
    {
      arabic: 'صَبَاحُ النُّورِ',
      translit: 'ṣabāḥ an-nūr',
      english: 'good morning (the reply)',
      note: 'Literally “morning of light”: you answer with a better greeting.',
    },
    { arabic: 'مَسَاءُ الْخَيْرِ', translit: 'masāʾ al-khayr', english: 'good evening' },
    { arabic: 'أَنَا', translit: 'anā', english: 'I' },
    { arabic: 'اسْمِي', translit: 'ismī', english: 'my name' },
    { arabic: 'مَا اسْمُكَ', translit: 'mā ismuka', english: 'what is your name? (to a man)' },
    { arabic: 'كَيْفَ حَالُكَ', translit: 'kayfa ḥāluka', english: 'how are you? (to a man)' },
    { arabic: 'بِخَيْرٍ', translit: 'bi-khayr', english: 'fine, well' },
    {
      arabic: 'الْحَمْدُ لِلَّهِ',
      translit: 'al-ḥamdu lillāh',
      english: 'thank God',
      note: 'Often added after بِخَيْرٍ.',
    },
    { arabic: 'شُكْرًا', translit: 'shukran', english: 'thank you' },
    { arabic: 'إِلَى اللِّقَاءِ', translit: 'ilā l-liqāʾ', english: 'goodbye' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “hello”?',
      options: ['مَرْحَبًا', 'شُكْرًا', 'إِلَى اللِّقَاءِ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'It is the evening. What do you say?',
      options: ['صَبَاحُ الْخَيْرِ', 'مَسَاءُ الْخَيْرِ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'كَيْفَ حَالُكَ؟',
      options: ['بِخَيْرٍ', 'إِلَى اللِّقَاءِ', 'مَسَاءُ الْخَيْرِ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the question you hear.',
      audio: 'كَيْفَ حَالُكَ',
      options: ['مَا اسْمُكَ', 'كَيْفَ حَالُكَ', 'شُكْرًا'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each phrase with its meaning.',
      pairs: [
        { arabic: 'مَرْحَبًا', english: 'hello' },
        { arabic: 'شُكْرًا', english: 'thank you' },
        { arabic: 'بِخَيْرٍ', english: 'fine, well' },
        { arabic: 'إِلَى اللِّقَاءِ', english: 'goodbye' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I am Adam.',
      words: ['أَنَا', 'آدَمُ'],
      distractors: ['اسْمِي'],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'What is your name?',
      words: ['مَا', 'اسْمُكَ'],
      distractors: ['كَيْفَ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'آدَمُ',
      english: 'My name is Adam.',
      options: ['اسْمِي', 'حَالُكَ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'حَالُكَ؟',
      english: 'How are you?',
      options: ['كَيْفَ', 'مَا'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'In the present, Arabic has no word for “am”, “is” or “are”. You put the two parts side by side and the sentence is complete.',
    },
    { type: 'example', arabic: 'أَنَا آدَمُ', translit: 'anā ādam', english: 'I am Adam.' },
    {
      type: 'example',
      arabic: 'اسْمِي سَلْمَى',
      translit: 'ismī salmā',
      english: 'My name is Salma.',
    },
    {
      type: 'p',
      text: 'The ending ـكَ speaks to a man and ـكِ to a woman: the same question changes by one vowel.',
    },
    {
      type: 'table',
      head: ['To', 'Arabic', 'Meaning'],
      rows: [
        ['a man', 'كَيْفَ حَالُكَ', 'How are you?'],
        ['a woman', 'كَيْفَ حَالُكِ', 'How are you?'],
      ],
    },
  ],
  cultureTip: {
    title: 'Greetings of light',
    body: 'A greeting is answered with a warmer one. صَبَاحُ الْخَيْرِ, “morning of goodness”, is answered with صَبَاحُ النُّورِ, “morning of light”. Taking a moment to ask after someone before anything else is normal and expected.',
  },
};
