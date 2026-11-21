import { useQuery } from '@tanstack/react-query';

import { t } from './i18n';

interface Health {
  status: string;
}

async function fetchHealth(): Promise<Health> {
  const res = await fetch('/api/v1/health');
  if (!res.ok) throw new Error(`health answered ${res.status}`);
  return (await res.json()) as Health;
}

export function App() {
  const health = useQuery({ queryKey: ['health'], queryFn: fetchHealth });
  const label = health.isPending ? 'checking' : health.isError ? 'unreachable' : health.data.status;

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">{t('app.name')}</h1>
      <p className="mt-2 text-sm">
        API status: <span data-testid="api-status">{label}</span>
      </p>
    </main>
  );
}
