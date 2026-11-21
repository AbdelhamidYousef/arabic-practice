import type { ContentLesson } from '../types.ts';

// A0-01: the first letters (ا ب ت ث ن) and the first phrases, by ear. Made-up for this app from
// the Classroom plan (curriculum/a0.md); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a0-letters-alif-ba',
  unit: 'A0.1',
  kind: 'letters',
  title: 'First letters: ا ب ت ث ن',
  topic: 'Your first five letters and three polite phrases',
  summary: 'Meet the letters alif, bāʾ, tāʾ, thāʾ and nūn, read your first words and say hello.',
  goals: [
    'Recognise ا ب ت ث ن and say the sound of each',
    'Read two words built from these letters: بَابٌ and بَابَا',
    'Say hello, thank you and you are welcome',
  ],
  grammarFocus: 'Arabic is written from right to left and ا never joins the letter after it.',
  scenario:
    'You are Salma, a friendly woman who greets a complete beginner. Say hello and ask their name. ' +
    'Use only two to four words per sentence and only words from the lesson: greetings, thank you, ' +
    'you are welcome, door, dad. Reply only in Arabic with full harakat, one short question at a time, ' +
    'and never correct the learner yourself: a separate step does that.',
  openingLine: 'السَّلَامُ عَلَيْكُمْ! أَنَا سَلْمَى.',
  vocab: [
    { arabic: 'بَابٌ', translit: 'bāb', english: 'door' },
    { arabic: 'بَابَا', translit: 'bābā', english: 'dad, papa' },
    { arabic: 'أَنَا', translit: 'anā', english: 'I', note: 'Used before your name: أَنَا سَلْمَى.' },
    {
      arabic: 'السَّلَامُ عَلَيْكُمْ',
      translit: 'as-salāmu ʿalaykum',
      english: 'hello (peace be upon you)',
    },
    {
      arabic: 'وَعَلَيْكُمُ السَّلَامُ',
      translit: 'wa-ʿalaykumu s-salām',
      english: 'hello back (and upon you, peace)',
    },
    { arabic: 'شُكْرًا', translit: 'shukran', english: 'thank you' },
    { arabic: 'عَفْوًا', translit: 'ʿafwan', english: 'you are welcome' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which letter makes the sound “b”?',
      options: ['ت', 'ب', 'ث', 'ن'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which letter makes the sound “n”?',
      options: ['ث', 'ن', 'ت', 'ب'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which letter sounds like “th” in “think”?',
      options: ['ث', 'ت', 'ا', 'ن'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which word means “door”?',
      options: ['بَابَا', 'بَابٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'بَابٌ',
      options: ['بَابٌ', 'بَابَا'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the phrase you hear.',
      audio: 'عَفْوًا',
      options: ['شُكْرًا', 'عَفْوًا'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each Arabic phrase with its meaning.',
      pairs: [
        { arabic: 'السَّلَامُ عَلَيْكُمْ', english: 'hello (peace be upon you)' },
        { arabic: 'شُكْرًا', english: 'thank you' },
        { arabic: 'عَفْوًا', english: 'you are welcome' },
        { arabic: 'بَابٌ', english: 'door' },
      ],
    },
    {
      type: 'build',
      prompt: 'Put the words in order.',
      english: 'Peace be upon you.',
      words: ['السَّلَامُ', 'عَلَيْكُمْ'],
      distractors: ['شُكْرًا'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'عَلَيْكُمْ',
      english: 'Hello: peace be upon you.',
      options: ['السَّلَامُ', 'شُكْرًا'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Someone says السَّلَامُ عَلَيْكُمْ. Fill the gap in your answer.',
      before: 'وَعَلَيْكُمُ',
      after: '',
      english: 'And upon you, peace.',
      options: ['عَفْوًا', 'السَّلَامُ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'Arabic is written from right to left. Letters in a word join to their neighbour, but ا never joins the letter after it, so a word with ا has small gaps.',
    },
    {
      type: 'example',
      arabic: 'بَابَا',
      translit: 'bābā',
      english: 'dad: ب, ا, ب, ا, read from the right',
    },
    {
      type: 'table',
      head: ['Letter', 'Name', 'Sound'],
      rows: [
        ['ا', 'alif', 'long ā, as in “father”'],
        ['ب', 'bāʾ', 'b'],
        ['ت', 'tāʾ', 't'],
        ['ث', 'thāʾ', 'th, as in “think”'],
        ['ن', 'nūn', 'n'],
      ],
    },
    {
      type: 'p',
      text: 'The little marks above and below letters (harakat) tell you the short vowels. In this app every Arabic word carries them.',
    },
  ],
  cultureTip: {
    title: 'Peace be upon you',
    body: 'السَّلَامُ عَلَيْكُمْ is how Arabic speakers greet each other everywhere, in every country and at any time of day. The reply repeats the words in a new order: وَعَلَيْكُمُ السَّلَامُ, “and upon you, peace”. Answering well is part of the greeting.',
  },
};
