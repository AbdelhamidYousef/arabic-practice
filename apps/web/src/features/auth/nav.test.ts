import { describe, expect, it } from 'vitest';

import type { User } from '../../api/auth';
import { learner, teacher } from '../../test-utils';

import { navFor } from './nav';

const settings = (user: object) => navFor(user as User).some((item) => item.to === '/settings');

describe('navFor: the settings link', () => {
  it('is there for a learner and a teacher with an account', () => {
    expect(settings(learner)).toBe(true);
    expect(settings(teacher)).toBe(true);
  });

  it('is not there for a visitor, a guest or the read-only demo teacher', () => {
    expect(navFor(null).some((item) => item.to === '/settings')).toBe(false);
    expect(settings({ ...learner, isGuest: true })).toBe(false);
    expect(settings({ ...teacher, readOnly: true })).toBe(false);
  });
});
