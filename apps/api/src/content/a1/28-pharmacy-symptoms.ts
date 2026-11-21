import type { ContentLesson } from '../types.ts';

// A1 L28: at the pharmacy. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L28: C20, G25, G26); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-pharmacy-symptoms',
  unit: 'A1.3',
  kind: 'lesson',
  title: 'Back at the pharmacy',
  topic: 'A headache, a cold and the right medicine',
  summary: 'Say what hurts, ask for medicine, and make nouns plural.',
  goals: [
    'Say where it hurts: head, stomach, back, throat',
    'Ask for medicine and understand when to take it',
    'Make plurals with -ūn, -āt, and learn common broken plurals',
  ],
  grammarFocus: 'Plurals: مُهَنْدِسُونَ، سَيَّارَاتٌ, and broken plurals such as بَيْتٌ ← بُيُوتٌ.',
  scenario:
    'You are Nabil, a kind pharmacist in a pharmacy in Cairo. The learner comes in feeling ill. ' +
    'Ask what is wrong and where it hurts, suggest a medicine, say how many pills to take and ' +
    'when (in the morning, in the evening), and wish them well with سَلَامَتُكَ. ' +
    'Use very short sentences and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'مَسَاءُ الْخَيْرِ! تَفَضَّلْ. مَا بِكَ؟',
  vocab: [
    {
      arabic: 'صَيْدَلِيَّةٌ',
      translit: 'ṣaydaliyya',
      english: 'pharmacy',
      note: 'Plural: صَيْدَلِيَّاتٌ.',
    },
    {
      arabic: 'صَيْدَلِيٌّ',
      translit: 'ṣaydalī',
      english: 'pharmacist',
      note: 'Plural: صَيْدَلِيُّونَ.',
    },
    { arabic: 'رَأْسٌ', translit: 'raʾs', english: 'head' },
    { arabic: 'بَطْنٌ', translit: 'baṭn', english: 'stomach, belly' },
    { arabic: 'ظَهْرٌ', translit: 'ẓahr', english: 'back' },
    { arabic: 'حَلْقٌ', translit: 'ḥalq', english: 'throat' },
    {
      arabic: 'أَسْنَانٌ',
      translit: 'asnān',
      english: 'teeth',
      note: 'One tooth: سِنٌّ.',
    },
    {
      arabic: 'أَلَمٌ',
      translit: 'alam',
      english: 'pain',
      note: 'I have a pain in my back: عِنْدِي أَلَمٌ فِي ظَهْرِي.',
    },
    { arabic: 'صُدَاعٌ', translit: 'ṣudāʿ', english: 'headache' },
    { arabic: 'زُكَامٌ', translit: 'zukām', english: 'a cold' },
    { arabic: 'مَرِيضٌ', translit: 'marīḍ', english: 'ill, sick' },
    {
      arabic: 'دَوَاءٌ',
      translit: 'dawāʾ',
      english: 'medicine',
      note: 'Plural: أَدْوِيَةٌ.',
    },
    {
      arabic: 'حُبُوبٌ',
      translit: 'ḥubūb',
      english: 'pills, tablets',
      note: 'One pill: حَبَّةٌ.',
    },
    { arabic: 'خُذْ', translit: 'khudh', english: 'take!' },
    {
      arabic: 'سَلَامَتُكَ',
      translit: 'salāmatuk',
      english: 'get well soon (to a man)',
      note: 'To a woman: سَلَامَتُكِ.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “headache”?',
      options: ['زُكَامٌ', 'دَوَاءٌ', 'صُدَاعٌ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which word is the plural of this one?',
      promptArabic: 'مُهَنْدِسٌ',
      options: ['مُهَنْدِسَةٌ', 'مُهَنْدِسُونَ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which word is the plural of this one?',
      promptArabic: 'بَيْتٌ',
      options: ['بُيُوتٌ', 'كُتُبٌ', 'أَدْوِيَةٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'عِنْدِي أَلَمٌ فِي ظَهْرِي',
      options: ['عِنْدِي أَلَمٌ فِي رَأْسِي', 'عِنْدِي أَلَمٌ فِي بَطْنِي', 'عِنْدِي أَلَمٌ فِي ظَهْرِي'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'أَدْوِيَةٌ',
      options: ['دَوَاءٌ', 'أَدْوِيَةٌ', 'حُبُوبٌ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'رَأْسٌ', english: 'head' },
        { arabic: 'بَطْنٌ', english: 'stomach' },
        { arabic: 'ظَهْرٌ', english: 'back' },
        { arabic: 'حَلْقٌ', english: 'throat' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each plural with its meaning.',
      pairs: [
        { arabic: 'صَيْدَلِيَّاتٌ', english: 'pharmacies' },
        { arabic: 'أَسْنَانٌ', english: 'teeth' },
        { arabic: 'مُهَنْدِسُونَ', english: 'engineers' },
        { arabic: 'سَيَّارَاتٌ', english: 'cars' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I have a headache.',
      words: ['عِنْدِي', 'صُدَاعٌ'],
      distractors: ['دَوَاءٌ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I have a pain in my stomach.',
      words: ['عِنْدِي', 'أَلَمٌ', 'فِي', 'بَطْنِي'],
      distractors: ['رَأْسٌ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Take this medicine in the morning.',
      words: ['خُذْ', 'هٰذَا', 'الدَّوَاءَ', 'صَبَاحًا'],
      distractors: ['حُبُوبٌ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'فِي الشَّارِعِ ثَلَاثُ',
      after: '',
      english: 'There are three pharmacies in the street.',
      options: ['صَيْدَلِيَّةٌ', 'صَيْدَلِيَّاتٍ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هُمْ',
      after: 'فِي هٰذِهِ الصَّيْدَلِيَّةِ.',
      english: 'They are pharmacists in this pharmacy.',
      options: ['صَيْدَلِيُّونَ', 'صَيْدَلِيَّاتٌ', 'صَيْدَلِيٌّ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'Arabic has two kinds of plural. The sound plural adds an ending: ـُونَ for a group of men or a mixed group, ـَاتٌ for women and for many things.',
    },
    {
      type: 'table',
      head: ['One', 'Many', 'Meaning'],
      rows: [
        ['مُهَنْدِسٌ', 'مُهَنْدِسُونَ', 'engineers'],
        ['صَيْدَلِيٌّ', 'صَيْدَلِيُّونَ', 'pharmacists'],
        ['مُهَنْدِسَةٌ', 'مُهَنْدِسَاتٌ', 'engineers (women)'],
        ['سَيَّارَةٌ', 'سَيَّارَاتٌ', 'cars'],
        ['صَيْدَلِيَّةٌ', 'صَيْدَلِيَّاتٌ', 'pharmacies'],
      ],
    },
    {
      type: 'p',
      text: 'After فِي, مِنْ, مَعَ and the other small words, and as the object of a verb, ـُونَ becomes ـِينَ: مَعَ الْمُهَنْدِسِينَ, “with the engineers”.',
    },
    {
      type: 'p',
      text: 'The broken plural changes the vowels inside the word. There is no simple rule at this level: learn each plural together with its singular.',
    },
    {
      type: 'table',
      head: ['One', 'Many', 'Meaning'],
      rows: [
        ['بَيْتٌ', 'بُيُوتٌ', 'houses'],
        ['كِتَابٌ', 'كُتُبٌ', 'books'],
        ['دَوَاءٌ', 'أَدْوِيَةٌ', 'medicines'],
        ['سِنٌّ', 'أَسْنَانٌ', 'teeth'],
        ['حَبَّةٌ', 'حُبُوبٌ', 'pills'],
      ],
    },
  ],
  cultureTip: {
    title: 'Ask the pharmacist',
    body: 'In Egypt the pharmacist is often the first person to ask about a small problem like a cold, a headache or an upset stomach. Pharmacies are everywhere, many stay open late, and most will deliver to your door. For anything serious, go to a doctor.',
  },
};
