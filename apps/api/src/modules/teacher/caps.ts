import { env } from '../../config/env.ts';

export interface DailyCaps {
  learnerTurns: number;
  guestTurns: number;
  callsPerModel: number;
}

// The one place the usage page reads the AI daily caps. When the per-model env name changes
// (AI_DAILY_CALLS_GLOBAL -> AI_DAILY_CALLS_PER_MODEL) only `callsPerModel` below needs to follow.
export function readDailyCaps(): DailyCaps {
  return {
    learnerTurns: env.AI_DAILY_TURNS_LEARNER,
    guestTurns: env.AI_DAILY_TURNS_GUEST,
    callsPerModel: env.AI_DAILY_CALLS_GLOBAL,
  };
}
