import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { en } from '../i18n';
import { localDay } from '../lib/local-day';
import { jsonError, learner, renderAt, stubApi, type Handlers } from '../test-utils';

const NOW = '2026-11-21T10:00:00.000Z';
const OPENING = 'مَرْحَبًا! كَيْفَ حَالُكَ؟';

const message = (id: string, role: 'learner' | 'partner', text: string, over: object = {}) => ({
  id,
  role,
  text,
  glossEn: null,
  levelMetrics: null,
  createdAt: NOW,
  correction: null,
  ...over,
});

const detail = (messages: object[] = [message('m1', 'partner', OPENING)]) => ({
  conversation: {
    id: 'c1',
    lessonId: 'l1',
    turnCount: 0,
    lastMessageAt: NOW,
    createdAt: NOW,
  },
  lesson: { id: 'l1', slug: 'greetings', title: 'Greetings', level: 'A1' },
  messages,
});

const wrongCorrection = {
  id: 'k1',
  isCorrect: false,
  corrected: 'هَذَا الْكِتَابُ الْجَدِيدُ',
  praise: null,
  mistakes: [
    {
      id: 'x1',
      type: 'grammar',
      original: 'كتاب',
      correction: 'الْكِتَابُ',
      explanation: 'Add ال after the demonstrative.',
    },
  ],
};
const rightCorrection = {
  id: 'k2',
  isCorrect: true,
  corrected: 'مرحبا',
  praise: 'Well said!',
  mistakes: [],
};

const encoder = new TextEncoder();
const frame = (event: string, data: unknown) =>
  encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

/** A turn stream the test feeds by hand, so it can look at the page between two events. */
function liveStream() {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const body = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
    },
  });
  return {
    response: new Response(body, { headers: { 'Content-Type': 'text/event-stream' } }),
    emit: (event: string, data: unknown) =>
      act(() => {
        controller.enqueue(frame(event, data));
        return Promise.resolve();
      }),
    end: () =>
      act(() => {
        controller.close();
        return Promise.resolve();
      }),
  };
}

const learnerEvent = (text: string) => ({ message: message('m2', 'learner', text) });
const partnerDone = (text: string) => ({
  message: message('m3', 'partner', text),
  usage: { inputTokens: 1, outputTokens: 1, model: 'fake', latencyMs: 1 },
});

beforeEach(() => localStorage.clear());

const signedIn = { 'GET /auth/me': () => Response.json({ user: learner }) };

function setup(extra: Handlers = {}, messages?: object[]) {
  return stubApi({
    ...signedIn,
    'GET /conversations/c1': () => Response.json(detail(messages)),
    ...extra,
  });
}

async function openChat() {
  renderAt('/practice/c1');
  return await screen.findByLabelText(en['chat.composer.label']);
}

async function typeAndSend(box: HTMLElement, text: string) {
  await userEvent.type(box, `${text}{Enter}`);
}

describe('practice chat: reading a conversation', () => {
  it('shows the header strip, the opening line and a harakat toggle', async () => {
    setup();
    await openChat();
    expect(screen.getByRole('heading', { level: 1, name: 'Greetings' })).toBeVisible();
    expect(screen.getByText('A1')).toBeVisible();
    expect(screen.getByRole('link', { name: en['chat.backToLesson'] })).toHaveAttribute(
      'href',
      '/lessons/greetings',
    );
    expect(screen.getByText(OPENING)).toHaveAttribute('lang', 'ar');
    expect(screen.getByText(OPENING)).toHaveAttribute('dir', 'rtl');

    await userEvent.click(screen.getByRole('checkbox', { name: en['chat.harakat.toggle'] }));
    expect(screen.getByText('مرحبا! كيف حالك؟')).toBeVisible();
  });

  it('shows saved corrections and a "could not check" note for a missing one', async () => {
    setup({}, [
      message('m1', 'partner', OPENING),
      message('m2', 'learner', 'هذا كتاب الجديد', { correction: wrongCorrection }),
      message('m3', 'learner', 'مرحبا', { correction: null }),
    ]);
    await openChat();
    expect(screen.getByText(en['chat.correction.title'])).toBeVisible();
    expect(screen.getByText(en['chat.correction.failed'])).toBeVisible();
  });

  it('shows the free-tier note to guests only', async () => {
    setup({ 'GET /auth/me': () => Response.json({ user: { ...learner, isGuest: true } }) });
    await openChat();
    expect(screen.getByText(en['chat.guestNote'])).toBeVisible();
  });

  it('says so when the conversation is not found', async () => {
    setup({ 'GET /conversations/c1': () => jsonError('NOT_FOUND', 404) });
    renderAt('/practice/c1');
    expect(await screen.findByText(en['chat.notFound.title'])).toBeVisible();
  });
});

