import type { ContentLesson } from '../types.ts';

// A1 L04: meeting someone new. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L04: C03, G04, G05, K03); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-where-from',
  unit: 'A1.1',
  kind: 'lesson',
  title: 'Where are you from?',
  topic: 'Meeting your guide',
  summary: 'Say where you are from and where you live, ask yes / no questions and make a plan.',
  goals: [
    'Say where you are from and where you live',
    'Use “my” and “your” on nouns',
    'Ask yes / no questions with هَلْ',
  ],
  grammarFocus: '“My” and “your” are endings: بَيْتِي, بَيْتُكَ, بَيْتُكِ; هَلْ makes a question.',
  scenario:
    'You are Karim, a friendly young local guide the hotel has booked for the learner, who is new in ' +
    'Cairo. You meet them in the hotel lobby. Introduce yourself, ask where they are from and where ' +
    'they live, say that you are from Cairo, and suggest a simple plan for tomorrow (the pyramids or ' +
    'the museum), answering with إِنْ شَاءَ اللَّهُ. Use very short present-tense sentences, yes / no ' +
    'questions with هَلْ and only words from the lesson. Reply only in Arabic with full harakat, ask ' +
    'one short question at a time, and never correct the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا وَسَهْلًا! أَنَا كَرِيمٌ، الْمُرْشِدُ. مِنْ أَيْنَ أَنْتَ؟',
  vocab: [
    {
      arabic: 'مِنْ أَيْنَ أَنْتَ',
      translit: 'min ayna anta',
      english: 'where are you from? (to a man)',
      note: 'To a woman: مِنْ أَيْنَ أَنْتِ؟ (min ayna anti).',
    },
    { arabic: 'أَنَا مِنْ', translit: 'anā min', english: 'I am from' },
    { arabic: 'أَسْكُنُ فِي', translit: 'askun fī', english: 'I live in' },
    { arabic: 'بَلَدٌ', translit: 'balad', english: 'country' },
    { arabic: 'مَدِينَةٌ', translit: 'madīna', english: 'city' },
    { arabic: 'مِصْرُ', translit: 'miṣr', english: 'Egypt' },
    { arabic: 'الْقَاهِرَةُ', translit: 'al-qāhira', english: 'Cairo' },
    { arabic: 'لَنْدَنُ', translit: 'landan', english: 'London' },
    {
      arabic: 'صَدِيقٌ',
      translit: 'ṣadīq',
      english: 'friend (a man)',
      note: 'A woman friend: صَدِيقَةٌ (ṣadīqa).',
    },
    { arabic: 'رَجُلٌ', translit: 'rajul', english: 'man' },
    { arabic: 'امْرَأَةٌ', translit: 'imraʾa', english: 'woman' },
    { arabic: 'مُرْشِدٌ', translit: 'murshid', english: 'guide' },
    {
      arabic: 'هَلْ',
      translit: 'hal',
      english: 'question word for a yes / no question',
      note: 'It has no English word: هَلْ أَنْتَ مِنْ مِصْرَ؟ is “Are you from Egypt?”.',
    },
    { arabic: 'بَيْتٌ', translit: 'bayt', english: 'house, home' },
    { arabic: 'غَدًا', translit: 'ghadan', english: 'tomorrow' },
    { arabic: 'إِنْ شَاءَ اللَّهُ', translit: 'in shāʾa llāh', english: 'God willing' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “my friend”?',
      options: ['صَدِيقُكَ', 'صَدِيقِي', 'صَدِيقُكِ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'You ask a woman about her house. Which word do you use?',
      options: ['بَيْتُكِ', 'بَيْتِي', 'بَيْتُكَ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer.',
      promptArabic: 'هَلْ أَنْتَ مِنْ مِصْرَ؟',
      options: ['غَدًا', 'مَدِينَةٌ', 'لَا، أَنَا مِنْ لَنْدَنَ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the question you hear.',
      audio: 'مِنْ أَيْنَ أَنْتَ؟',
      options: ['مِنْ أَيْنَ أَنْتَ؟', 'هَلْ أَنْتَ مِنْ مِصْرَ؟', 'مَا اسْمُكَ؟'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'أَسْكُنُ فِي الْقَاهِرَةِ',
      options: ['أَنَا مِنَ الْقَاهِرَةِ', 'أَسْكُنُ فِي الْقَاهِرَةِ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'بَلَدٌ', english: 'country' },
        { arabic: 'مَدِينَةٌ', english: 'city' },
        { arabic: 'صَدِيقٌ', english: 'friend' },
        { arabic: 'مُرْشِدٌ', english: 'guide' },
        { arabic: 'غَدًا', english: 'tomorrow' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'Are you from London?',
      words: ['هَلْ', 'أَنْتَ', 'مِنْ', 'لَنْدَنَ'],
      distractors: ['أَيْنَ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I live in Cairo.',
      words: ['أَسْكُنُ', 'فِي', 'الْقَاهِرَةِ'],
      distractors: ['مِنْ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هَلْ',
      after: 'مِنْ مِصْرَ؟',
      english: 'Are you (a woman) from Egypt?',
      options: ['أَنْتَ', 'أَنْتِ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'سَلْمَى.',
      english: 'My name is Salma.',
      options: ['اسْمُكَ', 'اسْمِي', 'اسْمُكِ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Karim suggests the museum tomorrow. Which answer means “God willing”?',
      options: ['الْحَمْدُ لِلَّهِ', 'إِنْ شَاءَ اللَّهُ', 'لَا بَأْسَ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'In Arabic, “my” and “your” are not separate words: they are endings on the noun. ـِي (-ī) is “my”, ـُكَ (-uka) is “your” to a man and ـُكِ (-uki) is “your” to a woman. A word ending in ة shows its t again before the ending: مَدِينَةٌ → مَدِينَتِي (my city).',
    },
    {
      type: 'table',
      head: ['Ending', 'Arabic', 'Meaning'],
      rows: [
        ['my', 'بَيْتِي', 'my house'],
        ['your (m)', 'بَيْتُكَ', 'your house (to a man)'],
        ['your (f)', 'بَيْتُكِ', 'your house (to a woman)'],
        ['my', 'مَدِينَتِي', 'my city'],
        ['your (m)', 'مَدِينَتُكَ', 'your city (to a man)'],
      ],
    },
    {
      type: 'p',
      text: 'For a yes / no question, put هَلْ (hal) in front of a normal sentence. Nothing else changes.',
    },
    {
      type: 'example',
      arabic: 'هَلْ أَنْتَ مِنْ مِصْرَ؟',
      translit: 'hal anta min miṣr?',
      english: 'Are you from Egypt?',
    },
    {
      type: 'example',
      arabic: 'نَعَمْ، أَنَا مِنَ الْقَاهِرَةِ',
      translit: 'naʿam, anā mina l-qāhira',
      english: 'Yes, I am from Cairo.',
    },
  ],
  cultureTip: {
    title: '“God willing” and the yes ladder',
    body: 'إِنْ شَاءَ اللَّهُ, “if God wills”, follows almost any plan about the future: see you tomorrow, God willing. It can be a warm yes, a polite maybe or a gentle no, so listen to the tone and to what comes with it. نَعَمْ, طَبْعًا (of course) or بِكُلِّ سُرُورٍ (with pleasure) is a clear yes; إِنْ شَاءَ اللَّهُ on its own may be a maybe.',
  },
};
