import { Navigate, Outlet } from 'react-router-dom';

import { Spinner } from '../../components/ui/Spinner';
import { useT } from '../../i18n';
import { ReadOnlyBanner } from '../teacher/ReadOnly';

import { useMe } from './queries';

function Pending() {
  const { t } = useT();
  return <Spinner label={t('shell.loading')} className="mx-auto my-16" />;
}

// Route guards, as layout routes: whatever is nested under them renders only for the right person.
// The API enforces the same rules (401/403); these only keep the wrong person from seeing a page
// that would immediately fail.

/** Anyone signed in (guests included). A visitor goes to the sign-in. */
export function RequireUser() {
  const { data: user, isPending } = useMe();
  if (isPending) return <Pending />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

/** Teachers only: a visitor goes to the sign-in, a learner to the lessons. */
export function RequireTeacher() {
  const { data: user, isPending } = useMe();
  if (isPending) return <Pending />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'teacher') return <Navigate to="/lessons" replace />;
  return (
    <>
      <ReadOnlyBanner />
      <Outlet />
    </>
  );
}
