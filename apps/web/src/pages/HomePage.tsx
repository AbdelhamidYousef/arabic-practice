import { Link } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { Seo } from '../components/Seo';
import { buttonClasses } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useMe } from '../features/auth/queries';
import { useT } from '../i18n';

// A placeholder landing page: the product's promise and one way in.
export default function HomePage() {
  const { t } = useT();
  const { data: user } = useMe();
  return (
    <Container className="py-12 sm:py-20">
      <Seo title={t('app.name')} description={t('home.lead')} />
      <Card className="mx-auto max-w-2xl p-8 sm:p-12">
        {user && (
          <p className="mb-2 text-sm text-muted">
            {t('home.greeting', { name: user.displayName })}
          </p>
        )}
        <h1 className="text-3xl sm:text-4xl">{t('home.title')}</h1>
        <p className="mt-4 text-lg text-muted">{t('home.lead')}</p>
        <Link
          to={user ? (user.role === 'teacher' ? '/teacher' : '/lessons') : '/login'}
          className={`${buttonClasses('primary', 'lg')} mt-8`}
        >
          {user ? t('home.cta.lessons') : t('home.cta.signIn')}
        </Link>
      </Card>
    </Container>
  );
}
