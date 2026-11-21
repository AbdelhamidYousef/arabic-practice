import { Link, useNavigate } from 'react-router-dom';

import { ApiError } from '../../api/client';
import { Alert } from '../../components/ui/Alert';
import { Button, buttonClasses } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { useT } from '../../i18n';
import { useStartConversation } from '../practice/mutations';

import type { StepProps } from './step-props';
import { learnPath } from './steps';

// The optional last step: a chat with the AI partner on this lesson. Starting it opens the normal
// practice page; the step counts as done after the first reply there (see ChatView). Finishing
// without it is just as fine.
export function TalkStep({ data }: Pick<StepProps, 'data'>) {
  const { t } = useT();
  const navigate = useNavigate();
  const start = useStartConversation();
  const { lesson } = data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-primary">{t('step.talk')}</p>
        <h1 className="mt-1 text-2xl">{t('talk.title')}</h1>
      </div>
      <Card className="rounded-3xl p-6 sm:p-8">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon name="chat" className="size-6" />
        </span>
        <p className="mt-5 text-lg">{t('talk.lead')}</p>
        <ul className="mt-4 space-y-2 text-muted">
          {(['talk.point1', 'talk.point2', 'talk.point3'] as const).map((key) => (
            <li key={key} className="flex items-start gap-2">
              <Icon name="check" className="mt-1 size-4 text-primary" />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted">{t('chat.guestNote')}</p>
      </Card>
      {start.error && (
        <Alert tone="danger">
          {start.error instanceof ApiError && start.error.code === 'RATE_LIMITED'
            ? t('auth.error.rateLimited')
            : t('lesson.startError')}
        </Alert>
      )}
      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          loading={start.isPending}
          onClick={() =>
            start.mutate(lesson.id, {
              onSuccess: ({ conversation }) => navigate(`/practice/${conversation.id}`),
            })
          }
        >
          {t('talk.start')}
          <Icon name="arrow" />
        </Button>
        <Link to={learnPath(lesson.slug, 'done')} className={buttonClasses('secondary', 'lg')}>
          {t('talk.skip')}
        </Link>
      </div>
    </div>
  );
}
