import { RegisterSchema } from '@arabic/shared';
import { useQuery } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { fetchInvite } from '../api/auth';
import { ApiError } from '../api/client';
import { Container } from '../components/layout/Container';
import { Seo } from '../components/Seo';
import { Alert } from '../components/ui/Alert';
import { buttonClasses, Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { authErrorKey } from '../features/auth/errors';
import { useRegister } from '../features/auth/mutations';
import { useT } from '../i18n';
import { keys } from '../lib/query-client';

// The invite link is `/register?code=...`. The page asks the API whether the code works before
// showing the form, so a dead link says so up front instead of after the form is filled in.
export default function RegisterPage() {
  const { t } = useT();
  const [params] = useSearchParams();
  const code = params.get('code') ?? '';
  const invite = useQuery({
    queryKey: keys.invite(code),
    queryFn: ({ signal }) => fetchInvite(code, signal),
    enabled: code !== '',
    retry: false,
  });

  const toStart = (
    <Link to="/" className={buttonClasses('secondary')}>
      {t('register.toStart')}
    </Link>
  );

  let body;
  if (code === '') {
    body = (
      <EmptyState
        title={t('register.invalid.title')}
        description={t('register.noCode')}
        action={toStart}
      />
    );
  } else if (invite.isPending) {
    body = (
      <div className="flex items-center justify-center gap-3 py-10 text-muted">
        <Spinner label={null} className="h-5 w-5" />
        {t('register.checking')}
      </div>
    );
  } else if (invite.error instanceof ApiError && invite.error.code === 'INVITES_CLOSED') {
    body = (
      <EmptyState
        title={t('register.closed.title')}
        description={t('register.closed.body')}
        action={toStart}
      />
    );
  } else if (invite.error || !invite.data.valid) {
    body = (
      <EmptyState
        title={t('register.invalid.title')}
        description={t('register.invalid.body')}
        action={toStart}
      />
    );
  } else {
    body = <RegisterForm code={code} teacherName={invite.data.teacherName} />;
  }

  return (
    <Container className="py-10 sm:py-16">
      <Seo title={t('page.register')} noindex />
      <Card className="mx-auto max-w-md p-6 sm:p-8" data-testid="register-card">
        <h1 className="text-3xl">{t('page.register')}</h1>
        {body}
      </Card>
    </Container>
  );
}

function RegisterForm({ code, teacherName }: { code: string; teacherName: string | null }) {
  const { t } = useT();
  const navigate = useNavigate();
  const register = useRegister();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<
    Partial<Record<'displayName' | 'email' | 'password', string>>
  >({});

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = RegisterSchema.safeParse({ code, email, password, displayName });
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        // The password rules come with their own wording from the shared schema (it is English
        // text the API sends too); the other two get the dictionary's.
        if (field === 'password') next.password ??= issue.message;
        if (field === 'email') next.email ??= t('auth.error.emailRequired');
        if (field === 'displayName') next.displayName ??= t('auth.error.nameRequired');
      }
      setErrors(next);
      return;
    }
    setErrors({});
    register.mutate(parsed.data, { onSuccess: () => navigate('/lessons') });
  }

  return (
    <>
      <p className="mt-2 text-muted">
        {teacherName ? t('register.invitedBy', { name: teacherName }) : t('register.lead')}
      </p>
      <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
        {register.error && <Alert tone="danger">{t(authErrorKey(register.error))}</Alert>}
        <Input
          label={t('auth.displayName')}
          hint={t('auth.displayName.hint')}
          autoComplete="name"
          value={displayName}
          error={errors.displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label={t('auth.password')}
          type="password"
          autoComplete="new-password"
          hint={t('auth.password.hint')}
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" size="lg" loading={register.isPending}>
          {t('auth.submit.register')}
        </Button>
      </form>
    </>
  );
}
