import type { ContentLesson } from '../types.ts';

// A0-03: the short vowels, sukūn, ay and aw, and asking for slow speech, by ear. Made-up for this
// app from the Classroom plan (curriculum/a0.md); the owner reviews the Arabic before real
// learners see it.
export const lesson: ContentLesson = {
  slug: 'a0-short-vowels',
  unit: 'A0.1',
  kind: 'letters',
  title: 'Short vowels and sukūn',
  topic: 'The small marks for a, u, i and no vowel, and asking someone to speak slowly',
  summary:
    'Read fatḥa, ḍamma, kasra and sukūn, the sounds ay and aw, and say you do not understand.',
  goals: [
    'Read the short vowels ـَ ـُ ـِ and the sukūn ـْ on any letter you know',
    'Hear and read the sounds ay and aw: بَيْتٌ، ثَوْبٌ',
    'Say “I don’t understand” and ask someone to speak slowly',
  ],
  grammarFocus: 'Fatḥa, ḍamma and kasra are short a, u, i; sukūn means no vowel.',
  scenario:
    'You are Nadia, a patient teacher meeting a complete beginner. Say short sentences with words ' +
    'from the lessons so far: house, girl, robe, yes, no, please. When the learner says they do not ' +
    'understand or asks you to speak slowly, say the same words again, slower and shorter. Use only ' +
    'two to four words per sentence. Reply only in Arabic with full harakat, one short question at ' +
    'a time, and never correct the learner yourself: a separate step does that.',
  openingLine: 'السَّلَامُ عَلَيْكُمْ! أَنَا نَادِيَةُ.',
  vocab: [
    { arabic: 'بِنْتٌ', translit: 'bint', english: 'girl', note: 'Kasra on ب, sukūn on ن.' },
    { arabic: 'بَيْتٌ', translit: 'bayt', english: 'house', note: 'بَيْ is the sound ay.' },
    { arabic: 'ثَوْبٌ', translit: 'thawb', english: 'robe (a long garment)', note: 'ثَوْ is aw.' },
    { arabic: 'بَيْنَ', translit: 'bayna', english: 'between' },
    { arabic: 'لَا أَفْهَمُ', translit: 'lā afham', english: 'I don’t understand' },
    {
      arabic: 'تَكَلَّمْ بِبُطْءٍ مِنْ فَضْلِكَ',
      translit: 'takallam bi-buṭʾ min faḍlika',
      english: 'speak slowly, please (to a man)',
    },
    {
      arabic: 'تَكَلَّمِي بِبُطْءٍ مِنْ فَضْلِكِ',
      translit: 'takallamī bi-buṭʾ min faḍliki',
      english: 'speak slowly, please (to a woman)',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which syllable says “bu”?',
      options: ['بِ', 'بَ', 'بُ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which one is the long “bī”?',
      options: ['بِي', 'بِ', 'بُو'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which letter in this word has a sukūn (no vowel)?',
      promptArabic: 'بِنْتٌ',
      options: ['ب', 'ن', 'ت'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which word has the sound “aw”?',
      options: ['بَيْتٌ', 'ثَوْبٌ', 'بِنْتٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which word means “girl”?',
      options: ['ثَوْبٌ', 'بَيْتٌ', 'بِنْتٌ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'بَيْتٌ',
      options: ['بَيْتٌ', 'بِنْتٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'ثَوْبٌ',
      options: ['تُوتٌ', 'ثَوْبٌ', 'بَابٌ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each Arabic word with its meaning.',
      pairs: [
        { arabic: 'بَيْتٌ', english: 'house' },
        { arabic: 'بِنْتٌ', english: 'girl' },
        { arabic: 'ثَوْبٌ', english: 'robe' },
        { arabic: 'لَا أَفْهَمُ', english: 'I don’t understand' },
      ],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'أَفْهَمُ',
      english: 'I don’t understand.',
      options: ['نَعَمْ', 'لَا'],
      answer: 1,
    },
    {
      type: 'build',
      prompt: 'Put the words in order.',
      english: 'Speak slowly, please (to a man).',
      words: ['تَكَلَّمْ', 'بِبُطْءٍ', 'مِنْ', 'فَضْلِكَ'],
      distractors: ['تَكَلَّمِي', 'فَضْلِكِ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'تَكَلَّمِي بِبُطْءٍ مِنْ',
      after: '',
      english: 'Speak slowly, please (to a woman).',
      options: ['فَضْلِكِ', 'فَضْلِكَ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'Short vowels are small marks above or below a letter. A letter with no vowel after it carries a little circle, the sukūn. Each short vowel has a long partner: ا, و or ي.',
    },
    {
      type: 'table',
      head: ['Mark', 'Name', 'Sound', 'Short', 'Long'],
      rows: [
        ['ـَ', 'fatḥa', 'a', 'بَ ba', 'بَا bā'],
        ['ـُ', 'ḍamma', 'u', 'بُ bu', 'بُو bū'],
        ['ـِ', 'kasra', 'i', 'بِ bi', 'بِي bī'],
        ['ـْ', 'sukūn', 'no vowel', 'بِنْ bin', ''],
      ],
    },
    {
      type: 'p',
      text: 'A fatḥa before و or ي with a sukūn gives the sounds ay and aw.',
    },
    { type: 'example', arabic: 'بَيْتٌ', translit: 'bayt', english: 'house: ba + y with sukūn = bay' },
    {
      type: 'example',
      arabic: 'ثَوْبٌ',
      translit: 'thawb',
      english: 'robe: tha + w with sukūn = thaw',
    },
    {
      type: 'p',
      text: 'The double mark at the end of a word (ـٌ) adds an n sound: بَيْتٌ is said baytun in full. You meet it properly later.',
    },
  ],
  cultureTip: {
    title: 'Asking for slow speech',
    body: 'Arabic speakers are usually delighted to hear a learner try. Saying لَا أَفْهَمُ or asking تَكَلَّمْ بِبُطْءٍ مِنْ فَضْلِكَ is not rude at all: most people will happily slow down, repeat, and add a gesture or two.',
  },
};
