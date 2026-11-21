// The English UI dictionary. Keys are typed from this object, so `t('nope')` fails to compile.
// Arabic lesson content is data from the API, never a string in here.
export const en = {
  'app.name': 'Arabic Practice',

  'shell.skipLink': 'Skip to main content',
  'shell.loading': 'Loading',
  'shell.loadingPage': 'Loading page',
  'shell.close': 'Close',
  'shell.mainNav': 'Main navigation',
  'shell.footerNav': 'Footer',
  'shell.waking':
    'The server is waking up after a quiet spell. This can take up to half a minute, thanks for your patience.',
  'shell.unreachable': 'The server is not answering right now. We will keep trying.',
  'shell.footer.note':
    "Practice chats on this demo are processed by Google's Gemini free tier. Please don't type personal information.",

  'nav.lessons': 'Lessons',
  'nav.review': 'Review',
  'nav.progress': 'Progress',
  'nav.learners': 'Learners',
  'nav.invites': 'Invites',
  'nav.usage': 'Usage',
  'nav.signIn': 'Sign in',

  'home.title': 'Practice Arabic by talking',
  'home.lead':
    'Short conversations built around your own lessons, with gentle corrections that match your level.',
  'home.cta.lessons': 'Go to lessons',
  'home.cta.signIn': 'Sign in to start',
  'home.greeting': 'Welcome back, {name}',

  'notFound.title': 'Page not found',
  'notFound.heading': 'We could not find that page',
  'notFound.hint': 'The link may be old, or the address may have a typo.',
  'notFound.back': 'Back to the home page',

  'error.title': 'Something went wrong',
  'error.hint': 'Please reload the page. If it keeps happening, try again later.',
  'error.network': 'Could not reach the server',
  'error.unexpected': 'The server sent an unexpected response',

  'page.login': 'Sign in',
  'page.register': 'Create your account',
  'page.lessons': 'Lessons',
  'page.lesson': 'Lesson',
  'page.practice': 'Practice',
  'page.progress': 'Your progress',
  'page.review': 'Review',
  'page.teacher': 'Teacher dashboard',
  'page.teacherLessons': 'Lessons',
  'page.teacherLesson': 'Edit lesson',
  'page.teacherLearner': 'Learner',
  'page.teacherConversation': 'Conversation',
  'page.teacherInvites': 'Invites',
  'page.teacherUsage': 'Usage',
  'page.comingSoon': 'This page is coming soon.',

  'count.lessons': { zero: 'No lessons yet', one: '{count} lesson', other: '{count} lessons' },
} as const;
