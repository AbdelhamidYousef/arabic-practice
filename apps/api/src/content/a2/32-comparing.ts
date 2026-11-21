import type { ContentLesson } from '../types.ts';

// A2 L32: compare cities, prices and flats. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L32: C24, G31; the sound item S23 is left out). The owner reviews the
// Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-comparing',
  unit: 'A2.1',
  kind: 'lesson',
  title: 'Comparing cities, prices and flats',
  topic: 'Cairo or Alexandria?',
  summary: 'Compare two places or things and say which one is the biggest, cheapest or best.',
  goals: [
    'Say that one thing is bigger, cheaper or better than another',
    'Say which one is the biggest or the best',
    'Ask “Which one is cheaper?” and answer',
  ],
  grammarFocus: 'Comparing with أَفْعَلُ مِنْ: الْقَاهِرَةُ أَكْبَرُ مِنَ الْإِسْكَنْدَرِيَّةِ.',
  scenario:
    'You are Tarek, a cheerful colleague from Alexandria who now works in Cairo. Chat with the ' +
    'learner about which city is bigger, cheaper, quieter or more beautiful, and compare flats, ' +
    'neighbourhoods and prices in the two cities. Use comparatives with مِنْ in short A2 sentences ' +
    'with mostly words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا! أَنَا طَارِقٌ مِنَ الْإِسْكَنْدَرِيَّةِ. أَيُّ مَدِينَةٍ أَجْمَلُ فِي رَأْيِكَ: الْقَاهِرَةُ أَمِ الْإِسْكَنْدَرِيَّةُ؟',
  vocab: [
    {
      arabic: 'أَكْبَرُ',
      translit: 'akbar',
      english: 'bigger; older (for people)',
      note: 'From كَبِيرٌ. With الْ it means “the biggest”: الْأَكْبَرُ.',
    },
    { arabic: 'أَصْغَرُ', translit: 'aṣghar', english: 'smaller; younger' },
    { arabic: 'أَجْمَلُ', translit: 'ajmal', english: 'more beautiful' },
    { arabic: 'أَرْخَصُ', translit: 'arkhaṣ', english: 'cheaper' },
    { arabic: 'أَغْلَى', translit: 'aghlā', english: 'more expensive', note: 'From غَالٍ.' },
    { arabic: 'أَفْضَلُ', translit: 'afḍal', english: 'better', note: 'Also “the best”.' },
    { arabic: 'أَهْدَأُ', translit: 'ahdaʾ', english: 'quieter' },
    { arabic: 'أَقْدَمُ', translit: 'aqdam', english: 'older (for things)' },
    { arabic: 'أَكْثَرُ', translit: 'akthar', english: 'more' },
    { arabic: 'أَقَلُّ', translit: 'aqall', english: 'less, fewer' },
    {
      arabic: 'مِنْ',
      translit: 'min',
      english: 'than',
      note: 'After a comparative, مِنْ means “than”. Before الْ it is مِنَ.',
    },
    { arabic: 'هَادِئٌ', translit: 'hādiʾ', english: 'quiet' },
    { arabic: 'مُزْدَحِمٌ', translit: 'muzdaḥim', english: 'crowded' },
    { arabic: 'حَيٌّ', translit: 'ḥayy', english: 'neighbourhood', note: 'Plural أَحْيَاءٌ.' },
    { arabic: 'حَدِيثٌ', translit: 'ḥadīth', english: 'modern, new' },
    { arabic: 'قَدِيمٌ', translit: 'qadīm', english: 'old' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word means “cheaper”?',
      options: ['أَغْلَى', 'أَرْخَصُ', 'أَكْبَرُ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick the true sentence.',
      options: ['الْقَاهِرَةُ أَصْغَرُ مِنَ الْإِسْكَنْدَرِيَّةِ', 'الْقَاهِرَةُ أَكْبَرُ مِنَ الْإِسْكَنْدَرِيَّةِ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Make the comparative of this adjective.',
      promptArabic: 'قَدِيمٌ',
      options: ['أَحْدَثُ', 'أَقَلُّ', 'أَقْدَمُ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'أَهْدَأُ',
      options: ['أَهْدَأُ', 'هَادِئٌ', 'أَقْدَمُ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'هٰذَا الْحَيُّ مُزْدَحِمٌ',
      options: ['هٰذَا الْحَيُّ هَادِئٌ', 'هٰذَا الْحَيُّ مُزْدَحِمٌ', 'هٰذَا الْحَيُّ قَدِيمٌ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each comparative with its meaning.',
      pairs: [
        { arabic: 'أَكْبَرُ', english: 'bigger' },
        { arabic: 'أَصْغَرُ', english: 'smaller' },
        { arabic: 'أَغْلَى', english: 'more expensive' },
        { arabic: 'أَفْضَلُ', english: 'better' },
        { arabic: 'أَقَلُّ', english: 'less' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'هَادِئٌ', english: 'quiet' },
        { arabic: 'مُزْدَحِمٌ', english: 'crowded' },
        { arabic: 'حَدِيثٌ', english: 'modern' },
        { arabic: 'قَدِيمٌ', english: 'old' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'This flat is cheaper than that one.',
      words: ['هٰذِهِ', 'الشَّقَّةُ', 'أَرْخَصُ', 'مِنْ', 'تِلْكَ'],
      distractors: ['رَخِيصَةٌ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Cairo is the biggest city in Egypt.',
      words: ['الْقَاهِرَةُ', 'أَكْبَرُ', 'مَدِينَةٍ', 'فِي', 'مِصْرَ'],
      distractors: ['مِنْ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'الشَّايُ هُنَا',
      after: 'مِنَ الْقَهْوَةِ.',
      english: 'The tea here is cheaper than the coffee.',
      options: ['أَرْخَصُ', 'رَخِيصٌ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَيُّ حَيٍّ',
      after: 'فِي رَأْيِكَ؟',
      english: 'Which neighbourhood is quieter, in your opinion?',
      options: ['هَادِئٌ', 'أَهْدَأُ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To compare, Arabic puts the adjective into the pattern أَفْعَلُ and adds مِنْ, “than”. The comparative has one form for a man, a woman and a thing.',
    },
    {
      type: 'table',
      head: ['Adjective', 'Comparative', 'Meaning'],
      rows: [
        ['كَبِيرٌ', 'أَكْبَرُ', 'bigger'],
        ['رَخِيصٌ', 'أَرْخَصُ', 'cheaper'],
        ['هَادِئٌ', 'أَهْدَأُ', 'quieter'],
        ['غَالٍ', 'أَغْلَى', 'more expensive'],
        ['قَلِيلٌ', 'أَقَلُّ', 'less'],
        ['جَيِّدٌ', 'أَفْضَلُ', 'better'],
      ],
    },
    {
      type: 'example',
      arabic: 'الْقَاهِرَةُ أَكْبَرُ مِنَ الْإِسْكَنْدَرِيَّةِ.',
      translit: 'al-qāhira akbar mina l-iskandariyya',
      english: 'Cairo is bigger than Alexandria.',
    },
    {
      type: 'example',
      arabic: 'شَقَّتِي أَصْغَرُ مِنْ شَقَّتِكَ.',
      translit: 'shaqqatī aṣghar min shaqqatik',
      english: 'My flat is smaller than yours.',
    },
    {
      type: 'p',
      text: 'To say “the biggest”, put the comparative before a noun with no الْ (أَكْبَرُ مَدِينَةٍ, “the biggest city”), or use it on its own with الْ: هٰذَا الْحَيُّ هُوَ الْأَهْدَأُ, “this neighbourhood is the quietest”.',
    },
    {
      type: 'example',
      arabic: 'الْقَاهِرَةُ أَكْبَرُ مَدِينَةٍ فِي مِصْرَ.',
      translit: 'al-qāhira akbar madīna fī miṣr',
      english: 'Cairo is the biggest city in Egypt.',
    },
  ],
  cultureTip: {
    title: 'Egypt’s second city',
    body: 'Alexandria, الْإِسْكَنْدَرِيَّةُ, lies on the Mediterranean about three hours from Cairo by road or train. It is cooler and calmer in summer, so many Cairo families spend part of the summer there. Ask a Cairene and an Alexandrian which city is better, and you will hear a long, friendly argument.',
  },
};
