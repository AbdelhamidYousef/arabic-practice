import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useLogout } from '../../features/auth/mutations';
import { navFor } from '../../features/auth/nav';
import { useMe } from '../../features/auth/queries';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';

import { Container } from './Container';

// While `me` is loading the nav shows the visitor's version (just "Sign in"), which is also what a
// signed-in person briefly sees; it is a single short link, so the swap does not shift the layout.
export function Header() {
  const { t } = useT();
  const { data: user } = useMe();
  const logout = useLogout();
  const navigate = useNavigate();
  return (
    <header className="border-b border-line bg-surface">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3">
        <Link to="/" className="text-lg font-semibold text-primary">
          {t('app.name')}
        </Link>
        <nav aria-label={t('shell.mainNav')}>
          <ul className="flex flex-wrap items-center gap-x-1">
            {navFor(user).map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  // "/teacher" is a prefix of its siblings; only an exact match counts for it.
                  end={item.to === '/teacher'}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex min-h-11 items-center rounded-ui px-3 font-medium hover:bg-primary-soft',
                      isActive ? 'text-primary underline underline-offset-8' : 'text-ink',
                    )
                  }
                >
                  {t(item.label)}
                </NavLink>
              </li>
            ))}
            {user && (
              <li>
                <button
                  type="button"
                  disabled={logout.isPending}
                  onClick={() => logout.mutate(undefined, { onSuccess: () => navigate('/') })}
                  className="inline-flex min-h-11 items-center rounded-ui px-3 font-medium text-ink hover:bg-primary-soft disabled:opacity-60"
                >
                  {t('nav.signOut')}
                </button>
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
