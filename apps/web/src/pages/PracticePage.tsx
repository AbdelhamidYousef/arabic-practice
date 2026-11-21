import { Link, useParams } from 'react-router-dom';

import { ApiError } from '../api/client';
import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { buttonClasses } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ChatView } from '../features/practice/ChatView';
import { useConversation } from '../features/practice/queries';
import { useT } from '../i18n';

export default function PracticePage() {
  const { t } = useT();
  const { conversationId = '' } = useParams();
  const query = useConversation(conversationId);
  const notFound = query.error instanceof ApiError && query.error.status === 404;
  return (
    <Container className="py-4 sm:py-6">
      <Seo title={t('page.practice')} noindex />
      {notFound ? (
        <EmptyState
          title={t('chat.notFound.title')}
          description={t('chat.notFound.hint')}
          action={
            <Link to="/lessons" className={buttonClasses()}>
              {t('chat.notFound.cta')}
            </Link>
          }
        />
      ) : (
        <LoadState query={query}>
          {(data) => <ChatView key={data.conversation.id} data={data} />}
        </LoadState>
      )}
    </Container>
  );
}
