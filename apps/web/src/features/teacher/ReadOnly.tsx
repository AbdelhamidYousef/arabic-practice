import { ApiError } from '../../api/client';
import { Container } from '../../components/layout/Container';
import { Alert } from '../../components/ui/Alert';
import type { StringKey } from '../../i18n';
import { useT } from '../../i18n';
import { useMe } from '../auth/queries';

/** True for the demo teacher, whose every change the API refuses (403 DEMO_READ_ONLY). */
export function useReadOnly(): boolean {
  const { data: user } = useMe();
  return user?.readOnly === true;
}

export function ReadOnlyBanner() {
  const { t } = useT();
  if (!useReadOnly()) return null;
  return (
    <div className="border-b border-line bg-accent-soft">
      <Container className="py-2 text-sm text-accent-strong">{t('readOnly.banner')}</Container>
    </div>
  );
}

/** Spread on a control that changes data: disabled, with the reason as its tooltip. */
export function useReadOnlyProps(): { disabled: true; title: string } | Record<string, never> {
  const { t } = useT();
  return useReadOnly() ? { disabled: true, title: t('readOnly.hint') } : {};
}

/** The sentence under a failed teacher action; the demo's 403 gets its own explanation. */
export function teacherErrorKey(error: unknown, fallback: StringKey = 'teacher.error'): StringKey {
  if (error instanceof ApiError) {
    if (error.code === 'DEMO_READ_ONLY') return 'readOnly.error';
    if (error.code === 'NETWORK') return 'error.network';
    if (error.code === 'RATE_LIMITED') return 'auth.error.rateLimited';
  }
  return fallback;
}

export function TeacherError({ error, fallback }: { error: unknown; fallback?: StringKey }) {
  const { t } = useT();
  if (!error) return null;
  return <Alert tone="danger">{t(teacherErrorKey(error, fallback))}</Alert>;
}
