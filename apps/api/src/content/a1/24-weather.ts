import type { ContentLesson } from '../types.ts';

// A1 L24: the weather and the seasons. Made-up for this app from the Classroom plan
// (curriculum/msa/a1.md, L24: C19, G21); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-weather',
  unit: 'A1.3',
  kind: 'lesson',
  title: 'The weather and the seasons',
  topic: 'A hot day in Cairo, and the weather back home',
  summary: 'Talk about the weather and the four seasons, and say what something is not.',
  goals: [
    'Say what the weather is like today: hot, cold, sunny',
    'Name the four seasons and say what they are like',
    'Say “is not” with لَيْسَ: الْجَوُّ لَيْسَ بَارِدًا',
  ],
  grammarFocus: '“Not” in a sentence without a verb: لَيْسَ، لَسْتُ، لَيْسَتْ.',
  scenario:
    'You are Karim, a colleague of the learner in Cairo, chatting on a very hot day. Talk about ' +
    'the weather today, the seasons in Cairo (a hot summer, a mild winter, the spring sandstorms), ' +
    'and ask about the weather in the learner’s country. Use لَيْسَ in some of your answers. ' +
    'Use very short sentences and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'صَبَاحُ الْخَيْرِ! الْجَوُّ حَارٌّ جِدًّا الْيَوْمَ. هَلِ الْجَوُّ حَارٌّ فِي بَلَدِكَ؟',
  vocab: [
    { arabic: 'الطَّقْسُ', translit: 'aṭ-ṭaqs', english: 'the weather' },
    {
      arabic: 'الْجَوُّ',
      translit: 'al-jaww',
      english: 'the weather, the air',
      note: 'The everyday word in “the weather is hot”: الْجَوُّ حَارٌّ.',
    },
    { arabic: 'حَارٌّ', translit: 'ḥārr', english: 'hot' },
    { arabic: 'بَارِدٌ', translit: 'bārid', english: 'cold' },
    { arabic: 'دَافِئٌ', translit: 'dāfiʾ', english: 'warm' },
    { arabic: 'مُعْتَدِلٌ', translit: 'muʿtadil', english: 'mild' },
    { arabic: 'مُشْمِسٌ', translit: 'mushmis', english: 'sunny' },
    { arabic: 'مَطَرٌ', translit: 'maṭar', english: 'rain' },
    { arabic: 'رِيَاحٌ', translit: 'riyāḥ', english: 'wind, winds' },
    { arabic: 'عَاصِفَةٌ رَمْلِيَّةٌ', translit: 'ʿāṣifa ramliyya', english: 'sandstorm' },
    { arabic: 'دَرَجَةُ الْحَرَارَةِ', translit: 'darajat al-ḥarāra', english: 'temperature' },
    { arabic: 'الصَّيْفُ', translit: 'aṣ-ṣayf', english: 'summer' },
    { arabic: 'الْخَرِيفُ', translit: 'al-kharīf', english: 'autumn' },
    { arabic: 'الشِّتَاءُ', translit: 'ash-shitāʾ', english: 'winter' },
    { arabic: 'الرَّبِيعُ', translit: 'ar-rabīʿ', english: 'spring' },
    { arabic: 'لَيْسَ', translit: 'laysa', english: 'is not' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “winter”?',
      options: ['الصَّيْفُ', 'الشِّتَاءُ', 'الرَّبِيعُ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick the correct sentence: “The weather is not cold.”',
      options: ['الْجَوُّ لَيْسَ بَارِدٌ', 'الْجَوُّ لَسْتُ بَارِدًا', 'الْجَوُّ لَيْسَ بَارِدًا'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'مُشْمِسٌ',
      options: ['مُشْمِسٌ', 'مُعْتَدِلٌ', 'مَطَرٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'الْجَوُّ بَارِدٌ فِي الشِّتَاءِ',
      options: ['الْجَوُّ حَارٌّ فِي الصَّيْفِ', 'الْجَوُّ بَارِدٌ فِي الشِّتَاءِ', 'الْجَوُّ دَافِئٌ فِي الرَّبِيعِ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'حَارٌّ', english: 'hot' },
        { arabic: 'بَارِدٌ', english: 'cold' },
        { arabic: 'دَافِئٌ', english: 'warm' },
        { arabic: 'مُعْتَدِلٌ', english: 'mild' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each season with its meaning.',
      pairs: [
        { arabic: 'الصَّيْفُ', english: 'summer' },
        { arabic: 'الشِّتَاءُ', english: 'winter' },
        { arabic: 'الرَّبِيعُ', english: 'spring' },
        { arabic: 'الْخَرِيفُ', english: 'autumn' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I am not busy today.',
      words: ['لَسْتُ', 'مَشْغُولًا', 'الْيَوْمَ'],
      distractors: ['لَيْسَ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The weather is very hot in the summer.',
      words: ['الْجَوُّ', 'حَارٌّ', 'جِدًّا', 'فِي', 'الصَّيْفِ'],
      distractors: ['بَارِدٌ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'She is not here.',
      words: ['هِيَ', 'لَيْسَتْ', 'هُنَا'],
      distractors: ['لَسْتُ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'الطَّقْسُ',
      after: 'حَارًّا الْيَوْمَ.',
      english: 'The weather is not hot today.',
      options: ['لَيْسَتْ', 'لَيْسَ', 'لَسْنَا'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'نَحْنُ',
      after: 'فِي الْبَيْتِ.',
      english: 'We are not at home.',
      options: ['لَسْتُمْ', 'لَيْسُوا', 'لَسْنَا'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'كَيْفَ الطَّقْسُ الْيَوْمَ؟',
      options: ['الْجَوُّ مُشْمِسٌ وَدَافِئٌ', 'أَنَا بِخَيْرٍ', 'فِي الصَّيْفِ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'A sentence without a verb (الْجَوُّ حَارٌّ, “the weather is hot”) says “not” with لَيْسَ. It changes with the person, like a verb.',
    },
    {
      type: 'table',
      head: ['Who', 'Arabic', 'Say', 'Meaning'],
      rows: [
        ['I', 'لَسْتُ', 'lastu', 'I am not'],
        ['you (m)', 'لَسْتَ', 'lasta', 'you are not'],
        ['you (f)', 'لَسْتِ', 'lasti', 'you are not'],
        ['he, it', 'لَيْسَ', 'laysa', 'he is not, it is not'],
        ['she, it', 'لَيْسَتْ', 'laysat', 'she is not, it is not'],
        ['we', 'لَسْنَا', 'lasnā', 'we are not'],
        ['you (plural)', 'لَسْتُمْ', 'lastum', 'you are not'],
        ['they', 'لَيْسُوا', 'laysū', 'they are not'],
      ],
    },
    {
      type: 'p',
      text: 'After لَيْسَ, the describing word ends in -an instead of -un: حَارٌّ becomes حَارًّا. A place word such as هُنَا or فِي الْبَيْتِ does not change.',
    },
    {
      type: 'example',
      arabic: 'الْجَوُّ لَيْسَ حَارًّا الْيَوْمَ.',
      translit: 'al-jawwu laysa ḥārran al-yawm',
      english: 'The weather is not hot today.',
    },
    {
      type: 'example',
      arabic: 'لَسْتُ مَشْغُولًا.',
      translit: 'lastu mashghūlan',
      english: 'I am not busy.',
    },
    {
      type: 'example',
      arabic: 'هِيَ لَيْسَتْ هُنَا.',
      translit: 'hiya laysat hunā',
      english: 'She is not here.',
    },
  ],
  cultureTip: {
    title: 'Cairo’s seasons',
    body: 'Cairo has a long, hot and dry summer, a short mild winter with cool nights, and almost no rain. In spring, hot winds can bring sandstorms for a few days. In summer, people go out in the evening, when it is cooler, and stay out late.',
  },
};
