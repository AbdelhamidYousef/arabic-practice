import type { ContentLesson } from '../types.ts';

// A1 L25: take a taxi or a bus. Made-up for this app from the Classroom plan
// (curriculum/msa/a1.md, L25: C21, G22, K13); the owner reviews the Arabic before real learners
// see it.
export const lesson: ContentLesson = {
  slug: 'a1-taxi-bus',
  unit: 'A1.3',
  kind: 'lesson',
  title: 'Taxi or bus',
  topic: 'Getting to Giza: where to, and how much',
  summary:
    'Say where you are going, ask the fare, tell the driver where to stop, and describe things.',
  goals: [
    'Tell a taxi driver where you are going and where to stop',
    'Ask how much the fare is and find the bus stop',
    'Tell “the new bus” from “the bus is new”',
  ],
  grammarFocus: '“The big house” vs “the house is big”: الْبَيْتُ الْكَبِيرُ / الْبَيْتُ كَبِيرٌ.',
  scenario:
    'You are Mahmoud, a chatty taxi driver in Cairo. The learner gets into your taxi: ask where ' +
    'they are going, agree a fare of up to ten pounds, talk a little about the traffic and your ' +
    'old but fast car, and stop where they ask. Speak MSA only. ' +
    'Use very short sentences, numbers up to ten only, and words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'مَسَاءُ الْخَيْرِ! إِلَى أَيْنَ، يَا أُسْتَاذُ؟',
  vocab: [
    { arabic: 'سَيَّارَةُ أُجْرَةٍ', translit: 'sayyārat ujra', english: 'taxi' },
    { arabic: 'حَافِلَةٌ', translit: 'ḥāfila', english: 'bus' },
    { arabic: 'مَوْقِفٌ', translit: 'mawqif', english: 'stop, stand (for a bus or taxi)' },
    { arabic: 'الْأُجْرَةُ', translit: 'al-ujra', english: 'the fare' },
    { arabic: 'السَّائِقُ', translit: 'as-sāʾiq', english: 'the driver' },
    {
      arabic: 'جُنَيْهٌ',
      translit: 'junayh',
      english: 'pound (Egyptian money)',
      note: 'Ten pounds: عَشَرَةُ جُنَيْهَاتٍ.',
    },
    { arabic: 'بِكَمْ', translit: 'bikam', english: 'how much? (price)' },
    { arabic: 'إِلَى أَيْنَ', translit: 'ilā ayna', english: 'where to?' },
    { arabic: 'قِفْ هُنَا', translit: 'qif hunā', english: 'stop here' },
    { arabic: 'زَحْمَةٌ', translit: 'zaḥma', english: 'traffic jam, crowd' },
    { arabic: 'سَرِيعٌ', translit: 'sarīʿ', english: 'fast' },
    { arabic: 'بَطِيءٌ', translit: 'baṭīʾ', english: 'slow' },
    { arabic: 'رَخِيصٌ', translit: 'rakhīṣ', english: 'cheap' },
    {
      arabic: 'غَالٍ',
      translit: 'ghālī',
      english: 'expensive',
      note: 'With الْ: الْغَالِي. For a feminine noun: غَالِيَةٌ.',
    },
    { arabic: 'جَدِيدٌ', translit: 'jadīd', english: 'new' },
    { arabic: 'قَدِيمٌ', translit: 'qadīm', english: 'old (of things)' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you ask “How much?”',
      options: ['بِكَمْ', 'إِلَى أَيْنَ', 'قِفْ هُنَا'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which one means “the new bus” (a phrase, not a sentence)?',
      options: ['الْحَافِلَةُ جَدِيدَةٌ', 'الْحَافِلَةُ الْجَدِيدَةُ', 'حَافِلَةٌ الْجَدِيدَةُ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which one means “The taxi is fast.”?',
      options: ['سَيَّارَةُ الْأُجْرَةِ السَّرِيعَةُ', 'سَيَّارَةُ أُجْرَةٍ سَرِيعٌ', 'سَيَّارَةُ الْأُجْرَةِ سَرِيعَةٌ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'قِفْ هُنَا',
      options: ['بِكَمْ', 'إِلَى أَيْنَ', 'قِفْ هُنَا'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'هُنَاكَ زَحْمَةٌ الْيَوْمَ',
      options: ['هُنَاكَ زَحْمَةٌ الْيَوْمَ', 'هُنَاكَ حَافِلَةٌ الْيَوْمَ', 'لَيْسَ هُنَاكَ زَحْمَةٌ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'سَيَّارَةُ أُجْرَةٍ', english: 'taxi' },
        { arabic: 'حَافِلَةٌ', english: 'bus' },
        { arabic: 'مَوْقِفٌ', english: 'stop' },
        { arabic: 'السَّائِقُ', english: 'the driver' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'رَخِيصٌ', english: 'cheap' },
        { arabic: 'غَالٍ', english: 'expensive' },
        { arabic: 'سَرِيعٌ', english: 'fast' },
        { arabic: 'بَطِيءٌ', english: 'slow' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The driver is kind.',
      words: ['السَّائِقُ', 'لَطِيفٌ'],
      distractors: ['اللَّطِيفُ'],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'Where is the bus stop?',
      words: ['أَيْنَ', 'مَوْقِفُ', 'الْحَافِلَةِ'],
      distractors: ['الْمَوْقِفُ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Stop here, please.',
      words: ['قِفْ', 'هُنَا', 'مِنْ', 'فَضْلِكَ'],
      distractors: ['اِمْشِ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'الْحَافِلَةُ',
      after: 'رَخِيصَةٌ.',
      english: 'The old bus is cheap.',
      options: ['قَدِيمَةٌ', 'الْقَدِيمَةُ', 'الْقَدِيمُ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'سَيَّارَةُ الْأُجْرَةِ',
      after: '',
      english: 'The taxi is new.',
      options: ['جَدِيدَةٌ', 'الْجَدِيدَةُ', 'جَدِيدٌ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'A describing word comes after its noun and copies it: الْ or no الْ, masculine or feminine, and the same ending. Both with الْ makes a phrase, “the new bus”.',
    },
    {
      type: 'p',
      text: 'When only the noun has الْ, you get a full sentence: “the bus is new”. That one small الْ is the whole difference.',
    },
    {
      type: 'table',
      head: ['Phrase', 'Meaning', 'Sentence', 'Meaning'],
      rows: [
        ['الْبَيْتُ الْكَبِيرُ', 'the big house', 'الْبَيْتُ كَبِيرٌ', 'The house is big.'],
        ['الْحَافِلَةُ الْجَدِيدَةُ', 'the new bus', 'الْحَافِلَةُ جَدِيدَةٌ', 'The bus is new.'],
        ['السَّائِقُ اللَّطِيفُ', 'the kind driver', 'السَّائِقُ لَطِيفٌ', 'The driver is kind.'],
      ],
    },
    {
      type: 'p',
      text: 'Without الْ on either word, it is a phrase again, “a …”: سَيَّارَةٌ سَرِيعَةٌ, “a fast car”.',
    },
    {
      type: 'example',
      arabic: 'الْحَافِلَةُ الْقَدِيمَةُ بَطِيئَةٌ.',
      translit: 'al-ḥāfilatu l-qadīmatu baṭīʾa',
      english: 'The old bus is slow.',
    },
  ],
  cultureTip: {
    title: 'MSA and the dialects',
    body: 'MSA is the shared language of the whole Arab world: news, books, signs, speeches and forms. At home and in the street, people speak their own dialect; in Cairo that is Egyptian Arabic, which sounds ج as a “g”. Everyone understands MSA, so a taxi driver will understand you perfectly, and may smile and answer in Egyptian. That is normal: keep speaking MSA.',
  },
};
