import { LoginSchema } from '@arabic/shared';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { Seo } from '../components/Seo';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { authErrorKey } from '../features/auth/errors';
import { useLogin } from '../features/auth/mutations';
import { useMe } from '../features/auth/queries';
import { useT } from '../i18n';

export default function LoginPage() {
  const { t } = useT();
  const navigate = useNavigate();
  const { data: user } = useMe();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  if (user && !login.isPending && !login.isSuccess) {
    return <Navigate to={user.role === 'teacher' ? '/teacher' : '/lessons'} replace />;
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    // The same schema the API uses, so a typo is caught here without a round trip.
    const parsed = LoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const bad = new Set(parsed.error.issues.map((i) => i.path[0]));
      setFieldErrors({
        ...(bad.has('email') && { email: t('auth.error.emailRequired') }),
        ...(bad.has('password') && { password: t('auth.error.passwordRequired') }),
      });
      return;
    }
    setFieldErrors({});
    login.mutate(parsed.data, {
      onSuccess: (u) => navigate(u.role === 'teacher' ? '/teacher' : '/lessons'),
    });
  }

  return (
    <Container className="py-10 sm:py-16">
      <Seo title={t('page.login')} />
      <Card className="mx-auto max-w-md p-6 sm:p-8">
        <h1 className="text-3xl">{t('page.login')}</h1>
        <p className="mt-2 text-muted">{t('login.lead')}</p>
        <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
          {login.error && <Alert tone="danger">{t(authErrorKey(login.error))}</Alert>}
          <Input
            label={t('auth.email')}
            type="email"
            autoComplete="email"
            value={email}
            error={fieldErrors.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label={t('auth.password')}
            type="password"
            autoComplete="current-password"
            value={password}
            error={fieldErrors.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" size="lg" loading={login.isPending}>
            {t('auth.submit.login')}
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted">
          {t('login.noAccount')}{' '}
          <Link to="/" className="font-medium text-primary underline underline-offset-4">
            {t('login.guestLink')}
          </Link>
        </p>
      </Card>
    </Container>
  );
}
