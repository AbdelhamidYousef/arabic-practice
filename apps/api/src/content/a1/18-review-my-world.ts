import type { ContentLesson } from '../types.ts';

// A1 L18: practice. A review of L13–L17 (family, work, home, numbers, your day), made-up for this
// app from the Classroom plan (curriculum/msa/a1.md, L18 🧪 practice); the owner reviews the
// Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-review-my-world',
  unit: 'A1.2',
  kind: 'review',
  title: 'Review: family, work, home and your day',
  topic: 'Talking about yourself: everything from the last five lessons',
  summary:
    'Bring it all together: your family, your work, your home, your phone number and your day.',
  goals: [
    'Introduce your family and say what you do',
    'Describe your home and what there is near it',
    'Ask questions with مَنْ، أَيْنَ، كَمْ، مَاذَا and answer them',
  ],
  grammarFocus: 'Recap: question words, -iyy / -iyya, عِنْدِي, هُنَاكَ and the present tense.',
  scenario:
    'You are Huda, a cheerful woman the learner meets at a language-exchange evening in Cairo. ' +
    'Get to know them: ask about their family, their work or studies, their flat, what there is ' +
    'near it and what they do on a normal day, and answer the same questions about yourself (you ' +
    'are an Egyptian teacher with one brother and one sister). ' +
    'Use very short sentences and only words from the last five lessons. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا وَسَهْلًا! أَنَا هُدَى. مَاذَا تَعْمَلُ؟',
  vocab: [
    { arabic: 'أَبٌ', translit: 'ab', english: 'father', note: 'My father: أَبِي.' },
    { arabic: 'أُمٌّ', translit: 'umm', english: 'mother', note: 'My mother: أُمِّي.' },
    { arabic: 'أَخٌ', translit: 'akh', english: 'brother', note: 'My brother: أَخِي.' },
    { arabic: 'أُخْتٌ', translit: 'ukht', english: 'sister' },
    { arabic: 'مَنْ', translit: 'man', english: 'who' },
    { arabic: 'مُهَنْدِسٌ', translit: 'muhandis', english: 'engineer' },
    { arabic: 'طَالِبٌ', translit: 'ṭālib', english: 'student' },
    { arabic: 'مَكْتَبٌ', translit: 'maktab', english: 'office' },
    {
      arabic: 'مِصْرِيٌّ',
      translit: 'miṣrī',
      english: 'Egyptian',
      note: 'For a woman: مِصْرِيَّةٌ (miṣriyya).',
    },
    { arabic: 'شَقَّةٌ', translit: 'shaqqa', english: 'flat, apartment' },
    { arabic: 'غُرْفَةٌ', translit: 'ghurfa', english: 'room' },
    { arabic: 'مَطْبَخٌ', translit: 'maṭbakh', english: 'kitchen' },
    { arabic: 'عِنْدِي', translit: 'ʿindī', english: 'I have' },
    { arabic: 'هُنَاكَ', translit: 'hunāka', english: 'there is, there are' },
    { arabic: 'يَسْكُنُ', translit: 'yaskun', english: 'to live (somewhere)' },
    { arabic: 'يَعْمَلُ', translit: 'yaʿmal', english: 'to work' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “my sister”?',
      options: ['أُخْتِي', 'أُمِّي', 'أَخِي'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'مَاذَا تَعْمَلُ؟',
      options: ['عِنْدِي أَخٌ', 'أَنَا مُهَنْدِسٌ', 'هُنَاكَ مَطْبَخٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'شَقَّةٌ',
      options: ['غُرْفَةٌ', 'مَطْبَخٌ', 'شَقَّةٌ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the question you hear.',
      audio: 'أَيْنَ تَسْكُنُ',
      options: ['مَاذَا تَعْمَلُ', 'أَيْنَ تَسْكُنُ', 'مَنْ هٰذَا'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'أَبٌ', english: 'father' },
        { arabic: 'أُمٌّ', english: 'mother' },
        { arabic: 'أَخٌ', english: 'brother' },
        { arabic: 'طَالِبٌ', english: 'student' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each question word with its meaning.',
      pairs: [
        { arabic: 'مَنْ', english: 'who' },
        { arabic: 'أَيْنَ', english: 'where' },
        { arabic: 'كَمْ', english: 'how many' },
        { arabic: 'مَاذَا', english: 'what (before a verb)' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I have a brother and a sister.',
      words: ['عِنْدِي', 'أَخٌ', 'وَأُخْتٌ'],
      distractors: ['أَبِي'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'My father is an engineer.',
      words: ['أَبِي', 'مُهَنْدِسٌ'],
      distractors: ['طَالِبٌ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'There is a small kitchen in the flat.',
      words: ['هُنَاكَ', 'مَطْبَخٌ', 'صَغِيرٌ', 'فِي', 'الشَّقَّةِ'],
      distractors: ['غُرْفَةٌ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هِيَ',
      after: 'فِي مَكْتَبٍ.',
      english: 'She works in an office.',
      options: ['يَعْمَلُ', 'تَعْمَلُ', 'أَعْمَلُ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'سَلْمَى',
      after: '',
      english: 'Salma is Egyptian.',
      options: ['مِصْرِيٌّ', 'مِصْرِيَّةٌ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'تَسْكُنُ؟',
      english: 'Where do you live?',
      options: ['أَيْنَ', 'مَنْ', 'كَمْ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'This lesson brings back the grammar of the last five lessons. Here is each point with one example.',
    },
    {
      type: 'table',
      head: ['Point', 'Example', 'Meaning'],
      rows: [
        ['question words', 'أَيْنَ تَسْكُنُ؟', 'Where do you live?'],
        ['nationality: -iyy / -iyya', 'هُوَ مِصْرِيٌّ، هِيَ مِصْرِيَّةٌ', 'He is Egyptian, she is Egyptian.'],
        ['“I have”', 'عِنْدِي أَخٌ وَأُخْتٌ', 'I have a brother and a sister.'],
        ['“there is”', 'هُنَاكَ مَقْهًى قَرِيبٌ', 'There is a café nearby.'],
        ['the present tense', 'هِيَ تَعْمَلُ فِي مَكْتَبٍ', 'She works in an office.'],
      ],
    },
    {
      type: 'p',
      text: 'Question words come first in the sentence. مَا asks “what” before a noun, مَاذَا before a verb.',
    },
    {
      type: 'example',
      arabic: 'مَا اسْمُ أَخِيكَ؟',
      translit: 'mā ismu akhīk',
      english: 'What is your brother’s name?',
    },
    {
      type: 'example',
      arabic: 'مَاذَا تَفْعَلُ مَسَاءً؟',
      translit: 'mādhā tafʿalu masāʾan',
      english: 'What do you do in the evening?',
    },
  ],
  cultureTip: {
    title: 'Family comes first',
    body: 'When you meet someone in Egypt, questions about your family come early: are you married, do you have children, how many brothers and sisters. It is a friendly way to get to know you, not prying, and a good chance to use everything from these lessons.',
  },
};
