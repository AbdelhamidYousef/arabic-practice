import type { ContentLesson } from '../types.ts';

// A2 L50: plan a trip, compare options. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L50: C41, G45; no culture item, so a short practical tip). The owner
// reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-plan-trip',
  unit: 'A2.3',
  kind: 'lesson',
  title: 'Planning a trip',
  topic: 'Bus, train or plane?',
  summary: 'Compare ways to travel by price, time and comfort, and say when each one arrives.',
  goals: [
    'Compare options with أَرْخَصُ، أَسْرَعُ، أَغْلَى',
    'Use weak-start verbs: وَصَلَ → يَصِلُ',
    'Say which option you prefer and why',
  ],
  grammarFocus: 'Verbs that start with و drop it in the present: وَصَلَ → يَصِلُ، وَجَدَ → يَجِدُ.',
  scenario:
    'You are Laila, the learner’s flatmate in Cairo. You are both planning a trip to Luxor next ' +
    'month and comparing the bus, the train and the plane: price, time and comfort. Ask which they ' +
    'prefer and why, and say when each option arrives. Use weak-start verbs (يَصِلُ، يَقِفُ، نَجِدُ) ' +
    'and comparatives (أَسْرَعُ، أَرْخَصُ، أَغْلَى). ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'سَنُسَافِرُ إِلَى الْأُقْصُرِ الشَّهْرَ الْقَادِمَ. أَتُفَضِّلُ الْحَافِلَةَ أَمِ الطَّائِرَةَ؟',
  vocab: [
    {
      arabic: 'وَصَلَ',
      translit: 'waṣala',
      english: 'he arrived',
      note: 'Present: يَصِلُ (yaṣilu).',
    },
    {
      arabic: 'وَجَدَ',
      translit: 'wajada',
      english: 'he found',
      note: 'Present: يَجِدُ (yajidu).',
    },
    {
      arabic: 'وَقَفَ',
      translit: 'waqafa',
      english: 'he stopped, he stood',
      note: 'Present: يَقِفُ (yaqifu).',
    },
    {
      arabic: 'وَضَعَ',
      translit: 'waḍaʿa',
      english: 'he put',
      note: 'Present: يَضَعُ (yaḍaʿu).',
    },
    { arabic: 'حَافِلَةٌ', translit: 'ḥāfila', english: 'bus' },
    { arabic: 'طَائِرَةٌ', translit: 'ṭāʾira', english: 'plane' },
    { arabic: 'أَسْرَعُ', translit: 'asraʿ', english: 'faster' },
    { arabic: 'أَرْخَصُ', translit: 'arkhaṣ', english: 'cheaper' },
    { arabic: 'أَغْلَى', translit: 'aghlā', english: 'more expensive' },
    { arabic: 'أَفْضَلُ', translit: 'afḍal', english: 'better' },
    { arabic: 'مُرِيحٌ', translit: 'murīḥ', english: 'comfortable' },
    {
      arabic: 'مُبَاشِرٌ',
      translit: 'mubāshir',
      english: 'direct',
      note: 'A direct flight: رِحْلَةٌ مُبَاشِرَةٌ.',
    },
    { arabic: 'مُدَّةٌ', translit: 'mudda', english: 'duration' },
    { arabic: 'مَسَافَةٌ', translit: 'masāfa', english: 'distance' },
    { arabic: 'خِيَارٌ', translit: 'khiyār', english: 'option' },
    {
      arabic: 'اسْتَغْرَقَ',
      translit: 'istaghraqa',
      english: 'it took (time)',
      note: 'Present: يَسْتَغْرِقُ (yastaghriqu): تَسْتَغْرِقُ الرِّحْلَةُ سَاعَةً.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “The plane arrives at ten”?',
      options: ['وَصَلَتِ الطَّائِرَةُ فِي الْعَاشِرَةِ.', 'تَصِلُ الطَّائِرَةُ فِي الْعَاشِرَةِ.', 'تَقِفُ الطَّائِرَةُ فِي الْعَاشِرَةِ.'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which word means “cheaper”?',
      options: ['أَغْلَى', 'أَسْرَعُ', 'أَرْخَصُ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'لِمَاذَا تُفَضِّلُ الْقِطَارَ؟',
      options: ['لِأَنَّهُ أَرْخَصُ مِنَ الطَّائِرَةِ.', 'سَأَصِلُ غَدًا.', 'وَضَعْتُ الْحَقِيبَةَ هُنَا.'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'لَا أَجِدُ تَذْكِرَتِي',
      options: ['وَجَدْتُ تَذْكِرَتِي', 'لَا أَجِدُ تَذْكِرَتِي', 'لَا تَضَعْ تَذْكِرَتَكَ هُنَا'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'الرِّحْلَةُ مُبَاشِرَةٌ',
      options: ['الرِّحْلَةُ مُرِيحَةٌ', 'الرِّحْلَةُ طَوِيلَةٌ', 'الرِّحْلَةُ مُبَاشِرَةٌ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'حَافِلَةٌ', english: 'bus' },
        { arabic: 'مُدَّةٌ', english: 'duration' },
        { arabic: 'مَسَافَةٌ', english: 'distance' },
        { arabic: 'خِيَارٌ', english: 'option' },
        { arabic: 'مُرِيحٌ', english: 'comfortable' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each present verb with its meaning.',
      pairs: [
        { arabic: 'يَصِلُ', english: 'he arrives' },
        { arabic: 'يَجِدُ', english: 'he finds' },
        { arabic: 'يَقِفُ', english: 'he stops' },
        { arabic: 'يَضَعُ', english: 'he puts' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The bus arrives in the morning.',
      words: ['تَصِلُ', 'الْحَافِلَةُ', 'صَبَاحًا'],
      distractors: ['يَصِلُ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The train is faster than the bus.',
      words: ['الْقِطَارُ', 'أَسْرَعُ', 'مِنَ', 'الْحَافِلَةِ'],
      distractors: ['أَغْلَى'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'كَمْ سَاعَةً',
      after: 'الرِّحْلَةُ بِالْقِطَارِ؟',
      english: 'How many hours does the trip by train take?',
      options: ['تَصِلُ', 'تَسْتَغْرِقُ', 'تَجِدُ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَيْنَ',
      after: 'الْحَقَائِبَ؟',
      english: 'Where do we put the suitcases?',
      options: ['نَضَعُ', 'نَصِلُ', 'وَضَعَ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'الطَّائِرَةُ',
      after: 'مِنَ الْحَافِلَةِ، لَكِنَّهَا أَسْرَعُ.',
      english: 'The plane is more expensive than the bus, but it is faster.',
      options: ['أَرْخَصُ', 'أَبْطَأُ', 'أَغْلَى'],
      answer: 2,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'Many verbs that start with و drop it in the present: وَصَلَ (he arrived) → يَصِلُ (he arrives). The past is regular: وَصَلْتُ، وَصَلْنَا.',
    },
    {
      type: 'table',
      head: ['Past', 'Present', 'Meaning'],
      rows: [
        ['وَصَلَ', 'يَصِلُ', 'to arrive'],
        ['وَجَدَ', 'يَجِدُ', 'to find'],
        ['وَقَفَ', 'يَقِفُ', 'to stop, to stand'],
        ['وَضَعَ', 'يَضَعُ', 'to put'],
      ],
    },
    {
      type: 'table',
      head: ['Person', 'Present of وَصَلَ'],
      rows: [
        ['I', 'أَصِلُ'],
        ['you (m)', 'تَصِلُ'],
        ['you (f)', 'تَصِلِينَ'],
        ['he', 'يَصِلُ'],
        ['she', 'تَصِلُ'],
        ['we', 'نَصِلُ'],
        ['they', 'يَصِلُونَ'],
      ],
    },
    {
      type: 'example',
      arabic: 'يَصِلُ الْقِطَارُ الْآنَ.',
      translit: 'yaṣilu l-qiṭāru l-ān.',
      english: 'The train is arriving now.',
    },
    {
      type: 'example',
      arabic: 'مَتَى تَصِلُ الْحَافِلَةُ إِلَى الْأُقْصُرِ؟',
      translit: 'matā taṣilu l-ḥāfilatu ilā l-uqṣur?',
      english: 'When does the bus arrive in Luxor?',
    },
    {
      type: 'p',
      text: 'To compare, use the أَفْعَلُ form with مِنْ, as in A2.1: الْقِطَارُ أَرْخَصُ مِنَ الطَّائِرَةِ (the train is cheaper than the plane).',
    },
  ],
  cultureTip: {
    title: 'Getting around Egypt',
    body: 'From Cairo to Luxor or Aswan you can fly in about an hour, take the train along the Nile for most of a day or a night, or ride a long-distance bus. Many travellers pick the train: it costs much less than flying, and you watch the villages, palm trees and fields go by.',
  },
};
