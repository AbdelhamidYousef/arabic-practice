import { bootstrap } from './bootstrap.ts';
import { env } from './config/env.ts';
import { closeDb } from './db/client.ts';
import { createShutdown } from './lib/shutdown.ts';

// Long-running server (local dev, e2e, any always-on host): build the app and listen. Anything
// testable lives in createApp().
const { app, logger } = bootstrap();

const server = app.listen(env.PORT, () => {
  logger.info(`api listening on http://localhost:${env.PORT}`);
});

const shutdown = createShutdown({ server, logger, cleanup: closeDb });
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
