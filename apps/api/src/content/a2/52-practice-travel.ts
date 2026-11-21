import type { ContentLesson } from '../types.ts';

// A2 L52: practice. The Classroom plan's catch-up lesson (curriculum/msa/a2.md, L52), made a review
// of L47–L51 for this app: plans, the hotel, the station, comparing trips, changing arrangements.
// The plan's reading and mini project are left out. The owner reviews the Arabic before real
// learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-practice-travel',
  unit: 'A2.3',
  kind: 'review',
  title: 'Practice: plans and travel',
  topic: 'Review of lessons 47 to 51',
  summary:
    'Bring together plans, booking a hotel, the station, choosing how to travel and changing a plan.',
  goals: [
    'Talk about a trip you will take, with سَـ and لَنْ',
    'Use weak verbs: نَسِيتُ، لَا تَنْسَ، يَصِلُ',
    'Say which one you mean with الَّذِي and الَّتِي',
  ],
  grammarFocus:
    'Recap: the future (سَـ / سَوْفَ), أَنْ and لَنْ + the subjunctive, weak verbs, and الَّذِي / الَّتِي.',
  scenario:
    'You are Rania, the learner’s friend in Cairo. You are planning a weekend trip to Alexandria ' +
    'together: decide how to get there (train or bus), which hotel to book, when you will arrive, and ' +
    'change the plan when one of you has a problem (a forgotten ticket, a busy day). Mix the future ' +
    '(سَـ، سَوْفَ، لَنْ), أَنْ + the subjunctive, weak verbs (يَصِلُ، نَسِيتُ، لَا تَنْسَ) and ' +
    'الَّذِي / الَّتِي. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'سَنُسَافِرُ إِلَى الْإِسْكَنْدَرِيَّةِ يَوْمَ الْجُمُعَةِ! أَتُرِيدُ أَنْ نَأْخُذَ الْقِطَارَ أَمِ الْحَافِلَةَ؟',
  vocab: [
    { arabic: 'غَدًا', translit: 'ghadan', english: 'tomorrow' },
    { arabic: 'خُطَّةٌ', translit: 'khuṭṭa', english: 'plan' },
    {
      arabic: 'سَافَرَ',
      translit: 'sāfara',
      english: 'he travelled',
      note: 'I will travel: سَأُسَافِرُ. I will not travel: لَنْ أُسَافِرَ.',
    },
    { arabic: 'شَاطِئٌ', translit: 'shāṭiʾ', english: 'beach' },
    {
      arabic: 'حَجَزَ',
      translit: 'ḥajaza',
      english: 'he booked',
      note: 'I want to book: أُرِيدُ أَنْ أَحْجِزَ.',
    },
    { arabic: 'غُرْفَةٌ مُزْدَوِجَةٌ', translit: 'ghurfa muzdawija', english: 'double room' },
    { arabic: 'فُطُورٌ', translit: 'fuṭūr', english: 'breakfast' },
    { arabic: 'جَوَازُ سَفَرٍ', translit: 'jawāz safar', english: 'passport' },
    { arabic: 'رَصِيفٌ', translit: 'raṣīf', english: 'platform' },
    {
      arabic: 'نَسِيَ',
      translit: 'nasiya',
      english: 'he forgot',
      note: 'I forgot: نَسِيتُ. Don’t forget: لَا تَنْسَ.',
    },
    {
      arabic: 'وَصَلَ',
      translit: 'waṣala',
      english: 'he arrived',
      note: 'Present: يَصِلُ (yaṣilu).',
    },
    { arabic: 'حَافِلَةٌ', translit: 'ḥāfila', english: 'bus' },
    { arabic: 'أَرْخَصُ', translit: 'arkhaṣ', english: 'cheaper' },
    { arabic: 'مُرِيحٌ', translit: 'murīḥ', english: 'comfortable' },
    { arabic: 'مَوْعِدٌ', translit: 'mawʿid', english: 'appointment, meeting time' },
    {
      arabic: 'أَلْغَى',
      translit: 'alghā',
      english: 'he cancelled',
      note: 'I cancelled: أَلْغَيْتُ.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “We will not travel tomorrow”?',
      options: ['سَنُسَافِرُ غَدًا.', 'لَا تُسَافِرْ غَدًا.', 'لَنْ نُسَافِرَ غَدًا.'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'مَتَى يَصِلُ الْقِطَارُ إِلَى الْإِسْكَنْدَرِيَّةِ؟',
      options: ['مِنَ الرَّصِيفِ الثَّانِي.', 'يَصِلُ ظُهْرًا.', 'حَجَزْتُ غُرْفَةً مُزْدَوِجَةً.'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which sentence is about the future?',
      options: ['الْقِطَارُ الَّذِي أَخَذْنَاهُ كَانَ مُرِيحًا.', 'سَوْفَ نَمْشِي إِلَى الشَّاطِئِ.', 'نَسِينَا الْخَرِيطَةَ.'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'نَسِيتُ جَوَازَ سَفَرِي فِي الْفُنْدُقِ',
      options: ['نَسِيَ جَوَازَ سَفَرِهِ فِي الْفُنْدُقِ', 'وَجَدْتُ جَوَازَ سَفَرِي فِي الْفُنْدُقِ', 'نَسِيتُ جَوَازَ سَفَرِي فِي الْفُنْدُقِ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'لَنْ نَحْجِزَ غُرْفَةً مُطِلَّةً عَلَى الْبَحْرِ',
      options: [
        'لَنْ نَحْجِزَ غُرْفَةً مُطِلَّةً عَلَى الْبَحْرِ',
        'حَجَزْنَا غُرْفَةً مُطِلَّةً عَلَى الْبَحْرِ',
        'سَوْفَ نَحْجِزُ غُرْفَةً مُطِلَّةً عَلَى الْبَحْرِ',
      ],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'جَوَازُ سَفَرٍ', english: 'passport' },
        { arabic: 'رَصِيفٌ', english: 'platform' },
        { arabic: 'حَافِلَةٌ', english: 'bus' },
        { arabic: 'مَوْعِدٌ', english: 'appointment' },
        { arabic: 'خُطَّةٌ', english: 'plan' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each form with its meaning.',
      pairs: [
        { arabic: 'سَأُسَافِرُ', english: 'I will travel' },
        { arabic: 'لَنْ أُسَافِرَ', english: 'I will not travel' },
        { arabic: 'سَافَرْتُ', english: 'I travelled' },
        { arabic: 'لَمْ أُسَافِرْ', english: 'I did not travel' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I want to book a double room.',
      words: ['أُرِيدُ', 'أَنْ', 'أَحْجِزَ', 'غُرْفَةً', 'مُزْدَوِجَةً'],
      distractors: ['أَحْجِزُ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The bus that we took was cheaper.',
      words: ['الْحَافِلَةُ', 'الَّتِي', 'أَخَذْنَاهَا', 'كَانَتْ', 'أَرْخَصَ'],
      distractors: ['الَّذِي'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'الْمَوْعِدَ لِأَنَّنِي مَرِيضٌ.',
      english: 'I cancelled the appointment because I am ill.',
      options: ['وَصَلْتُ', 'أَلْغَيْتُ', 'مَشَيْتُ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'لَا',
      after: 'تَذْكِرَتَكَ فِي الْبَيْتِ!',
      english: 'Don’t forget your ticket at home!',
      options: ['تَنْسَى', 'نَسِيتَ', 'تَنْسَ'],
      answer: 2,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'مَتَى',
      after: 'الْحَافِلَةُ؟',
      english: 'When does the bus arrive?',
      options: ['تَصِلُ', 'يَصِلُ', 'وَصَلْتُ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'This lesson brings back the grammar of lessons 47 to 51. Each line of the table is one small pattern you can reuse.',
    },
    {
      type: 'table',
      head: ['Idea', 'Pattern', 'Example'],
      rows: [
        ['will', 'سَـ / سَوْفَ + present', 'سَنُسَافِرُ غَدًا.'],
        ['will not', 'لَنْ + subjunctive', 'لَنْ نُسَافِرَ غَدًا.'],
        ['want to', 'أُرِيدُ أَنْ + subjunctive', 'أُرِيدُ أَنْ أَحْجِزَ.'],
        ['don’t', 'لَا + jussive', 'لَا تَنْسَ!'],
      ],
    },
    {
      type: 'p',
      text: 'Weak verbs change their last letter: نَسِيَ → نَسِيتُ، مَشَى → مَشَيْتُ، يَنْسَى → لَا تَنْسَ. Verbs that start with و drop it in the present: وَصَلَ → يَصِلُ.',
    },
    {
      type: 'p',
      text: 'الَّذِي goes with a masculine noun, الَّتِي with a feminine noun or things in the plural, الَّذِينَ with people in the plural.',
    },
    {
      type: 'example',
      arabic: 'الْفُنْدُقُ الَّذِي سَنَحْجِزُهُ قَرِيبٌ مِنَ الْمَحَطَّةِ.',
      translit: 'al-funduqu lladhī sa-naḥjizuhu qarībun mina l-maḥaṭṭa.',
      english: 'The hotel we will book is close to the station.',
    },
  ],
  cultureTip: {
    title: 'Alexandria for a weekend',
    body: 'Alexandria is about two and a half to three hours from Cairo by train, which makes it the classic weekend trip. Cairenes go for the sea air, the fish restaurants and a long walk on the Corniche, the road that runs along the sea.',
  },
};
