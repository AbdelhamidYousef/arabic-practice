import type { User } from '../../api/auth';
import type { StringKey } from '../../i18n';

export interface NavItem {
  to: string;
  label: StringKey;
}

// What the header shows for whoever is looking. One table, so a new role or page is one line.
// A visitor's items are sections of the landing page (`/#id`), then "Sign in".
export function navFor(user: User | null | undefined): NavItem[] {
  if (!user) {
    return [
      { to: '/#levels', label: 'nav.levels' },
      { to: '/#how', label: 'nav.how' },
      { to: '/#teachers', label: 'nav.teachers' },
      { to: '/login', label: 'nav.signIn' },
    ];
  }
  if (user.role === 'teacher') {
    return [
      { to: '/teacher/lessons', label: 'nav.lessons' },
      { to: '/teacher', label: 'nav.learners' },
      { to: '/teacher/invites', label: 'nav.invites' },
      { to: '/teacher/usage', label: 'nav.usage' },
    ];
  }
  return [
    { to: '/lessons', label: 'nav.lessons' },
    { to: '/review', label: 'nav.review' },
    { to: '/progress', label: 'nav.progress' },
  ];
}
