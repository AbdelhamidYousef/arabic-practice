import { NewPasswordSchema } from '@arabic/shared';
import { useState, type FormEvent } from 'react';

import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useT } from '../../i18n';
import { authErrorKey } from '../auth/errors';
import { useChangePassword } from '../auth/mutations';

type Errors = Partial<Record<'current' | 'next' | 'again', string>>;

// The new password is checked with the API's own rule before anything is sent; the API checks it
// again, and says WRONG_PASSWORD (not "signed out") when the current one is wrong.
export function ChangePasswordForm() {
  const { t } = useT();
  const change = useChangePassword();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    change.reset();
    const found: Errors = {};
    if (current === '') found.current = t('settings.password.currentRequired');
    const parsed = NewPasswordSchema.safeParse(next);
    // The rule's wording comes from the shared schema, as on the sign-up form.
    if (!parsed.success) found.next = parsed.error.issues[0]?.message ?? '';
    else if (again !== next) found.again = t('settings.password.mismatch');
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    change.mutate(
      { currentPassword: current, newPassword: next },
      {
        onSuccess: () => {
          setCurrent('');
          setNext('');
          setAgain('');
        },
      },
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-4 flex max-w-md flex-col gap-4">
      {change.isSuccess && <Alert tone="success">{t('settings.password.done')}</Alert>}
      {change.error && <Alert tone="danger">{t(authErrorKey(change.error))}</Alert>}
      <Input
        label={t('settings.password.current')}
        type="password"
        autoComplete="current-password"
        value={current}
        error={errors.current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      <Input
        label={t('settings.password.new')}
        type="password"
        autoComplete="new-password"
        hint={t('auth.password.hint')}
        value={next}
        error={errors.next}
        onChange={(e) => setNext(e.target.value)}
      />
      <Input
        label={t('settings.password.confirm')}
        type="password"
        autoComplete="new-password"
        value={again}
        error={errors.again}
        onChange={(e) => setAgain(e.target.value)}
      />
      <Button type="submit" loading={change.isPending} className="self-start">
        {t('settings.password.submit')}
      </Button>
    </form>
  );
}
