import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import { useGuest, useLogout } from '../../features/auth/mutations';
import { navFor } from '../../features/auth/nav';
import { useMe } from '../../features/auth/queries';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

import { Container } from './Container';
import { Logo } from './Logo';

const linkBase =
  'inline-flex min-h-11 w-full items-center rounded-ui px-3 font-medium hover:bg-primary-soft sm:w-auto';

// While `me` is loading the nav shows the visitor's version, which is also what a signed-in person
// briefly sees. Under 640 px the nav folds behind a menu button; it is the same list, so a
// keyboard or screen-reader user meets the same links in the same order at every width.
export function Header() {
  const { t } = useT();
  const { data: user } = useMe();
  const logout = useLogout();
  const guest = useGuest();
  const navigate = useNavigate();
  // The phone menu remembers the location it was opened on: any navigation (a new location key)
  // closes it, without an effect.
  const { key } = useLocation();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === key;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 py-2.5">
        <Logo />
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-ui hover:bg-primary-soft sm:hidden"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? t('nav.menuClose') : t('nav.menuOpen')}
          onClick={() => setOpenOn(open ? null : key)}
        >
          <Icon name={open ? 'close' : 'menu'} className="size-6" />
        </button>
        <nav
          id="main-nav"
          aria-label={t('shell.mainNav')}
          className={cn('w-full pb-2 sm:block sm:w-auto sm:pb-0', !open && 'hidden')}
        >
          <ul className="flex flex-col gap-1 sm:flex-row sm:items-center">
            {navFor(user).map((item) => (
              <li key={item.to}>
                {item.to.includes('#') ? (
                  // Landing-page sections: plain links, never "active".
                  <Link to={item.to} className={cn(linkBase, 'text-ink')}>
                    {t(item.label)}
                  </Link>
                ) : (
                  <NavLink
                    to={item.to}
                    // "/teacher" is a prefix of its siblings; only an exact match counts for it.
                    end={item.to === '/teacher'}
                    className={({ isActive }) =>
                      cn(linkBase, isActive ? 'bg-primary-soft text-primary' : 'text-ink')
                    }
                  >
                    {t(item.label)}
                  </NavLink>
                )}
              </li>
            ))}
            {!user && (
              <li className="sm:ml-2">
                <Button
                  className="w-full sm:w-auto"
                  loading={guest.isPending}
                  onClick={() => guest.mutate(undefined, { onSuccess: () => navigate('/lessons') })}
                >
                  {t('nav.startFree')}
                </Button>
              </li>
            )}
            {user && (
              <li>
                <button
                  type="button"
                  disabled={logout.isPending}
                  onClick={() => logout.mutate(undefined, { onSuccess: () => navigate('/') })}
                  className={cn(linkBase, 'text-ink disabled:opacity-60')}
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
