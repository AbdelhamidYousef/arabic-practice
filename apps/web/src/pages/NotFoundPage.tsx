import { Link } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { Seo } from '../components/Seo';
import { buttonClasses } from '../components/ui/Button';
import { useT } from '../i18n';

export default function NotFoundPage() {
  const { t } = useT();
  return (
    <Container className="py-16 text-center" data-testid="page-not-found">
      <Seo title={t('notFound.title')} noindex />
      <p className="text-6xl font-semibold text-primary" aria-hidden="true">
        404
      </p>
      <h1 className="mt-2 text-3xl">{t('notFound.heading')}</h1>
      <p className="mx-auto mt-3 max-w-prose text-muted">{t('notFound.hint')}</p>
      <Link to="/" className={`${buttonClasses()} mt-6`}>
        {t('notFound.back')}
      </Link>
    </Container>
  );
}
