import type { ContentLesson } from '../types.ts';

// A1 L23: ask and give directions. Made-up for this app from the Classroom plan
// (curriculum/msa/a1.md, L23: C17, G20); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-directions',
  unit: 'A1.3',
  kind: 'lesson',
  title: 'Asking the way',
  topic: 'Lost in downtown Cairo',
  summary: 'Ask where a place is, understand simple directions, and talk about “we” and “they”.',
  goals: [
    'Ask the way to a place: the museum, the station, a pharmacy',
    'Understand right, left, straight ahead, next to, between',
    'Use the present tense with we, you (plural) and they',
  ],
  grammarFocus: 'The present tense, plural: نَذْهَبُ، تَذْهَبُونَ، يَذْهَبُونَ.',
  scenario:
    'You are Hassan, a friendly shop owner on a busy street in downtown Cairo. The learner and a ' +
    'friend are lost and ask you the way to a place (the museum, the metro station or a ' +
    'pharmacy). Ask where they are going, then give simple directions with right, left, straight ' +
    'ahead, next to and between, and talk to them in the plural (أَنْتُمْ). ' +
    'Use very short sentences and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا! هَلْ تَبْحَثُونَ عَنْ شَيْءٍ؟',
  vocab: [
    { arabic: 'عَلَى الْيَمِينِ', translit: 'ʿala l-yamīn', english: 'on the right' },
    { arabic: 'عَلَى الْيَسَارِ', translit: 'ʿala l-yasār', english: 'on the left' },
    { arabic: 'إِلَى الْأَمَامِ', translit: 'ila l-amām', english: 'straight ahead' },
    { arabic: 'أَمَامَ', translit: 'amāma', english: 'in front of' },
    { arabic: 'خَلْفَ', translit: 'khalfa', english: 'behind' },
    { arabic: 'بِجَانِبِ', translit: 'bi-jānib', english: 'next to' },
    { arabic: 'بَيْنَ', translit: 'bayna', english: 'between' },
    {
      arabic: 'قَرِيبٌ',
      translit: 'qarīb',
      english: 'near, close',
      note: 'Near the station: قَرِيبٌ مِنَ الْمَحَطَّةِ.',
    },
    { arabic: 'بَعِيدٌ', translit: 'baʿīd', english: 'far' },
    { arabic: 'شَارِعٌ', translit: 'shāriʿ', english: 'street' },
    { arabic: 'مَيْدَانٌ', translit: 'maydān', english: 'square' },
    { arabic: 'مِتْحَفٌ', translit: 'mitḥaf', english: 'museum' },
    { arabic: 'إِشَارَةُ الْمُرُورِ', translit: 'ishārat al-murūr', english: 'traffic light' },
    { arabic: 'اِمْشِ', translit: 'imshi', english: 'walk!' },
    {
      arabic: 'اِتَّجِهْ',
      translit: 'ittajih',
      english: 'turn, head (that way)!',
      note: 'Turn right: اِتَّجِهْ يَمِينًا.',
    },
    {
      arabic: 'نَبْحَثُ عَنْ',
      translit: 'nabḥath ʿan',
      english: 'we are looking for',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “on the left”?',
      options: ['عَلَى الْيَمِينِ', 'عَلَى الْيَسَارِ', 'إِلَى الْأَمَامِ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick the form for “we go”.',
      options: ['يَذْهَبُونَ', 'تَذْهَبُونَ', 'نَذْهَبُ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'بِجَانِبِ',
      options: ['بِجَانِبِ', 'بَيْنَ', 'خَلْفَ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'الْمَحَطَّةُ عَلَى الْيَسَارِ',
      options: ['الْمَحَطَّةُ عَلَى الْيَمِينِ', 'الْمَحَطَّةُ بَعِيدَةٌ', 'الْمَحَطَّةُ عَلَى الْيَسَارِ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'أَمَامَ', english: 'in front of' },
        { arabic: 'خَلْفَ', english: 'behind' },
        { arabic: 'بَيْنَ', english: 'between' },
        { arabic: 'بِجَانِبِ', english: 'next to' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'شَارِعٌ', english: 'street' },
        { arabic: 'مَيْدَانٌ', english: 'square' },
        { arabic: 'مِتْحَفٌ', english: 'museum' },
        { arabic: 'إِشَارَةُ الْمُرُورِ', english: 'traffic light' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'We are looking for the museum.',
      words: ['نَبْحَثُ', 'عَنِ', 'الْمِتْحَفِ'],
      distractors: ['يَبْحَثُونَ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Walk straight ahead.',
      words: ['اِمْشِ', 'إِلَى', 'الْأَمَامِ'],
      distractors: ['خَلْفَ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The pharmacy is next to the bank.',
      words: ['الصَّيْدَلِيَّةُ', 'بِجَانِبِ', 'الْبَنْكِ'],
      distractors: ['بَعِيدٌ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هُمْ',
      after: 'إِلَى الْمَيْدَانِ.',
      english: 'They are going to the square.',
      options: ['يَذْهَبُونَ', 'نَذْهَبُ', 'تَذْهَبُونَ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَيْنَ',
      after: '',
      english: 'Where do you (plural) live?',
      options: ['تَسْكُنُ', 'تَسْكُنُونَ', 'يَسْكُنُونَ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'الْمِتْحَفُ',
      after: 'مِنْ هُنَا.',
      english: 'The museum is near here.',
      options: ['بَيْنَ', 'قَرِيبٌ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'For “we” the verb starts with نَـ. For “you” (plural) and “they” it starts with تَـ and يَـ, as in the singular, and ends in ـُونَ.',
    },
    {
      type: 'table',
      head: ['Who', 'Arabic', 'Say', 'Meaning'],
      rows: [
        ['I', 'أَنَا أَذْهَبُ', 'anā adhhab', 'I go'],
        ['we', 'نَحْنُ نَذْهَبُ', 'naḥnu nadhhab', 'we go'],
        ['you (plural)', 'أَنْتُمْ تَذْهَبُونَ', 'antum tadhhabūn', 'you go'],
        ['they', 'هُمْ يَذْهَبُونَ', 'hum yadhhabūn', 'they go'],
      ],
    },
    {
      type: 'p',
      text: 'A group of only women has its own forms (هُنَّ يَذْهَبْنَ, “they go”). You will meet them later; for a mixed group, use the forms above.',
    },
    {
      type: 'example',
      arabic: 'نَبْحَثُ عَنِ الْمِتْحَفِ.',
      translit: 'nabḥathu ʿani l-mitḥaf',
      english: 'We are looking for the museum.',
    },
    {
      type: 'example',
      arabic: 'أَيْنَ تَسْكُنُونَ؟',
      translit: 'ayna taskunūn',
      english: 'Where do you (plural) live?',
    },
    {
      type: 'example',
      arabic: 'هُمْ يَذْهَبُونَ إِلَى الْمَيْدَانِ.',
      translit: 'hum yadhhabūna ila l-maydān',
      english: 'They are going to the square.',
    },
  ],
  cultureTip: {
    title: 'Directions by landmarks',
    body: 'In Cairo people give directions by landmarks, not street names: “after the mosque”, “next to the big pharmacy”, “at the square”. Everyone is happy to help, and if one answer seems unsure, ask a second person further on.',
  },
};
