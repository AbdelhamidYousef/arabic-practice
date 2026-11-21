import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';

import { AppLayout } from './components/layout/AppLayout';
import RouteErrorPage from './pages/RouteErrorPage';
import RouteFallback from './pages/RouteFallback';

// Every route lives here, in one file. The layout is in the main bundle (every page needs it);
// each page is its own chunk via `lazy`, fetched only when the route is visited, so the first
// load carries the frame and one page, not the whole app (teacher screens never reach a learner).
//
// A data router (createBrowserRouter) rather than <Routes>: it gives route-level `lazy`,
// `errorElement` and ScrollRestoration, none of which exist in the component-style API.
const page = (load: () => Promise<{ default: ComponentType }>) => ({
  lazy: async () => ({ Component: (await load()).default }),
});

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    // The layout's own failure falls back to a bare error page.
    errorElement: <RouteErrorPage />,
    HydrateFallback: RouteFallback,
    children: [
      { index: true, ...page(() => import('./pages/HomePage')) },
      { path: 'login', ...page(() => import('./pages/LoginPage')) },
      { path: 'register', ...page(() => import('./pages/RegisterPage')) },
      { path: 'lessons', ...page(() => import('./pages/LessonsPage')) },
      { path: 'lessons/:slug', ...page(() => import('./pages/LessonPage')) },
      { path: 'practice/:conversationId', ...page(() => import('./pages/PracticePage')) },
      { path: 'progress', ...page(() => import('./pages/ProgressPage')) },
      { path: 'review', ...page(() => import('./pages/ReviewPage')) },
      { path: 'teacher', ...page(() => import('./pages/TeacherHomePage')) },
      { path: 'teacher/lessons', ...page(() => import('./pages/TeacherLessonsPage')) },
      { path: 'teacher/lessons/:id', ...page(() => import('./pages/TeacherLessonPage')) },
      { path: 'teacher/learners/:id', ...page(() => import('./pages/TeacherLearnerPage')) },
      {
        path: 'teacher/conversations/:id',
        ...page(() => import('./pages/TeacherConversationPage')),
      },
      { path: 'teacher/invites', ...page(() => import('./pages/TeacherInvitesPage')) },
      { path: 'teacher/usage', ...page(() => import('./pages/TeacherUsagePage')) },
      { path: '*', ...page(() => import('./pages/NotFoundPage')) },
    ],
  },
];
