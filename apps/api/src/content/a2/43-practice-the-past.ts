import type { ContentLesson } from '../types.ts';

// A2 L43: practice. The Classroom plan's practice lesson (curriculum/msa/a2.md, L43: catch-up,
// mini project, reading) becomes a review of L39–L42 here: the past tense, كَانَ and لَمْ. The
// reading part is left out. Made-up for this app; the owner reviews the Arabic before real
// learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-practice-the-past',
  unit: 'A2.2',
  kind: 'review',
  title: 'Practice: telling the past',
  topic: 'Review of lessons 39 to 42',
  summary:
    'Mix everything from the last four lessons: your weekend, your childhood, a trip and a small problem.',
  goals: [
    'Use the past tense for every person',
    'Describe the past with كَانَ and say what did not happen with لَمْ',
    'Tell a short story about your past, in order',
  ],
  grammarFocus: 'Review: past endings, كَانَ with -an, and لَمْ with the jussive.',
  scenario:
    'You are Mariam, a new friend the learner meets at a café in Zamalek, Cairo. Get to know each ' +
    'other through the past: ask where the learner was born and grew up, what they did last ' +
    'weekend, about a trip they made and about a small problem they once had, and share short ' +
    'stories of your own. Mix the past tense, كَانَ with -an and لَمْ with the jussive, in short A2 ' +
    'sentences with words from the last four lessons. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine:
    'أَهْلًا! أَنَا مَرْيَمُ. وُلِدْتُ فِي الْإِسْكَنْدَرِيَّةِ، وَانْتَقَلْتُ إِلَى الْقَاهِرَةِ السَّنَةَ الْمَاضِيَةَ. وَأَنْتَ، أَيْنَ كَبِرْتَ؟',
  vocab: [
    { arabic: 'أَمْسِ', translit: 'ams', english: 'yesterday' },
    { arabic: 'الْأُسْبُوعُ الْمَاضِي', translit: 'al-usbūʿ al-māḍī', english: 'last week' },
    { arabic: 'ثُمَّ', translit: 'thumma', english: 'then' },
    { arabic: 'ذَهَبَ', translit: 'dhahaba', english: 'he went' },
    { arabic: 'رَجَعَ', translit: 'rajaʿa', english: 'he came back' },
    { arabic: 'شَاهَدَ', translit: 'shāhada', english: 'he watched' },
    {
      arabic: 'وُلِدَ',
      translit: 'wulida',
      english: 'he was born',
      note: 'وُلِدْتُ, “I was born”.',
    },
    { arabic: 'كَبِرَ', translit: 'kabira', english: 'he grew up' },
    { arabic: 'انْتَقَلَ', translit: 'intaqala', english: 'he moved' },
    { arabic: 'رِحْلَةٌ', translit: 'riḥla', english: 'trip' },
    { arabic: 'كَانَ', translit: 'kāna', english: 'he / it was' },
    { arabic: 'مُمْتِعٌ', translit: 'mumtiʿ', english: 'enjoyable, fun' },
    { arabic: 'ضَاعَ', translit: 'ḍāʿa', english: 'it got lost' },
    { arabic: 'وَجَدَ', translit: 'wajada', english: 'he found' },
    { arabic: 'لَمْ', translit: 'lam', english: 'did not', note: 'Followed by the jussive.' },
    { arabic: 'لِلْأَسَفِ', translit: 'lil-asaf', english: 'unfortunately' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “she travelled”?',
      options: ['سَافَرْتُ', 'سَافَرَتْ', 'سَافَرُوا'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick the correct sentence: “The trip was enjoyable.”',
      options: ['كَانَتِ الرِّحْلَةُ مُمْتِعَةً', 'كَانَ الرِّحْلَةُ مُمْتِعٌ', 'كَانَتِ الرِّحْلَةُ مُمْتِعَةٌ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which sentence means “We didn’t watch the film”?',
      options: ['شَاهَدْنَا الْفِيلْمَ', 'لَا نُشَاهِدُ الْفِيلْمَ', 'لَمْ نُشَاهِدِ الْفِيلْمَ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'كَبِرْتُ فِي الْإِسْكَنْدَرِيَّةِ',
      options: ['وُلِدْتُ فِي الْإِسْكَنْدَرِيَّةِ', 'كَبِرْتُ فِي الْإِسْكَنْدَرِيَّةِ', 'سَكَنْتُ فِي الْإِسْكَنْدَرِيَّةِ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'لَمْ نَجِدِ الْفُنْدُقَ',
      options: ['لَمْ نَجِدِ الْفُنْدُقَ', 'وَجَدْنَا الْفُنْدُقَ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'كُنَّا مُتْعَبِينَ',
      options: ['كَانُوا مُتْعَبِينَ', 'كُنْتُ مُتْعَبًا', 'كُنَّا مُتْعَبِينَ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'أَمْسِ', english: 'yesterday' },
        { arabic: 'ثُمَّ', english: 'then' },
        { arabic: 'لِلْأَسَفِ', english: 'unfortunately' },
        { arabic: 'الْأُسْبُوعُ الْمَاضِي', english: 'last week' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each verb with its meaning.',
      pairs: [
        { arabic: 'رَجَعْنَا', english: 'we came back' },
        { arabic: 'وُلِدْتُ', english: 'I was born' },
        { arabic: 'ضَاعَ', english: 'it got lost' },
        { arabic: 'انْتَقَلُوا', english: 'they moved' },
        { arabic: 'كَانَتْ', english: 'she was' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Last week we went to Luxor by train.',
      words: ['الْأُسْبُوعَ', 'الْمَاضِيَ', 'ذَهَبْنَا', 'إِلَى', 'الْأُقْصُرِ', 'بِالْقِطَارِ'],
      distractors: ['ذَهَبُوا'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'My family moved to Cairo.',
      words: ['انْتَقَلَتْ', 'عَائِلَتِي', 'إِلَى', 'الْقَاهِرَةِ'],
      distractors: ['انْتَقَلُوا'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'كَانَ الْجَوُّ',
      after: 'يَوْمَ السَّبْتِ.',
      english: 'The weather was hot on Saturday.',
      options: ['حَارًّا', 'حَارٌّ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَمْسِ',
      after: 'إِلَى الْبَيْتِ مُتَأَخِّرِينَ.',
      english: 'Yesterday they came back home late.',
      options: ['رَجَعَ', 'رَجَعُوا', 'رَجَعْنَا'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'Three tools tell the past. The past tense says what happened, with one ending for each person; كَانَ follows the same endings, with a short vowel in some forms.',
    },
    {
      type: 'table',
      head: ['Person', 'رَجَعَ, to come back', 'كَانَ, was'],
      rows: [
        ['أَنَا', 'رَجَعْتُ', 'كُنْتُ'],
        ['أَنْتَ', 'رَجَعْتَ', 'كُنْتَ'],
        ['أَنْتِ', 'رَجَعْتِ', 'كُنْتِ'],
        ['هُوَ', 'رَجَعَ', 'كَانَ'],
        ['هِيَ', 'رَجَعَتْ', 'كَانَتْ'],
        ['نَحْنُ', 'رَجَعْنَا', 'كُنَّا'],
        ['أَنْتُمْ', 'رَجَعْتُمْ', 'كُنْتُمْ'],
        ['هُمْ', 'رَجَعُوا', 'كَانُوا'],
      ],
    },
    {
      type: 'p',
      text: 'After كَانَ, the word that describes takes -an: كَانَ الْفُنْدُقُ جَمِيلًا. To say what did not happen, use لَمْ with the present verb ending in a sukun: لَمْ أَذْهَبْ.',
    },
    {
      type: 'example',
      arabic: 'كَانَ الْجَوُّ حَارًّا، فَجَلَسْنَا فِي مَقْهًى.',
      translit: 'kāna l-jaww ḥārran, fa-jalasnā fī maqhan',
      english: 'The weather was hot, so we sat in a café.',
    },
    {
      type: 'example',
      arabic: 'ذَهَبْنَا إِلَى الْمُتْحَفِ، وَلٰكِنْ لَمْ نَجِدْ تَذَاكِرَ.',
      translit: 'dhahabnā ilā l-mutḥaf, wa-lākin lam najid tadhākir',
      english: 'We went to the museum, but we didn’t find any tickets.',
    },
  ],
  cultureTip: null,
};
