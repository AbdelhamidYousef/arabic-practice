import type { ContentLesson } from '../types.ts';

// A0-08: ف ق ك ل and the lām-alif لا, and asking where something is, by ear. Made-up for this app
// from the Classroom plan (curriculum/a0.md); the owner reviews the Arabic before real learners
// see it.
export const lesson: ContentLesson = {
  slug: 'a0-letters-fa-lam',
  unit: 'A0.2',
  kind: 'letters',
  title: 'Dots that count: ف ق ك ل',
  topic: 'Four new letters, the lām-alif, and asking where things are',
  summary: 'Read ف ق ك ل and لا, tell قَلْبٌ from كَلْبٌ, and ask “Where is…?”.',
  goals: [
    'Recognise ف ق ك ل, and لا, the lām and alif joined',
    'Read words like فِيلٌ، كِتَابٌ، قَلْبٌ، كَلْبٌ، فُنْدُقٌ',
    'Ask where something is and understand “here” and “there”',
  ],
  grammarFocus: 'ف has one dot and ق two; ل followed by ا is always written لا.',
  scenario:
    'You are Omar, a friendly man in a street in downtown Cairo. The learner is looking for places ' +
    'and asks you where they are. Answer with here or there, and ask simple yes-or-no questions. ' +
    'Use only two to four words per sentence and only words from the lessons so far: where, here, ' +
    'there, the hotel, greetings, sorry, thank you, yes, no. Reply only in Arabic with full ' +
    'harakat, one short question at a time, and never correct the learner yourself: a separate ' +
    'step does that.',
  openingLine: 'مَرْحَبًا! أَنَا عُمَرُ.',
  vocab: [
    { arabic: 'فِيلٌ', translit: 'fīl', english: 'elephant', note: 'ف: one dot above.' },
    { arabic: 'كِتَابٌ', translit: 'kitāb', english: 'book' },
    {
      arabic: 'قَلْبٌ',
      translit: 'qalb',
      english: 'heart',
      note: 'ق: two dots, said deep in the throat.',
    },
    { arabic: 'كَلْبٌ', translit: 'kalb', english: 'dog', note: 'ك: a plain k.' },
    { arabic: 'فُنْدُقٌ', translit: 'funduq', english: 'hotel' },
    { arabic: 'أَيْنَ', translit: 'ayna', english: 'where?' },
    { arabic: 'هُنَا', translit: 'hunā', english: 'here' },
    { arabic: 'هُنَاكَ', translit: 'hunāka', english: 'there' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which letter has two dots above it?',
      options: ['ف', 'ق', 'ك'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which letter makes the sound “f”?',
      options: ['ك', 'ل', 'ف', 'ق'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which one is lām and alif joined together?',
      options: ['لَا', 'كَا', 'فَا'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which letter does this word start with?',
      promptArabic: 'قَلْبٌ',
      options: ['ك', 'ف', 'ق'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which word means “dog”?',
      options: ['قَلْبٌ', 'كَلْبٌ', 'كِتَابٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'قَلْبٌ',
      options: ['قَلْبٌ', 'كَلْبٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'فُنْدُقٌ',
      options: ['فِيلٌ', 'كِتَابٌ', 'فُنْدُقٌ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each Arabic word with its meaning.',
      pairs: [
        { arabic: 'فِيلٌ', english: 'elephant' },
        { arabic: 'كِتَابٌ', english: 'book' },
        { arabic: 'فُنْدُقٌ', english: 'hotel' },
        { arabic: 'هُنَا', english: 'here' },
      ],
    },
    {
      type: 'build',
      prompt: 'Put the words in order.',
      english: 'Where is the hotel?',
      words: ['أَيْنَ', 'الْفُنْدُقُ'],
      distractors: ['هُنَا'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'الْفُنْدُقُ',
      after: '',
      english: 'The hotel is here.',
      options: ['هُنَا', 'أَيْنَ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'ف and ق share a body: ف has one dot, ق has two, and at the end of a word ق dips deeper below the line. ك and ل are new shapes. All four join on both sides.',
    },
    {
      type: 'table',
      head: ['Letter', 'Sound', 'Alone', 'Start', 'Middle', 'End'],
      rows: [
        ['ف fāʾ', 'f', 'ف', 'فـ', 'ـفـ', 'ـف'],
        ['ق qāf', 'q, a k from deep in the throat', 'ق', 'قـ', 'ـقـ', 'ـق'],
        ['ك kāf', 'k', 'ك', 'كـ', 'ـكـ', 'ـك'],
        ['ل lām', 'l', 'ل', 'لـ', 'ـلـ', 'ـل'],
      ],
    },
    {
      type: 'p',
      text: 'When ل is followed by ا the two are always written as one shape: لا. You met it as the word “no”.',
    },
    { type: 'example', arabic: 'لَا', translit: 'lā', english: 'no: ل and ا in one shape' },
    { type: 'example', arabic: 'قَلْبٌ', translit: 'qalb', english: 'heart: q from the throat' },
    { type: 'example', arabic: 'كَلْبٌ', translit: 'kalb', english: 'dog: a plain k' },
  ],
  cultureTip: {
    title: 'Asking the way',
    body: 'Two words are enough to find a place: أَيْنَ and the place, for example أَيْنَ الْفُنْدُقُ؟ “Where is the hotel?”. People in Cairo are quick to help, often with a pointed hand and هُنَا or هُنَاكَ, and sometimes they walk you part of the way.',
  },
};
