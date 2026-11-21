import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { ApiError } from '../api/client';
import { useT } from '../i18n';

import { Alert } from './ui/Alert';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';

interface LoadStateProps<T> {
  query: UseQueryResult<T>;
  children: (data: T) => ReactNode;
}

// The three states every data page has besides "done": loading, failed (with a retry), and
// "not signed in" (a 401 means a visitor opened a learner page, so send them to the sign-in).
export function LoadState<T>({ query, children }: LoadStateProps<T>) {
  const { t } = useT();
  if (query.isPending) return <Spinner label={t('shell.loading')} className="mx-auto my-16" />;
  if (query.isError) {
    if (query.error instanceof ApiError && query.error.status === 401) {
      return <Navigate to="/login" replace />;
    }
    return (
      <div className="my-8 flex flex-col items-start gap-3">
        <Alert tone="danger">{t('load.error')}</Alert>
        <Button variant="secondary" onClick={() => void query.refetch()}>
          {t('load.retry')}
        </Button>
      </div>
    );
  }
  return <>{children(query.data)}</>;
}
