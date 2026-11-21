import type { CefrLevel } from '@arabic/shared';

// Every person here is made up. The `.test` top-level domain is reserved (RFC 2606), so no address
// below can ever belong to a real person or receive mail.

export const DEMO_TEACHER = {
  email: 'demo-teacher@arabic-practice.test',
  displayName: 'Ustadh Demo',
} as const;

// A teacher login for local work (edit lessons, create invites). The password comes from
// SEED_TEACHER_PASSWORD; the default below is for a laptop only and is never created in production.
export const DEV_TEACHER = {
  email: 'teacher@arabic-practice.test',
  displayName: 'Ustadh Dev',
} as const;

export const DEFAULT_DEV_TEACHER_PASSWORD = 'Teacher-demo-1!';

export interface SeedLearner {
  email: string;
  displayName: string;
  level: CefrLevel;
}

export const demoLearners: SeedLearner[] = [
  { email: 'layla.hart@arabic-practice.test', displayName: 'Layla Hart', level: 'A1' },
  { email: 'omar.whitfield@arabic-practice.test', displayName: 'Omar Whitfield', level: 'A2' },
  { email: 'sofia.marin@arabic-practice.test', displayName: 'Sofia Marin', level: 'B1' },
  { email: 'daniel.okafor@arabic-practice.test', displayName: 'Daniel Okafor', level: 'B2' },
];
