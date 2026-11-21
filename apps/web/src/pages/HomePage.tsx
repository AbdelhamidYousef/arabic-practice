import { useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { Seo } from '../components/Seo';
import { Alert } from '../components/ui/Alert';
import { ArabicText } from '../components/ui/ArabicText';
import { Badge } from '../components/ui/Badge';
import { Button, buttonClasses } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { authErrorKey } from '../features/auth/errors';
import { useDemoTeacher, useGuest } from '../features/auth/mutations';
import { useMe } from '../features/auth/queries';
import { ChooseExercise } from '../features/exercises/ChooseExercise';
import { FAQ, HERO_WORD, LESSON_STEPS, LEVELS, SAMPLE_EXERCISE } from '../features/landing/content';
import { EXAMPLE_TURN } from '../features/landing/example';
import { useT } from '../i18n';
import { speakArabic, useArabicVoice } from '../lib/speech';

// Sections sit under a sticky header, so in-page jumps leave room for it.
const section = 'scroll-mt-20 py-14 sm:py-20';

// The landing page. Signed-in people have no use for the pitch: they go straight to their start page.
export default function HomePage() {
  const { t, tn } = useT();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { data: user } = useMe();
  const guest = useGuest();
  const demo = useDemoTeacher();
  const hasVoice = useArabicVoice();

  // The header's "Levels" / "How it works" links are `/#id`: scroll to that section on arrival.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  if (user) return <Navigate to={user.role === 'teacher' ? '/teacher' : '/lessons'} replace />;

  const failed = guest.error ?? demo.error;
  const busy = guest.isPending || demo.isPending;
  const startGuest = () => guest.mutate(undefined, { onSuccess: () => navigate('/lessons') });

  return (
    <>
      <Seo title={t('app.name')} description={t('home.lead')} />

      {/* Hero */}
      <div className="bg-[radial-gradient(ellipse_at_top_right,var(--color-primary-soft),transparent_60%)]">
        <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Badge tone="primary">{t('home.eyebrow')}</Badge>
            <h1 className="mt-4 text-4xl sm:text-5xl">{t('home.title')}</h1>
            <p className="mt-5 max-w-xl text-lg text-muted">{t('home.lead')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" loading={guest.isPending} disabled={busy} onClick={startGuest}>
                {t('home.cta.guest')}
                <Icon name="arrow" />
              </Button>
              <Link to="/login" className={buttonClasses('secondary', 'lg')}>
                {t('nav.signIn')}
              </Link>
            </div>
            {failed && (
              <Alert tone="danger" className="mt-4">
                {t(authErrorKey(failed))}
              </Alert>
            )}
            <p className="mt-4 text-sm text-muted">{t('home.trust')}</p>
          </div>

          {/* A word card, as the lesson's first step shows it. */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-x-4 inset-y-0 translate-y-3 rotate-3 rounded-3xl bg-accent-soft" />
            <Card className="relative rounded-3xl p-8 text-center">
              <p className="text-sm text-muted">{t('home.hero.cardLabel')}</p>
              <div className="mt-2 h-1.5 rounded-full bg-primary-soft">
                <div className="h-full w-1/12 rounded-full bg-primary" />
              </div>
              <ArabicText as="p" className="mt-8 block text-5xl">
                {HERO_WORD.arabic}
              </ArabicText>
              <p className="mt-2 text-lg text-muted">{HERO_WORD.translit}</p>
              <p className="mt-1 text-xl font-semibold">{t(HERO_WORD.meaningKey)}</p>
              {hasVoice && (
                <Button
                  variant="secondary"
                  className="mt-6"
                  onClick={() => speakArabic(HERO_WORD.arabic)}
                >
                  <Icon name="speaker" />
                  {t('home.hero.listen')}
                </Button>
              )}
            </Card>
          </div>
        </Container>
      </div>

      {/* Levels */}
      <section id="levels" aria-labelledby="levels-title" className={section}>
        <Container>
          <h2 id="levels-title" className="text-3xl">
            {t('home.levels.title')}
          </h2>
          <p className="mt-2 text-muted">{t('home.levels.lead')}</p>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {LEVELS.map((level) => (
              <li key={level.code}>
                <Card className="flex h-full flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-3xl font-semibold text-primary">{level.code}</span>
                    <ArabicText className="text-2xl text-muted">{level.sample}</ArabicText>
                  </div>
                  <h3 className="text-xl">{t(level.nameKey)}</h3>
                  <p className="flex-1 text-muted">{t(level.canDoKey)}</p>
                  <p className="text-sm font-medium">{tn('count.lessons', level.lessons)}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* How a lesson works */}
      <section id="how" aria-labelledby="how-title" className={`${section} bg-surface`}>
        <Container>
          <h2 id="how-title" className="text-3xl">
            {t('home.steps.title')}
          </h2>
          <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {LESSON_STEPS.map((step, i) => (
              <li key={step.titleKey} className="rounded-ui border border-line bg-bg p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon name={step.icon} />
                  </span>
                  <span className="text-sm text-muted">{i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg">{t(step.titleKey)}</h3>
                <p className="mt-1 text-sm text-muted">{t(step.bodyKey)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Try one */}
      <section aria-labelledby="try-title" className={section}>
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 id="try-title" className="text-3xl">
              {t('home.try.title')}
            </h2>
            <p className="mt-2 text-muted">{t('home.try.lead')}</p>
          </div>
          <Card className="p-6 sm:p-8">
            <ChooseExercise
              prompt={t('home.try.prompt')}
              options={SAMPLE_EXERCISE.options}
              answer={SAMPLE_EXERCISE.answer}
            />
          </Card>
        </Container>
      </section>

      {/* The AI partner */}
      <section aria-labelledby="turn-heading" className={`${section} bg-surface`}>
        <Container className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <h2 id="turn-heading" className="text-3xl">
              {t('home.turn.title')}
            </h2>
            <p className="mt-2 text-muted">{t('home.turn.lead')}</p>
            <ol className="mt-6 space-y-3">
              {(['home.turn.step1', 'home.turn.step2', 'home.turn.step3'] as const).map(
                (key, i) => (
                  <li key={key} className="flex items-start gap-3">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-surface">
                      {i + 1}
                    </span>
                    <span>{t(key)}</span>
                  </li>
                ),
              )}
            </ol>
          </div>
          <Card className="space-y-4 bg-bg" data-testid="example-turn">
            <Badge tone="accent">{t('home.turn.example')}</Badge>

            <div className="ml-auto max-w-[85%]">
              <p className="mb-1 text-right text-xs text-muted">{t('home.turn.you')}</p>
              <div className="rounded-ui bg-primary px-4 py-3 text-surface">
                <p dir="rtl" className="text-xl">
                  <ArabicText>{EXAMPLE_TURN.before}</ArabicText>{' '}
                  <mark className="rounded-md bg-accent-soft px-2 py-0.5 box-decoration-clone text-ink">
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
                <mark className="rounded-md bg-surface px-2 py-0.5 box-decoration-clone text-ink">
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
        </Container>
      </section>

      {/* For teachers */}
      <section id="teachers" aria-labelledby="teachers-title" className={section}>
        <Container>
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-primary px-6 py-10 text-surface sm:px-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 id="teachers-title" className="text-3xl">
                {t('home.teachers.title')}
              </h2>
              <p className="mt-2 opacity-90">{t('home.teachers.lead')}</p>
            </div>
            <Button
              size="lg"
              variant="secondary"
              loading={demo.isPending}
              disabled={busy}
              onClick={() => demo.mutate(undefined, { onSuccess: () => navigate('/teacher') })}
            >
              {t('home.cta.teacher')}
            </Button>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="pb-6">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 id="faq-title" className="text-3xl">
              {t('home.faq.title')}
            </h2>
            <div className="mt-6 divide-y divide-line rounded-ui border border-line bg-surface">
              {FAQ.map((item) => (
                <details key={item.q} className="group px-5">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {t(item.q)}
                    <Icon
                      name="arrow"
                      className="rotate-90 transition-transform group-open:-rotate-90"
                    />
                  </summary>
                  <p className="pb-4 text-muted">{t(item.a)}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
