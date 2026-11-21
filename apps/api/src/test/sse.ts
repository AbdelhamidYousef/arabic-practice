import { TurnEventSchema, type TurnEvent } from '@arabic/shared';

// Parses a finished `text/event-stream` body into typed events. Each one is checked against the
// shared schema, so a test that parses the stream also proves the web can parse it.
export function parseTurnEvents(text: string): TurnEvent[] {
  return text
    .split('\n\n')
    .filter((block) => block.trim() !== '')
    .map((block) => {
      const name = /^event: (.+)$/m.exec(block)?.[1];
      const data = /^data: (.+)$/m.exec(block)?.[1];
      if (!name || data === undefined) throw new Error(`not an SSE event: ${block}`);
      return TurnEventSchema.parse({ event: name, data: JSON.parse(data) as unknown });
    });
}

export const eventNames = (events: TurnEvent[]) => events.map((e) => e.event);

export function eventsOf<N extends TurnEvent['event']>(events: TurnEvent[], name: N) {
  return events.filter((e): e is Extract<TurnEvent, { event: N }> => e.event === name);
}