describe('practice chat: a turn', () => {
  it('streams the reply, shows the correction, and announces only the finished reply', async () => {
    const stream = liveStream();
    const calls = setup({ 'POST /conversations/c1/turns': () => stream.response });
    const box = await openChat();

    await typeAndSend(box, 'هذا كتاب الجديد');
    // The learner's bubble is there at once, before any event.
    expect(
      within(screen.getByRole('list', { name: en['chat.messages'] })).getByText('هذا كتاب الجديد'),
    ).toBeVisible();
    expect(box).toHaveAttribute('readonly');
    expect(screen.getByRole('button', { name: en['chat.stop'] })).toBeVisible();
    expect(calls.at(-1)).toEqual({
      key: 'POST /conversations/c1/turns',
      body: { text: 'هذا كتاب الجديد' },
    });

    await stream.emit('learner', learnerEvent('هذا كتاب الجديد'));
    expect(await screen.findByText(en['chat.correction.checking'])).toBeVisible();
    expect(box).toHaveValue('');

    await stream.emit('delta', { text: 'أَهْلًا ' });
    await stream.emit('delta', { text: 'بِكَ' });
    expect(await screen.findByText('أَهْلًا بِكَ')).toBeVisible();
    // Deltas never reach the live region.
    const live = document.querySelector('p[aria-live="polite"]');
    expect(live?.textContent).toBe('');

    await stream.emit('correction', { messageId: 'm2', correction: wrongCorrection });
    await stream.emit('done', partnerDone('أَهْلًا بِكَ'));
    await stream.end();

    expect(await screen.findByText(en['chat.correction.title'])).toBeVisible();
    await waitFor(() => expect(box).not.toHaveAttribute('readonly'));
    expect(box).toHaveFocus();
    expect(live?.textContent).toContain('أَهْلًا بِكَ');
    // The finished turn is in the list once, not twice (cache updated, no duplicate bubble).
    expect(screen.getAllByText('أَهْلًا بِكَ')).toHaveLength(1);
    const list = within(screen.getByRole('list', { name: en['chat.messages'] }));
    expect(list.getAllByText('هذا كتاب الجديد')).toHaveLength(1);
    // And no refetch of the conversation was needed.
    expect(calls.filter((c) => c.key === 'GET /conversations/c1')).toHaveLength(1);
  });

  it('highlights the changed words and lists each mistake', async () => {
    const stream = liveStream();
    setup({ 'POST /conversations/c1/turns': () => stream.response });
    const box = await openChat();
    await typeAndSend(box, 'هذا كتاب الجديد');
    await stream.emit('learner', learnerEvent('هذا كتاب الجديد'));
    await stream.emit('correction', { messageId: 'm2', correction: wrongCorrection });
    await stream.emit('delta', { text: 'نعم' });
    await stream.emit('done', partnerDone('نعم'));
    await stream.end();

    const card = (await screen.findByText(en['chat.correction.title'])).closest('div')!;
    const marks = card.querySelectorAll('mark');
    expect([...marks].map((m) => m.textContent)).toEqual(['الْكِتَابُ']);
    const mistake = within(within(card).getByRole('list'));
    expect(mistake.getByText(en['mistake.grammar'])).toBeVisible();
    expect(mistake.getByText('Add ال after the demonstrative.')).toBeVisible();
  });

  it('shows a calm "Correct" with the praise for a right sentence', async () => {
    const stream = liveStream();
    setup({ 'POST /conversations/c1/turns': () => stream.response });
    const box = await openChat();
    await typeAndSend(box, 'مرحبا');
    await stream.emit('learner', learnerEvent('مرحبا'));
    await stream.emit('correction', { messageId: 'm2', correction: rightCorrection });
    await stream.emit('delta', { text: 'أهلا' });
    await stream.emit('done', partnerDone('أهلا'));
    await stream.end();
    expect(await screen.findByText(en['chat.correction.correct'])).toBeVisible();
    expect(screen.getByText('Well said!')).toBeVisible();
  });

  // The API sends the correction before, between or after the reply; always before `done`.
  it.each([
    ['before the reply', ['correction', 'delta', 'delta', 'done']],
    ['between deltas', ['delta', 'correction', 'delta', 'done']],
    ['after the last delta', ['delta', 'delta', 'correction', 'done']],
  ])('keeps both halves when the correction arrives %s', async (_name, order) => {
    const stream = liveStream();
    setup({ 'POST /conversations/c1/turns': () => stream.response });
    const box = await openChat();
    await typeAndSend(box, 'مرحبا');
    await stream.emit('learner', learnerEvent('مرحبا'));
    for (const name of order) {
      if (name === 'delta') await stream.emit('delta', { text: 'أهلا ' });
      if (name === 'correction')
        await stream.emit('correction', { messageId: 'm2', correction: rightCorrection });
      if (name === 'done') await stream.emit('done', partnerDone('أهلا أهلا '));
    }
    await stream.end();
    expect(await screen.findByText(en['chat.correction.correct'])).toBeVisible();
    expect(screen.getByText('أهلا أهلا')).toBeVisible();
    expect(screen.queryByText(en['chat.correction.checking'])).toBeNull();
  });

  it('shows "could not check" without breaking the reply', async () => {
    const stream = liveStream();
    setup({ 'POST /conversations/c1/turns': () => stream.response });
    const box = await openChat();
    await typeAndSend(box, 'مرحبا');
    await stream.emit('learner', learnerEvent('مرحبا'));
    await stream.emit('error', { code: 'AI_FAILED', message: 'x', scope: 'correction' });
    await stream.emit('delta', { text: 'أهلا' });
    await stream.emit('done', partnerDone('أهلا'));
    await stream.end();
    expect(await screen.findByText(en['chat.correction.failed'])).toBeVisible();
    expect(screen.getByText('أهلا')).toBeVisible();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('keeps the learner message and offers a retry when the reply fails', async () => {
    const stream = liveStream();
    const calls = setup({ 'POST /conversations/c1/turns': () => stream.response });
    const box = await openChat();
    await typeAndSend(box, 'مرحبا');
    await stream.emit('learner', learnerEvent('مرحبا'));
    await stream.emit('delta', { text: 'نصف' });
    await stream.emit('error', { code: 'AI_FAILED', message: 'x', scope: 'reply' });
    await stream.end();

    expect(await screen.findByText(en['chat.error.replyFailed'])).toBeVisible();
    expect(screen.getByText('مرحبا')).toBeVisible();
    // The saved line says it got no reply, so the failed turn is not a mystery.
    expect(screen.getByText(en['chat.noReply'])).toBeVisible();
    // The half reply was never saved, so it is gone.
    expect(screen.queryByText('نصف')).toBeNull();
    expect(screen.getByRole('button', { name: en['chat.retry'] })).toBeVisible();
    expect(calls.filter((c) => c.key === 'POST /conversations/c1/turns')).toHaveLength(1);
  });

  it('mutes the earlier unanswered line when Retry saves the text a second time', async () => {
    const first = liveStream();
    const second = liveStream();
    let posts = 0;
    let firstSaved = false;
    stubApi({
      ...signedIn,
      // The server keeps the first learner line even though it got no reply.
      'GET /conversations/c1': () =>
        Response.json(
          detail(
            firstSaved
              ? [message('m1', 'partner', OPENING), message('m2', 'learner', 'مرحبا')]
              : undefined,
          ),
        ),
      'POST /conversations/c1/turns': () => {
        posts += 1;
        return posts === 1 ? first.response : second.response;
      },
    });
    const box = await openChat();
    await typeAndSend(box, 'مرحبا');
    await first.emit('learner', learnerEvent('مرحبا'));
    firstSaved = true;
    await first.emit('error', { code: 'AI_FAILED', message: 'x', scope: 'reply' });
    await first.end();
    expect(await screen.findByText(en['chat.noReply'])).toBeVisible();

    await userEvent.click(screen.getByRole('button', { name: en['chat.retry'] }));
    await second.emit('learner', { message: message('m4', 'learner', 'مرحبا') });
    await second.emit('delta', { text: 'أهلا' });
    await second.emit('done', partnerDone('أهلا'));
    await second.end();
    expect(await screen.findByText('أهلا')).toBeVisible();

    // Both learner lines are kept (the server has both): the first one muted, the second plain.
    const lines = screen.getAllByText('مرحبا');
    expect(lines).toHaveLength(2);
    expect(screen.getAllByText(en['chat.notAnswered'])).toHaveLength(1);
    expect(screen.queryByText(en['chat.noReply'])).toBeNull();
  });

  it('does not send on Shift+Enter or when empty', async () => {
    const calls = setup();
    const box = await openChat();
    await userEvent.type(box, 'سطر{Shift>}{Enter}{/Shift}ثان');
    expect(box).toHaveValue('سطر\nثان');
    await userEvent.clear(box);
    await userEvent.type(box, '   {Enter}');
    expect(calls.some((c) => c.key.startsWith('POST'))).toBe(false);
  });

  it('counts characters and stops at 500', async () => {
    setup();
    const box = await openChat();
    expect(screen.getByText('0 / 500')).toBeVisible();
    await userEvent.type(box, 'ا'.repeat(3));
    expect(screen.getByText('3 / 500')).toBeVisible();
    expect(box).toHaveAttribute('maxlength', '500');
  });

  it('stops the stream with the Stop button', async () => {
    const stream = liveStream();
    let signal: AbortSignal | null | undefined;
    let loads = 0;
    setup({
      // After a stop the page asks the server what it really saved: the learner message, no reply.
      'GET /conversations/c1': () => {
        loads += 1;
        return Response.json(
          detail(
            loads === 1
              ? undefined
              : [message('m1', 'partner', OPENING), message('m2', 'learner', 'مرحبا')],
          ),
        );
      },
      'POST /conversations/c1/turns': (init) => {
        signal = init.signal;
        return stream.response;
      },
    });
    const box = await openChat();
    await typeAndSend(box, 'مرحبا');
    await stream.emit('learner', learnerEvent('مرحبا'));
    await stream.emit('delta', { text: 'أهلا' });
    await userEvent.click(screen.getByRole('button', { name: en['chat.stop'] }));
    expect(signal?.aborted).toBe(true);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: en['chat.send'] })).toBeVisible(),
    );
    expect(box).not.toHaveAttribute('readonly');
    // The learner message stays; the cut-short reply does not appear.
    expect(screen.getByText('مرحبا')).toBeVisible();
    expect(screen.queryByText('أهلا')).toBeNull();
  });
});

