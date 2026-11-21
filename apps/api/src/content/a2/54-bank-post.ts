import type { ContentLesson } from '../types.ts';

// A2 L54: at the bank and the post office. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L54: C44, G48; no culture item, so a short practical tip). The owner
// reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-bank-post',
  unit: 'A2.3',
  kind: 'lesson',
  title: 'At the bank and the post office',
  topic: 'Sending a parcel',
  summary: 'Send a parcel, fill in a form, and take out or change money, saying what comes first.',
  goals: [
    'Send a parcel and ask how long it takes',
    'Open an account, take out money and sign a form',
    'Order events with عِنْدَمَا، قَبْلَ أَنْ، بَعْدَ أَنْ',
  ],
  grammarFocus: 'When, before, after: عِنْدَمَا + verb, قَبْلَ أَنْ + subjunctive, بَعْدَ أَنْ + past.',
  scenario:
    'You are Ahmed, a clerk at a post office in Cairo. The learner wants to send a parcel home. Ask ' +
    'what is in it, weigh it, give the price and how long it will take, and ask them to fill in a ' +
    'form and sign it. Then mention that the bank next door changes money. Use عِنْدَمَا، قَبْلَ أَنْ ' +
    'and بَعْدَ أَنْ in short sentences (وَقِّعْ هُنَا بَعْدَ أَنْ تَكْتُبَ الْعُنْوَانَ). ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'صَبَاحُ الْخَيْرِ! تَفَضَّلْ، مَاذَا تُرِيدُ أَنْ تُرْسِلَ الْيَوْمَ؟',
  vocab: [
    {
      arabic: 'بَنْكٌ',
      translit: 'bank',
      english: 'bank',
      note: 'Formal writing also uses مَصْرِفٌ.',
    },
    { arabic: 'حِسَابٌ', translit: 'ḥisāb', english: 'account' },
    {
      arabic: 'فَتَحَ',
      translit: 'fataḥa',
      english: 'he opened',
      note: 'Present: يَفْتَحُ (yaftaḥu).',
    },
    {
      arabic: 'سَحَبَ',
      translit: 'saḥaba',
      english: 'he withdrew (money)',
      note: 'Present: يَسْحَبُ (yasḥabu).',
    },
    { arabic: 'بِطَاقَةٌ', translit: 'biṭāqa', english: 'card' },
    { arabic: 'صَرَّافٌ آلِيٌّ', translit: 'ṣarrāf āliyy', english: 'cash machine' },
    { arabic: 'مَبْلَغٌ', translit: 'mablagh', english: 'amount (of money)' },
    { arabic: 'عُمْلَةٌ', translit: 'ʿumla', english: 'currency' },
    { arabic: 'مَكْتَبُ الْبَرِيدِ', translit: 'maktab al-barīd', english: 'post office' },
    { arabic: 'طَرْدٌ', translit: 'ṭard', english: 'parcel' },
    {
      arabic: 'أَرْسَلَ',
      translit: 'arsala',
      english: 'he sent',
      note: 'Present: يُرْسِلُ (yursilu).',
    },
    { arabic: 'طَابِعٌ', translit: 'ṭābiʿ', english: 'stamp' },
    { arabic: 'عُنْوَانٌ', translit: 'ʿunwān', english: 'address' },
    { arabic: 'اسْتِمَارَةٌ', translit: 'istimāra', english: 'form' },
    {
      arabic: 'وَقَّعَ',
      translit: 'waqqaʿa',
      english: 'he signed',
      note: 'Present: يُوَقِّعُ (yuwaqqiʿu). Sign here: وَقِّعْ هُنَا.',
    },
    { arabic: 'عِنْدَمَا', translit: 'ʿindamā', english: 'when' },
    { arabic: 'قَبْلَ أَنْ', translit: 'qabla an', english: 'before (+ verb)' },
    { arabic: 'بَعْدَ أَنْ', translit: 'baʿda an', english: 'after (+ verb)' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “I want to open an account”?',
      options: ['فَتَحْتُ حِسَابًا.', 'أُرِيدُ أَنْ أَفْتَحَ حِسَابًا.', 'أُرِيدُ أَنْ أَسْحَبَ مَالًا.'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Where do you buy a stamp?',
      options: ['فِي الصَّرَّافِ الْآلِيِّ', 'فِي الْمَطْعَمِ', 'فِي مَكْتَبِ الْبَرِيدِ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'مَتَى يَصِلُ الطَّرْدُ؟',
      options: ['بَعْدَ أُسْبُوعٍ تَقْرِيبًا.', 'فِي الْبَنْكِ.', 'وَقَّعْتُ الِاسْتِمَارَةَ.'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'وَقِّعْ هُنَا مِنْ فَضْلِكَ',
      options: ['اكْتُبِ الْعُنْوَانَ هُنَا', 'وَقِّعْ هُنَا مِنْ فَضْلِكَ', 'ادْفَعْ هُنَا مِنْ فَضْلِكَ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'عِنْدَمَا وَصَلْتُ إِلَى الْبَنْكِ',
      options: ['قَبْلَ أَنْ أَصِلَ إِلَى الْبَنْكِ', 'بَعْدَ أَنْ وَصَلْتُ إِلَى الْبَنْكِ', 'عِنْدَمَا وَصَلْتُ إِلَى الْبَنْكِ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'طَرْدٌ', english: 'parcel' },
        { arabic: 'طَابِعٌ', english: 'stamp' },
        { arabic: 'عُنْوَانٌ', english: 'address' },
        { arabic: 'عُمْلَةٌ', english: 'currency' },
        { arabic: 'اسْتِمَارَةٌ', english: 'form' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each verb with its meaning.',
      pairs: [
        { arabic: 'سَحَبَ', english: 'he withdrew' },
        { arabic: 'أَرْسَلَ', english: 'he sent' },
        { arabic: 'وَقَّعَ', english: 'he signed' },
        { arabic: 'فَتَحَ', english: 'he opened' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Before I send the parcel, I write the address.',
      words: ['قَبْلَ', 'أَنْ', 'أُرْسِلَ', 'الطَّرْدَ', 'أَكْتُبُ', 'الْعُنْوَانَ'],
      distractors: ['أُرْسِلُ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'When I arrived, the bank was closed.',
      words: ['عِنْدَمَا', 'وَصَلْتُ', 'كَانَ', 'الْبَنْكُ', 'مُغْلَقًا'],
      distractors: ['مُغْلَقٌ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'أَنْ سَحَبْتُ الْمَالَ، ذَهَبْتُ إِلَى السُّوقِ.',
      english: 'After I took out the money, I went to the market.',
      options: ['قَبْلَ', 'بَعْدَ', 'عِنْدَمَا'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'قَبْلَ أَنْ',
      after: 'الِاسْتِمَارَةَ، اقْرَأْهَا جَيِّدًا.',
      english: 'Before you sign the form, read it carefully.',
      options: ['تُوَقِّعَ', 'وَقَّعْتَ', 'تُوَقِّعُ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أُرِيدُ أَنْ أُرْسِلَ هَذَا',
      after: 'إِلَى لَنْدَنَ.',
      english: 'I want to send this parcel to London.',
      options: ['الطَّابِعَ', 'الْحِسَابَ', 'الطَّرْدَ'],
      answer: 2,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'عِنْدَمَا (when) joins two things that happen at the same time. A normal verb follows it, past or present.',
    },
    {
      type: 'example',
      arabic: 'عِنْدَمَا وَصَلْتُ، كَانَ الْبَنْكُ مُغْلَقًا.',
      translit: 'ʿindamā waṣaltu, kāna l-banku mughlaqan.',
      english: 'When I arrived, the bank was closed.',
    },
    {
      type: 'p',
      text: 'قَبْلَ أَنْ (before) takes the subjunctive, even when you talk about the past. بَعْدَ أَنْ (after) usually takes the past, because the action is already done.',
    },
    {
      type: 'example',
      arabic: 'قَبْلَ أَنْ أُرْسِلَ الطَّرْدَ، كَتَبْتُ الْعُنْوَانَ.',
      translit: 'qabla an ursila ṭ-ṭarda, katabtu l-ʿunwān.',
      english: 'Before I sent the parcel, I wrote the address.',
    },
    {
      type: 'table',
      head: ['Word', 'Verb after it', 'Example'],
      rows: [
        ['عِنْدَمَا', 'past or present', 'عِنْدَمَا وَصَلْتُ'],
        ['قَبْلَ أَنْ', 'subjunctive', 'قَبْلَ أَنْ أَصِلَ'],
        ['بَعْدَ أَنْ', 'past (usually)', 'بَعْدَ أَنْ وَصَلْتُ'],
      ],
    },
  ],
  cultureTip: {
    title: 'Banks and the post',
    body: 'Egyptian banks open Sunday to Thursday, from the morning to the early afternoon, and close on Friday and Saturday; cash machines work all week. In a bank or a big post office, take a number from the machine at the door and wait for it to be called. Bring your passport for anything with your name on it.',
  },
};
