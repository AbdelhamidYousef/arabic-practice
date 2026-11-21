import type { ContentLesson } from '../types.ts';

// A1 L06: small talk over coffee. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L06: C04, G06, G07, G08, K04); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-small-talk',
  unit: 'A1.1',
  kind: 'lesson',
  title: 'Coffee and small talk',
  topic: 'Chatting over coffee and paying the bill',
  summary: 'React to what someone says, describe things with simple adjectives and offer to pay.',
  goals: [
    'Tell masculine and feminine words apart',
    'Put an adjective after its noun, in the same gender',
    'Point at things with هٰذَا and هٰذِهِ',
  ],
  grammarFocus: 'The adjective follows the noun and takes its gender: مَكَانٌ جَمِيلٌ, قَهْوَةٌ لَذِيذَةٌ.',
  scenario:
    'You are Karim, the learner’s local guide in Cairo, having coffee with them in a café near the ' +
    'Nile. Make small talk: say what you think of the coffee, the café and the view (beautiful, new, ' +
    'old, big, small, delicious), react to what the learner says (really? great!) and, at the end, ' +
    'playfully insist on paying the bill. Use very short sentences without verbs, هٰذَا / هٰذِهِ, ' +
    'adjectives after the noun and only words from the lesson. Reply only in Arabic with full ' +
    'harakat, ask one short question at a time, and never correct the learner yourself: a separate ' +
    'step does that.',
  openingLine: 'هٰذَا مَقْهًى جَمِيلٌ! كَيْفَ الْقَهْوَةُ؟',
  vocab: [
    { arabic: 'جَمِيلٌ', translit: 'jamīl', english: 'beautiful, nice' },
    { arabic: 'جَدِيدٌ', translit: 'jadīd', english: 'new' },
    { arabic: 'قَدِيمٌ', translit: 'qadīm', english: 'old (for things)' },
    { arabic: 'كَبِيرٌ', translit: 'kabīr', english: 'big' },
    { arabic: 'صَغِيرٌ', translit: 'ṣaghīr', english: 'small' },
    { arabic: 'لَذِيذٌ', translit: 'ladhīdh', english: 'delicious' },
    { arabic: 'مَقْهًى', translit: 'maqhā', english: 'café' },
    { arabic: 'مَكَانٌ', translit: 'makān', english: 'place' },
    { arabic: 'نَهْرُ النِّيلِ', translit: 'nahr an-nīl', english: 'the River Nile' },
    { arabic: 'هٰذَا', translit: 'hādhā', english: 'this (masculine)' },
    { arabic: 'هٰذِهِ', translit: 'hādhihi', english: 'this (feminine)' },
    {
      arabic: 'حَقًّا',
      translit: 'ḥaqqan',
      english: 'really',
      note: 'Said with a rising voice, حَقًّا؟ is “Really?”.',
    },
    { arabic: 'رَائِعٌ', translit: 'rāʾiʿ', english: 'great, wonderful' },
    { arabic: 'حِسَابٌ', translit: 'ḥisāb', english: 'bill, check' },
    {
      arabic: 'أَنَا أَدْفَعُ',
      translit: 'anā adfaʿ',
      english: 'I’m paying',
      note: 'When the bill comes, everyone says it.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word is feminine?',
      options: ['مَكَانٌ', 'قَهْوَةٌ', 'مَقْهًى'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick the right phrase: “a new city”.',
      options: ['جَدِيدَةٌ مَدِينَةٌ', 'مَدِينَةٌ جَدِيدٌ', 'مَدِينَةٌ جَدِيدَةٌ'],
      answer: 2,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'قَهْوَةٌ لَذِيذَةٌ.',
      english: 'This is a delicious coffee.',
      options: ['هٰذَا', 'هٰذِهِ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هٰذَا مَكَانٌ',
      after: '',
      english: 'This is a beautiful place.',
      options: ['جَمِيلٌ', 'جَمِيلَةٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'هٰذَا مَقْهًى صَغِيرٌ',
      options: ['هٰذَا مَقْهًى كَبِيرٌ', 'هٰذَا مَقْهًى صَغِيرٌ', 'هٰذَا مَقْهًى جَدِيدٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'الْحِسَابُ، مِنْ فَضْلِكَ',
      options: ['الْحِسَابُ، مِنْ فَضْلِكَ', 'قَهْوَةٌ، مِنْ فَضْلِكَ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'كَبِيرٌ', english: 'big' },
        { arabic: 'صَغِيرٌ', english: 'small' },
        { arabic: 'قَدِيمٌ', english: 'old' },
        { arabic: 'رَائِعٌ', english: 'great' },
        { arabic: 'لَذِيذٌ', english: 'delicious' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'This is a big city.',
      words: ['هٰذِهِ', 'مَدِينَةٌ', 'كَبِيرَةٌ'],
      distractors: ['هٰذَا', 'كَبِيرٌ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The coffee is delicious.',
      words: ['الْقَهْوَةُ', 'لَذِيذَةٌ'],
      distractors: ['لَذِيذٌ'],
    },
    {
      type: 'build',
      prompt: 'Build the phrase.',
      english: 'a new phone',
      words: ['هَاتِفٌ', 'جَدِيدٌ'],
      distractors: ['جَدِيدَةٌ'],
    },
    {
      type: 'choose',
      prompt: 'Your friend says the coffee is great. How do you react?',
      promptArabic: 'الْقَهْوَةُ رَائِعَةٌ!',
      options: ['بِكَمْ؟', 'حَقًّا؟', 'مِنْ أَيْنَ أَنْتَ؟'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Karim reaches for the bill. What do you say?',
      options: ['أَنَا أَدْفَعُ!', 'هٰذَا جَمِيلٌ', 'لَا أَفْهَمُ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'Most feminine words end in ة (-a). A describing word (an adjective) adds the same ة when its noun is feminine.',
    },
    {
      type: 'table',
      head: ['Masculine', 'Feminine', 'Meaning'],
      rows: [
        ['جَدِيدٌ', 'جَدِيدَةٌ', 'new'],
        ['كَبِيرٌ', 'كَبِيرَةٌ', 'big'],
        ['لَذِيذٌ', 'لَذِيذَةٌ', 'delicious'],
      ],
    },
    {
      type: 'p',
      text: 'The adjective comes after the noun, the other way round from English: “a place beautiful”.',
    },
    { type: 'example', arabic: 'مَكَانٌ جَمِيلٌ', translit: 'makān jamīl', english: 'a beautiful place' },
    {
      type: 'example',
      arabic: 'قَهْوَةٌ لَذِيذَةٌ',
      translit: 'qahwa ladhīdha',
      english: 'a delicious coffee',
    },
    {
      type: 'p',
      text: 'Point with هٰذَا (hādhā) at a masculine word and with هٰذِهِ (hādhihi) at a feminine one: هٰذَا مَقْهًى (this is a café), هٰذِهِ مَدِينَةٌ كَبِيرَةٌ (this is a big city). With الـ the meaning changes: هٰذَا الْمَقْهَى is “this café”. The small upright stroke over the ه is a long ā.',
    },
  ],
  cultureTip: {
    title: 'The Nile is “the sea”; the bill fight',
    body: 'In everyday talk many Egyptians call the Nile الْبَحْرُ, “the sea”, so “going to the sea” in Cairo can mean a walk by the river. And when the bill comes, expect a friendly fight: everyone insists on paying, often reaching for it at the same time. Offer once or twice; if your host insists, thank them and pay next time.',
  },
};
