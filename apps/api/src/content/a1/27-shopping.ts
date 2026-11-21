import type { ContentLesson } from '../types.ts';

// A1 L27: shopping and prices. Made-up for this app from the Classroom plan
// (curriculum/msa/a1.md, L27: C15, G24, K10); the owner reviews the Arabic before real learners
// see it.
export const lesson: ContentLesson = {
  slug: 'a1-shopping',
  unit: 'A1.3',
  kind: 'lesson',
  title: 'Shopping and prices',
  topic: 'Buying a shirt in Khan el-Khalili market',
  summary: 'Count from eleven to a hundred, ask the price and the size, and haggle a little.',
  goals: [
    'Count from 11 to 100',
    'Ask the price and understand it in pounds',
    'Ask for the size and haggle politely',
  ],
  grammarFocus: 'Numbers 11–100 and prices: خَمْسَةٌ وَعِشْرُونَ جُنَيْهًا.',
  scenario:
    'You are Adel, a shopkeeper in Khan el-Khalili market in Cairo who sells shirts and small ' +
    'gifts. Greet the learner, tell them prices in Egyptian pounds between 11 and 100, answer ' +
    'questions about size, and let them haggle a little: start high, then give a small discount. ' +
    'Use very short sentences and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا وَسَهْلًا! تَفَضَّلْ، كُلُّ شَيْءٍ هُنَا جَمِيلٌ وَرَخِيصٌ!',
  vocab: [
    { arabic: 'سِعْرٌ', translit: 'siʿr', english: 'price' },
    { arabic: 'بِكَمْ هٰذَا', translit: 'bikam hādhā', english: 'how much is this?' },
    { arabic: 'غَالٍ', translit: 'ghālī', english: 'expensive' },
    { arabic: 'رَخِيصٌ', translit: 'rakhīṣ', english: 'cheap' },
    { arabic: 'مَقَاسٌ', translit: 'maqās', english: 'size' },
    { arabic: 'قَمِيصٌ', translit: 'qamīṣ', english: 'shirt' },
    { arabic: 'خَصْمٌ', translit: 'khaṣm', english: 'discount' },
    { arabic: 'آخِرُ سِعْرٍ', translit: 'ākhir siʿr', english: 'final price, best price' },
    { arabic: 'جُنَيْهٌ', translit: 'junayh', english: 'pound (Egyptian money)' },
    { arabic: 'أَحَدَ عَشَرَ', translit: 'aḥada ʿashar', english: 'eleven' },
    { arabic: 'خَمْسَةَ عَشَرَ', translit: 'khamsata ʿashar', english: 'fifteen' },
    { arabic: 'عِشْرُونَ', translit: 'ʿishrūn', english: 'twenty' },
    { arabic: 'ثَلَاثُونَ', translit: 'thalāthūn', english: 'thirty' },
    { arabic: 'أَرْبَعُونَ', translit: 'arbaʿūn', english: 'forty' },
    { arabic: 'خَمْسُونَ', translit: 'khamsūn', english: 'fifty' },
    { arabic: 'مِئَةٌ', translit: 'miʾa', english: 'a hundred' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say 50?',
      options: ['خَمْسَةَ عَشَرَ', 'خَمْسُونَ', 'خَمْسَةٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which one is 25?',
      options: ['خَمْسَةَ عَشَرَ', 'عِشْرُونَ وَخَمْسَةٌ', 'خَمْسَةٌ وَعِشْرُونَ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the number you hear.',
      audio: 'ثَلَاثُونَ',
      options: ['ثَلَاثُونَ', 'ثَلَاثَةَ عَشَرَ', 'ثَمَانُونَ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the question you hear.',
      audio: 'بِكَمْ هٰذَا الْقَمِيصُ',
      options: ['هٰذَا الْقَمِيصُ غَالٍ', 'بِكَمْ هٰذَا الْقَمِيصُ', 'مَا مَقَاسُ هٰذَا الْقَمِيصِ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each number with its meaning.',
      pairs: [
        { arabic: 'أَحَدَ عَشَرَ', english: 'eleven' },
        { arabic: 'عِشْرُونَ', english: 'twenty' },
        { arabic: 'أَرْبَعُونَ', english: 'forty' },
        { arabic: 'مِئَةٌ', english: 'a hundred' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'سِعْرٌ', english: 'price' },
        { arabic: 'مَقَاسٌ', english: 'size' },
        { arabic: 'خَصْمٌ', english: 'discount' },
        { arabic: 'رَخِيصٌ', english: 'cheap' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'This shirt is expensive.',
      words: ['هٰذَا', 'الْقَمِيصُ', 'غَالٍ'],
      distractors: ['رَخِيصٌ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The price is thirty pounds.',
      words: ['السِّعْرُ', 'ثَلَاثُونَ', 'جُنَيْهًا'],
      distractors: ['جُنَيْهَاتٍ'],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'What is your final price?',
      words: ['مَا', 'آخِرُ', 'سِعْرٍ'],
      distractors: ['خَصْمٌ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'السِّعْرُ',
      after: 'جُنَيْهٍ.',
      english: 'The price is a hundred pounds.',
      options: ['مِئَةُ', 'عِشْرُونَ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هٰذَا غَالٍ! هَلْ هُنَاكَ',
      after: '',
      english: 'This is expensive! Is there a discount?',
      options: ['مَقَاسٌ', 'خَصْمٌ', 'سِعْرٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'بِكَمْ هٰذَا؟',
      options: ['هٰذَا قَمِيصٌ', 'مَقَاسٌ كَبِيرٌ', 'بِأَرْبَعِينَ جُنَيْهًا'],
      answer: 2,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'From 11 to 19, the small number comes first and عَشَرَ (ten) after it, both ending in -a. The tens end in ـُونَ, like a plural.',
    },
    {
      type: 'table',
      head: ['Number', 'Arabic', 'Say'],
      rows: [
        ['11', 'أَحَدَ عَشَرَ', 'aḥada ʿashar'],
        ['12', 'اثْنَا عَشَرَ', 'ithnā ʿashar'],
        ['15', 'خَمْسَةَ عَشَرَ', 'khamsata ʿashar'],
        ['20', 'عِشْرُونَ', 'ʿishrūn'],
        ['30', 'ثَلَاثُونَ', 'thalāthūn'],
        ['40', 'أَرْبَعُونَ', 'arbaʿūn'],
        ['50', 'خَمْسُونَ', 'khamsūn'],
        ['60', 'سِتُّونَ', 'sittūn'],
        ['70', 'سَبْعُونَ', 'sabʿūn'],
        ['80', 'ثَمَانُونَ', 'thamānūn'],
        ['90', 'تِسْعُونَ', 'tisʿūn'],
        ['100', 'مِئَةٌ', 'miʾa'],
      ],
    },
    {
      type: 'p',
      text: 'For 21 to 99, say the units first, then وَ and the tens: “five and twenty”. After 11–99 the thing counted is singular and ends in -an (جُنَيْهًا); after مِئَةٌ it ends in -in (مِئَةُ جُنَيْهٍ).',
    },
    {
      type: 'example',
      arabic: 'خَمْسَةٌ وَعِشْرُونَ جُنَيْهًا',
      translit: 'khamsatun wa-ʿishrūna junayhan',
      english: 'twenty-five pounds',
    },
    {
      type: 'example',
      arabic: 'السِّعْرُ مِئَةُ جُنَيْهٍ.',
      translit: 'as-siʿru miʾatu junayh',
      english: 'The price is a hundred pounds.',
    },
  ],
  cultureTip: {
    title: 'Haggling in the market',
    body: 'In markets like Khan el-Khalili, the first price is only the start. Smile, offer about half, and meet somewhere in the middle; walking away politely often brings a better price. Haggling is friendly, never rude. In supermarkets, pharmacies and shops with price tags, the price is fixed.',
  },
};
