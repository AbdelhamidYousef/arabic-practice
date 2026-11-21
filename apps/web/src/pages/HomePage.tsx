import { Link, Navigate, useNavigate } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { Seo } from '../components/Seo';
import { Alert } from '../components/ui/Alert';
import { ArabicText } from '../components/ui/ArabicText';
import { Badge } from '../components/ui/Badge';
import { Button, buttonClasses } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { authErrorKey } from '../features/auth/errors';
import { useDemoTeacher, useGuest } from '../features/auth/mutations';
import { useMe } from '../features/auth/queries';
import { EXAMPLE_TURN } from '../features/landing/example';
import { useT } from '../i18n';

// Signed-in people have no use for the pitch: they go straight to their own start page.
export default function HomePage() {
  const { t } = useT();
  const navigate = useNavigate();
  const { data: user } = useMe();
  const guest = useGuest();
  const demo = useDemoTeacher();

  if (user) return <Navigate to={user.role === 'teacher' ? '/teacher' : '/lessons'} replace />;

  const failed = guest.error ?? demo.error;
  const busy = guest.isPending || demo.isPending;

  return (
    <Container className="py-10 sm:py-16">
      <Seo title={t('app.name')} description={t('home.lead')} />
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl">{t('home.title')}</h1>
        <p className="mt-4 text-lg text-muted">{t('home.lead')}</p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            loading={guest.isPending}
            disabled={busy}
            onClick={() => guest.mutate(undefined, { onSuccess: () => navigate('/lessons') })}
          >
            {t('home.cta.guest')}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            loading={demo.isPending}
            disabled={busy}
            onClick={() => demo.mutate(undefined, { onSuccess: () => navigate('/teacher') })}
          >
            {t('home.cta.teacher')}
          </Button>
          <Link to="/login" className={buttonClasses('ghost', 'lg')}>
            {t('nav.signIn')}
          </Link>
        </div>
        {failed && (
          <Alert tone="danger" className="mt-4 text-left">
            {t(authErrorKey(failed))}
          </Alert>
        )}
        <p className="mx-auto mt-4 max-w-prose text-sm text-muted">{t('shell.footer.note')}</p>
      </section>

      <section aria-labelledby="turn-heading" className="mx-auto mt-14 max-w-2xl">
        <h2 id="turn-heading" className="text-2xl">
          {t('home.turn.title')}
        </h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-muted">
          <li>{t('home.turn.step1')}</li>
          <li>{t('home.turn.step2')}</li>
          <li>{t('home.turn.step3')}</li>
        </ol>
        <Card className="mt-5 space-y-4 bg-bg/40" data-testid="example-turn">
          <Badge tone="accent">{t('home.turn.example')}</Badge>

          <div className="ml-auto max-w-[85%]">
            <p className="mb-1 text-right text-xs text-muted">{t('home.turn.you')}</p>
            <div className="rounded-ui bg-primary px-4 py-3 text-surface">
              <p dir="rtl" className="text-xl">
                <ArabicText>{EXAMPLE_TURN.before}</ArabicText>{' '}
                <mark className="rounded bg-accent-soft px-1 text-ink">
                  <ArabicText>{EXAMPLE_TURN.wrong}</ArabicText>
                </mark>{' '}
                <ArabicText>{EXAMPLE_TURN.after}</ArabicText>
              </p>
            </div>
          </div>

          <div className="max-w-[92%] rounded-ui border-l-4 border-accent bg-accent-soft px-4 py-3">
            <p className="font-semibold text-accent-strong">{t('home.turn.correctionTitle')}</p>
            <p className="mt-2 text-sm text-muted">{t('home.turn.corrected')}</p>
            <p dir="rtl" className="text-xl">
              <ArabicText>{EXAMPLE_TURN.before}</ArabicText>{' '}
              <mark className="rounded bg-surface px-1 text-ink">
                <ArabicText>{EXAMPLE_TURN.right}</ArabicText>
              </mark>{' '}
              <ArabicText>{EXAMPLE_TURN.after}</ArabicText>
            </p>
            <p className="mt-2 flex flex-wrap items-start gap-2 text-sm">
              <Badge tone="danger">{t('home.turn.mistakeType')}</Badge>
              <span className="min-w-0 flex-1">{t('home.turn.explanation')}</span>
            </p>
          </div>

          <div className="max-w-[85%]">
            <p className="mb-1 text-xs text-muted">{t('home.turn.partner')}</p>
            <div className="rounded-ui border border-line bg-surface px-4 py-3">
              <ArabicText as="p" className="text-xl">
                {EXAMPLE_TURN.partner}
              </ArabicText>
            </div>
          </div>
        </Card>
      </section>
    </Container>
  );
}
