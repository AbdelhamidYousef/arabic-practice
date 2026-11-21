import request from 'supertest';

import { createSession } from '../modules/auth/sessions.ts';

import { TEST_ORIGIN } from './app.ts';
import { createUser } from './factories.ts';

type App = Parameters<typeof request>[0];

// A user plus a ready-to-send `sid` cookie (no password involved).
export async function signedIn(overrides: Parameters<typeof createUser>[0] = {}) {
  const user = await createUser(overrides);
  const { token } = await createSession(user.id);
  return { user, token, cookie: `sid=${token}` };
}

// Helpers that always send the allowed Origin, so a test says only what it is about.
export const api = (app: App) => ({
  get: (path: string, cookie?: string) => {
    const req = request(app).get(`/api/v1${path}`);
    return cookie ? req.set('Cookie', cookie) : req;
  },
  post: (path: string, body: object = {}, cookie?: string) => {
    const req = request(app).post(`/api/v1${path}`).set('Origin', TEST_ORIGIN).send(body);
    return cookie ? req.set('Cookie', cookie) : req;
  },
  put: (path: string, body: object = {}, cookie?: string) => {
    const req = request(app).put(`/api/v1${path}`).set('Origin', TEST_ORIGIN).send(body);
    return cookie ? req.set('Cookie', cookie) : req;
  },
  patch: (path: string, body: object = {}, cookie?: string) => {
    const req = request(app).patch(`/api/v1${path}`).set('Origin', TEST_ORIGIN).send(body);
    return cookie ? req.set('Cookie', cookie) : req;
  },
  delete: (path: string, cookie?: string, body?: object) => {
    const req = request(app).delete(`/api/v1${path}`).set('Origin', TEST_ORIGIN);
    const withBody = body ? req.send(body) : req;
    return cookie ? withBody.set('Cookie', cookie) : withBody;
  },
});
