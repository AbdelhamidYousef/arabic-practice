import type { ContentLesson } from '../types.ts';

// A1 L13: introducing your family. Made-up for this app from the Classroom plan
// (curriculum/msa/a1.md, L13: C07, G10, K07); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-family',
  unit: 'A1.2',
  kind: 'lesson',
  title: 'This is my family',
  topic: 'Looking at family photos',
  summary: 'Introduce your family and ask questions about someone else’s.',
  goals: [
    'Name the people in your family',
    'Ask questions with مَنْ, مَا, أَيْنَ, كَمْ, مَتَى and more',
    'Say who someone is: هٰذَا أَخِي',
  ],
  grammarFocus: 'Question words come first: مَنْ هٰذَا؟ أَيْنَ جَدَّتُكَ؟ كَمْ أَخًا عِنْدَكَ؟',
  scenario:
    'You are Karim, the learner’s friend in Cairo, showing them photos of your family on your phone. ' +
    'Introduce your father, mother, brother, sister and grandparents (give them made-up names), say ' +
    'one short thing about each (where they live, whether they are married), and ask the learner ' +
    'about their own family with مَنْ, مَا, أَيْنَ, كَيْفَ and كَمْ. Use very short sentences and ' +
    'only words from the lesson. Reply only in Arabic with full harakat, ask one short question at ' +
    'a time, and never correct the learner yourself: a separate step does that.',
  openingLine: 'انْظُرْ، هٰذِهِ عَائِلَتِي! هٰذَا أَبِي، وَهٰذِهِ أُمِّي.',
  vocab: [
    { arabic: 'عَائِلَةٌ', translit: 'ʿāʾila', english: 'family' },
    { arabic: 'أَبٌ', translit: 'ab', english: 'father', note: 'My father: أَبِي (abī).' },
    { arabic: 'أُمٌّ', translit: 'umm', english: 'mother', note: 'My mother: أُمِّي (ummī).' },
    { arabic: 'أَخٌ', translit: 'akh', english: 'brother', note: 'My brother: أَخِي (akhī).' },
    { arabic: 'أُخْتٌ', translit: 'ukht', english: 'sister' },
    { arabic: 'ابْنٌ', translit: 'ibn', english: 'son' },
    { arabic: 'بِنْتٌ', translit: 'bint', english: 'daughter, girl' },
    { arabic: 'جَدٌّ', translit: 'jadd', english: 'grandfather' },
    { arabic: 'جَدَّةٌ', translit: 'jadda', english: 'grandmother' },
    { arabic: 'زَوْجٌ', translit: 'zawj', english: 'husband' },
    { arabic: 'زَوْجَةٌ', translit: 'zawja', english: 'wife' },
    { arabic: 'عَمٌّ', translit: 'ʿamm', english: 'uncle (father’s brother)' },
    { arabic: 'خَالٌ', translit: 'khāl', english: 'uncle (mother’s brother)' },
    { arabic: 'طِفْلٌ', translit: 'ṭifl', english: 'child' },
    {
      arabic: 'مُتَزَوِّجٌ',
      translit: 'mutazawwij',
      english: 'married (a man)',
      note: 'A woman: مُتَزَوِّجَةٌ (mutazawwija).',
    },
    { arabic: 'مَنْ', translit: 'man', english: 'who' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word means “sister”?',
      options: ['أَخٌ', 'ابْنٌ', 'أُخْتٌ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'You want to know who someone is. Which word do you start with?',
      options: ['أَيْنَ', 'مَنْ', 'كَمْ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer.',
      promptArabic: 'مَنْ هٰذَا؟',
      options: ['هٰذَا أَخِي', 'فِي الْقَاهِرَةِ', 'بِخَيْرٍ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'هٰذِهِ جَدَّتِي',
      options: ['هٰذِهِ أُمِّي', 'هٰذِهِ جَدَّتِي', 'هٰذِهِ زَوْجَتِي'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the question you hear.',
      audio: 'كَمْ أُخْتًا عِنْدَكَ؟',
      options: ['كَمْ أُخْتًا عِنْدَكَ؟', 'كَمْ أَخًا عِنْدَكَ؟'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'أَبٌ', english: 'father' },
        { arabic: 'أُمٌّ', english: 'mother' },
        { arabic: 'جَدٌّ', english: 'grandfather' },
        { arabic: 'زَوْجَةٌ', english: 'wife' },
        { arabic: 'طِفْلٌ', english: 'child' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'عَمٌّ', english: 'uncle (father’s brother)' },
        { arabic: 'خَالٌ', english: 'uncle (mother’s brother)' },
        { arabic: 'بِنْتٌ', english: 'daughter' },
        { arabic: 'ابْنٌ', english: 'son' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'This is my mother.',
      words: ['هٰذِهِ', 'أُمِّي'],
      distractors: ['هٰذَا', 'أُمُّكَ'],
    },
    {
      type: 'build',
      prompt: 'Build the question (to a man).',
      english: 'Where is your grandmother?',
      words: ['أَيْنَ', 'جَدَّتُكَ'],
      distractors: ['مَنْ', 'جَدَّتِي'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'اسْمُ أُمِّكَ؟',
      english: 'What is your mother’s name?',
      options: ['مَنْ', 'مَا', 'كَمْ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'الْغَدَاءُ؟',
      english: 'When is lunch?',
      options: ['لِمَاذَا', 'أَيْنَ', 'مَتَى'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'A woman says she is married. Pick her sentence.',
      options: ['أَنَا مُتَزَوِّجٌ', 'أَنَا مُتَزَوِّجَةٌ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'A question word comes at the start of the question, and the rest is a normal sentence. Learn the main ones as a set.',
    },
    {
      type: 'table',
      head: ['Word', 'Meaning', 'Example'],
      rows: [
        ['مَا', 'what (before a noun)', 'مَا اسْمُكَ؟'],
        ['مَاذَا', 'what (before a verb)', 'مَاذَا تُرِيدُ؟'],
        ['مَنْ', 'who', 'مَنْ هٰذَا؟'],
        ['أَيْنَ', 'where', 'أَيْنَ تَسْكُنُ؟'],
        ['كَيْفَ', 'how', 'كَيْفَ حَالُكَ؟'],
        ['كَمْ', 'how many', 'كَمْ أَخًا عِنْدَكَ؟'],
        ['مَتَى', 'when', 'مَتَى الْغَدَاءُ؟'],
        ['لِمَاذَا', 'why', 'لِمَاذَا أَنْتَ هُنَا؟'],
      ],
    },
    {
      type: 'p',
      text: 'After كَمْ the noun stays singular and ends in -an (ـً): كَمْ أَخًا؟ is “how many brothers?”, كَمْ أُخْتًا؟ “how many sisters?”.',
    },
    {
      type: 'example',
      arabic: 'مَنْ هٰذِهِ؟ هٰذِهِ أُخْتِي سَلْمَى.',
      translit: 'man hādhihi? hādhihi ukhtī salmā.',
      english: 'Who is this? This is my sister Salma.',
    },
    {
      type: 'example',
      arabic: 'كَمْ أَخًا عِنْدَكَ؟',
      translit: 'kam akhan ʿindaka?',
      english: 'How many brothers do you have?',
    },
  ],
  cultureTip: {
    title: 'Abu and Umm: named after the eldest child',
    body: 'Parents are often called after their eldest child, usually the eldest son: the father of Ahmad becomes أَبُو أَحْمَدَ and his mother أُمُّ أَحْمَدَ. Friends and neighbours use these names warmly, sometimes more than first names. Asking a parent the name of their eldest is a friendly question.',
  },
};
