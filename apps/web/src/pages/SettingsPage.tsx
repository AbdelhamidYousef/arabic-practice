import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { Seo } from '../components/Seo';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { ChangePasswordForm } from '../features/account/ChangePasswordForm';
import { DataSection } from '../features/account/DataSection';
import { useMe } from '../features/auth/queries';
import { useT } from '../i18n';

// One page for what belongs to the signed-in person. A guest has no password, nor anything worth
// exporting (their data goes by itself), so a guest is sent back to the lessons.
export default function SettingsPage() {
  const { t } = useT();
  const { data: user, isPending } = useMe();
  const [deleted, setDeleted] = useState(false);

  if (deleted) return <Navigate to="/" replace />;
  if (isPending) return <Spinner label={t('shell.loading')} className="mx-auto my-16" />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.isGuest) return <Navigate to="/lessons" replace />;

  return (
    <Container className="py-8 sm:py-12">
      <Seo title={t('page.settings')} noindex />
      <h1 className="text-3xl">{t('page.settings')}</h1>
      <p className="mt-2 text-muted">{t('settings.lead')}</p>

      <div className="mt-8 flex max-w-2xl flex-col gap-6">
        <Card className="p-5 sm:p-6">
          <section aria-labelledby="account-heading">
            <h2 id="account-heading" className="text-xl font-semibold">
              {t('settings.account.title')}
            </h2>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-muted">{t('settings.account.name')}</dt>
              <dd className="min-w-0 break-words">{user.displayName}</dd>
              <dt className="text-muted">{t('settings.account.email')}</dt>
              <dd className="min-w-0 break-all">{user.email}</dd>
              <dt className="text-muted">{t('settings.account.type')}</dt>
              <dd>{t(`settings.account.role.${user.role}`)}</dd>
            </dl>
          </section>
        </Card>

        {user.readOnly ? (
          <Alert tone="info">{t('settings.demo')}</Alert>
        ) : (
          <Card className="p-5 sm:p-6">
            <section aria-labelledby="password-heading">
              <h2 id="password-heading" className="text-xl font-semibold">
                {t('settings.password.title')}
              </h2>
              <p className="mt-1 text-sm text-muted">{t('settings.password.lead')}</p>
              <ChangePasswordForm />
            </section>
          </Card>
        )}

        {/* Learners only: a teacher account owns the lessons every chat hangs off, so the operator
            closes it (see the API's modules/me). */}
        {!user.readOnly &&
          (user.role === 'learner' ? (
            <DataSection onDeleted={() => setDeleted(true)} />
          ) : (
            <Alert tone="info">{t('settings.data.teacher')}</Alert>
          ))}
      </div>
    </Container>
  );
}