describe('practice chat: errors before the stream', () => {
  const limited = (code: string, status = 429) => ({
    'POST /conversations/c1/turns': () => jsonError(code, status),
  });

  it('shows the daily limit with its reset time and keeps the text', async () => {
    setup(limited('AI_LIMIT_USER'));
    const box = await openChat();
    await typeAndSend(box, 'شكرا');
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("You've reached today's practice limit.");
    expect(alert).toHaveTextContent('resets at');
    expect(within(alert).queryByRole('button')).toBeNull();
    expect(box).toHaveValue('شكرا');
    // The optimistic bubble is gone: nothing was sent.
    expect(screen.getByRole('list', { name: en['chat.messages'] }).textContent).not.toContain(
      'شكرا',
    );
  });

  it('says the partner is resting when the global cap is hit', async () => {
    setup(limited('AI_LIMIT_GLOBAL'));
    const box = await openChat();
    await typeAndSend(box, 'مرحبا');
    expect(await screen.findByRole('alert')).toHaveTextContent('The practice partner is resting');
  });

  it('retries the same text after "busy"', async () => {
    let attempts = 0;
    const stream = liveStream();
    const calls = setup({
      'POST /conversations/c1/turns': () => {
        attempts += 1;
        return attempts === 1 ? jsonError('AI_BUSY', 503) : stream.response;
      },
    });
    const box = await openChat();
    await typeAndSend(box, 'مرحبا');
    expect(await screen.findByRole('alert')).toHaveTextContent('Too many people are practising');
    await userEvent.click(screen.getByRole('button', { name: en['chat.retry'] }));
    await stream.emit('learner', learnerEvent('مرحبا'));
    await stream.emit('delta', { text: 'أهلا' });
    await stream.emit('done', partnerDone('أهلا'));
    await stream.end();
    expect(await screen.findByText('أهلا')).toBeVisible();
    const posts = calls.filter((c) => c.key === 'POST /conversations/c1/turns');
    expect(posts.map((p) => p.body)).toEqual([{ text: 'مرحبا' }, { text: 'مرحبا' }]);
    expect(box).toHaveValue('');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('offers a retry when the network fails', async () => {
    let attempts = 0;
    const stream = liveStream();
    setup({
      'POST /conversations/c1/turns': () => {
        attempts += 1;
        if (attempts === 1) throw new TypeError('failed to fetch');
        return stream.response;
      },
    });
    const box = await openChat();
    await typeAndSend(box, 'مرحبا');
    expect(await screen.findByText(en['chat.error.network'])).toBeVisible();
    expect(box).toHaveValue('مرحبا');
    expect(screen.getByRole('button', { name: en['chat.retry'] })).toBeVisible();
  });
});

describe('practice chat: translate and keyboard', () => {
  it('loads the gloss once and shows it under the bubble', async () => {
    const calls = setup({
      'POST /messages/m1/gloss': () => Response.json({ glossEn: 'Hello! How are you?' }),
    });
    await openChat();
    const button = screen.getByRole('button', { name: en['chat.translate'] });
    await userEvent.click(button);
    expect(await screen.findByText('Hello! How are you?')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: en['chat.translate.hide'] }));
    expect(screen.queryByText('Hello! How are you?')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: en['chat.translate'] }));
    expect(await screen.findByText('Hello! How are you?')).toBeVisible();
    // Cached: the second time did not call the API again.
    expect(calls.filter((c) => c.key === 'POST /messages/m1/gloss')).toHaveLength(1);
  });

  it('shows a gloss the API already holds without a request', async () => {
    const calls = setup({}, [message('m1', 'partner', OPENING, { glossEn: 'Welcome!' })]);
    await openChat();
    await userEvent.click(screen.getByRole('button', { name: en['chat.translate'] }));
    expect(screen.getByText('Welcome!')).toBeVisible();
    expect(calls.some((c) => c.key.includes('gloss'))).toBe(false);
  });

  it('inserts keyboard keys at the caret of the composer', async () => {
    setup();
    const box = await openChat();
    await userEvent.click(screen.getByRole('button', { name: en['keyboard.toggle'] }));
    await userEvent.type(box, 'اب');
    (box as HTMLTextAreaElement).setSelectionRange(1, 1);
    await userEvent.click(screen.getByRole('button', { name: 'ت' }));
    expect(box).toHaveValue('اتب');
    expect(box).toHaveFocus();
    expect(screen.getByText('3 / 500')).toBeVisible();
  });
});

describe('practice chat: the lesson talk step', () => {
  it('marks the talk step once, after the first finished reply', async () => {
    const stream = liveStream();
    const calls = setup({
      'POST /conversations/c1/turns': () => stream.response,
      'POST /lessons/greetings/progress': () =>
        Response.json({ xpGained: 10, xpToday: 10, streak: 1 }),
    });
    const box = await openChat();
    await typeAndSend(box, 'مرحبا');
    await stream.emit('learner', learnerEvent('مرحبا'));
    expect(calls.some((c) => c.key === 'POST /lessons/greetings/progress')).toBe(false);
    await stream.emit('done', partnerDone('أَهْلًا'));
    await stream.end();
    await waitFor(() =>
      expect(calls.filter((c) => c.key === 'POST /lessons/greetings/progress')).toEqual([
        { key: 'POST /lessons/greetings/progress', body: { step: 'talk', day: localDay() } },
      ]),
    );
  });
});
