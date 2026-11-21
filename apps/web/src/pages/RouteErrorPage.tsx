import { Link } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { Seo } from '../components/Seo';
import { buttonClasses } from '../components/ui/Button';
import { useT } from '../i18n';

// The router's errorElement: a crashed page or a failed chunk download ends here, not in a blank screen.
export default function RouteErrorPage() {
  const { t } = useT();
  return (
    <Container className="py-16 text-center">
      <Seo title={t('error.title')} noindex />
      <h1 className="text-3xl">{t('error.title')}</h1>
      <p className="mt-3 text-muted">{t('error.hint')}</p>
      <Link to="/" className={`${buttonClasses()} mt-6`}>
        {t('notFound.back')}
      </Link>
    </Container>
  );
}
