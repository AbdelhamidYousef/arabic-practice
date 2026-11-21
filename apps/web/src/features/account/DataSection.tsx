import { useState, type FormEvent } from 'react';

import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { useT } from '../../i18n';
import { authErrorKey } from '../auth/errors';
import { useSetMe } from '../auth/queries';

import { useDeleteAccount, useExportData } from './mutations';

// "Your data": a download of everything the app holds about the learner, and the account's
// removal behind a dialog that asks for the password again.
export function DataSection({ onDeleted }: { onDeleted: () => void }) {
  const { t } = useT();
  const exportData = useExportData();
  const [confirming, setConfirming] = useState(false);

  return (
    <Card className="p-5 sm:p-6">
      <section aria-labelledby="data-heading">
        <h2 id="data-heading" className="text-xl font-semibold">
          {t('settings.data.title')}
        </h2>

        <h3 className="mt-4 font-semibold">{t('settings.export.title')}</h3>
        <p className="mt-1 text-sm text-muted">{t('settings.export.lead')}</p>
        {exportData.isError && (
          <Alert tone="danger" className="mt-3">
            {t(authErrorKey(exportData.error))}
          </Alert>
        )}
        <Button
          variant="secondary"
          className="mt-3"
          loading={exportData.isPending}
          onClick={() => exportData.mutate()}
        >
          {t('settings.export.button')}
        </Button>

        <h3 className="mt-8 font-semibold text-danger">{t('settings.delete.title')}</h3>
        <p className="mt-1 text-sm text-muted">{t('settings.delete.lead')}</p>
        <Button variant="danger" className="mt-3" onClick={() => setConfirming(true)}>
          {t('settings.delete.button')}
        </Button>
      </section>

      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title={t('settings.delete.dialogTitle')}
        closeLabel={t('shell.close')}
      >
        <DeleteForm onCancel={() => setConfirming(false)} onDeleted={onDeleted} />
      </Dialog>
    </Card>
  );
}

function DeleteForm({ onCancel, onDeleted }: { onCancel: () => void; onDeleted: () => void }) {
  const { t } = useT();
  const del = useDeleteAccount();
  const setMe = useSetMe();
  const [password, setPassword] = useState('');
  const [missing, setMissing] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (password === '') {
      setMissing(true);
      return;
    }
    setMissing(false);
    del.mutate(password, {
      // Both in one event, so the page renders once with "deleted" set and the person gone: it
      // leaves for the start page, not for the sign-in its own guard would pick.
      onSuccess: () => {
        onDeleted();
        setMe(null);
      },
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <p className="text-sm">{t('settings.delete.warning')}</p>
      {del.error && <Alert tone="danger">{t(authErrorKey(del.error))}</Alert>}
      <Input
        label={t('settings.delete.password')}
        type="password"
        autoComplete="current-password"
        value={password}
        error={missing ? t('settings.password.currentRequired') : undefined}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="danger" loading={del.isPending}>
          {t('settings.delete.confirm')}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          {t('settings.delete.cancel')}
        </Button>
      </div>
    </form>
  );
}
