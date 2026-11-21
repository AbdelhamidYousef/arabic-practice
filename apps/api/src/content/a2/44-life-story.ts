import type { ContentLesson } from '../types.ts';

// A2 L44: a short life story. Made-up for this app from the Classroom plan (curriculum/msa/a2.md,
// L44: C35, G40, K14); the singer in the scenario is made up. The reading item (R22) is left out.
// The owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-life-story',
  unit: 'A2.2',
  kind: 'lesson',
  title: 'A short life story',
  topic: 'Telling the life of a famous person',
  summary:
    'Tell the story of a life in the past: where someone was born, where they lived and what they became.',
  goals: [
    'Say where someone was born and where they lived',
    'Use the hollow verbs كَانَ، قَالَ، زَارَ in the past',
    'Tell a short life story in four or five sentences',
  ],
  grammarFocus: 'Hollow verbs: a long ā for he and she (زَارَ), a short vowel for I and you (زُرْتُ).',
  scenario:
    'You are Mona, a guide at a small museum in Cairo about Samira, a made-up singer of the last ' +
    'century. Tell the learner short facts about her life (where she was born, where she lived, what ' +
    'she became, which cities she visited, what she said about music) and ask them about a person ' +
    'they admire. Use short past-tense sentences with the hollow verbs كَانَ، عَاشَ، زَارَ، قَالَ، صَارَ. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا بِكَ فِي الْمَتْحَفِ! هَذِهِ صُورَةُ الْمُغَنِّيَةِ سَمِيرَةَ. هَلْ تَعْرِفُ قِصَّتَهَا؟',
  vocab: [
    { arabic: 'حَيَاةٌ', translit: 'ḥayāh', english: 'life' },
    { arabic: 'طُفُولَةٌ', translit: 'ṭufūla', english: 'childhood' },
    {
      arabic: 'وُلِدَ',
      translit: 'wulida',
      english: 'he was born',
      note: 'I was born: وُلِدْتُ. She was born: وُلِدَتْ.',
    },
    {
      arabic: 'عَاشَ',
      translit: 'ʿāsha',
      english: 'he lived',
      note: 'Present: يَعِيشُ (yaʿīshu). I lived: عِشْتُ.',
    },
    {
      arabic: 'كَانَ',
      translit: 'kāna',
      english: 'he was',
      note: 'Present: يَكُونُ (yakūnu). I was: كُنْتُ.',
    },
    {
      arabic: 'قَالَ',
      translit: 'qāla',
      english: 'he said',
      note: 'Present: يَقُولُ (yaqūlu). I said: قُلْتُ.',
    },
    {
      arabic: 'زَارَ',
      translit: 'zāra',
      english: 'he visited',
      note: 'Present: يَزُورُ (yazūru). I visited: زُرْتُ.',
    },
    {
      arabic: 'صَارَ',
      translit: 'ṣāra',
      english: 'he became',
      note: 'Present: يَصِيرُ (yaṣīru). I became: صِرْتُ.',
    },
    {
      arabic: 'عَادَ',
      translit: 'ʿāda',
      english: 'he returned',
      note: 'Present: يَعُودُ (yaʿūdu). I returned: عُدْتُ.',
    },
    {
      arabic: 'تُوُفِّيَ',
      translit: 'tuwuffiya',
      english: 'he passed away',
      note: 'The polite word for “died” in a life story.',
    },
    { arabic: 'مَشْهُورٌ', translit: 'mashhūr', english: 'famous' },
    {
      arabic: 'مُغَنِّيَةٌ',
      translit: 'mughanniya',
      english: 'singer (a woman)',
      note: 'A male singer is مُغَنٍّ.',
    },
    { arabic: 'أُغْنِيَةٌ', translit: 'ughniya', english: 'song' },
    { arabic: 'صَوْتٌ', translit: 'ṣawt', english: 'voice' },
    { arabic: 'جُمْهُورٌ', translit: 'jumhūr', english: 'audience' },
    { arabic: 'قَرْيَةٌ', translit: 'qarya', english: 'village' },
    { arabic: 'عُمْرٌ', translit: 'ʿumr', english: 'age' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “she lived”?',
      options: ['عَاشَتْ', 'عِشْتُ', 'عَاشَ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which form means “I visited”?',
      options: ['زَارَ', 'زُرْتُ', 'زَارَتْ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'أَيْنَ وُلِدَتْ سَمِيرَةُ؟',
      options: ['صَارَتْ مُغَنِّيَةً مَشْهُورَةً.', 'زَارَتْ بَيْرُوتَ.', 'وُلِدَتْ فِي قَرْيَةٍ صَغِيرَةٍ.'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'كَانَ صَوْتُهَا جَمِيلًا',
      options: ['كَانَ صَوْتُهَا جَمِيلًا', 'كَانَتْ أُغْنِيَتُهَا جَمِيلَةً', 'صَارَ صَوْتُهَا مَشْهُورًا'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'قُلْتُ',
      options: ['قَالَ', 'قَالَتْ', 'قُلْتُ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'طُفُولَةٌ', english: 'childhood' },
        { arabic: 'جُمْهُورٌ', english: 'audience' },
        { arabic: 'أُغْنِيَةٌ', english: 'song' },
        { arabic: 'قَرْيَةٌ', english: 'village' },
        { arabic: 'مَشْهُورٌ', english: 'famous' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each verb with its meaning.',
      pairs: [
        { arabic: 'كَانَ', english: 'he was' },
        { arabic: 'عَاشَ', english: 'he lived' },
        { arabic: 'صَارَ', english: 'he became' },
        { arabic: 'عَادَ', english: 'he returned' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'She became a famous singer.',
      words: ['صَارَتْ', 'مُغَنِّيَةً', 'مَشْهُورَةً'],
      distractors: ['صَارَ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I visited Alexandria last year.',
      words: ['زُرْتُ', 'الْإِسْكَنْدَرِيَّةَ', 'فِي', 'السَّنَةِ', 'الْمَاضِيَةِ'],
      distractors: ['زَارَ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'عَاشَتْ سَمِيرَةُ فِي الْقَاهِرَةِ، ثُمَّ',
      after: 'إِلَى قَرْيَتِهَا.',
      english: 'Samira lived in Cairo, then she returned to her village.',
      options: ['عُدْتُ', 'عَادَتْ', 'عَادَ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'طِفْلًا سَعِيدًا فِي قَرْيَتِي.',
      english: 'I was a happy child in my village.',
      options: ['كُنْتُ', 'كَانَ', 'كَانَتْ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Samira talked about music. How do you say “she said”?',
      options: ['قُلْتُ', 'قَالَ', 'قَالَتْ'],
      answer: 2,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'A hollow verb has و or ي as its middle root letter. In the past, for he and she, that middle letter shows up as a long ā: قَالَ، كَانَ، زَارَ، عَاشَ.',
    },
    {
      type: 'p',
      text: 'When the ending starts with a consonant (I, you, we), the long ā gets short. Verbs with و in the middle take u: قُلْتُ، كُنْتُ، زُرْتُ. Verbs with ي in the middle take i: عِشْتُ، صِرْتُ.',
    },
    {
      type: 'table',
      head: ['Person', 'زَارَ (to visit)', 'عَاشَ (to live)'],
      rows: [
        ['I', 'زُرْتُ', 'عِشْتُ'],
        ['you (m)', 'زُرْتَ', 'عِشْتَ'],
        ['you (f)', 'زُرْتِ', 'عِشْتِ'],
        ['he', 'زَارَ', 'عَاشَ'],
        ['she', 'زَارَتْ', 'عَاشَتْ'],
        ['we', 'زُرْنَا', 'عِشْنَا'],
        ['they', 'زَارُوا', 'عَاشُوا'],
      ],
    },
    {
      type: 'example',
      arabic: 'وُلِدَتْ سَمِيرَةُ فِي قَرْيَةٍ، وَعَاشَتْ فِي الْقَاهِرَةِ.',
      translit: 'wulidat samīratu fī qarya, wa-ʿāshat fī l-qāhira.',
      english: 'Samira was born in a village and lived in Cairo.',
    },
    {
      type: 'example',
      arabic: 'كُنْتُ فِي الْمَتْحَفِ أَمْسِ، وَزُرْتُ قَاعَةَ الْمُوسِيقَى.',
      translit: 'kuntu fī l-matḥafi ams, wa-zurtu qāʿat al-mūsīqā.',
      english: 'I was at the museum yesterday and visited the music hall.',
    },
    {
      type: 'p',
      text: 'كَانَ keeps its partner in the accusative (-an), as you saw in an earlier lesson: كَانَ صَوْتُهَا جَمِيلًا (her voice was beautiful).',
    },
  ],
  cultureTip: {
    title: 'The Star of the East',
    body: 'Umm Kulthum, the Egyptian singer called “the Star of the East”, sang songs so long that one could fill a whole evening. For decades, on the first Thursday of the month, families across the Arab world gathered around the radio for her concert. Her songs still play in Cairo cafés today, and her slow, clear Arabic is a good place to start listening to Arabic music.',
  },
};
