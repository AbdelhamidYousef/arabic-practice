import { useT } from '../../i18n';

import { Container } from './Container';

// One honest line about where practice chats go. Not a cookie wall, not a wall of legal text.
export function Footer() {
  const { t } = useT();
  return (
    <footer className="border-t border-line">
      <Container className="py-6">
        <p className="max-w-prose text-sm text-muted">{t('shell.footer.note')}</p>
      </Container>
    </footer>
  );
}
