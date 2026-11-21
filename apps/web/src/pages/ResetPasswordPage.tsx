import { NewPasswordSchema } from '@arabic/shared';
import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ApiError } from '../api/client';
import { Container } from '../components/layout/Container';
import { Seo } from '../components/Seo';
import { Alert } from '../components/ui/Alert';
import { Button, buttonClasses } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { authErrorKey } from '../features/auth/errors';
import { useResetPassword } from '../features/auth/mutations';
import { useT } from '../i18n';

// `/reset/:token`: the link a teacher gave this learner. The page cannot know whether the link is
// still good until the form is sent (a lookup would be one more endpoint to rate-limit), so a dead
// link is explained after the attempt, in place of the form.
export default function ResetPasswordPage() {
  const { t } = useT();
  const { token = '' } = useParams();
  const reset = useResetPassword();
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [errors, setErrors] = useState<{ password?: string; again?: string }>({});

  const toLogin = (
    <Link to="/login" className={buttonClasses('primary')}>
      {t('auth.submit.login')}
    </Link>
  );
  const linkIsDead = reset.error instanceof ApiError && reset.error.code === 'NOT_FOUND';

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = NewPasswordSchema.safeParse(password);
    const found: typeof errors = {};
    // The rule's wording comes from the shared schema, as on the sign-up form.
    if (!parsed.success) found.password = parsed.error.issues[0]?.message ?? '';
    else if (again !== password) found.again = t('settings.password.mismatch');
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    reset.mutate({ token, password });
  }

  let body;
  if (reset.isSuccess) {
    body = (
      <div className="mt-4 flex flex-col items-start gap-4">
        <Alert tone="success">{t('reset.done')}</Alert>
        {toLogin}
      </div>
    );
  } else if (linkIsDead) {
    body = (
      <EmptyState
        title={t('reset.invalid.title')}
        description={t('reset.invalid.body')}
        action={
          <Link to="/" className={buttonClasses('secondary')}>
            {t('register.toStart')}
          </Link>
        }
      />
    );
  } else {
    body = (
      <>
        <p className="mt-2 text-muted">{t('reset.lead')}</p>
        <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
          {reset.error && <Alert tone="danger">{t(authErrorKey(reset.error))}</Alert>}
          <Input
            label={t('settings.password.new')}
            type="password"
            autoComplete="new-password"
            hint={t('auth.password.hint')}
            value={password}
            error={errors.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label={t('settings.password.confirm')}
            type="password"
            autoComplete="new-password"
            value={again}
            error={errors.again}
            onChange={(e) => setAgain(e.target.value)}
          />
          <Button type="submit" size="lg" loading={reset.isPending}>
            {t('reset.submit')}
          </Button>
        </form>
      </>
    );
  }

  return (
    <Container className="py-10 sm:py-16">
      <Seo title={t('page.reset')} noindex />
      <Card className="mx-auto max-w-md p-6 sm:p-8" data-testid="reset-card">
        <h1 className="text-3xl">{t('page.reset')}</h1>
        {body}
      </Card>
    </Container>
  );
}
