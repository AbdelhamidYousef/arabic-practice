import { Link } from 'react-router-dom';

import { useT } from '../../i18n';

import { Container } from './Container';
import { Logo } from './Logo';

const REPO_URL = 'https://github.com/AbdelhamidYousef/arabic-practice';

// Short columns of links, then the one honest line about where practice chats go.
export function Footer() {
  const { t } = useT();
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <Container className="grid gap-8 py-10 sm:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-sm text-muted">{t('footer.tagline')}</p>
        </div>
        <nav aria-label={t('shell.footerNav')} className="contents">
          <div>
            <p className="text-sm font-semibold">{t('footer.learn')}</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link className="inline-block py-1 text-muted hover:text-primary" to="/#levels">
                  {t('nav.levels')}
                </Link>
              </li>
              <li>
                <Link className="inline-block py-1 text-muted hover:text-primary" to="/#how">
                  {t('nav.how')}
                </Link>
              </li>
              <li>
                <Link className="inline-block py-1 text-muted hover:text-primary" to="/login">
                  {t('nav.signIn')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">{t('footer.project')}</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link className="inline-block py-1 text-muted hover:text-primary" to="/#teachers">
                  {t('nav.teachers')}
                </Link>
              </li>
              <li>
                <a className="inline-block py-1 text-muted hover:text-primary" href={REPO_URL}>
                  {t('footer.source')}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </Container>
      <div className="border-t border-line">
        <Container className="py-4">
          <p className="max-w-prose text-xs text-muted">{t('shell.footer.note')}</p>
        </Container>
      </div>
    </footer>
  );
}
