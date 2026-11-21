import type { ContentLesson } from '../types.ts';

// A2 L47: plans for the weekend. Made-up for this app from the Classroom plan (curriculum/msa/a2.md,
// L47: C38, G42; no culture item, so a short practical tip). The sound item (S25) is left out. The
// owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-weekend-plans',
  unit: 'A2.3',
  kind: 'lesson',
  title: 'Plans for the weekend',
  topic: 'A trip to the Red Sea',
  summary: 'Say what you will do at the weekend and next week, and ask about someone else’s plans.',
  goals: [
    'Say what you will do with سَـ and سَوْفَ',
    'Use future time words: غَدًا، بَعْدَ غَدٍ، الْأُسْبُوعَ الْقَادِمَ',
    'Ask a friend about their plans for the weekend',
  ],
  grammarFocus: 'The future: سَـ or سَوْفَ before the present verb (سَأُسَافِرُ غَدًا).',
  scenario:
    'You are Karim, a colleague of the learner at an office in Cairo. It is Thursday afternoon. ' +
    'Tell them your plan for the weekend: you will travel to the Red Sea with friends, swim and dive, ' +
    'and come back on Saturday. Ask about their plans for the weekend and for next week. Use the ' +
    'future with سَـ and سَوْفَ and simple time words (غَدًا، بَعْدَ غَدٍ، الْأُسْبُوعَ الْقَادِمَ). ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَخِيرًا جَاءَ الْخَمِيسُ! مَاذَا سَتَفْعَلُ فِي نِهَايَةِ الْأُسْبُوعِ؟',
  vocab: [
    { arabic: 'غَدًا', translit: 'ghadan', english: 'tomorrow' },
    { arabic: 'بَعْدَ غَدٍ', translit: 'baʿda ghad', english: 'the day after tomorrow' },
    { arabic: 'نِهَايَةُ الْأُسْبُوعِ', translit: 'nihāyat al-usbūʿ', english: 'the weekend' },
    { arabic: 'الْأُسْبُوعُ الْقَادِمُ', translit: 'al-usbūʿ al-qādim', english: 'next week' },
    { arabic: 'الشَّهْرُ الْقَادِمُ', translit: 'ash-shahr al-qādim', english: 'next month' },
    { arabic: 'خُطَّةٌ', translit: 'khuṭṭa', english: 'plan' },
    {
      arabic: 'سَافَرَ',
      translit: 'sāfara',
      english: 'he travelled',
      note: 'Present: يُسَافِرُ (yusāfiru). I will travel: سَأُسَافِرُ.',
    },
    {
      arabic: 'رَجَعَ',
      translit: 'rajaʿa',
      english: 'he came back',
      note: 'Present: يَرْجِعُ (yarjiʿu).',
    },
    { arabic: 'رِحْلَةٌ', translit: 'riḥla', english: 'trip' },
    { arabic: 'إِجَازَةٌ', translit: 'ijāza', english: 'holiday, time off' },
    { arabic: 'بَحْرٌ', translit: 'baḥr', english: 'sea' },
    { arabic: 'الْبَحْرُ الْأَحْمَرُ', translit: 'al-baḥr al-aḥmar', english: 'the Red Sea' },
    { arabic: 'شَاطِئٌ', translit: 'shāṭiʾ', english: 'beach' },
    {
      arabic: 'سَبَحَ',
      translit: 'sabaḥa',
      english: 'he swam',
      note: 'Present: يَسْبَحُ (yasbaḥu).',
    },
    {
      arabic: 'غَوْصٌ',
      translit: 'ghawṣ',
      english: 'diving',
      note: 'To dive: غَاصَ / يَغُوصُ, a hollow verb.',
    },
    { arabic: 'رُبَّمَا', translit: 'rubbamā', english: 'maybe' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “I will travel”?',
      options: ['سَافَرْتُ', 'سَأُسَافِرُ', 'أُسَافِرُ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which word means “tomorrow”?',
      options: ['أَمْسِ', 'الْيَوْمَ', 'غَدًا'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'مَتَى سَتَرْجِعُ مِنَ الْبَحْرِ؟',
      options: ['سَأَرْجِعُ يَوْمَ السَّبْتِ.', 'رَجَعْتُ أَمْسِ.', 'أَرْجِعُ كُلَّ يَوْمٍ.'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which sentence is about the future?',
      options: ['ذَهَبْنَا إِلَى الشَّاطِئِ.', 'نَذْهَبُ إِلَى الشَّاطِئِ كُلَّ جُمُعَةٍ.', 'سَنَذْهَبُ إِلَى الشَّاطِئِ.'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'سَوْفَ نَسْبَحُ فِي الْبَحْرِ',
      options: ['سَبَحْنَا فِي الْبَحْرِ', 'سَوْفَ نَسْبَحُ فِي الْبَحْرِ', 'سَوْفَ نَسْبَحُ فِي النَّهْرِ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'بَعْدَ غَدٍ',
      options: ['غَدًا', 'الشَّهْرَ الْقَادِمَ', 'بَعْدَ غَدٍ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'شَاطِئٌ', english: 'beach' },
        { arabic: 'رِحْلَةٌ', english: 'trip' },
        { arabic: 'خُطَّةٌ', english: 'plan' },
        { arabic: 'إِجَازَةٌ', english: 'time off' },
        { arabic: 'غَوْصٌ', english: 'diving' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each future form with its meaning.',
      pairs: [
        { arabic: 'سَأُسَافِرُ', english: 'I will travel' },
        { arabic: 'سَنُسَافِرُ', english: 'we will travel' },
        { arabic: 'سَيُسَافِرُ', english: 'he will travel' },
        { arabic: 'سَيُسَافِرُونَ', english: 'they will travel' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'We will travel to the Red Sea.',
      words: ['سَنُسَافِرُ', 'إِلَى', 'الْبَحْرِ', 'الْأَحْمَرِ'],
      distractors: ['سَافَرْنَا'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Maybe I will dive tomorrow.',
      words: ['رُبَّمَا', 'سَأَغُوصُ', 'غَدًا'],
      distractors: ['أَمْسِ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'سَوْفَ',
      after: 'إِلَى الْإِسْكَنْدَرِيَّةِ الْأُسْبُوعَ الْقَادِمَ.',
      english: 'I will go to Alexandria next week.',
      options: ['ذَهَبْتُ', 'أَذْهَبُ', 'ذَهَبَ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'مَا',
      after: 'لِنِهَايَةِ الْأُسْبُوعِ؟',
      english: 'What is your plan for the weekend?',
      options: ['شَاطِئُكَ', 'خُطَّتُكَ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To talk about the future, put سَـ or سَوْفَ before the present verb. سَـ is joined to the verb; سَوْفَ is a separate word and often feels a little further off or more formal. The verb itself does not change.',
    },
    {
      type: 'table',
      head: ['Person', 'Present', 'Future'],
      rows: [
        ['I', 'أُسَافِرُ', 'سَأُسَافِرُ'],
        ['you (m)', 'تُسَافِرُ', 'سَتُسَافِرُ'],
        ['you (f)', 'تُسَافِرِينَ', 'سَتُسَافِرِينَ'],
        ['he', 'يُسَافِرُ', 'سَيُسَافِرُ'],
        ['she', 'تُسَافِرُ', 'سَتُسَافِرُ'],
        ['we', 'نُسَافِرُ', 'سَنُسَافِرُ'],
        ['they', 'يُسَافِرُونَ', 'سَيُسَافِرُونَ'],
      ],
    },
    {
      type: 'example',
      arabic: 'سَأُسَافِرُ غَدًا.',
      translit: 'sa-usāfiru ghadan.',
      english: 'I will travel tomorrow.',
    },
    {
      type: 'example',
      arabic: 'سَوْفَ نَرْجِعُ يَوْمَ السَّبْتِ.',
      translit: 'sawfa narjiʿu yawma s-sabt.',
      english: 'We will come back on Saturday.',
    },
    {
      type: 'p',
      text: 'Future time words usually come at the end. Used as time words, they end in -a: الْأُسْبُوعَ الْقَادِمَ (next week), الشَّهْرَ الْقَادِمَ (next month).',
    },
  ],
  cultureTip: {
    title: 'The Egyptian weekend',
    body: 'In Egypt the weekend is Friday and Saturday, so Thursday evening is when plans are made. Cairenes head to the Red Sea (Hurghada, Ain Sokhna, Dahab) or, in summer, to the Mediterranean coast. When people talk about any plan they usually add إِنْ شَاءَ اللَّهُ, “God willing”: سَأُسَافِرُ غَدًا، إِنْ شَاءَ اللَّهُ.',
  },
};
