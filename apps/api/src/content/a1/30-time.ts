import type { ContentLesson } from '../types.ts';

// A1 L30: what time is it? Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L30: C18, G71, G28, K12); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-time',
  unit: 'A1.3',
  kind: 'lesson',
  title: 'What time is it?',
  topic: 'Opening hours at the museum',
  summary:
    'Ask and tell the time, understand opening hours, and link ideas with and, or, but, then.',
  goals: [
    'Ask “What time is it?” and tell the time',
    'Understand when a place opens and closes',
    'Link two ideas with وَ، أَوْ، لٰكِنْ، ثُمَّ، فَـ',
  ],
  grammarFocus: 'Telling the time (السَّاعَةُ الثَّالِثَةُ) and linking words: وَ، أَوْ، لٰكِنْ، ثُمَّ، فَـ.',
  scenario:
    'You are Samia, who sells tickets at a museum in Cairo. The learner asks you questions: what ' +
    'time it is, when the museum opens (nine in the morning) and closes (five in the evening), ' +
    'and which day it is closed. Use the linking words وَ، أَوْ، لٰكِنْ، ثُمَّ in your answers. ' +
    'Use very short sentences, full hours, half and quarter hours only, and words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'صَبَاحُ الْخَيْرِ! أَهْلًا بِكَ فِي الْمِتْحَفِ. هَلْ عِنْدَكَ سُؤَالٌ؟',
  vocab: [
    { arabic: 'السَّاعَةُ', translit: 'as-sāʿa', english: 'the hour; the clock, the watch' },
    { arabic: 'كَمِ السَّاعَةُ', translit: 'kami s-sāʿa', english: 'what time is it?' },
    { arabic: 'دَقِيقَةٌ', translit: 'daqīqa', english: 'minute' },
    { arabic: 'رُبْعٌ', translit: 'rubʿ', english: 'quarter' },
    { arabic: 'نِصْفٌ', translit: 'niṣf', english: 'half' },
    { arabic: 'إِلَّا', translit: 'illā', english: 'minus, to (in times)' },
    { arabic: 'مَفْتُوحٌ', translit: 'maftūḥ', english: 'open' },
    { arabic: 'مُغْلَقٌ', translit: 'mughlaq', english: 'closed' },
    { arabic: 'يَفْتَحُ', translit: 'yaftaḥ', english: 'to open (it opens)' },
    { arabic: 'يُغْلِقُ', translit: 'yughliq', english: 'to close (it closes)' },
    { arabic: 'مُتَأَخِّرٌ', translit: 'mutaʾakhkhir', english: 'late' },
    { arabic: 'أَوْ', translit: 'aw', english: 'or' },
    { arabic: 'لٰكِنْ', translit: 'lākin', english: 'but' },
    { arabic: 'ثُمَّ', translit: 'thumma', english: 'then, after that' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you ask “What time is it?”',
      options: ['كَمْ عُمْرُكَ', 'كَمِ السَّاعَةُ', 'بِكَمْ هٰذَا'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'It is 3:30. Which one is right?',
      options: ['السَّاعَةُ الثَّالِثَةُ وَالرُّبْعُ', 'السَّاعَةُ الثَّالِثَةُ إِلَّا رُبْعًا', 'السَّاعَةُ الثَّالِثَةُ وَالنِّصْفُ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'مُغْلَقٌ',
      options: ['مُغْلَقٌ', 'مَفْتُوحٌ', 'مُتَأَخِّرٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the time you hear.',
      audio: 'السَّاعَةُ الْعَاشِرَةُ',
      options: ['السَّاعَةُ الثَّامِنَةُ', 'السَّاعَةُ الْعَاشِرَةُ', 'السَّاعَةُ الْوَاحِدَةُ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'رُبْعٌ', english: 'quarter' },
        { arabic: 'نِصْفٌ', english: 'half' },
        { arabic: 'دَقِيقَةٌ', english: 'minute' },
        { arabic: 'مَفْتُوحٌ', english: 'open' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each linking word with its meaning.',
      pairs: [
        { arabic: 'وَ', english: 'and' },
        { arabic: 'أَوْ', english: 'or' },
        { arabic: 'لٰكِنْ', english: 'but' },
        { arabic: 'ثُمَّ', english: 'then' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The museum opens at nine.',
      words: ['يَفْتَحُ', 'الْمِتْحَفُ', 'فِي', 'السَّاعَةِ', 'التَّاسِعَةِ'],
      distractors: ['يُغْلِقُ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'We visit the museum, then we eat.',
      words: ['نَزُورُ', 'الْمِتْحَفَ', 'ثُمَّ', 'نَأْكُلُ'],
      distractors: ['أَوْ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The shop is open but the bank is closed.',
      words: ['الْمَحَلُّ', 'مَفْتُوحٌ', 'لٰكِنِ', 'الْبَنْكُ', 'مُغْلَقٌ'],
      distractors: ['ثُمَّ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هَلْ تُرِيدُ شَايًا',
      after: 'قَهْوَةً؟',
      english: 'Do you want tea or coffee?',
      options: ['لٰكِنْ', 'أَوْ', 'ثُمَّ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'السَّاعَةُ الْخَامِسَةُ',
      after: '',
      english: 'It is a quarter to five.',
      options: ['وَالرُّبْعُ', 'وَالنِّصْفُ', 'إِلَّا رُبْعًا'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'مَتَى يُغْلِقُ الْمِتْحَفُ؟',
      options: ['فِي السَّاعَةِ الْخَامِسَةِ مَسَاءً', 'الْمِتْحَفُ كَبِيرٌ', 'نَعَمْ، هُوَ مَفْتُوحٌ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To tell the time, say السَّاعَةُ and then the hour as “the first, the second, the third…”. These words end in ـَةُ because السَّاعَةُ is feminine. Only one o’clock is different: الْوَاحِدَةُ.',
    },
    {
      type: 'table',
      head: ['Time', 'Arabic', 'Say'],
      rows: [
        ['1:00', 'السَّاعَةُ الْوَاحِدَةُ', 'as-sāʿa l-wāḥida'],
        ['2:00', 'السَّاعَةُ الثَّانِيَةُ', 'as-sāʿa th-thāniya'],
        ['3:00', 'السَّاعَةُ الثَّالِثَةُ', 'as-sāʿa th-thālitha'],
        ['4:00', 'السَّاعَةُ الرَّابِعَةُ', 'as-sāʿa r-rābiʿa'],
        ['5:00', 'السَّاعَةُ الْخَامِسَةُ', 'as-sāʿa l-khāmisa'],
        ['6:00', 'السَّاعَةُ السَّادِسَةُ', 'as-sāʿa s-sādisa'],
        ['7:00', 'السَّاعَةُ السَّابِعَةُ', 'as-sāʿa s-sābiʿa'],
        ['8:00', 'السَّاعَةُ الثَّامِنَةُ', 'as-sāʿa th-thāmina'],
        ['9:00', 'السَّاعَةُ التَّاسِعَةُ', 'as-sāʿa t-tāsiʿa'],
        ['10:00', 'السَّاعَةُ الْعَاشِرَةُ', 'as-sāʿa l-ʿāshira'],
        ['11:00', 'السَّاعَةُ الْحَادِيَةَ عَشْرَةَ', 'as-sāʿa l-ḥādiyata ʿashra'],
        ['12:00', 'السَّاعَةُ الثَّانِيَةَ عَشْرَةَ', 'as-sāʿa th-thāniyata ʿashra'],
      ],
    },
    {
      type: 'p',
      text: 'Add وَالرُّبْعُ (and a quarter), وَالنِّصْفُ (and a half) or إِلَّا رُبْعًا (minus a quarter). “At” a time is فِي السَّاعَةِ: يَفْتَحُ الْمِتْحَفُ فِي السَّاعَةِ التَّاسِعَةِ.',
    },
    {
      type: 'table',
      head: ['Word', 'Meaning', 'Example'],
      rows: [
        ['وَ', 'and', 'شَايٌ وَقَهْوَةٌ'],
        ['أَوْ', 'or', 'شَايٌ أَوْ قَهْوَةٌ؟'],
        ['لٰكِنْ', 'but', 'أَشْرَبُ الشَّايَ لٰكِنْ لَا أَشْرَبُ الْقَهْوَةَ.'],
        ['ثُمَّ', 'then, after a while', 'نَزُورُ الْمِتْحَفَ ثُمَّ نَأْكُلُ.'],
        ['فَـ', 'and so', 'الْمِتْحَفُ مُغْلَقٌ فَنَرْجِعُ غَدًا.'],
      ],
    },
    {
      type: 'p',
      text: 'وَ and فَـ are written joined to the next word. Before الْ, لٰكِنْ takes a short i to join: لٰكِنِ الْبَنْكُ مُغْلَقٌ.',
    },
  ],
  cultureTip: {
    title: 'Arab time and patience',
    body: 'In Egypt, time is often relaxed: “at five” can mean a quarter past, and a shop may open a little late. People keep calm about it, and you will hear the Egyptian word maʿlesh, “never mind”, many times a day. In MSA you can say لَا بَأْسَ, “no problem”. For trains, flights and official appointments, be on time.',
  },
};
