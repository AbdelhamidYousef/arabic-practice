import { Spinner } from '../components/ui/Spinner';
import { useT } from '../i18n';

// Shown while a lazy route chunk downloads.
export default function RouteFallback() {
  const { t } = useT();
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-primary">
      <Spinner label={t('shell.loadingPage')} className="h-8 w-8" />
    </div>
  );
}
