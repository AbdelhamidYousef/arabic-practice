import type { ConversationDetailResponse } from '@arabic/shared';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Badge } from '../../components/ui/Badge';
import { useT } from '../../i18n';
import { useMe } from '../auth/queries';

import { LearnerBubble, PartnerBubble } from './Bubble';
import { Composer } from './Composer';
import { CorrectionCard } from './CorrectionCard';
import { TurnError } from './TurnError';
import { useTurn } from './use-turn';

const HARAKAT_KEY = 'arabic-practice.chat.harakat';

function readHarakatPref(): boolean {
  try {
    return localStorage.getItem(HARAKAT_KEY) !== 'off';
  } catch {
    return true;
  }
}

// Within this many pixels of the end of the chat, new text keeps the view pinned to the bottom.
const PIN_SLACK = 120;

type Unanswered = 'noReply' | 'history' | undefined;

/**
 * Whether a saved line is a learner line the partner never answered. `nextRole` is the role of the
 * saved message after it (undefined for the last one); `turnRunning` means a new learner bubble is
 * on screen after the saved ones.
 */
export function unansweredState(
  role: 'learner' | 'partner',
  nextRole: 'learner' | 'partner' | undefined,
  turnRunning: boolean,
  turnFailed: boolean,
): Unanswered {
  if (role !== 'learner' || nextRole === 'partner') return undefined;
  if (nextRole === 'learner' || turnRunning) return 'history';
  return turnFailed ? 'noReply' : 'history';
}

export function ChatView({ data }: { data: ConversationDetailResponse }) {
  const { t } = useT();
  const { data: user } = useMe();
  const { conversation, lesson, messages } = data;
  const { turn, busy, announcement, send, stop, retry } = useTurn(conversation.id);

  const [draft, setDraft] = useState('');
  const [showHarakat, setShowHarakat] = useState(readHarakatPref);
  const hideHarakat = !showHarakat;

  const endRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const composerHeight = useRef(0);
  const pinned = useRef(true);

  const toggleHarakat = (checked: boolean) => {
    setShowHarakat(checked);
    try {
      localStorage.setItem(HARAKAT_KEY, checked ? 'on' : 'off');
    } catch {
      // A private window: the choice just lasts for this visit.
    }
  };

  // Track whether the learner is reading the end of the chat or has scrolled up to re-read.
  useEffect(() => {
    const onScroll = () => {
      const end = endRef.current;
      if (end) pinned.current = end.getBoundingClientRect().top - window.innerHeight < PIN_SLACK;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToEnd = useCallback(() => {
    const end = endRef.current;
    if (!end || typeof end.scrollIntoView !== 'function') return;
    end.style.scrollMarginBottom = `${composerHeight.current + 8}px`;
    end.scrollIntoView({ block: 'end' });
  }, []);

  // The composer is sticky and covers the bottom of the page; keep its height so "scroll to the
  // end" stops above it instead of under it (and grows with the on-screen keyboard open).
  useEffect(() => {
    const el = composerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      composerHeight.current = el.getBoundingClientRect().height;
      if (pinned.current) scrollToEnd();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [scrollToEnd]);

  useLayoutEffect(() => {
    if (pinned.current) scrollToEnd();
  }, [scrollToEnd, messages.length, turn.status, turn.reply, turn.correction, turn.failure]);

  const accepted = useCallback(
    (text: string) => () => setDraft((current) => (current.trim() === text.trim() ? '' : current)),
    [],
  );
  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    pinned.current = true;
    send(text, accepted(draft));
  };
  const onRetry = () => {
    pinned.current = true;
    retry(accepted(turn.lastText));
  };

  const showTyping = turn.learner !== null && turn.partner === null && !turn.failure;

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-9rem)] w-full max-w-3xl flex-col">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line pb-3">
        <div className="min-w-0">
          <Link
            to={`/lessons/${lesson.slug}`}
            className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
          >
            {t('chat.backToLesson')}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="min-w-0 break-words text-xl">{lesson.title}</h1>
            <Badge tone="primary">{lesson.level}</Badge>
          </div>
        </div>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={showHarakat}
            onChange={(e) => toggleHarakat(e.target.checked)}
          />
          {t('chat.harakat.toggle')}
        </label>
      </div>

      <ul aria-label={t('chat.messages')} className="flex-1 space-y-4 py-4">
        {messages.map((message, index) => {
          // A learner line the partner never answered. If anything learner-side follows it (a
          // retry that is running or finished), it is history: muted, "Not answered". If it is the
          // last line and the turn failed, it is the one Retry will resend: "No reply".
          const next = messages[index + 1];
          const unanswered = unansweredState(
            message.role,
            next?.role,
            turn.status !== 'idle',
            turn.failure !== null,
          );
          return message.role === 'partner' ? (
            <li key={message.id}>
              <PartnerBubble
                messageId={message.id}
                text={message.text}
                glossEn={message.glossEn}
                hideHarakat={hideHarakat}
              />
            </li>
          ) : (
            <li key={message.id} className="space-y-2">
              <LearnerBubble
                text={message.text}
                hideHarakat={hideHarakat}
                {...(unanswered && { unanswered })}
              />
              <div className="ml-auto max-w-[88%] sm:max-w-[80%]">
                <CorrectionCard
                  original={message.text}
                  state={
                    message.correction ? { status: 'done', correction: message.correction } : null
                  }
                  hideHarakat={hideHarakat}
                />
              </div>
            </li>
          );
        })}
        {turn.status !== 'idle' && (
          <>
            <li className="space-y-2">
              <LearnerBubble
                text={turn.learner?.text ?? turn.text}
                hideHarakat={hideHarakat}
                pending={turn.learner === null}
              />
              {turn.correction && (
                <div className="ml-auto max-w-[88%] sm:max-w-[80%]">
                  <CorrectionCard
                    original={turn.text}
                    state={turn.correction}
                    hideHarakat={hideHarakat}
                  />
                </div>
              )}
            </li>
            {(showTyping || turn.reply !== '') && (
              <li>
                <PartnerBubble text={turn.reply} hideHarakat={hideHarakat} streaming />
              </li>
            )}
          </>
        )}
      </ul>

      {/* Polite, and only when a reply is complete: never one announcement per streamed chunk. */}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement && t('chat.replyDone', { text: announcement })}
      </p>
      <div ref={endRef} />

      <div
        ref={composerRef}
        className="sticky bottom-0 z-10 max-h-[75dvh] space-y-2 overflow-y-auto border-t border-line bg-bg pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
      >
        {turn.failure && <TurnError failure={turn.failure} onRetry={onRetry} />}
        {user?.isGuest && <p className="text-xs text-muted">{t('chat.guestNote')}</p>}
        <Composer value={draft} onChange={setDraft} onSend={submit} onStop={stop} busy={busy} />
      </div>
    </div>
  );
}
