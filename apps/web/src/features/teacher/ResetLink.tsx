import { useState } from 'react';

import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useT } from '../../i18n';
import { formatDateTime } from '../../lib/format';

import { useCreateResetLink } from './queries';
import { TeacherError, useReadOnlyProps } from './ReadOnly';

// A learner who forgot the password has no email to be sent to, so the teacher makes a one-time
// link here and passes it on by chat. The link is in the API's answer once; this card is the only
// place to copy it, and says so (same shape as a created invite).
export function ResetLinkCard({ learnerId }: { learnerId: string }) {
  const { t } = useT();
  const create = useCreateResetLink(learnerId);
  const readOnly = useReadOnlyProps();
  const [copied, setCopied] = useState<'yes' | 'no' | null>(null);
  const made = create.data;
  const link = made ? `${window.location.origin}${made.resetPath}` : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied('yes');
    } catch {
      setCopied('no');
    }
  };

  return (
    <section aria-labelledby="reset-heading">
      <Card>
        <h2 id="reset-heading" className="text-xl">
          {t('teacher.reset.title')}
        </h2>
        <p className="mt-1 text-sm text-muted">{t('teacher.reset.lead')}</p>
        <div className="mt-4">
          <Button
            variant="secondary"
            loading={create.isPending}
            onClick={() => {
              setCopied(null);
              create.mutate();
            }}
            {...readOnly}
          >
            {t('teacher.reset.create')}
          </Button>
        </div>
        {create.isError && (
          <div className="mt-3">
            <TeacherError error={create.error} />
          </div>
        )}
        {made && (
          <div className="mt-4" data-testid="created-reset">
            <Alert tone="warning">
              {t('teacher.reset.once', { when: formatDateTime(made.expiresAt) })}
            </Alert>
            <label className="mt-3 block text-sm font-medium" htmlFor="reset-link">
              {t('teacher.reset.link')}
            </label>
            <input
              id="reset-link"
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="mt-1 min-h-11 w-full rounded-ui border border-line bg-bg px-3 text-sm"
            />
            <div className="mt-3 flex flex-wrap gap-3">
              <Button onClick={() => void copy()}>{t('teacher.reset.copy')}</Button>
            </div>
            <p className="mt-2 text-sm" role="status">
              {copied === 'yes' && t('teacher.reset.copied')}
              {copied === 'no' && t('teacher.reset.copyFailed')}
            </p>
          </div>
        )}
      </Card>
    </section>
  );
}
