import { describe, expect, it } from 'vitest';

import { makeTestApp } from '../../test/app.ts';
import { api } from '../../test/auth.ts';
import { createDemoTeacher, createTeacher } from '../../test/factories.ts';
import { bodyOf, cookieValue, errorOf, setCookieLine } from '../../test/http.ts';

const app = makeTestApp();
const { get, post } = api(app);

describe('POST /auth/demo-teacher', () => {
  it('signs in as the read-only demo teacher', async () => {
    const demo = await createDemoTeacher();
    const res = await post('/auth/demo-teacher');

    expect(res.status).toBe(200);
    expect(bodyOf(res)).toEqual({
      user: {
        id: demo.id,
        displayName: 'Ustadh Demo',
        role: 'teacher',
        level: 'A1',
        isGuest: false,
        readOnly: true,
        email: 'demo-teacher@arabic-practice.test',
      },
    });
    expect(setCookieLine(res, 'sid')).toContain('HttpOnly');
    const me = await get('/auth/me', `sid=${cookieValue(res, 'sid')}`);
    expect(bodyOf<{ user: { readOnly: boolean } }>(me).user.readOnly).toBe(true);
  });

  it('answers 503 DEMO_UNAVAILABLE when the demo teacher is not seeded', async () => {
    const res = await post('/auth/demo-teacher');
    expect(res.status).toBe(503);
    expect(errorOf(res).code).toBe('DEMO_UNAVAILABLE');
  });

  it('never signs into a demo account that lost its read-only flag', async () => {
    await createDemoTeacher({ readOnly: false });
    const res = await post('/auth/demo-teacher');
    expect(res.status).toBe(503);
    expect(setCookieLine(res, 'sid')).toBeUndefined();
  });

  it('never signs into a demo account that is not a teacher', async () => {
    await createTeacher({
      email: 'demo-teacher@arabic-practice.test',
      role: 'learner',
      readOnly: true,
    });
    expect((await post('/auth/demo-teacher')).status).toBe(503);
  });

  it('refuses a cross-origin request and limits per IP', async () => {
    await createDemoTeacher();
    expect((await post('/auth/demo-teacher').set('Origin', 'https://evil.example')).status).toBe(
      403,
    );
    const limited = makeTestApp({ config: { guestRateLimit: { windowMs: 3600_000, limit: 1 } } });
    const { post: p } = api(limited);
    expect((await p('/auth/demo-teacher')).status).toBe(200);
    expect((await p('/auth/demo-teacher')).status).toBe(429);
  });
});
