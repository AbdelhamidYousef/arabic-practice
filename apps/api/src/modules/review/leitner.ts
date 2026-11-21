export const MAX_BOX = 5;
// Days to wait after answering, per box (index 0 is unused so the box number is the index).
const INTERVAL_DAYS = [0, 1, 2, 4, 8, 16] as const;
const DAY_MS = 24 * 3600 * 1000;

export interface CardState {
  box: number;
  reviews: number;
  lapses: number;
}

export interface NextCardState extends CardState {
  dueAt: Date;
  lastReviewedAt: Date;
}

export function intervalDays(box: number): number {
  const days = INTERVAL_DAYS[box];
  if (!Number.isInteger(box) || box < 1 || days === undefined)
    throw new RangeError(`box must be between 1 and ${MAX_BOX}, got ${box}`);
  return days;
}

// Leitner boxes: right moves the card one box up (capped at 5), wrong sends it back to box 1 and
// counts a lapse. The new due date is `now` plus the interval of the NEW box.
export function reviewCard(card: CardState, correct: boolean, now: Date): NextCardState {
  intervalDays(card.box); // reject an impossible stored box instead of computing on it
  const box = correct ? Math.min(card.box + 1, MAX_BOX) : 1;
  return {
    box,
    reviews: card.reviews + 1,
    lapses: correct ? card.lapses : card.lapses + 1,
    dueAt: new Date(now.getTime() + intervalDays(box) * DAY_MS),
    lastReviewedAt: now,
  };
}
