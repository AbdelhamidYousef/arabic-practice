import { Writable } from 'node:stream';

import express from 'express';
import { pinoHttp } from 'pino-http';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createErrorHandler } from '../middleware/error.ts';

import { createLogger } from './logger.ts';
import { scrubError } from './scrub-error.ts';

const EMAIL = 'victim@example.com';
const HASH = 'f'.repeat(64);

// The shape drizzle-orm 0.45 throws: a wrapper with query + params whose message repeats them, and
// the driver's own error underneath with `parameters` and a `detail` that names the value.
class DrizzleQueryError extends Error {
  query: string;
  params: unknown[];
  constructor(query: string, params: unknown[], cause: Error) {
    super(`Failed query: ${query}\nparams: ${params.join(',')}`, { cause });
    this.name = 'DrizzleQueryError';
    this.query = query;
    this.params = params;
  }
}
class PostgresError extends Error {
  parameters = [EMAIL, HASH];
  detail = `Key (email)=(${EMAIL}) already exists.`;
  code = '23505';
  constructor() {
    super('duplicate key value violates unique constraint "users_email_unique"');
    this.name = 'PostgresError';
  }
}
const sample = () =>
  new DrizzleQueryError(
    'insert into "users" ("email", "password_hash") values ($1, $2)',
    [EMAIL, HASH],
    new PostgresError(),
  );

function capture() {
  const lines: string[] = [];
  const destination = new Writable({
    write(chunk: Buffer, _enc, done) {
      lines.push(chunk.toString());
      done();
    },
  });
  return { lines, destination };
}

describe('scrubError', () => {
  it('drops params and parameters on the error and on its cause, and the values from the message', () => {
    const out = scrubError(sample()) as Record<string, unknown>;
    const json = JSON.stringify(out);
    expect(out).not.toHaveProperty('params');
    expect(out.cause).not.toHaveProperty('parameters');
    expect(out.cause).not.toHaveProperty('detail');
    expect(json).not.toContain(EMAIL);
    expect(json).not.toContain(HASH);
    // Still debuggable: the SQL with placeholders, the codes and the driver message survive.
    expect(out.query).toContain('insert into "users"');
    expect(out.message).toContain('Failed query:');
    expect(out.cause).toMatchObject({ code: '23505', type: 'PostgresError' });
  });

  it('leaves anything that is not an Error alone', () => {
    expect(scrubError('x')).toBe('x');
    expect(scrubError(undefined)).toBeUndefined();
  });
});

describe('logging a database error', () => {
  it('createLogger never writes the parameters', () => {
    const { lines, destination } = capture();
    createLogger({ level: 'info', destination }).error({ err: sample() }, 'boom');
    const text = lines.join('');
    expect(text).toContain('Failed query');
    expect(text).not.toContain(EMAIL);
    expect(text).not.toContain(HASH);
    expect(text).not.toContain('"params"');
  });

  it('the error middleware logs a 500 through it without the parameters', async () => {
    const { lines, destination } = capture();
    const app = express();
    app.use(pinoHttp({ logger: createLogger({ level: 'info', destination }) }));
    app.get('/boom', () => {
      throw sample();
    });
    app.use(createErrorHandler({ isProduction: true }));
    const res = await request(app).get('/boom');
    expect(res.status).toBe(500);
    const text = lines.join('');
    expect(text).toContain('unhandled error');
    expect(text).not.toContain(EMAIL);
    expect(text).not.toContain(HASH);
    expect(res.text).not.toContain(EMAIL);
  });
});
