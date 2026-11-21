import type { ContentLesson } from '../types.ts';

// A1 L12: walking downtown. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L12: C79, G09); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-downtown',
  unit: 'A1.1',
  kind: 'lesson',
  title: 'Walking downtown',
  topic: 'Pointing at places in central Cairo',
  summary: 'Point at places downtown and say what you see, using الـ (the) the right way.',
  goals: [
    'Use الـ to say “the”',
    'Hear when the l of الـ blends into the next letter',
    'Name places in town and say what you see',
  ],
  grammarFocus: 'الـ means “the”; before a sun letter its l blends in: الشَّارِعُ (ash-shāriʿ).',
  scenario:
    'You are Karim, the learner’s guide, walking with them out of the metro at Tahrir Square in ' +
    'downtown Cairo. Point at places (the square, the museum, the street, the bridge, the Nile, a ' +
    'mosque, a church, a restaurant, a park), name them with هٰذَا / هٰذِهِ and الـ, describe them ' +
    'with adjectives they know (big, small, old, new, beautiful) and ask what they see. Use very ' +
    'short sentences and only words from the lesson. Reply only in Arabic with full harakat, ask ' +
    'one short question at a time, and never correct the learner yourself: a separate step does that.',
  openingLine: 'هٰذَا مَيْدَانُ التَّحْرِيرِ! وَهٰذَا الْمَتْحَفُ الْمِصْرِيُّ. هَلْ تَرَى النِّيلَ؟',
  vocab: [
    { arabic: 'مَيْدَانٌ', translit: 'maydān', english: 'square (in a town)' },
    { arabic: 'شَارِعٌ', translit: 'shāriʿ', english: 'street' },
    { arabic: 'جِسْرٌ', translit: 'jisr', english: 'bridge' },
    { arabic: 'نَهْرٌ', translit: 'nahr', english: 'river' },
    { arabic: 'مَسْجِدٌ', translit: 'masjid', english: 'mosque' },
    { arabic: 'كَنِيسَةٌ', translit: 'kanīsa', english: 'church' },
    { arabic: 'مَتْحَفٌ', translit: 'matḥaf', english: 'museum' },
    { arabic: 'مَطْعَمٌ', translit: 'maṭʿam', english: 'restaurant' },
    { arabic: 'مَحَلٌّ', translit: 'maḥall', english: 'shop' },
    { arabic: 'بَنْكٌ', translit: 'bank', english: 'bank' },
    { arabic: 'مَبْنًى', translit: 'mabnā', english: 'building' },
    { arabic: 'حَدِيقَةٌ', translit: 'ḥadīqa', english: 'garden, park' },
    {
      arabic: 'أَرَى',
      translit: 'arā',
      english: 'I see',
      note: 'هَلْ تَرَى…؟ (hal tarā): do you see…? (to a man).',
    },
    { arabic: 'شَمْسٌ', translit: 'shams', english: 'sun' },
    { arabic: 'قَمَرٌ', translit: 'qamar', english: 'moon' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word starts with a sun letter?',
      options: ['قَمَرٌ', 'شَارِعٌ', 'مَتْحَفٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'How do you say “the street”?',
      options: ['شَارِعٌ', 'الشَّارِعُ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'In which word do you say the l of الـ?',
      options: ['النَّهْرُ', 'الشَّمْسُ', 'الْمَطْعَمُ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'الْمَسْجِدُ قَدِيمٌ',
      options: ['الْمَسْجِدُ قَدِيمٌ', 'الْمَتْحَفُ قَدِيمٌ', 'الْمَطْعَمُ قَدِيمٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'الْجِسْرُ كَبِيرٌ',
      options: ['النَّهْرُ كَبِيرٌ', 'الشَّارِعُ كَبِيرٌ', 'الْجِسْرُ كَبِيرٌ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each place with its meaning.',
      pairs: [
        { arabic: 'مَيْدَانٌ', english: 'square' },
        { arabic: 'جِسْرٌ', english: 'bridge' },
        { arabic: 'مَسْجِدٌ', english: 'mosque' },
        { arabic: 'مَطْعَمٌ', english: 'restaurant' },
        { arabic: 'حَدِيقَةٌ', english: 'park' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'This street is beautiful.',
      words: ['هٰذَا', 'الشَّارِعُ', 'جَمِيلٌ'],
      distractors: ['هٰذِهِ', 'جَمِيلَةٌ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I see the mosque.',
      words: ['أَرَى', 'الْمَسْجِدَ'],
      distractors: ['أَيْنَ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هٰذِهِ',
      after: 'كَبِيرَةٌ.',
      english: 'This park is big.',
      options: ['حَدِيقَةٌ', 'الْحَدِيقَةُ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَرَى',
      after: 'وَالنَّهْرَ.',
      english: 'I see the bridge and the river.',
      options: ['الْمَطْعَمَ', 'الشَّمْسَ', 'الْجِسْرَ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer.',
      promptArabic: 'أَيْنَ الْبَنْكُ؟',
      options: ['بِكُلِّ سُرُورٍ', 'هُنَاكَ، عَلَى الْيَمِينِ', 'رَأْسِي يُؤْلِمُنِي'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: '“The” is الـ (al-), joined to the front of the word. It is the same for every noun, masculine or feminine. A word with الـ loses its tanwin: مَتْحَفٌ → الْمَتْحَفُ.',
    },
    {
      type: 'p',
      text: 'Before 14 letters, the “sun letters” (ت ث د ذ ر ز س ش ص ض ط ظ ل ن), you do not say the l: it blends into the next letter, which is doubled, and a shadda shows it. Before the other 14, the “moon letters”, you say the l.',
    },
    {
      type: 'table',
      head: ['Letter', 'Written', 'Said', 'Meaning'],
      rows: [
        ['moon', 'الْقَمَرُ', 'al-qamar', 'the moon'],
        ['moon', 'الْمَتْحَفُ', 'al-matḥaf', 'the museum'],
        ['sun', 'الشَّمْسُ', 'ash-shams', 'the sun'],
        ['sun', 'الشَّارِعُ', 'ash-shāriʿ', 'the street'],
        ['sun', 'النَّهْرُ', 'an-nahr', 'the river'],
      ],
    },
    {
      type: 'example',
      arabic: 'هٰذَا الشَّارِعُ جَمِيلٌ',
      translit: 'hādhā sh-shāriʿ jamīl',
      english: 'This street is beautiful.',
    },
    {
      type: 'example',
      arabic: 'الْمَسْجِدُ قَدِيمٌ',
      translit: 'al-masjid qadīm',
      english: 'The mosque is old.',
    },
  ],
  cultureTip: {
    title: 'Tahrir Square and downtown',
    body: 'مَيْدَانُ التَّحْرِيرِ, Liberation Square, is the heart of downtown Cairo, close to the Nile and to the old Egyptian Museum with its famous pink-red building. Around it, wide streets of old buildings, cafés and shops make a good walk. Many signs are in Arabic and English, so it is a fine place to practise reading.',
  },
};
