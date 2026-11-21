import { CreateInviteRequestSchema, type CreateInviteResponse, type Invite } from '@arabic/shared';
import { useState, type FormEvent } from 'react';

import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { Alert } from '../components/ui/Alert';
import { Badge, type BadgeTone } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Td, TableScroll, Th, THead, Tr } from '../components/ui/Table';
import { useCreateInvite, useInvites } from '../features/teacher/queries';
import { TeacherError, useReadOnly } from '../features/teacher/ReadOnly';
import { useT, type StringKey } from '../i18n';
import { formatDate } from '../lib/format';

const statusTone: Record<Invite['status'], BadgeTone> = {
  active: 'success',
  expired: 'neutral',
  used_up: 'neutral',
};
const statusKey: Record<Invite['status'], StringKey> = {
  active: 'invites.status.active',
  expired: 'invites.status.expired',
  used_up: 'invites.status.usedUp',
};

export default function TeacherInvitesPage() {
  const { t } = useT();
  const query = useInvites();
  return (
    <Container className="py-8 sm:py-12">
      <Seo title={t('page.teacherInvites')} noindex />
      <h1 className="text-3xl">{t('page.teacherInvites')}</h1>
      <p className="mt-2 text-muted">{t('invites.lead')}</p>
      {query.data?.invitesOpen === false && (
        <Alert tone="warning" className="mt-4" data-testid="invites-closed">
          {t('invites.closedNotice')}
        </Alert>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="list-heading" className="min-w-0 lg:order-1">
          <h2 id="list-heading" className="text-xl">
            {t('invites.list')}
          </h2>
          <LoadState query={query}>
            {({ invites }) =>
              invites.length === 0 ? (
                <EmptyState
                  title={t('invites.empty.title')}
                  description={t('invites.empty.body')}
                />
              ) : (
                <div className="mt-4">
                  <TableScroll label={t('invites.list')}>
                    <THead>
                      <tr>
                        <Th>{t('invites.col.note')}</Th>
                        <Th>{t('invites.col.status')}</Th>
                        <Th className="text-right">{t('invites.col.uses')}</Th>
                        <Th>{t('invites.col.expires')}</Th>
                      </tr>
                    </THead>
                    <tbody>
                      {invites.map((i) => (
                        <Tr key={i.id}>
                          <Td className="max-w-56 [overflow-wrap:anywhere]">
                            {i.note || <span className="text-muted">{t('invites.noNote')}</span>}
                          </Td>
                          <Td>
                            <Badge tone={statusTone[i.status]}>{t(statusKey[i.status])}</Badge>
                          </Td>
                          <Td className="text-right tabular-nums">
                            {i.usedCount} / {i.maxUses}
                          </Td>
                          <Td>{formatDate(i.expiresAt)}</Td>
                        </Tr>
                      ))}
                    </tbody>
                  </TableScroll>
                </div>
              )
            }
          </LoadState>
        </section>

        <aside aria-labelledby="create-heading" className="space-y-4 lg:order-2">
          <CreateForm />
        </aside>
      </div>
    </Container>
  );
}

function CreateForm() {
  const { t } = useT();
  const create = useCreateInvite();
  const readOnly = useReadOnly();
  const [note, setNote] = useState('');
  const [maxUses, setMaxUses] = useState('1');
  const [days, setDays] = useState('7');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<CreateInviteResponse | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const parsed = CreateInviteRequestSchema.safeParse({
      note,
      maxUses: Number(maxUses),
      expiresInDays: Number(days),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0]);
        next[field] = t(
          field === 'note' ? 'invites.error.note' : (`invites.error.${field}` as StringKey),
        );
      }
      setErrors(next);
      return;
    }
    setErrors({});
    create.mutate(parsed.data, {
      onSuccess: (res) => {
        setCreated(res);
        setNote('');
      },
    });
  };

  return (
    <>
      <Card>
        <h2 id="create-heading" className="text-xl">
          {t('invites.create')}
        </h2>
        <form onSubmit={submit} noValidate className="mt-4 space-y-4">
          <fieldset disabled={readOnly} className="space-y-4">
            <Input
              label={t('invites.field.note')}
              hint={t('invites.field.note.hint')}
              value={note}
              maxLength={100}
              error={errors.note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('invites.field.maxUses')}
                type="number"
                inputMode="numeric"
                min={1}
                max={100}
                value={maxUses}
                error={errors.maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
              />
              <Input
                label={t('invites.field.days')}
                type="number"
                inputMode="numeric"
                min={1}
                max={90}
                value={days}
                error={errors.expiresInDays}
                onChange={(e) => setDays(e.target.value)}
              />
            </div>
          </fieldset>
          <TeacherError error={create.error} />
          <Button
            type="submit"
            loading={create.isPending}
            disabled={readOnly}
            title={readOnly ? t('readOnly.hint') : undefined}
          >
            {t('invites.submit')}
          </Button>
          {readOnly && <p className="text-sm text-muted">{t('readOnly.hint')}</p>}
        </form>
      </Card>
      {created && <CreatedLink created={created} onDone={() => setCreated(null)} />}
    </>
  );
}

// The code is in the API's answer once; it is not stored in a recoverable form. So this card is the
// only place to copy it, and says so.
function CreatedLink({ created, onDone }: { created: CreateInviteResponse; onDone: () => void }) {
  const { t } = useT();
  const [copied, setCopied] = useState<'yes' | 'no' | null>(null);
  const link = `${window.location.origin}${created.invitePath}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied('yes');
    } catch {
      setCopied('no');
    }
  };

  return (
    <Card className="border-primary" data-testid="created-invite">
      <h2 className="text-lg">{t('invites.created.title')}</h2>
      <Alert tone="warning" className="mt-3">
        {t('invites.created.once')}
      </Alert>
      <label className="mt-3 block text-sm font-medium" htmlFor="invite-link">
        {t('invites.created.link')}
      </label>
      <input
        id="invite-link"
        readOnly
        value={link}
        onFocus={(e) => e.currentTarget.select()}
        className="mt-1 min-h-11 w-full rounded-ui border border-line bg-bg px-3 text-sm"
      />
      <div className="mt-3 flex flex-wrap gap-3">
        <Button onClick={() => void copy()}>{t('invites.created.copy')}</Button>
        <Button variant="secondary" onClick={onDone}>
          {t('invites.created.done')}
        </Button>
      </div>
      <p className="mt-2 text-sm" role="status">
        {copied === 'yes' && t('invites.created.copied')}
        {copied === 'no' && t('invites.created.copyFailed')}
      </p>
    </Card>
  );
}
