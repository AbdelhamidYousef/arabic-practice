import type { CefrLevel } from '@arabic/shared';

// The seed lessons, written once as data and checked by `validate.ts` at seed time and in tests.
// Every word is common textbook Modern Standard Arabic, written with full harakat; the lesson
// vocabulary uses the dictionary form (nouns with tanwin, verbs in the first person or the
// 3rd-person past). All content is made up for this project. The teacher (the owner) is expected
// to review the Arabic before it is shown to anyone.

export interface SeedVocab {
  arabic: string;
  english: string;
  note?: string;
}

export interface SeedLesson {
  slug: string;
  title: string;
  level: CefrLevel;
  topic: string;
  summary: string;
  goals: string[];
  grammarFocus: string;
  /** English instructions for the AI partner. */
  scenario: string;
  /** The partner's first message, with full harakat. */
  openingLine: string;
  vocab: SeedVocab[];
}

// Shared tail of every scenario, so the partner's behaviour is the same across lessons.
const HOUSE_RULES =
  'Reply only in Arabic with full harakat. Keep to the level and to the lesson vocabulary, ask one ' +
  'short question at a time, and never correct the learner yourself: a separate step does that.';

export const seedLessons: SeedLesson[] = [
  {
    slug: 'greetings',
    title: 'Greetings and introductions',
    level: 'A1',
    topic: 'Meeting someone for the first time',
    summary: 'Say hello at different times of the day, give your name and ask how someone is.',
    goals: [
      'Greet someone politely at different times of the day',
      'Say your name and ask for theirs',
      'Ask and answer "How are you?"',
    ],
    grammarFocus: 'Nominal sentences with no verb "to be" (أَنَا طَالِبٌ) and the pronouns أَنَا / أَنْتَ.',
    scenario:
      'You are Salma, a friendly woman the learner meets for the first time at a language café. ' +
      'Greet them, ask their name and how they are, and answer the same questions about yourself. ' +
      'Use very short sentences (three to five words) and present-tense nominal sentences. ' +
      HOUSE_RULES,
    openingLine: 'السَّلَامُ عَلَيْكُمْ! أَنَا سَلْمَى. مَا اسْمُكَ؟',
    vocab: [
      { arabic: 'مَرْحَبًا', english: 'hello' },
      { arabic: 'أَهْلًا وَسَهْلًا', english: 'welcome' },
      { arabic: 'صَبَاحُ الْخَيْرِ', english: 'good morning' },
      { arabic: 'مَسَاءُ الْخَيْرِ', english: 'good evening' },
      {
        arabic: 'كَيْفَ حَالُكَ',
        english: 'how are you?',
        note: 'To a man. To a woman: كَيْفَ حَالُكِ.',
      },
      { arabic: 'بِخَيْرٍ', english: 'fine, well' },
      { arabic: 'شُكْرًا', english: 'thank you' },
      { arabic: 'اِسْمِي', english: 'my name is', note: 'Literally "my name".' },
      { arabic: 'تَشَرَّفْنَا', english: 'pleased to meet you' },
      { arabic: 'مَعَ السَّلَامَةِ', english: 'goodbye' },
    ],
  },
  {
    slug: 'family',
    title: 'My family',
    level: 'A1',
    topic: 'Talking about family members',
    summary: 'Name the people in your family and say who you have in it.',
    goals: [
      'Name close family members',
      'Say "I have a brother" with عِنْدِي',
      'Ask a friend about their family',
    ],
    grammarFocus:
      'Possessive endings (-ī, -ka, -ki) and عِنْدَ for "to have"; adjectives agreeing in gender.',
    scenario:
      'You are Karim, a friendly young man chatting with the learner about families. Tell them ' +
      'about your own made-up family (a big family, one sister) and ask about theirs. Use short ' +
      'present-tense sentences. ' +
      HOUSE_RULES,
    openingLine: 'أَهْلًا! عِنْدِي عَائِلَةٌ كَبِيرَةٌ. هَلْ عِنْدَكَ أَخٌ أَوْ أُخْتٌ؟',
    vocab: [
      { arabic: 'عَائِلَةٌ', english: 'family' },
      { arabic: 'أَبٌ', english: 'father' },
      { arabic: 'أُمٌّ', english: 'mother' },
      { arabic: 'أَخٌ', english: 'brother' },
      { arabic: 'أُخْتٌ', english: 'sister' },
      { arabic: 'اِبْنٌ', english: 'son' },
      { arabic: 'بِنْتٌ', english: 'girl, daughter' },
      { arabic: 'جَدٌّ', english: 'grandfather' },
      { arabic: 'جَدَّةٌ', english: 'grandmother' },
      { arabic: 'عَمٌّ', english: 'paternal uncle', note: "The mother's brother is خَالٌ." },
    ],
  },
  {
    slug: 'cafe-order',
    title: 'Ordering at a café',
    level: 'A2',
    topic: 'Ordering food and drink',
    summary: 'Ask for a drink, answer questions about sugar and milk, and ask for the bill.',
    goals: [
      'Order a drink and something to eat politely',
      'Answer simple questions from a waiter',
      'Ask for the bill',
    ],
    grammarFocus: 'أُرِيدُ + noun and أُرِيدُ أَنْ + subjunctive verb; polite requests with مِنْ فَضْلِكَ.',
    scenario:
      'You are a waiter in a small café. Welcome the learner, ask what they want to drink, offer ' +
      'sugar, milk or a cake, and bring the bill when they ask. Use only drinks and food from ' +
      'the vocabulary. ' +
      HOUSE_RULES,
    openingLine: 'أَهْلًا وَسَهْلًا فِي الْمَقْهَى! مَاذَا تُرِيدُ أَنْ تَشْرَبَ؟',
    vocab: [
      { arabic: 'قَهْوَةٌ', english: 'coffee' },
      { arabic: 'شَايٌ', english: 'tea' },
      { arabic: 'عَصِيرٌ', english: 'juice' },
      { arabic: 'مَاءٌ', english: 'water' },
      { arabic: 'حَلِيبٌ', english: 'milk' },
      { arabic: 'سُكَّرٌ', english: 'sugar' },
      { arabic: 'كَعْكَةٌ', english: 'a cake' },
      { arabic: 'قَائِمَةُ الطَّعَامِ', english: 'the menu' },
      { arabic: 'أُرِيدُ', english: 'I want' },
      { arabic: 'مِنْ فَضْلِكَ', english: 'please', note: 'To a man. To a woman: مِنْ فَضْلِكِ.' },
      { arabic: 'الْحِسَابُ', english: 'the bill' },
    ],
  },
  {
    slug: 'directions',
    title: 'Asking for directions',
    level: 'A2',
    topic: 'Finding your way in a city',
    summary: 'Ask where a place is and understand simple directions.',
    goals: [
      'Ask where a place is',
      'Understand "right", "left" and "straight ahead"',
      'Say whether a place is near or far',
    ],
    grammarFocus: 'The imperative (اِنْعَطِفْ) and prepositions of place (عَلَى، أَمَامَ، خَلْفَ).',
    scenario:
      "You are a visitor in the learner's city and you are lost. Ask the learner where a station, " +
      'a bank or a restaurant is, and react to their directions by repeating them back in your own ' +
      'words. Use short sentences. ' +
      HOUSE_RULES,
    openingLine: 'عَفْوًا يَا أَخِي، أَيْنَ الْمَحَطَّةُ مِنْ فَضْلِكَ؟',
    vocab: [
      { arabic: 'شَارِعٌ', english: 'street' },
      { arabic: 'عَلَى الْيَمِينِ', english: 'on the right' },
      { arabic: 'عَلَى الْيَسَارِ', english: 'on the left' },
      { arabic: 'مُبَاشَرَةً', english: 'straight ahead' },
      { arabic: 'قَرِيبٌ', english: 'near' },
      { arabic: 'بَعِيدٌ', english: 'far' },
      { arabic: 'أَيْنَ', english: 'where' },
      { arabic: 'مَحَطَّةٌ', english: 'station' },
      { arabic: 'مَصْرِفٌ', english: 'bank' },
      { arabic: 'اِنْعَطِفْ', english: 'turn!', note: 'Command to a man. To a woman: اِنْعَطِفِي.' },
    ],
  },
  {
    slug: 'daily-routine',
    title: 'My daily routine',
    level: 'A2',
    topic: 'Describing an ordinary day',
    summary: 'Say what you do every day and at what time.',
    goals: [
      'Describe the main parts of your day',
      'Say when you wake up, work and sleep',
      'Ask someone about their day',
    ],
    grammarFocus: 'The present tense (المُضَارِع) and its prefixes: أَ، نَ، يَ، تَ.',
    scenario:
      'You are a friendly neighbour talking about daily routines. Describe your own made-up ' +
      'routine in two or three short sentences (you wake up early, you work, you sleep late) and ' +
      'ask the learner about theirs. Use the present tense. ' +
      HOUSE_RULES,
    openingLine: 'صَبَاحُ الْخَيْرِ! أَنَا أَسْتَيْقِظُ بَاكِرًا كُلَّ يَوْمٍ. مَتَى تَسْتَيْقِظُ أَنْتَ؟',
    vocab: [
      { arabic: 'أَسْتَيْقِظُ', english: 'I wake up' },
      { arabic: 'أَتَنَاوَلُ الْفُطُورَ', english: 'I have breakfast' },
      { arabic: 'أَذْهَبُ', english: 'I go' },
      { arabic: 'أَعْمَلُ', english: 'I work' },
      { arabic: 'أَرْجِعُ', english: 'I return' },
      { arabic: 'أَنَامُ', english: 'I sleep' },
      { arabic: 'الْعَشَاءُ', english: 'dinner' },
      { arabic: 'بَاكِرًا', english: 'early' },
      { arabic: 'مُتَأَخِّرًا', english: 'late' },
      { arabic: 'كُلَّ يَوْمٍ', english: 'every day' },
      { arabic: 'السَّاعَةُ', english: 'the hour; the clock' },
    ],
  },
  {
    slug: 'shopping',
    title: 'Shopping for clothes',
    level: 'A2',
    topic: 'Buying things in a shop',
    summary: 'Ask the price, compare cheap and expensive, and say what you want to buy.',
    goals: [
      'Ask how much something costs',
      'Say that something is cheap or expensive',
      'Say what you would like to buy',
    ],
    grammarFocus: 'Demonstratives هَذَا / هَذِهِ and adjectives that agree with their noun.',
    scenario:
      'You are a shopkeeper in a small clothes shop. Show the learner a shirt, a bag or shoes, ' +
      'say the price, mention a discount if they hesitate, and ask what they want to buy. Use only ' +
      'short sentences and the vocabulary. ' +
      HOUSE_RULES,
    openingLine: 'أَهْلًا بِكَ فِي الْمَتْجَرِ! هَذَا الْقَمِيصُ جَمِيلٌ جِدًّا. هَلْ تُرِيدُ أَنْ تَشْتَرِيَهُ؟',
    vocab: [
      { arabic: 'سُوقٌ', english: 'market' },
      { arabic: 'مَتْجَرٌ', english: 'shop' },
      { arabic: 'ثَمَنٌ', english: 'price' },
      { arabic: 'غَالٍ', english: 'expensive' },
      { arabic: 'رَخِيصٌ', english: 'cheap' },
      { arabic: 'قَمِيصٌ', english: 'shirt' },
      { arabic: 'حِذَاءٌ', english: 'shoe' },
      { arabic: 'حَقِيبَةٌ', english: 'bag' },
      { arabic: 'كَمْ', english: 'how much; how many' },
      { arabic: 'أَشْتَرِي', english: 'I buy' },
      { arabic: 'تَخْفِيضٌ', english: 'discount' },
      { arabic: 'مَالٌ', english: 'money' },
    ],
  },
  {
    slug: 'weather',
    title: 'Talking about the weather',
    level: 'B1',
    topic: 'Weather and seasons',
    summary: "Describe today's weather, compare it with yesterday and talk about the seasons.",
    goals: [
      'Describe the weather today and yesterday',
      'Compare two days or two seasons',
      'Say which season you prefer and why',
    ],
    grammarFocus: 'Comparatives on the pattern أَفْعَلُ (أَبْرَدُ، أَحَرُّ) and the past with كَانَ.',
    scenario:
      'You are a pen friend in another city. Describe your weather (cloudy, strong wind, cold) ' +
      "and ask about the learner's weather. Ask which season they like. Use sentences of up to " +
      'eight words and one comparison at a time. ' +
      HOUSE_RULES,
    openingLine: 'كَيْفَ الطَّقْسُ الْيَوْمَ فِي مَدِينَتِكَ؟ هُنَا السَّمَاءُ غَائِمَةٌ وَالرِّيَاحُ قَوِيَّةٌ.',
    vocab: [
      { arabic: 'الطَّقْسُ', english: 'the weather' },
      { arabic: 'حَارٌّ', english: 'hot' },
      { arabic: 'بَارِدٌ', english: 'cold' },
      { arabic: 'مُمْطِرٌ', english: 'rainy' },
      { arabic: 'مُشْمِسٌ', english: 'sunny' },
      { arabic: 'غَائِمٌ', english: 'cloudy' },
      { arabic: 'مَطَرٌ', english: 'rain' },
      { arabic: 'ثَلْجٌ', english: 'snow' },
      { arabic: 'رِيَاحٌ', english: 'winds', note: 'Plural of رِيحٌ (a wind).' },
      { arabic: 'دَرَجَةُ الْحَرَارَةِ', english: 'the temperature' },
      { arabic: 'الشِّتَاءُ', english: 'winter' },
      { arabic: 'الصَّيْفُ', english: 'summer' },
    ],
  },
  {
    slug: 'at-the-doctor',
    title: 'At the doctor',
    level: 'B1',
    topic: 'Describing symptoms (role-play)',
    summary: 'Explain a small health problem to a doctor and understand simple advice.',
    goals: [
      'Say where it hurts and for how long',
      'Name common symptoms',
      "Understand a doctor's simple questions",
    ],
    grammarFocus: 'Verbs with attached object pronouns (يُؤْلِمُنِي) and saying how long with مُنْذُ.',
    scenario:
      'You are a doctor in a clinic, in a role-play. Ask the learner what the problem is, where ' +
      'it hurts and since when, and reply with simple, harmless advice such as resting and ' +
      'drinking water. Never give real medical advice: stay inside the made-up story. ' +
      HOUSE_RULES,
    openingLine: 'أَهْلًا بِكَ فِي الْعِيَادَةِ. مَا الْمُشْكِلَةُ؟ أَيْنَ يُؤْلِمُكَ؟',
    vocab: [
      { arabic: 'طَبِيبٌ', english: 'doctor', note: 'A woman doctor is طَبِيبَةٌ.' },
      { arabic: 'مُسْتَشْفًى', english: 'hospital' },
      { arabic: 'صَيْدَلِيَّةٌ', english: 'pharmacy' },
      { arabic: 'دَوَاءٌ', english: 'medicine' },
      { arabic: 'أَلَمٌ', english: 'pain' },
      { arabic: 'صُدَاعٌ', english: 'headache' },
      { arabic: 'حُمَّى', english: 'fever' },
      { arabic: 'سُعَالٌ', english: 'cough' },
      { arabic: 'مَرِيضٌ', english: 'sick; a patient' },
      { arabic: 'وَصْفَةٌ طِبِّيَّةٌ', english: 'prescription' },
      { arabic: 'مَوْعِدٌ', english: 'appointment' },
      { arabic: 'يُؤْلِمُنِي', english: 'it hurts me' },
    ],
  },
  {
    slug: 'travel-plans',
    title: 'Travel plans',
    level: 'B1',
    topic: 'Planning a trip',
    summary: 'Talk about where you will travel, when, and what you need for the trip.',
    goals: [
      'Say where and when you will travel',
      'Name what you need at the airport and the hotel',
      "Ask about someone else's holiday plans",
    ],
    grammarFocus: 'The future with سَـ and سَوْفَ, and the subjunctive after أَنْ.',
    scenario:
      'You are a friend planning a holiday. Say where you will travel and when, then ask the ' +
      'learner about their own plans for the holiday. Use the future tense with سَـ. Keep to the ' +
      'travel vocabulary. ' +
      HOUSE_RULES,
    openingLine: 'سَأُسَافِرُ إِلَى مَدِينَةٍ جَمِيلَةٍ فِي الْأُسْبُوعِ الْقَادِمِ. إِلَى أَيْنَ سَتُسَافِرُ أَنْتَ فِي الْعُطْلَةِ؟',
    vocab: [
      { arabic: 'رِحْلَةٌ', english: 'trip; flight' },
      { arabic: 'مَطَارٌ', english: 'airport' },
      { arabic: 'تَذْكِرَةٌ', english: 'ticket' },
      { arabic: 'جَوَازُ السَّفَرِ', english: 'passport' },
      { arabic: 'فُنْدُقٌ', english: 'hotel' },
      { arabic: 'حَجْزٌ', english: 'reservation' },
      { arabic: 'سَأُسَافِرُ', english: 'I will travel' },
      { arabic: 'غَدًا', english: 'tomorrow' },
      { arabic: 'الْأُسْبُوعَ الْقَادِمَ', english: 'next week' },
      { arabic: 'سِيَاحَةٌ', english: 'tourism' },
      { arabic: 'وِجْهَةٌ', english: 'destination' },
    ],
  },
  {
    slug: 'hobbies',
    title: 'Hobbies and free time',
    level: 'B1',
    topic: 'Talking about what you like to do',
    summary: "Say what you enjoy doing in your free time and ask about the other person's hobbies.",
    goals: [
      'Name common hobbies and sports',
      'Say what you like doing and how often',
      'Ask and answer about free time',
    ],
    grammarFocus: 'Verbal nouns after أُحِبُّ (أُحِبُّ الْقِرَاءَةَ) and أَنْ + subjunctive as the alternative.',
    scenario:
      'You are a classmate who likes reading, drawing and music. Share your hobbies in short ' +
      'sentences, ask the learner about theirs, and react with interest (for example that you also ' +
      'like football). ' +
      HOUSE_RULES,
    openingLine: 'مَا هِوَايَتُكَ الْمُفَضَّلَةُ؟ أَنَا أُحِبُّ الْقِرَاءَةَ فِي وَقْتِ الْفَرَاغِ، وَأَنْتَ؟',
    vocab: [
      { arabic: 'هِوَايَةٌ', english: 'hobby' },
      { arabic: 'قِرَاءَةٌ', english: 'reading' },
      { arabic: 'كِتَابَةٌ', english: 'writing' },
      { arabic: 'رِيَاضَةٌ', english: 'sport' },
      { arabic: 'كُرَةُ الْقَدَمِ', english: 'football' },
      { arabic: 'سِبَاحَةٌ', english: 'swimming' },
      { arabic: 'مُوسِيقَى', english: 'music' },
      { arabic: 'رَسْمٌ', english: 'drawing' },
      { arabic: 'طَبْخٌ', english: 'cooking' },
      { arabic: 'أُحِبُّ', english: 'I like; I love' },
      { arabic: 'أَسْتَمْتِعُ', english: 'I enjoy', note: 'Followed by بِـ: أَسْتَمْتِعُ بِالرِّيَاضَةِ.' },
      { arabic: 'وَقْتُ الْفَرَاغِ', english: 'free time' },
    ],
  },
  {
    slug: 'work-and-study',
    title: 'Work and study',
    level: 'B2',
    topic: 'A job interview conversation',
    summary: 'Talk about your studies, your experience and your work in a formal register.',
    goals: [
      'Describe your studies and your degree',
      'Talk about work experience and responsibilities',
      'Answer common interview questions in a formal register',
    ],
    grammarFocus: 'Relative clauses with الَّذِي / الَّتِي and conditional sentences with إِذَا.',
    scenario:
      'You are an interviewer at a company, in a role-play. Ask the learner about their studies, ' +
      'their work experience and what they learned, one question at a time, in a polite and ' +
      'formal register. React briefly to each answer before the next question. ' +
      HOUSE_RULES,
    openingLine: 'أَهْلًا بِكَ فِي الْمُقَابَلَةِ. حَدِّثْنِي عَنْ دِرَاسَتِكَ وَعَنْ خِبْرَتِكَ فِي الْعَمَلِ.',
    vocab: [
      { arabic: 'وَظِيفَةٌ', english: 'job' },
      { arabic: 'شَرِكَةٌ', english: 'company' },
      { arabic: 'مُوَظَّفٌ', english: 'employee' },
      { arabic: 'مُدِيرٌ', english: 'manager' },
      { arabic: 'جَامِعَةٌ', english: 'university' },
      { arabic: 'تَخَصُّصٌ', english: 'field of study; specialisation' },
      { arabic: 'شَهَادَةٌ', english: 'certificate; degree' },
      { arabic: 'مُقَابَلَةٌ', english: 'interview' },
      { arabic: 'خِبْرَةٌ', english: 'experience' },
      { arabic: 'رَاتِبٌ', english: 'salary' },
      { arabic: 'دِرَاسَةٌ', english: 'study' },
      { arabic: 'اِجْتِمَاعٌ', english: 'meeting' },
    ],
  },
  {
    slug: 'news-headlines',
    title: 'News headlines',
    level: 'B2',
    topic: 'Reading and discussing the news',
    summary: 'Understand the language of a short headline and give an opinion about a news story.',
    goals: [
      'Understand the verbs and nouns of common headlines',
      'Report what a headline says in a full sentence',
      'Give and justify a short opinion',
    ],
    grammarFocus:
      'Verb-first sentences in headlines, the past tense, and the passive voice (أُعْلِنَ).',
    scenario:
      'You are a colleague who has just read a made-up headline in the newspaper (fuel prices ' +
      'rose). Share it, ask the learner for their opinion, and follow up with one question about ' +
      'the economy. Keep the topic neutral and non-political. ' +
      HOUSE_RULES,
    openingLine: 'أَقْرَأُ الْيَوْمَ عُنْوَانًا فِي الصَّحِيفَةِ: اِرْتَفَعَ سِعْرُ الْوَقُودِ فِي الْبِلَادِ. مَاذَا تَعْتَقِدُ؟',
    vocab: [
      { arabic: 'أَخْبَارٌ', english: 'news', note: 'Plural of خَبَرٌ (a piece of news).' },
      { arabic: 'صَحِيفَةٌ', english: 'newspaper' },
      { arabic: 'عُنْوَانٌ', english: 'headline; title' },
      { arabic: 'حُكُومَةٌ', english: 'government' },
      { arabic: 'اِقْتِصَادٌ', english: 'economy' },
      { arabic: 'اِنْتِخَابَاتٌ', english: 'elections' },
      { arabic: 'أَعْلَنَ', english: 'he announced' },
      { arabic: 'اِرْتَفَعَ', english: 'it rose' },
      { arabic: 'اِنْخَفَضَ', english: 'it fell' },
      { arabic: 'قَرَارٌ', english: 'decision' },
      { arabic: 'مُؤْتَمَرٌ', english: 'conference' },
    ],
  },
];
