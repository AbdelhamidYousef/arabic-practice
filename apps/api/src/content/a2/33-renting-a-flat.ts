import type { ContentLesson } from '../types.ts';

// A2 L33: rent a room, describe a flat in detail. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L33: C25, G32, V21). The owner reviews the Arabic before real learners
// see it.
export const lesson: ContentLesson = {
  slug: 'a2-renting-a-flat',
  unit: 'A2.1',
  kind: 'lesson',
  title: 'Renting a flat',
  topic: 'Viewing a furnished flat',
  summary: 'Ask about a flat, describe its rooms and furniture, and talk about the rent.',
  goals: [
    'Ask about the rooms, the floor and the rent',
    'Describe the furniture in a flat',
    'Use the dual to talk about two of something',
  ],
  grammarFocus: 'The dual, for exactly two: غُرْفَةٌ، غُرْفَتَانِ، غُرْفَتَيْنِ.',
  scenario:
    'You are Mr Magdy, a polite landlord showing the learner a furnished flat for rent in Dokki, ' +
    'Cairo. Describe the rooms, the floor, the lift and the furniture, answer questions about the ' +
    'rent, and ask what the learner needs. Use the dual naturally (two rooms, two beds, two months) ' +
    'in short A2 sentences with mostly words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا وَسَهْلًا! هٰذِهِ هِيَ الشَّقَّةُ. فِيهَا غُرْفَتَانِ وَحَمَّامٌ وَشُرْفَةٌ. تَفَضَّلْ!',
  vocab: [
    { arabic: 'شَقَّةٌ', translit: 'shaqqa', english: 'flat, apartment', note: 'Plural شُقَقٌ.' },
    { arabic: 'إِيجَارٌ', translit: 'ījār', english: 'rent' },
    { arabic: 'شَهْرِيًّا', translit: 'shahriyyan', english: 'monthly, per month' },
    { arabic: 'مَالِكٌ', translit: 'mālik', english: 'owner, landlord' },
    { arabic: 'يَسْتَأْجِرُ', translit: 'yastaʾjir', english: 'to rent (as a tenant)' },
    { arabic: 'طَابِقٌ', translit: 'ṭābiq', english: 'floor, storey' },
    { arabic: 'مِصْعَدٌ', translit: 'miṣʿad', english: 'lift, elevator' },
    { arabic: 'غُرْفَةُ نَوْمٍ', translit: 'ghurfat nawm', english: 'bedroom' },
    { arabic: 'حَمَّامٌ', translit: 'ḥammām', english: 'bathroom' },
    { arabic: 'شُرْفَةٌ', translit: 'shurfa', english: 'balcony' },
    { arabic: 'سَرِيرٌ', translit: 'sarīr', english: 'bed', note: 'Plural أَسِرَّةٌ.' },
    { arabic: 'خِزَانَةٌ', translit: 'khizāna', english: 'wardrobe, cupboard' },
    { arabic: 'أَرِيكَةٌ', translit: 'arīka', english: 'sofa' },
    { arabic: 'كُرْسِيٌّ', translit: 'kursī', english: 'chair', note: 'Plural كَرَاسِيُّ.' },
    { arabic: 'ثَلَّاجَةٌ', translit: 'thallāja', english: 'fridge' },
    { arabic: 'مَفْرُوشٌ', translit: 'mafrūsh', english: 'furnished' },
    { arabic: 'وَاسِعٌ', translit: 'wāsiʿ', english: 'spacious, roomy' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “two beds”?',
      options: ['سَرِيرٌ', 'سَرِيرَانِ', 'أَسِرَّةٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'What do you call the person who owns the flat?',
      options: ['الْإِيجَارُ', 'الْمِصْعَدُ', 'الْمَالِكُ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'الشَّقَّةُ مَفْرُوشَةٌ',
      options: ['الشَّقَّةُ مَفْرُوشَةٌ', 'الشَّقَّةُ وَاسِعَةٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'فِي الشَّقَّةِ حَمَّامَانِ',
      options: ['فِي الشَّقَّةِ حَمَّامٌ', 'فِي الشَّقَّةِ حَمَّامَانِ', 'فِي الشَّقَّةِ حَمَّامَاتٌ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each piece of furniture with its meaning.',
      pairs: [
        { arabic: 'سَرِيرٌ', english: 'bed' },
        { arabic: 'خِزَانَةٌ', english: 'wardrobe' },
        { arabic: 'أَرِيكَةٌ', english: 'sofa' },
        { arabic: 'ثَلَّاجَةٌ', english: 'fridge' },
        { arabic: 'كُرْسِيٌّ', english: 'chair' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'طَابِقٌ', english: 'floor' },
        { arabic: 'مِصْعَدٌ', english: 'lift' },
        { arabic: 'شُرْفَةٌ', english: 'balcony' },
        { arabic: 'إِيجَارٌ', english: 'rent' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The flat has two rooms and a balcony.',
      words: ['فِي', 'الشَّقَّةِ', 'غُرْفَتَانِ', 'وَشُرْفَةٌ'],
      distractors: ['غُرْفَتَيْنِ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I want to rent a flat near the metro.',
      words: ['أُرِيدُ', 'أَنْ', 'أَسْتَأْجِرَ', 'شَقَّةً', 'قُرْبَ', 'الْمِتْرُو'],
      distractors: ['شَقَّتَانِ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'عِنْدِي',
      after: 'وَخِزَانَةٌ.',
      english: 'I have two chairs and a wardrobe.',
      options: ['كُرْسِيَّانِ', 'كُرْسِيَّيْنِ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أُرِيدُ',
      after: 'كَبِيرَتَيْنِ.',
      english: 'I want two big rooms.',
      options: ['غُرْفَتَيْنِ', 'غُرْفَتَانِ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَدْفَعُ الْإِيجَارَ',
      after: '',
      english: 'I pay the rent monthly.',
      options: ['مَفْرُوشٌ', 'شَهْرِيًّا', 'وَاسِعٌ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'Arabic has a special form for exactly two things, the dual. You add ـَانِ to the singular. A word ending in ة changes it to ت first: غُرْفَةٌ becomes غُرْفَتَانِ.',
    },
    {
      type: 'table',
      head: ['One', 'Two (subject)', 'Two (after a verb or a preposition)'],
      rows: [
        ['سَرِيرٌ', 'سَرِيرَانِ', 'سَرِيرَيْنِ'],
        ['غُرْفَةٌ', 'غُرْفَتَانِ', 'غُرْفَتَيْنِ'],
        ['كُرْسِيٌّ', 'كُرْسِيَّانِ', 'كُرْسِيَّيْنِ'],
        ['شَهْرٌ', 'شَهْرَانِ', 'شَهْرَيْنِ'],
      ],
    },
    {
      type: 'p',
      text: 'ـَانِ is the form for the subject. When a verb acts on the word, or after a preposition, the ending is ـَيْنِ. An adjective takes the same ending as its noun.',
    },
    {
      type: 'example',
      arabic: 'فِي الشَّقَّةِ غُرْفَتَانِ وَاسِعَتَانِ.',
      translit: 'fī sh-shaqqa ghurfatān wāsiʿatān',
      english: 'The flat has two spacious rooms.',
    },
    {
      type: 'example',
      arabic: 'أَسْتَأْجِرُ الشَّقَّةَ لِشَهْرَيْنِ.',
      translit: 'astaʾjir ash-shaqqa li-shahrayn',
      english: 'I am renting the flat for two months.',
    },
    {
      type: 'p',
      text: 'There is a dual pronoun too: هُمَا, “they two”, and أَنْتُمَا, “you two”. The dual already means two, so you do not add the number.',
    },
  ],
  cultureTip: {
    title: 'Before you sign',
    body: 'Ask whether the flat is مَفْرُوشَةٌ, furnished, and what the rent covers. Landlords in Cairo usually ask for a deposit, التَّأْمِينُ, often one or two months’ rent, which you get back when you leave.',
  },
};
