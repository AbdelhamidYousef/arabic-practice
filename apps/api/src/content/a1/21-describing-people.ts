import type { ContentLesson } from '../types.ts';

// A1 L21: describe people. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L21: C14, G19); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-describing-people',
  unit: 'A1.2',
  kind: 'lesson',
  title: 'Describing people',
  topic: 'What someone looks like and what they are like',
  summary: 'Describe someone’s looks and character, and say “his”, “her”, “our” and “their”.',
  goals: [
    'Say what someone looks like: tall, short, black hair',
    'Say what someone is like: kind, clever, calm',
    'Use the endings for my, your, his, her, our and their',
  ],
  grammarFocus: 'Attached pronouns on nouns and prepositions: بَيْتُهَا، مَعَنَا، شَعْرُهُ.',
  scenario:
    'You are Layla, a woman in a café in Cairo showing the learner photos of her family on her ' +
    'phone. Describe your brother Karim and your sister Huda (looks and character) with short ' +
    'sentences that use the attached endings (أَخِي، شَعْرُهُ، أُخْتُهَا، مَعَنَا), then ask the ' +
    'learner to describe someone in their own family. ' +
    'Use very short sentences with no verb where you can, and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'اُنْظُرْ! هٰذِهِ أُخْتِي هُدَى. هِيَ طَوِيلَةٌ وَمَرِحَةٌ.',
  vocab: [
    {
      arabic: 'طَوِيلٌ',
      translit: 'ṭawīl',
      english: 'tall, long',
      note: 'For a woman, add ـَةٌ: طَوِيلَةٌ. The same goes for the words below.',
    },
    { arabic: 'قَصِيرٌ', translit: 'qaṣīr', english: 'short' },
    { arabic: 'كَبِيرٌ', translit: 'kabīr', english: 'big; old (of a person)' },
    { arabic: 'صَغِيرٌ', translit: 'ṣaghīr', english: 'small; young' },
    { arabic: 'جَمِيلٌ', translit: 'jamīl', english: 'beautiful, handsome' },
    { arabic: 'لَطِيفٌ', translit: 'laṭīf', english: 'kind, nice' },
    { arabic: 'ذَكِيٌّ', translit: 'dhakī', english: 'clever' },
    { arabic: 'مَرِحٌ', translit: 'mariḥ', english: 'cheerful, fun' },
    { arabic: 'هَادِئٌ', translit: 'hādiʾ', english: 'calm, quiet' },
    { arabic: 'نَشِيطٌ', translit: 'nashīṭ', english: 'active, hard-working' },
    { arabic: 'شَعْرٌ', translit: 'shaʿr', english: 'hair' },
    {
      arabic: 'عَيْنٌ',
      translit: 'ʿayn',
      english: 'eye',
      note: 'Eyes: عُيُونٌ (ʿuyūn).',
    },
    {
      arabic: 'أَسْوَدُ',
      translit: 'aswad',
      english: 'black',
      note: 'For a woman or a feminine noun: سَوْدَاءُ.',
    },
    { arabic: 'بُنِّيٌّ', translit: 'bunnī', english: 'brown' },
    { arabic: 'مَعَ', translit: 'maʿa', english: 'with' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “his house”?',
      options: ['بَيْتُهَا', 'بَيْتُهُ', 'بَيْتُهُمْ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which word is the opposite of this one?',
      promptArabic: 'طَوِيلٌ',
      options: ['قَصِيرٌ', 'كَبِيرٌ', 'جَمِيلٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'مَعَنَا',
      options: ['مَعَهُمْ', 'مَعَكَ', 'مَعَنَا'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'شَعْرُهَا أَسْوَدُ',
      options: ['شَعْرُهُ أَسْوَدُ', 'شَعْرُهَا أَسْوَدُ', 'شَعْرُهَا بُنِّيٌّ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'لَطِيفٌ', english: 'kind' },
        { arabic: 'ذَكِيٌّ', english: 'clever' },
        { arabic: 'هَادِئٌ', english: 'calm' },
        { arabic: 'نَشِيطٌ', english: 'active' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each phrase with its meaning.',
      pairs: [
        { arabic: 'بَيْتِي', english: 'my house' },
        { arabic: 'بَيْتُنَا', english: 'our house' },
        { arabic: 'بَيْتُكُمْ', english: 'your (plural) house' },
        { arabic: 'بَيْتُهُمْ', english: 'their house' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'My brother is tall and cheerful.',
      words: ['أَخِي', 'طَوِيلٌ', 'وَمَرِحٌ'],
      distractors: ['أُخْتِي'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'His hair is black.',
      words: ['شَعْرُهُ', 'أَسْوَدُ'],
      distractors: ['شَعْرُهَا'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'She lives with us.',
      words: ['هِيَ', 'تَسْكُنُ', 'مَعَنَا'],
      distractors: ['مَعَهُمْ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هٰذِهِ أُخْتِي.',
      after: 'جَمِيلَةٌ وَذَكِيَّةٌ.',
      english: 'This is my sister. She is beautiful and clever.',
      options: ['هُوَ', 'هِيَ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أُخْتِي',
      after: '',
      english: 'My sister is short.',
      options: ['قَصِيرَةٌ', 'قَصِيرٌ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هٰذَا كَرِيمٌ.',
      after: 'كَبِيرٌ.',
      english: 'This is Karim. His house is big.',
      options: ['بَيْتُهَا', 'بَيْتُكِ', 'بَيْتُهُ'],
      answer: 2,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'Arabic says “my”, “his”, “our” and the rest with a short ending on the noun. You already know ـِي (my) and ـكَ / ـكِ (your). Here is the full set.',
    },
    {
      type: 'table',
      head: ['Whose', 'Ending', 'On بَيْتٌ', 'On مَعَ'],
      rows: [
        ['my', 'ـِي', 'بَيْتِي', 'مَعِي'],
        ['your (m)', 'ـكَ', 'بَيْتُكَ', 'مَعَكَ'],
        ['your (f)', 'ـكِ', 'بَيْتُكِ', 'مَعَكِ'],
        ['his', 'ـهُ', 'بَيْتُهُ', 'مَعَهُ'],
        ['her', 'ـهَا', 'بَيْتُهَا', 'مَعَهَا'],
        ['our', 'ـنَا', 'بَيْتُنَا', 'مَعَنَا'],
        ['your (plural)', 'ـكُمْ', 'بَيْتُكُمْ', 'مَعَكُمْ'],
        ['their', 'ـهُمْ', 'بَيْتُهُمْ', 'مَعَهُمْ'],
      ],
    },
    {
      type: 'p',
      text: 'After an i sound, ـهُ becomes ـهِ and ـهُمْ becomes ـهِمْ: فِي بَيْتِهِ, “in his house”.',
    },
    {
      type: 'example',
      arabic: 'أُخْتُهَا طَوِيلَةٌ وَشَعْرُهَا أَسْوَدُ.',
      translit: 'ukhtuhā ṭawīla wa-shaʿruhā aswad',
      english: 'Her sister is tall and her hair is black.',
    },
    {
      type: 'example',
      arabic: 'هَلْ تَسْكُنُ مَعَهُمْ؟',
      translit: 'hal taskunu maʿahum',
      english: 'Do you live with them?',
    },
  ],
  cultureTip: {
    title: 'Compliments with مَا شَاءَ اللَّهُ',
    body: 'When you say something nice about a person, especially a child, Egyptians add مَا شَاءَ اللَّهُ, “what God has willed”. It shows that you admire without envy. You will hear it whenever someone shows a photo of their family.',
  },
};
