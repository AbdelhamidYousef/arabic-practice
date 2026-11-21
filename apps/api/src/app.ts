import express, { type Express } from 'express';
import helmet from 'helmet';

// The app is built by a function, not at import time, so tests can create as many isolated
// instances as they like and Supertest can drive one without opening a real port.
export function createApp(): Express {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());

  app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}
