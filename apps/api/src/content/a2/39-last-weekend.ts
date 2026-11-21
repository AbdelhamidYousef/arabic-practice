import type { ContentLesson } from '../types.ts';

// A2 L39: your last weekend. Made-up for this app from the Classroom plan (curriculum/msa/a2.md,
// L39: C31, G37, V27; the sound and writing items S18, S24, R17 are left out). The owner reviews
// the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-last-weekend',
  unit: 'A2.2',
  kind: 'lesson',
  title: 'Your last weekend',
  topic: 'A weekend in Alexandria',
  summary: 'Say what you did last weekend, using the past tense of regular verbs.',
  goals: [
    'Say what you did yesterday and last weekend',
    'Use the past tense for I, you, he, she, we and they',
    'Put events in order with ثُمَّ and بَعْدَ ذٰلِكَ',
  ],
  grammarFocus: 'The past tense of regular verbs: ذَهَبْتُ، ذَهَبَتْ، ذَهَبْنَا.',
  scenario:
    'You are Nour, the learner’s cheerful friend and colleague in Cairo. It is Sunday morning, the ' +
    'first working day of the week, and you chat about the weekend: you went to Alexandria with ' +
    'your family. Ask what the learner did on Friday and Saturday, and tell your own story in order ' +
    'with ثُمَّ and بَعْدَ ذٰلِكَ. Use the past tense of regular verbs in short A2 sentences with ' +
    'mostly words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine:
    'صَبَاحُ الْخَيْرِ! أَنَا ذَهَبْتُ إِلَى الْإِسْكَنْدَرِيَّةِ يَوْمَ الْجُمُعَةِ. وَأَنْتَ، مَاذَا فَعَلْتَ فِي عُطْلَةِ نِهَايَةِ الْأُسْبُوعِ؟',
  vocab: [
    { arabic: 'أَمْسِ', translit: 'ams', english: 'yesterday' },
    { arabic: 'أَوَّلَ أَمْسِ', translit: 'awwal ams', english: 'the day before yesterday' },
    { arabic: 'الْأُسْبُوعُ الْمَاضِي', translit: 'al-usbūʿ al-māḍī', english: 'last week' },
    {
      arabic: 'عُطْلَةُ نِهَايَةِ الْأُسْبُوعِ',
      translit: 'ʿuṭlat nihāyat al-usbūʿ',
      english: 'the weekend',
    },
    { arabic: 'مَسَاءً', translit: 'masāʾan', english: 'in the evening' },
    { arabic: 'ثُمَّ', translit: 'thumma', english: 'then' },
    { arabic: 'بَعْدَ ذٰلِكَ', translit: 'baʿda dhālika', english: 'after that' },
    {
      arabic: 'ذَهَبَ',
      translit: 'dhahaba',
      english: 'he went',
      note: 'Present: يَذْهَبُ. “To” is إِلَى.',
    },
    { arabic: 'رَجَعَ', translit: 'rajaʿa', english: 'he came back' },
    { arabic: 'خَرَجَ', translit: 'kharaja', english: 'he went out' },
    { arabic: 'جَلَسَ', translit: 'jalasa', english: 'he sat' },
    { arabic: 'شَرِبَ', translit: 'shariba', english: 'he drank' },
    { arabic: 'لَعِبَ', translit: 'laʿiba', english: 'he played' },
    { arabic: 'شَاهَدَ', translit: 'shāhada', english: 'he watched' },
    { arabic: 'طَبَخَ', translit: 'ṭabakha', english: 'he cooked' },
    { arabic: 'سَهِرَ', translit: 'sahira', english: 'he stayed up late' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “I went”?',
      options: ['ذَهَبَ', 'ذَهَبْتُ', 'ذَهَبْنَا'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which word means “yesterday”?',
      options: ['أَمْسِ', 'ثُمَّ', 'مَسَاءً'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which sentence means “We watched a film”?',
      options: ['شَاهَدُوا فِيلْمًا', 'شَاهَدْتُ فِيلْمًا', 'شَاهَدْنَا فِيلْمًا'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'خَرَجْتُ مَعَ أَصْدِقَائِي',
      options: ['خَرَجْتُ مَعَ أَصْدِقَائِي', 'خَرَجَتْ مَعَ أَصْدِقَائِهَا', 'رَجَعْتُ مَعَ أَصْدِقَائِي'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the question you hear.',
      audio: 'هَلْ سَهِرْتَ أَمْسِ؟',
      options: ['هَلْ خَرَجْتَ أَمْسِ؟', 'هَلْ سَهِرْتَ أَمْسِ؟', 'هَلْ طَبَخْتَ أَمْسِ؟'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each verb with its meaning.',
      pairs: [
        { arabic: 'ذَهَبَ', english: 'he went' },
        { arabic: 'رَجَعَ', english: 'he came back' },
        { arabic: 'شَرِبَ', english: 'he drank' },
        { arabic: 'جَلَسَ', english: 'he sat' },
        { arabic: 'طَبَخَ', english: 'he cooked' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each form with who did it.',
      pairs: [
        { arabic: 'ذَهَبْتُ', english: 'I went' },
        { arabic: 'ذَهَبَتْ', english: 'she went' },
        { arabic: 'ذَهَبْنَا', english: 'we went' },
        { arabic: 'ذَهَبُوا', english: 'they went' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'On Friday I went to Alexandria.',
      words: ['يَوْمَ', 'الْجُمُعَةِ', 'ذَهَبْتُ', 'إِلَى', 'الْإِسْكَنْدَرِيَّةِ'],
      distractors: ['ذَهَبَتْ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'We sat in a café, then we went back home.',
      words: ['جَلَسْنَا', 'فِي', 'مَقْهًى', 'ثُمَّ', 'رَجَعْنَا', 'إِلَى', 'الْبَيْتِ'],
      distractors: ['رَجَعُوا'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَمْسِ',
      after: 'أُخْتِي الْعَشَاءَ.',
      english: 'Yesterday my sister cooked dinner.',
      options: ['طَبَخَ', 'طَبَخَتْ', 'طَبَخْتُ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هَلْ',
      after: 'كُرَةَ الْقَدَمِ يَوْمَ السَّبْتِ؟',
      english: 'Did you (all) play football on Saturday?',
      options: ['لَعِبْتُمْ', 'لَعِبُوا'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'شَاهَدْنَا فِيلْمًا،',
      after: 'شَرِبْنَا الشَّايَ.',
      english: 'We watched a film, and after that we drank tea.',
      options: ['وَبَعْدَ ذٰلِكَ', 'وَأَمْسِ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'The past tense is built on one base, ذَهَبَ, “he went”, with an ending for each person. Learn the endings once and they work for every regular verb.',
    },
    {
      type: 'table',
      head: ['Person', 'Ending', 'ذَهَبَ, to go', 'شَاهَدَ, to watch'],
      rows: [
        ['أَنَا', 'ـْتُ', 'ذَهَبْتُ', 'شَاهَدْتُ'],
        ['أَنْتَ', 'ـْتَ', 'ذَهَبْتَ', 'شَاهَدْتَ'],
        ['أَنْتِ', 'ـْتِ', 'ذَهَبْتِ', 'شَاهَدْتِ'],
        ['هُوَ', 'ـَ', 'ذَهَبَ', 'شَاهَدَ'],
        ['هِيَ', 'ـَتْ', 'ذَهَبَتْ', 'شَاهَدَتْ'],
        ['نَحْنُ', 'ـْنَا', 'ذَهَبْنَا', 'شَاهَدْنَا'],
        ['أَنْتُمْ', 'ـْتُمْ', 'ذَهَبْتُمْ', 'شَاهَدْتُمْ'],
        ['هُمْ', 'ـُوا', 'ذَهَبُوا', 'شَاهَدُوا'],
      ],
    },
    {
      type: 'p',
      text: 'The ending already says who did it, so the pronoun is usually left out: ذَهَبْتُ is “I went”. The alif after ـُوا is written but not said.',
    },
    {
      type: 'example',
      arabic: 'ذَهَبْتُ إِلَى الْإِسْكَنْدَرِيَّةِ يَوْمَ الْجُمُعَةِ.',
      translit: 'dhahabtu ilā l-iskandariyya yawm al-jumuʿa',
      english: 'I went to Alexandria on Friday.',
    },
    {
      type: 'example',
      arabic: 'هَلْ خَرَجْتِ أَمْسِ؟',
      translit: 'hal kharajti ams',
      english: 'Did you go out yesterday? (to a woman)',
    },
    {
      type: 'example',
      arabic: 'شَاهَدْنَا فِيلْمًا، ثُمَّ سَهِرْنَا مَعَ أَصْدِقَائِنَا.',
      translit: 'shāhadnā fīlman, thumma sahirnā maʿa aṣdiqāʾinā',
      english: 'We watched a film, then stayed up late with our friends.',
    },
  ],
  cultureTip: {
    title: 'A Friday–Saturday weekend',
    body: 'In Egypt the weekend is Friday and Saturday, and Sunday is the first day of the working week. Friday is the day of the noon prayer and a big family lunch; in summer, many Cairo families spend the weekend by the sea in Alexandria or on the north coast.',
  },
};
