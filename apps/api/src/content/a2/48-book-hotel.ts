import type { ContentLesson } from '../types.ts';

// A2 L48: book a hotel. Made-up for this app from the Classroom plan (curriculum/msa/a2.md, L48:
// C39, G43; no culture item, so a short practical tip). The hotel is made up. The owner reviews the
// Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-book-hotel',
  unit: 'A2.3',
  kind: 'lesson',
  title: 'Booking a hotel',
  topic: 'A room in Dahab',
  summary: 'Book a hotel room by phone: the dates, the kind of room, breakfast and the price.',
  goals: [
    'Ask for a room for a number of nights',
    'Say what you want to do with أَنْ + the subjunctive',
    'Say what you will not do with لَنْ',
  ],
  grammarFocus:
    'After أَنْ، كَيْ and لَنْ the present verb takes the subjunctive: أُرِيدُ أَنْ أَحْجِزَ، لَنْ أَتَأَخَّرَ.',
  scenario:
    'You are Tarek, the receptionist of a small made-up hotel in Dahab, on the phone with the ' +
    'learner, who is calling from Cairo. Help them book a room: ask for the dates, how many nights, ' +
    'a single or a double room, and whether they want breakfast. Give a price and say what is ' +
    'included. Use أَنْ، كَيْ and لَنْ with the subjunctive (هَلْ تُرِيدُ أَنْ تَحْجِزَ…؟، لَنْ تَدْفَعَ الْآنَ). ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'فُنْدُقُ الْمَوْجَةِ، مَسَاءُ الْخَيْرِ! كَيْفَ أَسْتَطِيعُ أَنْ أُسَاعِدَكَ؟',
  vocab: [
    { arabic: 'فُنْدُقٌ', translit: 'funduq', english: 'hotel' },
    { arabic: 'نَزِيلٌ', translit: 'nazīl', english: 'hotel guest' },
    {
      arabic: 'حَجَزَ',
      translit: 'ḥajaza',
      english: 'he booked',
      note: 'Present: يَحْجِزُ (yaḥjizu).',
    },
    { arabic: 'غُرْفَةٌ مُفْرَدَةٌ', translit: 'ghurfa mufrada', english: 'single room' },
    { arabic: 'غُرْفَةٌ مُزْدَوِجَةٌ', translit: 'ghurfa muzdawija', english: 'double room' },
    { arabic: 'لَيْلَةٌ', translit: 'layla', english: 'night', note: 'Plural: لَيَالٍ.' },
    { arabic: 'اسْتِقْبَالٌ', translit: 'istiqbāl', english: 'reception' },
    { arabic: 'مِفْتَاحٌ', translit: 'miftāḥ', english: 'key' },
    { arabic: 'فُطُورٌ', translit: 'fuṭūr', english: 'breakfast' },
    { arabic: 'تَكْيِيفٌ', translit: 'takyīf', english: 'air conditioning' },
    {
      arabic: 'مُطِلٌّ عَلَى الْبَحْرِ',
      translit: 'muṭill ʿalā l-baḥr',
      english: 'with a sea view',
      note: 'With a feminine noun: غُرْفَةٌ مُطِلَّةٌ عَلَى الْبَحْرِ.',
    },
    { arabic: 'مُتَاحٌ', translit: 'mutāḥ', english: 'available' },
    {
      arabic: 'دَفَعَ',
      translit: 'dafaʿa',
      english: 'he paid',
      note: 'Present: يَدْفَعُ (yadfaʿu).',
    },
    { arabic: 'أَوَدُّ أَنْ', translit: 'awaddu an', english: 'I would like to' },
    { arabic: 'لَنْ', translit: 'lan', english: 'will not' },
    { arabic: 'كَيْ', translit: 'kay', english: 'so that' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “I want to book a room”?',
      options: ['حَجَزْتُ غُرْفَةً.', 'سَأَحْجِزُ غُرْفَةً.', 'أُرِيدُ أَنْ أَحْجِزَ غُرْفَةً.'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which sentence means “I will not be late”?',
      options: ['لَمْ أَتَأَخَّرْ.', 'لَنْ أَتَأَخَّرَ.', 'لَا تَتَأَخَّرْ.'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'كَمْ لَيْلَةً تُرِيدُ أَنْ تَبْقَى؟',
      options: ['ثَلَاثَ لَيَالٍ.', 'غُرْفَةً مُزْدَوِجَةً.', 'مَعَ الْفُطُورِ.'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'The receptionist says this. What does he mean?',
      promptArabic: 'لَنْ تَدْفَعَ الْآنَ.',
      options: ['تَدْفَعُ الْآنَ.', 'سَتَدْفَعُ لَاحِقًا.', 'دَفَعْتَ أَمْسِ.'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the question you hear.',
      audio: 'هَلِ الْفُطُورُ مَعَ الْغُرْفَةِ؟',
      options: ['هَلِ التَّكْيِيفُ فِي الْغُرْفَةِ؟', 'هَلِ الْفُطُورُ مَعَ الْغُرْفَةِ؟', 'هَلِ الْفُطُورُ فِي الْمَطْعَمِ؟'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'غُرْفَةٌ مُزْدَوِجَةٌ',
      options: ['غُرْفَةٌ مُزْدَوِجَةٌ', 'غُرْفَةٌ مُفْرَدَةٌ', 'غُرْفَةٌ صَغِيرَةٌ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'مِفْتَاحٌ', english: 'key' },
        { arabic: 'اسْتِقْبَالٌ', english: 'reception' },
        { arabic: 'فُطُورٌ', english: 'breakfast' },
        { arabic: 'تَكْيِيفٌ', english: 'air conditioning' },
        { arabic: 'لَيْلَةٌ', english: 'night' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each small word with its meaning.',
      pairs: [
        { arabic: 'أَنْ', english: 'to (before a verb)' },
        { arabic: 'لَنْ', english: 'will not' },
        { arabic: 'كَيْ', english: 'so that' },
        { arabic: 'لَمْ', english: 'did not' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I would like to pay by card.',
      words: ['أَوَدُّ', 'أَنْ', 'أَدْفَعَ', 'بِالْبِطَاقَةِ'],
      distractors: ['أَدْفَعُ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'We will not book at this hotel.',
      words: ['لَنْ', 'نَحْجِزَ', 'فِي', 'هَذَا', 'الْفُنْدُقِ'],
      distractors: ['نَحْجِزُ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أُرِيدُ غُرْفَةً مُطِلَّةً عَلَى الْبَحْرِ',
      after: 'أَرَى الشَّاطِئَ.',
      english: 'I want a room with a sea view so that I can see the beach.',
      options: ['لَنْ', 'لَمْ', 'كَيْ'],
      answer: 2,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هَلْ تُرِيدُ أَنْ',
      after: 'الْآنَ؟',
      english: 'Do you want to pay now?',
      options: ['تَدْفَعَ', 'تَدْفَعُ', 'دَفَعْتَ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'After أَنْ (to), كَيْ (so that) and لَنْ (will not), the present verb takes the subjunctive: its last vowel ـُ becomes ـَ.',
    },
    {
      type: 'example',
      arabic: 'أُرِيدُ أَنْ أَحْجِزَ غُرْفَةً.',
      translit: 'urīdu an aḥjiza ghurfa.',
      english: 'I want to book a room.',
    },
    {
      type: 'example',
      arabic: 'لَنْ أَتَأَخَّرَ.',
      translit: 'lan ataʾakhkhara.',
      english: 'I will not be late.',
    },
    {
      type: 'p',
      text: 'In the forms that end in ـُونَ or ـِينَ, the ن drops: تَحْجِزِينَ → أَنْ تَحْجِزِي، يَحْجِزُونَ → لَنْ يَحْجِزُوا.',
    },
    {
      type: 'table',
      head: ['Person', 'Present', 'Subjunctive'],
      rows: [
        ['I', 'أَحْجِزُ', 'أَحْجِزَ'],
        ['you (m)', 'تَحْجِزُ', 'تَحْجِزَ'],
        ['you (f)', 'تَحْجِزِينَ', 'تَحْجِزِي'],
        ['we', 'نَحْجِزُ', 'نَحْجِزَ'],
        ['they', 'يَحْجِزُونَ', 'يَحْجِزُوا'],
      ],
    },
    {
      type: 'p',
      text: 'لَنْ is the negative of the future: سَأَدْفَعُ (I will pay) → لَنْ أَدْفَعَ (I will not pay). It never takes سَـ.',
    },
  ],
  cultureTip: {
    title: 'Booking in Dahab',
    body: 'Dahab, a small town on the Red Sea in South Sinai, is full of family-run hotels and camps. Many take bookings by phone or message, and asking هَلِ الْفُطُورُ مَعَ الْغُرْفَةِ؟ is normal. At check-in you will be asked for your passport or ID, so keep it with you.',
  },
};
