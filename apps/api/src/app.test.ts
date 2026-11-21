import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from './app.ts';

describe('health endpoint', () => {
  it('answers 200 with status ok', async () => {
    const res = await request(createApp()).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('does not advertise the framework', async () => {
    const res = await request(createApp()).get('/api/v1/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});
