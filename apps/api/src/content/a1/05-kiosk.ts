import type { ContentLesson } from '../types.ts';

// A1 L05: shopping at a kiosk. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L05: C75; the row has no grammar spot, so this lesson teaches هَلْ عِنْدَكَ…؟ and بِكَمْ؟ as phrases);
// the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-kiosk',
  unit: 'A1.1',
  kind: 'lesson',
  title: 'At the kiosk',
  topic: 'Buying water and a SIM card',
  summary: 'Ask a shop if they have something, point at the one you want and ask the price.',
  goals: [
    'Ask “Do you have…?”',
    'Point at what you want: هٰذَا, this one',
    'Ask how much it is and pay',
  ],
  grammarFocus: 'Asking for things: هَلْ عِنْدَكَ…؟ and بِكَمْ؟, learned as phrases.',
  scenario:
    'You are Yusuf, a cheerful man who runs a small street kiosk in Cairo. The learner, who is new ' +
    'in the city, wants water and a SIM card for their phone, and maybe phone credit. Say what you ' +
    'have, ask which one they want, give the price in pounds with a simple word (no numbers above ' +
    'ten), and give them their change and a bag. Use very short sentences and only words from the ' +
    'lesson. Reply only in Arabic with full harakat, ask one short question at a time, and never ' +
    'correct the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا وَسَهْلًا! تَفَضَّلْ، مَاءٌ بَارِدٌ؟',
  vocab: [
    {
      arabic: 'هَلْ عِنْدَكَ',
      translit: 'hal ʿindaka',
      english: 'do you have…? (to a man)',
      note: 'To a woman: هَلْ عِنْدَكِ (hal ʿindaki).',
    },
    { arabic: 'كُشْكٌ', translit: 'kushk', english: 'kiosk' },
    { arabic: 'زُجَاجَةٌ', translit: 'zujāja', english: 'bottle' },
    { arabic: 'شَرِيحَةٌ', translit: 'sharīḥa', english: 'SIM card' },
    { arabic: 'هَاتِفٌ', translit: 'hātif', english: 'phone' },
    {
      arabic: 'رَصِيدٌ',
      translit: 'raṣīd',
      english: 'phone credit',
      note: 'Also “balance”, as in a bank account.',
    },
    { arabic: 'بِكَمْ', translit: 'bikam', english: 'how much? (for how much?)' },
    { arabic: 'جُنَيْهٌ', translit: 'junayh', english: 'pound (Egyptian money)' },
    { arabic: 'هٰذَا', translit: 'hādhā', english: 'this, this one' },
    { arabic: 'أَيْضًا', translit: 'ayḍan', english: 'also, too' },
    { arabic: 'كِيسٌ', translit: 'kīs', english: 'bag' },
    {
      arabic: 'بَارِدٌ',
      translit: 'bārid',
      english: 'cold',
      note: 'With a feminine word it becomes بَارِدَةٌ: more in the next lesson.',
    },
    { arabic: 'فَقَطْ', translit: 'faqaṭ', english: 'only, that’s all' },
    { arabic: 'الْبَاقِي', translit: 'al-bāqī', english: 'the change (money back)' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word means “phone”?',
      options: ['كِيسٌ', 'هَاتِفٌ', 'كُشْكٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'You want to know the price. What do you ask?',
      options: ['بِكَمْ هٰذَا؟', 'مِنْ أَيْنَ أَنْتَ؟', 'كَيْفَ حَالُكَ؟'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the question you hear.',
      audio: 'هَلْ عِنْدَكَ مَاءٌ بَارِدٌ؟',
      options: ['هَلْ عِنْدَكَ شَرِيحَةٌ؟', 'هَلْ عِنْدَكَ كِيسٌ؟', 'هَلْ عِنْدَكَ مَاءٌ بَارِدٌ؟'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'رَصِيدٌ',
      options: ['شَرِيحَةٌ', 'رَصِيدٌ', 'زُجَاجَةٌ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'زُجَاجَةٌ', english: 'bottle' },
        { arabic: 'شَرِيحَةٌ', english: 'SIM card' },
        { arabic: 'جُنَيْهٌ', english: 'pound (money)' },
        { arabic: 'كِيسٌ', english: 'bag' },
        { arabic: 'بَارِدٌ', english: 'cold' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'Do you have a SIM card?',
      words: ['هَلْ', 'عِنْدَكَ', 'شَرِيحَةٌ'],
      distractors: ['بِكَمْ'],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'How much is this?',
      words: ['بِكَمْ', 'هٰذَا'],
      distractors: ['هَلْ', 'أَيْنَ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هٰذَا،',
      after: 'فَضْلِكَ.',
      english: 'This one, please.',
      options: ['مِنْ', 'فِي'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'زُجَاجَةُ مَاءٍ',
      after: '، مِنْ فَضْلِكَ.',
      english: 'Just a bottle of water, please.',
      options: ['أَيْضًا', 'فَقَطْ', 'غَدًا'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'The seller gives you your money back. What is it called?',
      options: ['الرَّصِيدُ', 'الْكِيسُ', 'الْبَاقِي'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'The seller hands you the bag. What do you say?',
      options: ['شُكْرًا', 'آسِفٌ', 'لَا أَعْرِفُ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To ask a shopkeeper for something, say هَلْ عِنْدَكَ (hal ʿindaka), “do you have”, then the thing. You know هَلْ from the last lesson; take عِنْدَكَ as a phrase for now; lesson 15 shows how it works.',
    },
    {
      type: 'example',
      arabic: 'هَلْ عِنْدَكَ شَرِيحَةٌ؟',
      translit: 'hal ʿindaka sharīḥa?',
      english: 'Do you have a SIM card?',
    },
    {
      type: 'p',
      text: 'Point and say هٰذَا (hādhā), “this one”. To ask the price, say بِكَمْ؟ (bikam), “for how much?”, or بِكَمْ هٰذَا؟, “how much is this?”.',
    },
    {
      type: 'example',
      arabic: 'بِكَمْ هٰذَا؟',
      translit: 'bikam hādhā?',
      english: 'How much is this?',
    },
    {
      type: 'table',
      head: ['You say', 'Meaning'],
      rows: [
        ['هَلْ عِنْدَكَ…؟', 'Do you have…?'],
        ['هٰذَا، مِنْ فَضْلِكَ', 'This one, please.'],
        ['بِكَمْ؟', 'How much?'],
        ['فَقَطْ', 'That’s all.'],
      ],
    },
  ],
  cultureTip: {
    title: 'A kiosk on every corner',
    body: 'In Cairo a كُشْكٌ on the street corner sells water, snacks, tissues and phone credit, and many stay open late into the night. To top up your phone, ask for رَصِيدٌ and give your number. Keep small notes and coins: a big note can be hard to change.',
  },
};
