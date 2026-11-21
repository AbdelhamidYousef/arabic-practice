import type { ContentLesson } from '../types.ts';

// A1 L15: talking about your home. Made-up for this app from the Classroom plan
// (curriculum/msa/a1.md, L15: C09, G13, G14, K09); the owner reviews the Arabic before real
// learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-home',
  unit: 'A1.2',
  kind: 'lesson',
  title: 'My home',
  topic: 'Visiting a neighbour’s flat',
  summary: 'Describe a home and its rooms, and say what you have.',
  goals: [
    'Name the rooms of a home and a few things in them',
    'Use we, you (plural) and they',
    'Say what you have with عِنْدِي, عِنْدَكَ, عِنْدَكِ',
  ],
  grammarFocus: '“I have” is عِنْدِي, “at me”; and the plural pronouns نَحْنُ, أَنْتُمْ, هُمْ.',
  scenario:
    'You are Laila, the learner’s friendly neighbour in their building in Zamalek, Cairo. You have ' +
    'invited them into your flat. Show them the rooms, say what you and your family have (we have…, ' +
    'they are…), ask about their own flat with هَلْ عِنْدَكَ…؟, and, like a good Egyptian host, keep ' +
    'offering tea and something to eat. Use very short sentences without verbs and only words from ' +
    'the lesson. Reply only in Arabic with full harakat, ask one short question at a time, and never ' +
    'correct the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا وَسَهْلًا! تَفَضَّلْ، هٰذِهِ شَقَّتِي.',
  vocab: [
    { arabic: 'بَيْتٌ', translit: 'bayt', english: 'house, home' },
    { arabic: 'شَقَّةٌ', translit: 'shaqqa', english: 'flat, apartment' },
    { arabic: 'غُرْفَةُ النَّوْمِ', translit: 'ghurfat an-nawm', english: 'bedroom' },
    { arabic: 'غُرْفَةُ الْجُلُوسِ', translit: 'ghurfat al-julūs', english: 'living room' },
    { arabic: 'مَطْبَخٌ', translit: 'maṭbakh', english: 'kitchen' },
    { arabic: 'حَمَّامٌ', translit: 'ḥammām', english: 'bathroom' },
    { arabic: 'شُرْفَةٌ', translit: 'shurfa', english: 'balcony' },
    { arabic: 'سَرِيرٌ', translit: 'sarīr', english: 'bed' },
    { arabic: 'كُرْسِيٌّ', translit: 'kursī', english: 'chair' },
    { arabic: 'طَاوِلَةٌ', translit: 'ṭāwila', english: 'table' },
    { arabic: 'نَافِذَةٌ', translit: 'nāfidha', english: 'window' },
    { arabic: 'عِنْدِي', translit: 'ʿindī', english: 'I have' },
    { arabic: 'نَحْنُ', translit: 'naḥnu', english: 'we' },
    { arabic: 'أَنْتُمْ', translit: 'antum', english: 'you (more than one)' },
    { arabic: 'هُمْ', translit: 'hum', english: 'they' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word means “kitchen”?',
      options: ['حَمَّامٌ', 'شُرْفَةٌ', 'مَطْبَخٌ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'How do you say “we”?',
      options: ['نَحْنُ', 'هُمْ', 'أَنْتُمْ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Ask a woman if she has a balcony.',
      options: ['هَلْ عِنْدَكَ شُرْفَةٌ؟', 'هَلْ عِنْدَكِ شُرْفَةٌ؟', 'عِنْدِي شُرْفَةٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'عِنْدِي غُرْفَتَانِ',
      options: ['عِنْدِي غُرْفَةٌ وَاحِدَةٌ', 'عِنْدِي غُرْفَتَانِ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'هُمْ فِي غُرْفَةِ الْجُلُوسِ',
      options: ['نَحْنُ فِي غُرْفَةِ الْجُلُوسِ', 'أَنْتُمْ فِي غُرْفَةِ الْجُلُوسِ', 'هُمْ فِي غُرْفَةِ الْجُلُوسِ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'سَرِيرٌ', english: 'bed' },
        { arabic: 'كُرْسِيٌّ', english: 'chair' },
        { arabic: 'طَاوِلَةٌ', english: 'table' },
        { arabic: 'نَافِذَةٌ', english: 'window' },
        { arabic: 'شَقَّةٌ', english: 'flat' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I have a big kitchen.',
      words: ['عِنْدِي', 'مَطْبَخٌ', 'كَبِيرٌ'],
      distractors: ['كَبِيرَةٌ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'We are in the bedroom.',
      words: ['نَحْنُ', 'فِي', 'غُرْفَةِ', 'النَّوْمِ'],
      distractors: ['هُمْ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هَلْ',
      after: 'حَمَّامٌ؟',
      english: 'Do you (a man) have a bathroom?',
      options: ['عِنْدِي', 'عِنْدَكَ', 'عِنْدَكِ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'مِنْ مِصْرَ.',
      english: 'They are from Egypt.',
      options: ['نَحْنُ', 'هُمْ', 'أَنْتُمْ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'الْمَطْبَخُ',
      after: '',
      english: 'The kitchen is small.',
      options: ['صَغِيرٌ', 'صَغِيرَةٌ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Laila shows you her flat. Pick the right compliment.',
      options: ['الشَّقَّةُ جَمِيلَةٌ!', 'الشَّقَّةُ جَمِيلٌ!'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'You know أَنَا, أَنْتَ, أَنْتِ, هُوَ and هِيَ. Here are the plural ones; like the others, they need no verb in the present.',
    },
    {
      type: 'table',
      head: ['Arabic', 'Meaning'],
      rows: [
        ['نَحْنُ', 'we'],
        ['أَنْتُمْ', 'you (more than one)'],
        ['هُمْ', 'they'],
      ],
    },
    {
      type: 'example',
      arabic: 'نَحْنُ فِي الْمَطْبَخِ',
      translit: 'naḥnu fī l-maṭbakh',
      english: 'We are in the kitchen.',
    },
    {
      type: 'p',
      text: 'Arabic has no verb “to have”. It says عِنْدِي, “at me”: عِنْدَ (at) with the endings you know from lesson 4. You already asked هَلْ عِنْدَكَ…؟ at the kiosk.',
    },
    {
      type: 'table',
      head: ['Arabic', 'Meaning'],
      rows: [
        ['عِنْدِي', 'I have'],
        ['عِنْدَكَ', 'you have (a man)'],
        ['عِنْدَكِ', 'you have (a woman)'],
      ],
    },
    {
      type: 'example',
      arabic: 'عِنْدِي شَقَّةٌ صَغِيرَةٌ وَشُرْفَةٌ كَبِيرَةٌ',
      translit: 'ʿindī shaqqa ṣaghīra wa-shurfa kabīra',
      english: 'I have a small flat and a big balcony.',
    },
  ],
  cultureTip: {
    title: 'Hospitality: “You have to eat!”',
    body: 'A guest in an Egyptian home is offered tea, juice and food straight away, and a first “no, thank you” is rarely taken as an answer: the host insists, saying تَفَضَّلْ again and again. Take a little and praise the food; when you are really full, say الْحَمْدُ لِلَّهِ with a smile. Refusing everything can seem cold.',
  },
};
