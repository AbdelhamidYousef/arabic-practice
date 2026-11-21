import type { ContentLesson } from '../types.ts';

// A2 L35: buy clothes, colours, sizes, a return. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L35: C26, G35 + G36, V22). The owner reviews the Arabic before real
// learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-buying-clothes',
  unit: 'A2.1',
  kind: 'lesson',
  title: 'Buying clothes',
  topic: 'A shirt for a wedding',
  summary: 'Ask for a size and a colour, try clothes on, and take something back to the shop.',
  goals: [
    'Ask for a size, a colour and the price',
    'Say “every”, “all”, “some” and “a lot of”',
    'Use verbs that need a preposition, like “look for”',
  ],
  grammarFocus: 'كُلُّ، بَعْضُ، كَثِيرٌ مِنْ, and verbs with their preposition: أَبْحَثُ عَنْ قَمِيصٍ.',
  scenario:
    'You are Mona, a helpful shop assistant in a clothes shop in downtown Cairo. The learner is ' +
    'buying a shirt for a friend’s wedding: help with sizes, colours and prices, send them to the ' +
    'fitting room, and later handle a return with the receipt. Use كُلُّ، بَعْضُ، كَثِيرٌ مِنْ and ' +
    'verbs with their preposition (يَبْحَثُ عَنْ، يَحْتَاجُ إِلَى) in short A2 sentences with mostly ' +
    'words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا وَسَهْلًا! عِنْدَنَا تَخْفِيضَاتٌ الْيَوْمَ. عَمَّ تَبْحَثُ؟',
  vocab: [
    { arabic: 'مَقَاسٌ', translit: 'maqās', english: 'size' },
    { arabic: 'لَوْنٌ', translit: 'lawn', english: 'colour', note: 'Plural أَلْوَانٌ.' },
    { arabic: 'تَخْفِيضٌ', translit: 'takhfīḍ', english: 'discount, sale' },
    { arabic: 'فُسْتَانٌ', translit: 'fustān', english: 'dress', note: 'Plural فَسَاتِينُ.' },
    { arabic: 'بِنْطَالٌ', translit: 'binṭāl', english: 'trousers' },
    { arabic: 'حِذَاءٌ', translit: 'ḥidhāʾ', english: 'shoes, a pair of shoes' },
    { arabic: 'ضَيِّقٌ', translit: 'ḍayyiq', english: 'tight' },
    {
      arabic: 'وَاسِعٌ',
      translit: 'wāsiʿ',
      english: 'loose, wide',
      note: 'For a flat it means “spacious”.',
    },
    { arabic: 'إِيصَالٌ', translit: 'īṣāl', english: 'receipt' },
    { arabic: 'غُرْفَةُ الْقِيَاسِ', translit: 'ghurfat al-qiyās', english: 'fitting room' },
    { arabic: 'يَقِيسُ', translit: 'yaqīs', english: 'to try on', note: 'Literally “to measure”.' },
    { arabic: 'يُعِيدُ', translit: 'yuʿīd', english: 'to bring back, to return' },
    { arabic: 'يَبْحَثُ عَنْ', translit: 'yabḥath ʿan', english: 'to look for' },
    { arabic: 'يَنْظُرُ إِلَى', translit: 'yanẓur ilā', english: 'to look at' },
    { arabic: 'يَحْتَاجُ إِلَى', translit: 'yaḥtāj ilā', english: 'to need' },
    { arabic: 'كُلُّ', translit: 'kull', english: 'every, all' },
    { arabic: 'بَعْضُ', translit: 'baʿḍ', english: 'some' },
    { arabic: 'كَثِيرٌ مِنْ', translit: 'kathīr min', english: 'a lot of, many' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word means “size”?',
      options: ['لَوْنٌ', 'مَقَاسٌ', 'تَخْفِيضٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'The shirt is too small for you. What do you say?',
      options: ['الْقَمِيصُ ضَيِّقٌ', 'الْقَمِيصُ وَاسِعٌ', 'الْقَمِيصُ رَخِيصٌ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Where do you try clothes on?',
      options: ['فِي الْمَطْبَخِ', 'فِي الْمِصْعَدِ', 'فِي غُرْفَةِ الْقِيَاسِ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'أَبْحَثُ عَنْ فُسْتَانٍ أَزْرَقَ',
      options: ['أَبْحَثُ عَنْ قَمِيصٍ أَزْرَقَ', 'أَبْحَثُ عَنْ فُسْتَانٍ أَزْرَقَ', 'أَبْحَثُ عَنْ فُسْتَانٍ أَسْوَدَ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the question you hear.',
      audio: 'هَلْ عِنْدَكُمْ مَقَاسٌ أَكْبَرُ؟',
      options: ['هَلْ عِنْدَكُمْ مَقَاسٌ أَصْغَرُ؟', 'هَلْ عِنْدَكُمْ لَوْنٌ آخَرُ؟', 'هَلْ عِنْدَكُمْ مَقَاسٌ أَكْبَرُ؟'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'فُسْتَانٌ', english: 'dress' },
        { arabic: 'بِنْطَالٌ', english: 'trousers' },
        { arabic: 'حِذَاءٌ', english: 'shoes' },
        { arabic: 'إِيصَالٌ', english: 'receipt' },
        { arabic: 'تَخْفِيضٌ', english: 'discount' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each verb with its meaning.',
      pairs: [
        { arabic: 'يَبْحَثُ عَنْ', english: 'to look for' },
        { arabic: 'يَنْظُرُ إِلَى', english: 'to look at' },
        { arabic: 'يَحْتَاجُ إِلَى', english: 'to need' },
        { arabic: 'يَقِيسُ', english: 'to try on' },
        { arabic: 'يُعِيدُ', english: 'to bring back' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I want to return this shirt.',
      words: ['أُرِيدُ', 'أَنْ', 'أُعِيدَ', 'هٰذَا', 'الْقَمِيصَ'],
      distractors: ['هٰذِهِ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'All the dresses are on sale.',
      words: ['كُلُّ', 'الْفَسَاتِينِ', 'عَلَيْهَا', 'تَخْفِيضٌ'],
      distractors: ['بَعْضُ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَبْحَثُ',
      after: 'حِذَاءٍ أَسْوَدَ.',
      english: 'I am looking for black shoes.',
      options: ['إِلَى', 'عَنْ', 'مِنْ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَحْتَاجُ',
      after: 'مَقَاسٍ أَصْغَرَ.',
      english: 'I need a smaller size.',
      options: ['إِلَى', 'عَنْ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَذْهَبُ إِلَى السُّوقِ',
      after: 'يَوْمٍ.',
      english: 'I go to the market every day.',
      options: ['بَعْضَ', 'كُلَّ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'كُلُّ، بَعْضُ and كَثِيرٌ مِنْ come before a noun. كُلُّ with a single noun and no الْ means “every”; with الْ and a plural it means “all”.',
    },
    {
      type: 'table',
      head: ['Arabic', 'Meaning'],
      rows: [
        ['كُلَّ يَوْمٍ', 'every day'],
        ['كُلُّ الْفَسَاتِينِ', 'all the dresses'],
        ['بَعْضُ الْأَلْوَانِ', 'some (of the) colours'],
        ['كَثِيرٌ مِنَ النَّاسِ', 'a lot of people'],
      ],
    },
    {
      type: 'example',
      arabic: 'بَعْضُ الْقُمْصَانِ رَخِيصَةٌ.',
      translit: 'baʿḍ al-qumṣān rakhīṣa',
      english: 'Some of the shirts are cheap.',
    },
    {
      type: 'p',
      text: 'Many verbs take a fixed preposition, and it is not always the one English uses. Learn the verb and its preposition together. Some verbs take none where English has one: “wait for” is just أَنْتَظِرُ.',
    },
    {
      type: 'table',
      head: ['Verb', 'Meaning', 'Example'],
      rows: [
        ['يَبْحَثُ عَنْ', 'to look for', 'أَبْحَثُ عَنْ قَمِيصٍ.'],
        ['يَنْظُرُ إِلَى', 'to look at', 'أَنْظُرُ إِلَى الْفُسْتَانِ.'],
        ['يَحْتَاجُ إِلَى', 'to need', 'أَحْتَاجُ إِلَى مَقَاسٍ أَكْبَرَ.'],
        ['يَتَكَلَّمُ مَعَ', 'to talk to', 'أَتَكَلَّمُ مَعَ الْبَائِعِ.'],
      ],
    },
    {
      type: 'example',
      arabic: 'أَنْتَظِرُ صَدِيقِي أَمَامَ الْمَحَلِّ.',
      translit: 'antaẓir ṣadīqī amām al-maḥall',
      english: 'I am waiting for my friend in front of the shop.',
    },
  ],
  cultureTip: {
    title: 'Fixed price or bargaining?',
    body: 'In shops with price tags and in malls the price is fixed, though you can always ask: هَلْ هُنَاكَ تَخْفِيضٌ؟ (Is there a discount?). In markets such as Khan el-Khalili, bargaining is normal and friendly: smile, offer less, and meet in the middle.',
  },
};
