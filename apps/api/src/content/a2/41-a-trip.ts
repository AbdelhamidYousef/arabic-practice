import type { ContentLesson } from '../types.ts';

// A2 L41: a trip you made. Made-up for this app from the Classroom plan (curriculum/msa/a2.md,
// L41: C33, G38, V29). The owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-a-trip',
  unit: 'A2.2',
  kind: 'lesson',
  title: 'A trip you made',
  topic: 'A trip to Luxor',
  summary: 'Tell someone about a trip: where you went, what you saw and what it was like.',
  goals: [
    'Say where you went and what you saw on a trip',
    'Say what something was like with كَانَ',
    'Ask “How was the trip?” and answer',
  ],
  grammarFocus: 'كَانَ, “was”, with its predicate in -an: كَانَ الْجَوُّ جَمِيلًا.',
  scenario:
    'You are Karim, the learner’s friendly colleague in Cairo. The learner has just come back from ' +
    'a trip to Luxor. Ask how the trip was, how they travelled, what they saw (the temples, the ' +
    'river, the museum), and what the hotel and the weather were like, and share a short memory of ' +
    'your own trip to Aswan. Use the past tense and كَانَ with the -an ending in short A2 sentences ' +
    'with mostly words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا! سَمِعْتُ أَنَّكَ سَافَرْتَ إِلَى الْأُقْصُرِ. كَيْفَ كَانَتِ الرِّحْلَةُ؟',
  vocab: [
    { arabic: 'رِحْلَةٌ', translit: 'riḥla', english: 'trip' },
    { arabic: 'سَائِحٌ', translit: 'sāʾiḥ', english: 'tourist', note: 'Plural سُيَّاحٌ.' },
    { arabic: 'مَعْبَدٌ', translit: 'maʿbad', english: 'temple' },
    { arabic: 'آثَارٌ', translit: 'āthār', english: 'ancient monuments, ruins' },
    { arabic: 'مُتْحَفٌ', translit: 'mutḥaf', english: 'museum' },
    { arabic: 'فُنْدُقٌ', translit: 'funduq', english: 'hotel' },
    { arabic: 'قِطَارٌ', translit: 'qiṭār', english: 'train' },
    { arabic: 'نَهْرٌ', translit: 'nahr', english: 'river' },
    { arabic: 'قَارِبٌ', translit: 'qārib', english: 'boat' },
    { arabic: 'صُورَةٌ', translit: 'ṣūra', english: 'photo, picture' },
    {
      arabic: 'كَانَ',
      translit: 'kāna',
      english: 'he / it was',
      note: 'كُنْتُ, “I was”; كَانَتْ, “she / it was”.',
    },
    { arabic: 'الْجَوُّ', translit: 'al-jaww', english: 'the weather' },
    { arabic: 'شَمْسٌ', translit: 'shams', english: 'sun' },
    { arabic: 'رَائِعٌ', translit: 'rāʾiʿ', english: 'wonderful' },
    { arabic: 'مُمْتِعٌ', translit: 'mumtiʿ', english: 'enjoyable, fun' },
    { arabic: 'مُتْعَبٌ', translit: 'mutʿab', english: 'tired' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “I was tired”? (a man speaking)',
      options: ['كُنْتُ مُتْعَبًا', 'كَانَ مُتْعَبًا', 'كُنَّا مُتْعَبِينَ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Pick the correct sentence: “The weather was beautiful.”',
      options: ['كَانَ الْجَوُّ جَمِيلٌ', 'كَانَ الْجَوُّ جَمِيلًا'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Where do tourists see ancient things?',
      options: ['فِي الصَّيْدَلِيَّةِ', 'فِي الْمَطْبَخِ', 'فِي الْمُتْحَفِ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'كَانَتِ الرِّحْلَةُ رَائِعَةً',
      options: ['كَانَتِ الرِّحْلَةُ طَوِيلَةً', 'كَانَتِ الرِّحْلَةُ رَائِعَةً', 'كَانَ الْفُنْدُقُ رَائِعًا'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'سَافَرْنَا بِالْقِطَارِ',
      options: ['سَافَرْنَا بِالْقِطَارِ', 'سَافَرْنَا بِالْقَارِبِ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'مَعْبَدٌ', english: 'temple' },
        { arabic: 'مُتْحَفٌ', english: 'museum' },
        { arabic: 'فُنْدُقٌ', english: 'hotel' },
        { arabic: 'قَارِبٌ', english: 'boat' },
        { arabic: 'صُورَةٌ', english: 'photo' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each form of كَانَ with its meaning.',
      pairs: [
        { arabic: 'كُنْتُ', english: 'I was' },
        { arabic: 'كَانَ', english: 'he was' },
        { arabic: 'كَانَتْ', english: 'she was' },
        { arabic: 'كُنَّا', english: 'we were' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The hotel was near the river.',
      words: ['كَانَ', 'الْفُنْدُقُ', 'قَرِيبًا', 'مِنَ', 'النَّهْرِ'],
      distractors: ['قَرِيبٌ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'We were in Luxor for three days.',
      words: ['كُنَّا', 'فِي', 'الْأُقْصُرِ', 'ثَلَاثَةَ', 'أَيَّامٍ'],
      distractors: ['كُنْتُمْ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'كَانَتِ الشَّمْسُ',
      after: 'جِدًّا.',
      english: 'The sun was very hot.',
      options: ['حَارَّةٌ', 'حَارَّةً'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هَلْ',
      after: 'مُتْعَبِينَ بَعْدَ الرِّحْلَةِ؟',
      english: 'Were you (all) tired after the trip?',
      options: ['كُنْتُمْ', 'كُنَّا'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'شَاهَدْنَا',
      after: 'قَدِيمَةً جِدًّا فِي الْأُقْصُرِ.',
      english: 'We saw very old temples in Luxor.',
      options: ['مَعَابِدَ', 'فَنَادِقَ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'In the present, Arabic needs no verb “to be”: الْجَوُّ جَمِيلٌ. In the past it uses كَانَ, “was”, and the word that describes takes the ending -an: جَمِيلٌ becomes جَمِيلًا.',
    },
    {
      type: 'example',
      arabic: 'كَانَ الْجَوُّ جَمِيلًا.',
      translit: 'kāna l-jaww jamīlan',
      english: 'The weather was beautiful.',
    },
    {
      type: 'table',
      head: ['Person', 'كَانَ', 'Example'],
      rows: [
        ['أَنَا', 'كُنْتُ', 'كُنْتُ مُتْعَبًا.'],
        ['أَنْتَ / أَنْتِ', 'كُنْتَ / كُنْتِ', 'كُنْتَ سَعِيدًا.'],
        ['هُوَ', 'كَانَ', 'كَانَ الْفُنْدُقُ جَمِيلًا.'],
        ['هِيَ', 'كَانَتْ', 'كَانَتِ الرِّحْلَةُ مُمْتِعَةً.'],
        ['نَحْنُ', 'كُنَّا', 'كُنَّا فِي الْأُقْصُرِ.'],
        ['أَنْتُمْ', 'كُنْتُمْ', 'كُنْتُمْ هُنَاكَ.'],
        ['هُمْ', 'كَانُوا', 'كَانُوا سُعَدَاءَ.'],
      ],
    },
    {
      type: 'p',
      text: 'In كُنْتُ, كُنَّا and كُنْتُمْ the long ā drops: learn these forms as they are for now; a later lesson explains why. After a place (فِي الْأُقْصُرِ) or هُنَاكَ there is no ending to change.',
    },
    {
      type: 'example',
      arabic: 'كَانَتِ الرِّحْلَةُ طَوِيلَةً، وَلٰكِنْ كَانَتْ مُمْتِعَةً جِدًّا.',
      translit: 'kānati r-riḥla ṭawīlatan, wa-lākin kānat mumtiʿatan jiddan',
      english: 'The trip was long, but it was very enjoyable.',
    },
  ],
  cultureTip: {
    title: 'Luxor by train',
    body: 'Luxor, الْأُقْصُرُ, on the Nile in Upper Egypt, is home to the temples of Karnak and Luxor and, across the river, the Valley of the Kings. Many visitors take the overnight sleeper train from Cairo and wake up there; a felucca, a small sailing boat, on the river at sunset is part of the trip for many.',
  },
};
