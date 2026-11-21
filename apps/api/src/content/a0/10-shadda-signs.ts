import type { ContentLesson } from '../types.ts';

// A0-10: shadda, the article al- with sun and moon letters, reading signs and a menu, and a review
// of every phrase so far. Made-up for this app from the Classroom plan (curriculum/a0.md); the
// owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a0-shadda-signs',
  unit: 'A0.2',
  kind: 'letters',
  title: 'Shadda, al- and your first signs',
  topic: 'Doubled letters, the word “the”, and reading signs and a menu',
  summary:
    'Read the shadda and al- with sun and moon letters, read signs and a menu, and use every phrase so far.',
  goals: [
    'Read the shadda ـّ as a doubled letter: سُكَّرٌ',
    'Say al- right before sun and moon letters: الشَّمْسُ، الْقَمَرُ',
    'Read simple signs and order from a menu using all your phrases',
  ],
  grammarFocus: 'Before a sun letter the l of al- is silent and the next letter is doubled.',
  scenario:
    'You are Salma, a waitress at a café in Cairo; the learner has finished the letters and comes ' +
    'in for a drink. Greet them, ask how they are and their name, take an order of tea, coffee or ' +
    'water, ask about sugar, bring it and say goodbye. Use only two to four words per sentence and ' +
    'only words from the lessons so far. Reply only in Arabic with full harakat, one short question ' +
    'at a time, and never correct the learner yourself: a separate step does that.',
  openingLine: 'السَّلَامُ عَلَيْكُمْ! كَيْفَ حَالُكَ؟',
  vocab: [
    { arabic: 'سُكَّرٌ', translit: 'sukkar', english: 'sugar', note: 'The shadda doubles ك: kk.' },
    {
      arabic: 'الشَّمْسُ',
      translit: 'ash-shams',
      english: 'the sun',
      note: 'ش is a sun letter: the l of al- is silent.',
    },
    {
      arabic: 'الْقَمَرُ',
      translit: 'al-qamar',
      english: 'the moon',
      note: 'ق is a moon letter: you say the l.',
    },
    { arabic: 'مَفْتُوحٌ', translit: 'maftūḥ', english: 'open' },
    { arabic: 'مُغْلَقٌ', translit: 'mughlaq', english: 'closed' },
    { arabic: 'مَدْخَلٌ', translit: 'madkhal', english: 'entrance' },
    { arabic: 'مَخْرَجٌ', translit: 'makhraj', english: 'exit' },
    { arabic: 'قَائِمَةُ الطَّعَامِ', translit: 'qāʾimat aṭ-ṭaʿām', english: 'menu' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which letter in this word is doubled?',
      promptArabic: 'سُكَّرٌ',
      options: ['س', 'ك', 'ر'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'In which word is the l of al- silent?',
      options: ['الْقَمَرُ', 'الْبَابُ', 'الشَّمْسُ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which of these is a moon letter (al- keeps its l)?',
      options: ['ش', 'ق', 'س', 'ن'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'You want to leave the building. Which sign do you look for?',
      options: ['مَدْخَلٌ', 'مَخْرَجٌ', 'مُغْلَقٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'The shop door shows this sign. Can you go in?',
      promptArabic: 'مُغْلَقٌ',
      options: ['نَعَمْ', 'لَا'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'سُكَّرٌ',
      options: ['شَايٌ', 'سُكَّرٌ', 'قَهْوَةٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'مَفْتُوحٌ',
      options: ['مَفْتُوحٌ', 'مُغْلَقٌ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each sign with its meaning.',
      pairs: [
        { arabic: 'مَفْتُوحٌ', english: 'open' },
        { arabic: 'مُغْلَقٌ', english: 'closed' },
        { arabic: 'مَدْخَلٌ', english: 'entrance' },
        { arabic: 'مَخْرَجٌ', english: 'exit' },
      ],
    },
    {
      type: 'match',
      prompt: 'Review: match each phrase with its meaning.',
      pairs: [
        { arabic: 'شُكْرًا', english: 'thank you' },
        { arabic: 'لَا أَفْهَمُ', english: 'I don’t understand' },
        { arabic: 'أَيْنَ', english: 'where?' },
        { arabic: 'مَعَ السَّلَامَةِ', english: 'goodbye' },
        { arabic: 'آسِفٌ', english: 'sorry' },
      ],
    },
    {
      type: 'build',
      prompt: 'Put the words in order.',
      english: 'Coffee without sugar, please (to a man).',
      words: ['قَهْوَةٌ', 'بِدُونِ', 'سُكَّرٍ', 'مِنْ', 'فَضْلِكَ'],
      distractors: ['شَايٌ'],
    },
    {
      type: 'gap',
      prompt: 'Someone says السَّلَامُ عَلَيْكُمْ. Fill the gap in your answer.',
      before: '',
      after: 'السَّلَامُ',
      english: 'And upon you, peace.',
      options: ['وَعَلَيْكُمُ', 'مَعَ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'The shadda ـّ is the fifth mark: it doubles a letter, so you hold the sound a moment longer. It sits on the letter together with its vowel.',
    },
    { type: 'example', arabic: 'سُكَّرٌ', translit: 'sukkar', english: 'sugar: ك is said twice' },
    {
      type: 'p',
      text: 'The word for “the” is ال (al-), joined to the front of the word. Half of the letters, the sun letters, swallow its l: you skip the l and double the next letter, and a shadda shows it. Before the moon letters you say the l, and it carries a sukūn.',
    },
    {
      type: 'table',
      head: ['Group', 'Letters', 'Example'],
      rows: [
        ['sun letters (l silent)', 'ت ث د ذ ر ز س ش ص ض ط ظ ل ن', 'الشَّمْسُ ash-shams'],
        ['moon letters (l said)', 'ا ب ج ح خ ع غ ف ق ك م ه و ي', 'الْقَمَرُ al-qamar'],
      ],
    },
    { type: 'example', arabic: 'الشَّمْسُ', translit: 'ash-shams', english: 'the sun: sun letter ش' },
    { type: 'example', arabic: 'الْقَمَرُ', translit: 'al-qamar', english: 'the moon: moon letter ق' },
  ],
  cultureTip: {
    title: 'Reading signs',
    body: 'You can now read every letter, so signs start to speak to you: مَدْخَلٌ and مَخْرَجٌ at a metro station, مَفْتُوحٌ and مُغْلَقٌ on a shop door. Real signs and menus usually leave out the vowel marks, so you will read them by their letters: a good next step once the shapes feel easy.',
  },
};
