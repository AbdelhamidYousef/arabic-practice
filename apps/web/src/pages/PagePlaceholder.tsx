import { Container } from '../components/layout/Container';
import { Seo } from '../components/Seo';
import type { StringKey } from '../i18n';
import { useT } from '../i18n';

// Stands in for a feature page until its phase builds it. Each route has its own file so the
// route is already its own chunk and the real page replaces the file, not the route table.
export function PagePlaceholder({ title }: { title: StringKey }) {
  const { t } = useT();
  return (
    <Container className="py-12">
      <Seo title={t(title)} />
      <h1 className="text-3xl">{t(title)}</h1>
      <p className="mt-3 text-muted">{t('page.comingSoon')}</p>
    </Container>
  );
}
