import type { ContentLesson } from '../types.ts';

// A0-05: د ذ ر ز (they never join forward) and "what is your name?", by ear. Made-up for this app
// from the Classroom plan (curriculum/a0.md); the owner reviews the Arabic before real learners
// see it.
export const lesson: ContentLesson = {
  slug: 'a0-letters-dal-ra',
  unit: 'A0.1',
  kind: 'letters',
  title: 'Letters that stand apart: د ذ ر ز',
  topic: 'Four letters that never join forward, and your name and where you are from',
  summary: 'Read د ذ ر ز, see why words with them have gaps, and say your name and country.',
  goals: [
    'Recognise د ذ ر ز and pair them by their dot',
    'Read words like دَارٌ، وَرْدٌ، خُبْزٌ، زَيْتٌ، بَحْرٌ',
    'Ask someone’s name, say yours and where you are from',
  ],
  grammarFocus: 'Six letters never join the letter after them: ا و د ذ ر ز.',
  scenario:
    'You are Karim, a student at a language café in Cairo. Ask the learner their name and where ' +
    'they are from, and say yours: you are Karim, from Egypt. Use only two to four words per ' +
    'sentence and only words from the lessons so far: greetings, name, I am from, how are you, ' +
    'fine, yes, no, thank you. Reply only in Arabic with full harakat, one short question at a ' +
    'time, and never correct the learner yourself: a separate step does that.',
  openingLine: 'مَرْحَبًا! أَنَا كَرِيمٌ. مَا اسْمُكَ؟',
  vocab: [
    { arabic: 'دَارٌ', translit: 'dār', english: 'house, home', note: 'No letter joins forward.' },
    { arabic: 'وَرْدٌ', translit: 'ward', english: 'roses', note: 'و, ر, د: three gaps.' },
    { arabic: 'خُبْزٌ', translit: 'khubz', english: 'bread' },
    { arabic: 'زَيْتٌ', translit: 'zayt', english: 'oil' },
    { arabic: 'بَحْرٌ', translit: 'baḥr', english: 'sea' },
    { arabic: 'ذُبَابٌ', translit: 'dhubāb', english: 'flies (the insects)', note: 'Spot the ذ.' },
    {
      arabic: 'مَا اسْمُكَ',
      translit: 'mā ismuka',
      english: 'what is your name? (to a man)',
      note: 'To a woman: مَا اسْمُكِ (mā ismuki).',
    },
    { arabic: 'اسْمِي', translit: 'ismī', english: 'my name (is)' },
    { arabic: 'أَنَا مِنْ', translit: 'anā min', english: 'I am from' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which letter sounds like “th” in “this”?',
      options: ['د', 'ذ', 'ز', 'ر'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which letter makes the sound “z”?',
      options: ['ر', 'د', 'ز', 'ذ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which of these letters joins the letter after it?',
      options: ['ر', 'د', 'ز', 'ب'],
      answer: 3,
    },
    {
      type: 'choose',
      prompt: 'Which letter does this word end with?',
      promptArabic: 'وَرْدٌ',
      options: ['ر', 'د', 'ذ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which word means “bread”?',
      options: ['زَيْتٌ', 'بَحْرٌ', 'خُبْزٌ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'بَحْرٌ',
      options: ['بَحْرٌ', 'خُبْزٌ', 'دَارٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'زَيْتٌ',
      options: ['بَيْتٌ', 'زَيْتٌ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each Arabic word with its meaning.',
      pairs: [
        { arabic: 'خُبْزٌ', english: 'bread' },
        { arabic: 'زَيْتٌ', english: 'oil' },
        { arabic: 'بَحْرٌ', english: 'sea' },
        { arabic: 'وَرْدٌ', english: 'roses' },
      ],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'مَا',
      after: '',
      english: 'What is your name? (to a man)',
      options: ['اسْمِي', 'اسْمُكَ'],
      answer: 1,
    },
    {
      type: 'build',
      prompt: 'Put the words in order.',
      english: 'I am from Egypt.',
      words: ['أَنَا', 'مِنْ', 'مِصْرَ'],
      distractors: ['اسْمِي'],
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'د ذ ر ز join the letter before them but never the letter after them, just like ا and و. That makes six letters that leave a small gap after themselves: ا و د ذ ر ز.',
    },
    {
      type: 'table',
      head: ['Letter', 'Sound', 'Alone', 'Start', 'Middle', 'End'],
      rows: [
        ['د dāl', 'd', 'د', 'د', 'ـد', 'ـد'],
        ['ذ dhāl', 'dh, as in “this”', 'ذ', 'ذ', 'ـذ', 'ـذ'],
        ['ر rāʾ', 'r, rolled', 'ر', 'ر', 'ـر', 'ـر'],
        ['ز zāy', 'z', 'ز', 'ز', 'ـز', 'ـز'],
      ],
    },
    {
      type: 'p',
      text: 'They come in pairs: ذ is د with a dot, and ز is ر with a dot. ر and ز dip below the line; د and ذ sit on it.',
    },
    { type: 'example', arabic: 'وَرْدٌ', translit: 'ward', english: 'roses: و, ر, د, none joined' },
    { type: 'example', arabic: 'خُبْزٌ', translit: 'khubz', english: 'bread: خ joins ب, ب joins ز' },
  ],
  cultureTip: {
    title: 'Where are you from?',
    body: 'Right after names, people often ask where you are from. Two words carry the answer: أَنَا مِنْ and your country, for example أَنَا مِنْ مِصْرَ, “I am from Egypt”. Expect a warm welcome back, often أَهْلًا وَسَهْلًا.',
  },
};
