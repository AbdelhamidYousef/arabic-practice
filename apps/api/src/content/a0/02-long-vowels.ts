import type { ContentLesson } from '../types.ts';

// A0-02: the long vowels و and ي, and yes / no / please, by ear. Made-up for this app from the
// Classroom plan (curriculum/a0.md); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a0-long-vowels',
  unit: 'A0.1',
  kind: 'letters',
  title: 'Long vowels: و ي',
  topic: 'Two letters for the long vowels ū and ī, and yes, no and please',
  summary: 'Meet wāw and yāʾ, read words with long ū and ī, and say yes, no and please.',
  goals: [
    'Recognise و and ي and say the long ū and ī they make',
    'Read words built from the letters so far: تِينٌ، تُوتٌ، نُونٌ، بُيُوتٌ',
    'Say yes and no, and please to a man and to a woman',
  ],
  grammarFocus:
    'و and ي are long vowels after a letter; و, like ا, never joins the letter after it.',
  scenario:
    'You are Karim, a friendly fruit seller at a market stall in Cairo. Offer the learner figs and ' +
    'mulberries and ask yes-or-no questions. Use only two to four words per sentence and only words ' +
    'from the lessons so far: greetings, yes, no, please, thank you, figs, mulberries. Reply only in ' +
    'Arabic with full harakat, one short question at a time, and never correct the learner yourself: ' +
    'a separate step does that.',
  openingLine: 'السَّلَامُ عَلَيْكُمْ! تِينٌ؟',
  vocab: [
    { arabic: 'تِينٌ', translit: 'tīn', english: 'figs', note: 'ي makes the long ī.' },
    { arabic: 'تُوتٌ', translit: 'tūt', english: 'mulberries', note: 'و makes the long ū.' },
    { arabic: 'نُونٌ', translit: 'nūn', english: 'the letter nūn' },
    {
      arabic: 'بُيُوتٌ',
      translit: 'buyūt',
      english: 'houses',
      note: 'Here ي is the sound y, and و is the long ū.',
    },
    { arabic: 'نَعَمْ', translit: 'naʿam', english: 'yes' },
    { arabic: 'لَا', translit: 'lā', english: 'no' },
    {
      arabic: 'مِنْ فَضْلِكَ',
      translit: 'min faḍlika',
      english: 'please (to a man)',
      note: 'To a woman: مِنْ فَضْلِكِ (min faḍliki), with a kasra at the end.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which letter makes the long “ū”, as in “moon”?',
      options: ['ي', 'و', 'ن', 'ب'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which letter makes the long “ī”, as in “see”?',
      options: ['ت', 'ن', 'ي', 'و'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which long vowel do you see in this word?',
      promptArabic: 'تِينٌ',
      options: ['و', 'ا', 'ي'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which letter is the long ū in this word?',
      promptArabic: 'بُيُوتٌ',
      options: ['و', 'ي', 'ت', 'ب'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which word means “figs”?',
      options: ['تُوتٌ', 'تِينٌ', 'نُونٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'نُونٌ',
      options: ['تِينٌ', 'تُوتٌ', 'نُونٌ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'لَا',
      options: ['لَا', 'نَعَمْ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each Arabic word with its meaning.',
      pairs: [
        { arabic: 'نَعَمْ', english: 'yes' },
        { arabic: 'لَا', english: 'no' },
        { arabic: 'تِينٌ', english: 'figs' },
        { arabic: 'بُيُوتٌ', english: 'houses' },
      ],
    },
    {
      type: 'choose',
      prompt: 'You ask a woman for something. What do you add?',
      options: ['مِنْ فَضْلِكَ', 'مِنْ فَضْلِكِ'],
      answer: 1,
    },
    {
      type: 'build',
      prompt: 'Put the words in order.',
      english: 'Yes, please (to a man).',
      words: ['نَعَمْ', 'مِنْ', 'فَضْلِكَ'],
      distractors: ['فَضْلِكِ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'لَا، مِنْ',
      after: '',
      english: 'No, please (to a woman).',
      options: ['فَضْلِكَ', 'فَضْلِكِ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'After a letter with a short vowel, و stretches it into a long ū and ي into a long ī, the way ا makes a long ā. At the start of a syllable they are the consonants w and y.',
    },
    {
      type: 'table',
      head: ['Letter', 'Alone', 'Start', 'Middle', 'End'],
      rows: [
        ['و wāw', 'و', 'و', 'ـو', 'ـو'],
        ['ي yāʾ', 'ي', 'يـ', 'ـيـ', 'ـي'],
      ],
    },
    {
      type: 'p',
      text: 'و is like ا: it joins the letter before it but never the letter after it. ي joins on both sides, and its two dots sit below.',
    },
    { type: 'example', arabic: 'تِينٌ', translit: 'tīn', english: 'figs: ت, ي, ن' },
    { type: 'example', arabic: 'تُوتٌ', translit: 'tūt', english: 'mulberries: ت, و, ت' },
  ],
  cultureTip: {
    title: 'Please, to a man or a woman',
    body: 'Arabic speaks to a man and to a woman in slightly different words. “Please” is مِنْ فَضْلِكَ to a man and مِنْ فَضْلِكِ to a woman: only the last vowel changes. People will understand you either way, and getting it right is a nice touch.',
  },
};
