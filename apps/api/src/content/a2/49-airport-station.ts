import type { ContentLesson } from '../types.ts';

// A2 L49: at the airport and the train station. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L49: C40, G44; no culture item, so a short practical tip on the night
// train). The reading item (R23) is left out. The owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-airport-station',
  unit: 'A2.3',
  kind: 'lesson',
  title: 'At the airport and the station',
  topic: 'The night train to Aswan',
  summary: 'Find your platform or gate, ask about delays and say what you forgot.',
  goals: [
    'Ask for the platform, the gate and the time',
    'Use weak-ending verbs: مَشَى، نَسِيَ، دَعَا',
    'Say “don’t forget…” with لَا تَنْسَ',
  ],
  grammarFocus: 'Weak-ending verbs: نَسِيَ → نَسِيتُ، مَشَى → مَشَيْتُ, and in the present يَنْسَى، يَمْشِي، يَدْعُو.',
  scenario:
    'You are Amr, a friendly employee at the information desk of Ramses station in Cairo. The ' +
    'learner wants to take the night train to Aswan. Help them with the platform, the time, the ' +
    'sleeper car and their ticket. At one point one of you has forgotten something, so use ' +
    'weak-ending verbs in the past and present (نَسِيتُ، لَا تَنْسَ، مَشَيْتُ، يَمْشِي، بَقِيَ). ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'مَسَاءُ الْخَيْرِ! أَهْلًا بِكَ فِي مَحَطَّةِ رَمْسِيسَ. إِلَى أَيْنَ تُسَافِرُ اللَّيْلَةَ؟',
  vocab: [
    { arabic: 'مَطَارٌ', translit: 'maṭār', english: 'airport' },
    { arabic: 'مَحَطَّةُ الْقِطَارِ', translit: 'maḥaṭṭat al-qiṭār', english: 'train station' },
    { arabic: 'قِطَارٌ', translit: 'qiṭār', english: 'train' },
    { arabic: 'طَائِرَةٌ', translit: 'ṭāʾira', english: 'plane' },
    { arabic: 'جَوَازُ سَفَرٍ', translit: 'jawāz safar', english: 'passport' },
    { arabic: 'رَصِيفٌ', translit: 'raṣīf', english: 'platform' },
    { arabic: 'بَوَّابَةٌ', translit: 'bawwāba', english: 'gate' },
    { arabic: 'حَقِيبَةٌ', translit: 'ḥaqība', english: 'bag, suitcase' },
    { arabic: 'مُسَافِرٌ', translit: 'musāfir', english: 'traveller' },
    {
      arabic: 'تَذْكِرَةُ ذَهَابٍ وَعَوْدَةٍ',
      translit: 'tadhkirat dhahāb wa-ʿawda',
      english: 'return ticket',
    },
    {
      arabic: 'عَرَبَةُ النَّوْمِ',
      translit: 'ʿarabat an-nawm',
      english: 'sleeper car',
    },
    { arabic: 'مُتَأَخِّرٌ', translit: 'mutaʾakhkhir', english: 'late, delayed' },
    {
      arabic: 'مَشَى',
      translit: 'mashā',
      english: 'he walked',
      note: 'Present: يَمْشِي (yamshī). I walked: مَشَيْتُ.',
    },
    {
      arabic: 'نَسِيَ',
      translit: 'nasiya',
      english: 'he forgot',
      note: 'Present: يَنْسَى (yansā). I forgot: نَسِيتُ.',
    },
    {
      arabic: 'دَعَا',
      translit: 'daʿā',
      english: 'he invited',
      note: 'Present: يَدْعُو (yadʿū). I invited: دَعَوْتُ.',
    },
    {
      arabic: 'جَرَى',
      translit: 'jarā',
      english: 'he ran',
      note: 'Present: يَجْرِي (yajrī). I ran: جَرَيْتُ.',
    },
    {
      arabic: 'بَقِيَ',
      translit: 'baqiya',
      english: 'he stayed',
      note: 'Present: يَبْقَى (yabqā). I stayed: بَقِيتُ.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “I forgot my passport”?',
      options: ['نَسِيَ جَوَازَ سَفَرِهِ.', 'نَسِيتُ جَوَازَ سَفَرِي.', 'لَا تَنْسَ جَوَازَ سَفَرِكَ.'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which form means “we walked”?',
      options: ['مَشَوْا', 'نَمْشِي', 'مَشَيْنَا'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'مِنْ أَيِّ رَصِيفٍ يَخْرُجُ الْقِطَارُ؟',
      options: ['مِنَ الرَّصِيفِ الثَّالِثِ.', 'فِي السَّاعَةِ الْعَاشِرَةِ.', 'مِنْ مَطَارِ الْقَاهِرَةِ.'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'You want a ticket there and back. What do you ask for?',
      options: ['تَذْكِرَةُ ذَهَابٍ فَقَطْ', 'تَذْكِرَةُ ذَهَابٍ وَعَوْدَةٍ', 'عَرَبَةُ النَّوْمِ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'الْقِطَارُ مُتَأَخِّرٌ سَاعَةً',
      options: ['الطَّائِرَةُ مُتَأَخِّرَةٌ سَاعَةً', 'الْقِطَارُ مُتَأَخِّرٌ سَاعَةً', 'الْقِطَارُ عَلَى الرَّصِيفِ الْآنَ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'لَا تَنْسَ حَقِيبَتَكَ',
      options: ['نَسِيتُ حَقِيبَتِي', 'لَا تَنْسَيْ حَقِيبَتَكِ', 'لَا تَنْسَ حَقِيبَتَكَ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'جَوَازُ سَفَرٍ', english: 'passport' },
        { arabic: 'رَصِيفٌ', english: 'platform' },
        { arabic: 'بَوَّابَةٌ', english: 'gate' },
        { arabic: 'حَقِيبَةٌ', english: 'suitcase' },
        { arabic: 'طَائِرَةٌ', english: 'plane' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each verb with its meaning.',
      pairs: [
        { arabic: 'مَشَى', english: 'he walked' },
        { arabic: 'نَسِيَ', english: 'he forgot' },
        { arabic: 'دَعَا', english: 'he invited' },
        { arabic: 'جَرَى', english: 'he ran' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I walked to the station.',
      words: ['مَشَيْتُ', 'إِلَى', 'الْمَحَطَّةِ'],
      distractors: ['مَشَى'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Don’t forget your ticket!',
      words: ['لَا', 'تَنْسَ', 'تَذْكِرَتَكَ'],
      distractors: ['تَنْسَى'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَنَا دَائِمًا',
      after: 'رَقْمَ الرَّصِيفِ!',
      english: 'I always forget the platform number!',
      options: ['نَسِيتُ', 'أَنْسَى', 'يَنْسَى'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'فِي عَرَبَةِ النَّوْمِ طُولَ اللَّيْلِ.',
      english: 'I stayed in the sleeper car all night.',
      options: ['بَقِيتُ', 'بَقِيَ', 'أَبْقَى'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'A weak-ending verb has و or ي as its last root letter, so it ends in a vowel instead of a consonant. In the past, the he-form ends in ـَى or ـَا (مَشَى، دَعَا) or in ـِيَ (نَسِيَ).',
    },
    {
      type: 'table',
      head: ['Person', 'مَشَى (to walk)', 'نَسِيَ (to forget)', 'دَعَا (to invite)'],
      rows: [
        ['I', 'مَشَيْتُ', 'نَسِيتُ', 'دَعَوْتُ'],
        ['you (m)', 'مَشَيْتَ', 'نَسِيتَ', 'دَعَوْتَ'],
        ['he', 'مَشَى', 'نَسِيَ', 'دَعَا'],
        ['she', 'مَشَتْ', 'نَسِيَتْ', 'دَعَتْ'],
        ['we', 'مَشَيْنَا', 'نَسِينَا', 'دَعَوْنَا'],
        ['they', 'مَشَوْا', 'نَسُوا', 'دَعَوْا'],
      ],
    },
    {
      type: 'p',
      text: 'In the present the verb ends in a long vowel: يَمْشِي، يَنْسَى، يَدْعُو. After لَمْ, or لَا meaning “don’t”, that long vowel becomes short: لَمْ يَمْشِ، لَا تَنْسَ!',
    },
    {
      type: 'example',
      arabic: 'نَسِيتُ تَذْكِرَتِي فِي الْفُنْدُقِ.',
      translit: 'nasītu tadhkiratī fī l-funduq.',
      english: 'I forgot my ticket at the hotel.',
    },
    {
      type: 'example',
      arabic: 'لَا تَنْسَ جَوَازَ سَفَرِكَ!',
      translit: 'lā tansa jawāza safarik!',
      english: 'Don’t forget your passport!',
    },
  ],
  cultureTip: {
    title: 'The night train to Aswan',
    body: 'A sleeper train runs from Cairo to Luxor and Aswan along the Nile. It leaves in the evening and arrives the next morning, so you save a night in a hotel. Book a few days ahead, keep your passport with you for the ticket check, and expect dinner and breakfast to be brought to your cabin.',
  },
};
