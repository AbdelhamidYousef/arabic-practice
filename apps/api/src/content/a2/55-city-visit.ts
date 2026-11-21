import type { ContentLesson } from '../types.ts';

// A2 L55: describe a city you visited or want to visit. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L55: C45, K17). The plan has no grammar item for this lesson, so the note
// covers describing places (adjective agreement, plurals of things). The owner reviews the Arabic
// before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-city-visit',
  unit: 'A2.3',
  kind: 'lesson',
  title: 'Describing a city',
  topic: 'Amman, Marrakech and your own city',
  summary:
    'Describe a city you visited or want to visit: its streets, markets, weather and people.',
  goals: [
    'Describe a city with the right adjectives',
    'Say what a place was like and what you will see there',
    'Ask someone about a city they know',
  ],
  grammarFocus:
    'Describing places: adjectives agree with their noun, and plurals of things take a feminine singular adjective (شَوَارِعُ ضَيِّقَةٌ).',
  scenario:
    'You are Salim, a made-up travel writer from Jordan whom the learner meets at a book café in ' +
    'Cairo. Describe Amman (its hills, old and new streets, the Roman theatre, the markets) and ask ' +
    'the learner about a city they visited or want to visit: what it is like, its weather, its ' +
    'markets. Use adjectives with the right agreement (شَوَارِعُ ضَيِّقَةٌ، مَدِينَةٌ هَادِئَةٌ) and ' +
    'كَانَ or سَـ for past and future visits. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'هَلْ زُرْتَ عَمَّانَ؟ هِيَ عَاصِمَةُ الْأُرْدُنِّ، وَمَدِينَةٌ جَمِيلَةٌ عَلَى جِبَالٍ كَثِيرَةٍ.',
  vocab: [
    { arabic: 'عَاصِمَةٌ', translit: 'ʿāṣima', english: 'capital city' },
    { arabic: 'بَلَدٌ', translit: 'balad', english: 'country' },
    { arabic: 'مِنْطَقَةٌ', translit: 'minṭaqa', english: 'area, region' },
    {
      arabic: 'الْمَدِينَةُ الْقَدِيمَةُ',
      translit: 'al-madīna al-qadīma',
      english: 'the old city',
    },
    { arabic: 'شَارِعٌ', translit: 'shāriʿ', english: 'street', note: 'Plural: شَوَارِعُ.' },
    { arabic: 'سُوقٌ', translit: 'sūq', english: 'market', note: 'Plural: أَسْوَاقٌ.' },
    { arabic: 'جَبَلٌ', translit: 'jabal', english: 'mountain, hill', note: 'Plural: جِبَالٌ.' },
    { arabic: 'صَحْرَاءُ', translit: 'ṣaḥrāʾ', english: 'desert' },
    { arabic: 'آثَارٌ', translit: 'āthār', english: 'ruins, ancient sites' },
    { arabic: 'مُنَاخٌ', translit: 'munākh', english: 'climate' },
    { arabic: 'سُكَّانٌ', translit: 'sukkān', english: 'inhabitants, population' },
    { arabic: 'ضَيِّقٌ', translit: 'ḍayyiq', english: 'narrow' },
    { arabic: 'وَاسِعٌ', translit: 'wāsiʿ', english: 'wide' },
    { arabic: 'مُزْدَحِمٌ', translit: 'muzdaḥim', english: 'crowded' },
    { arabic: 'هَادِئٌ', translit: 'hādiʾ', english: 'quiet' },
    { arabic: 'قَدِيمٌ', translit: 'qadīm', english: 'old' },
    { arabic: 'حَدِيثٌ', translit: 'ḥadīth', english: 'modern' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “The streets are narrow”?',
      options: ['الشَّارِعُ ضَيِّقٌ.', 'الشَّوَارِعُ ضَيِّقَةٌ.', 'الشَّوَارِعُ وَاسِعَةٌ.'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which word means “capital city”?',
      options: ['مِنْطَقَةٌ', 'صَحْرَاءُ', 'عَاصِمَةٌ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'كَيْفَ كَانَ الْجَوُّ فِي مَرَّاكُشَ؟',
      options: ['كَانَ حَارًّا وَمُشْمِسًا.', 'هِيَ فِي الْمَغْرِبِ.', 'سَأَزُورُهَا السَّنَةَ الْقَادِمَةَ.'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'You describe a place with a lot of people. Which word do you use?',
      options: ['هَادِئٌ', 'مُزْدَحِمٌ', 'وَاسِعٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'الْمَدِينَةُ الْقَدِيمَةُ هَادِئَةٌ',
      options: ['الْمَدِينَةُ الْحَدِيثَةُ مُزْدَحِمَةٌ', 'الْمَدِينَةُ الْقَدِيمَةُ مُزْدَحِمَةٌ', 'الْمَدِينَةُ الْقَدِيمَةُ هَادِئَةٌ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'فِي الْأُرْدُنِّ جِبَالٌ وَصَحْرَاءُ',
      options: ['فِي الْأُرْدُنِّ جِبَالٌ وَصَحْرَاءُ', 'فِي مِصْرَ نَهْرٌ وَصَحْرَاءُ', 'فِي الْمَغْرِبِ جِبَالٌ وَبَحْرٌ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'جَبَلٌ', english: 'mountain' },
        { arabic: 'صَحْرَاءُ', english: 'desert' },
        { arabic: 'سُوقٌ', english: 'market' },
        { arabic: 'آثَارٌ', english: 'ruins' },
        { arabic: 'مُنَاخٌ', english: 'climate' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each adjective with its meaning.',
      pairs: [
        { arabic: 'ضَيِّقٌ', english: 'narrow' },
        { arabic: 'وَاسِعٌ', english: 'wide' },
        { arabic: 'مُزْدَحِمٌ', english: 'crowded' },
        { arabic: 'هَادِئٌ', english: 'quiet' },
        { arabic: 'حَدِيثٌ', english: 'modern' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The markets in Marrakech are old and crowded.',
      words: ['الْأَسْوَاقُ', 'فِي', 'مَرَّاكُشَ', 'قَدِيمَةٌ', 'وَمُزْدَحِمَةٌ'],
      distractors: ['قَدِيمٌ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I want to visit Amman next year.',
      words: ['أُرِيدُ', 'أَنْ', 'أَزُورَ', 'عَمَّانَ', 'السَّنَةَ', 'الْقَادِمَةَ'],
      distractors: ['أَزُورُ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'الْقَاهِرَةُ مَدِينَةٌ كَبِيرَةٌ، وَشَوَارِعُهَا',
      after: 'دَائِمًا.',
      english: 'Cairo is a big city, and its streets are always crowded.',
      options: ['مُزْدَحِمٌ', 'مُزْدَحِمَةٌ', 'هَادِئَةٌ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'كَانَ',
      after: 'فِي الْمَغْرِبِ لَطِيفًا.',
      english: 'The climate in Morocco was pleasant.',
      options: ['الْمُنَاخُ', 'الْجِبَالُ', 'الصَّحْرَاءُ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'An adjective comes after its noun and agrees with it: masculine or feminine, with الـ or without, and in the same case.',
    },
    {
      type: 'example',
      arabic: 'مَدِينَةٌ هَادِئَةٌ',
      translit: 'madīna hādiʾa',
      english: 'a quiet city',
    },
    {
      type: 'example',
      arabic: 'الْمَدِينَةُ الْقَدِيمَةُ',
      translit: 'al-madīna al-qadīma',
      english: 'the old city',
    },
    {
      type: 'p',
      text: 'Plurals of things (not people) take a feminine singular adjective. Listen for the ـَةٌ: it is one of the most common slips.',
    },
    {
      type: 'table',
      head: ['Plural noun', 'Adjective', 'Meaning'],
      rows: [
        ['شَوَارِعُ', 'ضَيِّقَةٌ', 'narrow streets'],
        ['أَسْوَاقٌ', 'قَدِيمَةٌ', 'old markets'],
        ['جِبَالٌ', 'عَالِيَةٌ', 'high mountains'],
        ['مُدُنٌ', 'كَبِيرَةٌ', 'big cities'],
      ],
    },
    {
      type: 'p',
      text: 'For people, the adjective is plural: سُكَّانٌ طَيِّبُونَ (kind inhabitants).',
    },
  ],
  cultureTip: {
    title: 'Twenty-two countries, one written language',
    body: 'Arabic is an official language in the 22 member countries of the Arab League, from Morocco on the Atlantic to Oman on the Arabian Sea. People speak very different dialects at home, but newspapers, books, signs and the news are written in the Modern Standard Arabic you are learning, so a text from Amman reads much like one from Marrakech.',
  },
};
