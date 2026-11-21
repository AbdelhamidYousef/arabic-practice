import type { ContentLesson } from '../types.ts';

// A1 L16: numbers in life. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L16: C10, G15, G17); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-numbers',
  unit: 'A1.2',
  kind: 'lesson',
  title: 'Numbers, phone and address',
  topic: 'Swapping phone numbers and addresses',
  summary: 'Count from zero to ten, give your phone number and address, and say what is near you.',
  goals: [
    'Count from zero to ten',
    'Give your phone number digit by digit and ask for someone’s',
    'Say what there is near your home with هُنَاكَ',
  ],
  grammarFocus: 'The numbers 0–10, and “there is”: هُنَاكَ مَقْهًى قَرِيبٌ.',
  scenario:
    'You are Nadia, a friendly colleague the learner has just met at their new office in Cairo. ' +
    'Swap phone numbers: ask for theirs (they say it one digit at a time) and give yours the same ' +
    'way, then ask where they live and what there is near their home, using هُنَاكَ. ' +
    'Use very short sentences, numbers from zero to ten only, and words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا! أَنَا نَادِيَةُ. مَا رَقْمُ هَاتِفِكَ؟',
  vocab: [
    { arabic: 'صِفْرٌ', translit: 'ṣifr', english: 'zero' },
    { arabic: 'وَاحِدٌ', translit: 'wāḥid', english: 'one' },
    { arabic: 'اثْنَانِ', translit: 'ithnān', english: 'two' },
    { arabic: 'ثَلَاثَةٌ', translit: 'thalātha', english: 'three' },
    { arabic: 'أَرْبَعَةٌ', translit: 'arbaʿa', english: 'four' },
    { arabic: 'خَمْسَةٌ', translit: 'khamsa', english: 'five' },
    { arabic: 'سِتَّةٌ', translit: 'sitta', english: 'six' },
    { arabic: 'سَبْعَةٌ', translit: 'sabʿa', english: 'seven' },
    { arabic: 'ثَمَانِيَةٌ', translit: 'thamāniya', english: 'eight' },
    { arabic: 'تِسْعَةٌ', translit: 'tisʿa', english: 'nine' },
    { arabic: 'عَشَرَةٌ', translit: 'ʿashara', english: 'ten' },
    {
      arabic: 'رَقْمُ الْهَاتِفِ',
      translit: 'raqm al-hātif',
      english: 'phone number',
      note: 'My phone number: رَقْمُ هَاتِفِي.',
    },
    { arabic: 'الْعُنْوَانُ', translit: 'al-ʿunwān', english: 'the address' },
    {
      arabic: 'كَمْ عُمْرُكَ',
      translit: 'kam ʿumruka',
      english: 'how old are you? (to a man)',
      note: 'To a woman: كَمْ عُمْرُكِ.',
    },
    { arabic: 'سَنَةٌ', translit: 'sana', english: 'year' },
    {
      arabic: 'هُنَاكَ',
      translit: 'hunāka',
      english: 'there is, there are',
      note: 'It also means “over there”.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word is the number 3?',
      options: ['ثَلَاثَةٌ', 'ثَمَانِيَةٌ', 'عَشَرَةٌ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which number comes after this one?',
      promptArabic: 'سِتَّةٌ',
      options: ['خَمْسَةٌ', 'سَبْعَةٌ', 'تِسْعَةٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the number you hear.',
      audio: 'أَرْبَعَةٌ',
      options: ['سَبْعَةٌ', 'تِسْعَةٌ', 'أَرْبَعَةٌ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'رَقْمُ الْهَاتِفِ',
      options: ['الْعُنْوَانُ', 'رَقْمُ الْهَاتِفِ', 'كَمْ عُمْرُكَ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each number with its meaning.',
      pairs: [
        { arabic: 'وَاحِدٌ', english: 'one' },
        { arabic: 'اثْنَانِ', english: 'two' },
        { arabic: 'خَمْسَةٌ', english: 'five' },
        { arabic: 'عَشَرَةٌ', english: 'ten' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each number with its meaning.',
      pairs: [
        { arabic: 'صِفْرٌ', english: 'zero' },
        { arabic: 'سِتَّةٌ', english: 'six' },
        { arabic: 'ثَمَانِيَةٌ', english: 'eight' },
        { arabic: 'تِسْعَةٌ', english: 'nine' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'There is a café nearby.',
      words: ['هُنَاكَ', 'مَقْهًى', 'قَرِيبٌ'],
      distractors: ['أَيْنَ'],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'What is your phone number?',
      words: ['مَا', 'رَقْمُ', 'هَاتِفِكَ'],
      distractors: ['عُمْرُكَ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'My address is Haram Street.',
      words: ['عُنْوَانِي', 'شَارِعُ', 'الْهَرَمِ'],
      distractors: ['رَقْمُ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'صَيْدَلِيَّةٌ فِي الشَّارِعِ.',
      english: 'There is a pharmacy in the street.',
      options: ['كَمْ', 'هُنَاكَ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'كَمْ',
      after: '',
      english: 'How old are you?',
      options: ['هَاتِفُكَ', 'عُنْوَانُكَ', 'عُمْرُكَ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Someone asks how old your son is. Pick a natural answer.',
      promptArabic: 'كَمْ عُمْرُ ابْنِكَ؟',
      options: ['عُمْرُهُ خَمْسُ سَنَوَاتٍ', 'فِي شَارِعِ الْهَرَمِ', 'صِفْرٌ، وَاحِدٌ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'Here are the numbers from zero to ten. A phone number is read one digit at a time, so these eleven words are all you need for it.',
    },
    {
      type: 'table',
      head: ['Digit', 'Arabic digit', 'Word', 'Say'],
      rows: [
        ['0', '٠', 'صِفْرٌ', 'ṣifr'],
        ['1', '١', 'وَاحِدٌ', 'wāḥid'],
        ['2', '٢', 'اثْنَانِ', 'ithnān'],
        ['3', '٣', 'ثَلَاثَةٌ', 'thalātha'],
        ['4', '٤', 'أَرْبَعَةٌ', 'arbaʿa'],
        ['5', '٥', 'خَمْسَةٌ', 'khamsa'],
        ['6', '٦', 'سِتَّةٌ', 'sitta'],
        ['7', '٧', 'سَبْعَةٌ', 'sabʿa'],
        ['8', '٨', 'ثَمَانِيَةٌ', 'thamāniya'],
        ['9', '٩', 'تِسْعَةٌ', 'tisʿa'],
        ['10', '١٠', 'عَشَرَةٌ', 'ʿashara'],
      ],
    },
    {
      type: 'p',
      text: 'هُنَاكَ means “there is” or “there are”. Put it before the thing, and you can say what is near you. To ask, put هَلْ in front.',
    },
    {
      type: 'example',
      arabic: 'هُنَاكَ مَقْهًى قَرِيبٌ.',
      translit: 'hunāka maqhan qarīb',
      english: 'There is a café nearby.',
    },
    {
      type: 'example',
      arabic: 'هَلْ هُنَاكَ صَيْدَلِيَّةٌ فِي الشَّارِعِ؟',
      translit: 'hal hunāka ṣaydaliyya fi sh-shāriʿ',
      english: 'Is there a pharmacy in the street?',
    },
    {
      type: 'p',
      text: 'With a noun after them, the numbers from three to ten change shape (عُمْرُهُ خَمْسُ سَنَوَاتٍ, “he is five years old”). For now, learn that answer as a phrase; ages over ten come with the numbers to a hundred.',
    },
  ],
  cultureTip: {
    title: 'Numbers run left to right',
    body: 'Arabic is written from right to left, but numbers inside it are written and read from left to right, just like yours. A phone number is said one digit at a time, often in small groups, so take it slowly and repeat it back to check.',
  },
};
