import type { ContentLesson } from '../types.ts';

// A2 L45: a celebration you went to. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L45: C36, G40 cont., K15); the owner reviews the Arabic before real
// learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-celebration',
  unit: 'A2.2',
  kind: 'lesson',
  title: 'A celebration you went to',
  topic: 'A wedding and Eid',
  summary:
    'Tell a friend about a wedding or an Eid you went to: who came, what you did and how it felt.',
  goals: [
    'Describe a wedding or an Eid you went to',
    'Use hollow verbs in the present: يَقُولُ، يَجِيءُ، يَنَامُ',
    'Say what did not happen with لَمْ: لَمْ أَنَمْ',
  ],
  grammarFocus:
    'Hollow verbs keep a long vowel in the present (يَزُورُ، يَجِيءُ، يَنَامُ); after لَمْ it gets short (لَمْ أَنَمْ).',
  scenario:
    'You are Hoda, a colleague of the learner at an office in Cairo. It is the first day back after ' +
    'the Eid holiday. Tell them about your cousin’s wedding (the bride, the music, the dancing, the ' +
    'guests) and ask about their Eid or a celebration they went to. Use short past sentences, a few ' +
    'present-tense hollow verbs (يَقُولُ، يَنَامُ، يَجِيءُ, يَزُورُ), and لَمْ for what did not happen ' +
    '(لَمْ أَنَمْ). ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'عِيدٌ مُبَارَكٌ! كَيْفَ كَانَ الْعِيدُ؟ أَنَا ذَهَبْتُ إِلَى عُرْسِ ابْنَةِ عَمِّي.',
  vocab: [
    { arabic: 'عُرْسٌ', translit: 'ʿurs', english: 'wedding' },
    { arabic: 'عَرُوسٌ', translit: 'ʿarūs', english: 'bride' },
    { arabic: 'عَرِيسٌ', translit: 'ʿarīs', english: 'groom' },
    { arabic: 'عِيدٌ', translit: 'ʿīd', english: 'feast, Eid' },
    { arabic: 'حَفْلَةٌ', translit: 'ḥafla', english: 'party' },
    { arabic: 'ضَيْفٌ', translit: 'ḍayf', english: 'guest', note: 'Plural: ضُيُوفٌ.' },
    { arabic: 'الْأَقَارِبُ', translit: 'al-aqārib', english: 'relatives' },
    { arabic: 'هَدِيَّةٌ', translit: 'hadiyya', english: 'gift' },
    {
      arabic: 'كَعْكٌ',
      translit: 'kaʿk',
      english: 'Eid biscuits',
      note: 'Sweet biscuits baked for the Eid after Ramadan.',
    },
    { arabic: 'فُسْتَانٌ', translit: 'fustān', english: 'dress' },
    {
      arabic: 'رَقَصَ',
      translit: 'raqaṣa',
      english: 'he danced',
      note: 'Present: يَرْقُصُ (yarquṣu).',
    },
    {
      arabic: 'غَنَّى',
      translit: 'ghannā',
      english: 'he sang',
      note: 'Present: يُغَنِّي (yughannī). We sang: غَنَّيْنَا.',
    },
    {
      arabic: 'جَاءَ',
      translit: 'jāʾa',
      english: 'he came',
      note: 'Present: يَجِيءُ (yajīʾu). I came: جِئْتُ.',
    },
    {
      arabic: 'نَامَ',
      translit: 'nāma',
      english: 'he slept',
      note: 'Present: يَنَامُ (yanāmu). I slept: نِمْتُ.',
    },
    {
      arabic: 'قَامَ',
      translit: 'qāma',
      english: 'he got up',
      note: 'Present: يَقُومُ (yaqūmu). I got up: قُمْتُ.',
    },
    {
      arabic: 'عِيدٌ مُبَارَكٌ',
      translit: 'ʿīd mubārak',
      english: 'happy Eid',
      note: 'Literally “a blessed feast”.',
    },
    {
      arabic: 'أَلْفُ مَبْرُوكٍ',
      translit: 'alf mabrūk',
      english: 'congratulations',
      note: 'Said at a wedding, a new job or a success.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'It is Eid. What do you say to your neighbour?',
      options: ['أَلْفُ مَبْرُوكٍ', 'عِيدٌ مُبَارَكٌ', 'مَسَاءُ الْخَيْرِ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Your friend just got married. What do you say?',
      options: ['أَلْفُ مَبْرُوكٍ', 'إِلَى اللِّقَاءِ', 'عِيدٌ مُبَارَكٌ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which sentence means “I didn’t sleep all night”?',
      options: ['لَا أَنَامُ طُولَ اللَّيْلِ.', 'نِمْتُ طُولَ اللَّيْلِ.', 'لَمْ أَنَمْ طُولَ اللَّيْلِ.'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which verb is the present of نَامَ (he slept)?',
      options: ['يَقُومُ', 'يَنَامُ', 'يَجِيءُ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'رَقَصْنَا وَغَنَّيْنَا',
      options: ['رَقَصُوا وَغَنَّوْا', 'رَقَصْتُ وَغَنَّيْتُ', 'رَقَصْنَا وَغَنَّيْنَا'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'جَاءَ كُلُّ الْأَقَارِبِ',
      options: ['جَاءَ كُلُّ الْأَقَارِبِ', 'جِئْتُ مَعَ الْأَقَارِبِ', 'جَاءَ كُلُّ الضُّيُوفِ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'عَرُوسٌ', english: 'bride' },
        { arabic: 'عَرِيسٌ', english: 'groom' },
        { arabic: 'ضَيْفٌ', english: 'guest' },
        { arabic: 'هَدِيَّةٌ', english: 'gift' },
        { arabic: 'فُسْتَانٌ', english: 'dress' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each present verb with its meaning.',
      pairs: [
        { arabic: 'يَقُومُ', english: 'he gets up' },
        { arabic: 'يَنَامُ', english: 'he sleeps' },
        { arabic: 'يَجِيءُ', english: 'he comes' },
        { arabic: 'يَقُولُ', english: 'he says' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The bride wore a white dress.',
      words: ['لَبِسَتِ', 'الْعَرُوسُ', 'فُسْتَانًا', 'أَبْيَضَ'],
      distractors: ['لَبِسَ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'We eat kahk at Eid.',
      words: ['نَأْكُلُ', 'الْكَعْكَ', 'فِي', 'الْعِيدِ'],
      distractors: ['أَكَلْتُ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'فِي الْعِيدِ',
      after: 'مُبَكِّرًا وَأَزُورُ جَدَّتِي.',
      english: 'At Eid I get up early and visit my grandmother.',
      options: ['قَامَ', 'أَقُومُ', 'قُمْتُ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'كَانَ الْعُرْسُ رَائِعًا، لَكِنِّي',
      after: 'كَثِيرًا.',
      english: 'The wedding was wonderful, but I didn’t sleep much.',
      options: ['لَمْ أَقُلْ', 'لَمْ أَجِئْ', 'لَمْ أَنَمْ'],
      answer: 2,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'Hollow verbs keep a long vowel in the present. Which vowel you hear (ū, ī or ā) depends on the verb, so learn the past and the present together.',
    },
    {
      type: 'table',
      head: ['Past', 'Present', 'Meaning'],
      rows: [
        ['قَالَ', 'يَقُولُ', 'to say'],
        ['زَارَ', 'يَزُورُ', 'to visit'],
        ['قَامَ', 'يَقُومُ', 'to get up'],
        ['جَاءَ', 'يَجِيءُ', 'to come'],
        ['عَاشَ', 'يَعِيشُ', 'to live'],
        ['نَامَ', 'يَنَامُ', 'to sleep'],
      ],
    },
    {
      type: 'example',
      arabic: 'يَزُورُ النَّاسُ أَقَارِبَهُمْ فِي الْعِيدِ.',
      translit: 'yazūru n-nāsu aqāribahum fī l-ʿīd.',
      english: 'People visit their relatives at Eid.',
    },
    {
      type: 'p',
      text: 'After لَمْ the verb loses its last vowel, and the long vowel before the last letter gets short: يَنَامُ → لَمْ يَنَمْ، يَقُولُ → لَمْ يَقُلْ، يَجِيءُ → لَمْ يَجِئْ.',
    },
    {
      type: 'example',
      arabic: 'لَمْ أَنَمْ بَعْدَ الْعُرْسِ.',
      translit: 'lam anam baʿda l-ʿurs.',
      english: 'I didn’t sleep after the wedding.',
    },
  ],
  cultureTip: {
    title: 'Weddings and Eid',
    body: 'Egyptian weddings are loud and long: music, the zaffa (a procession with drums that walks the couple in) and dancing until late at night. At the Eid after Ramadan, families bake kaʿk (kahk in Cairo), biscuits filled with dates or nuts and dusted with sugar, children get new clothes and a little money, and everyone visits relatives. You greet people with عِيدٌ مُبَارَكٌ or كُلُّ عَامٍ وَأَنْتُمْ بِخَيْرٍ.',
  },
};
