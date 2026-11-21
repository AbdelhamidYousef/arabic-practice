import { FakeProvider } from '../../ai/fake.ts';
import {
  LlmBadOutput,
  LlmFailed,
  LlmRateLimited,
  type JsonRequest,
  type StreamEvent,
  type TextRequest,
  type Usage,
} from '../../ai/provider.ts';

type Fault = 'fail' | 'bad-output' | 'rate-limit';

function throwFault(fault: Fault): never {
  if (fault === 'rate-limit') throw new LlmRateLimited('scripted: rate limited', 1000);
  if (fault === 'bad-output') throw new LlmBadOutput('scripted: bad output', '{nope');
  throw new LlmFailed('SCRIPTED', 'scripted: failure');
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    // An already-aborted signal never fires 'abort' again, so check it first.
    if (signal?.aborted) return reject(new LlmFailed('ABORTED', 'aborted before it started'));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new LlmFailed('ABORTED', 'scripted: aborted'));
      },
      { once: true },
    );
  });
}

// The fake plus the scripts a turn test needs and the plain fake cannot do: a fault on ONE purpose
// (`failNext` always hits whichever call comes first, which is the reply), a failure in the middle
// of a stream, a slow correction, and a stream that stalls after its first chunk.
export class ScriptedProvider extends FakeProvider {
  correctionFault: Fault | undefined;
  correctionDelayMs = 0;
  replyFaultAfterFirstDelta: Fault | undefined;
  /** Stall after the first delta until this many ms pass or the call is aborted. */
  replyStallMs = 0;
  /** Set when the stalled stream saw the abort signal. */
  replyAborted = false;

  override async generateJson<T>(request: JsonRequest<T>): Promise<{ data: T; usage: Usage }> {
    if (request.purpose === 'correction') {
      if (this.correctionDelayMs > 0) await wait(this.correctionDelayMs, request.signal);
      if (this.correctionFault) throwFault(this.correctionFault);
    }
    return super.generateJson(request);
  }

  override async *streamText(request: TextRequest): AsyncGenerator<StreamEvent> {
    let deltas = 0;
    for await (const event of super.streamText(request)) {
      yield event;
      if (event.type === 'delta' && ++deltas === 1) {
        if (this.replyFaultAfterFirstDelta) throwFault(this.replyFaultAfterFirstDelta);
        if (this.replyStallMs > 0) {
          try {
            await wait(this.replyStallMs, request.signal);
          } catch (e) {
            this.replyAborted = true;
            throw e;
          }
        }
      }
    }
  }
}
