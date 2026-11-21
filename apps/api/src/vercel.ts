import { bootstrap } from './bootstrap.ts';

// Serverless entry for Vercel (apps/web/api/index.js re-exports this). One instance may serve many
// requests, so the app is built once per instance at module load. Nothing runs after a response
// ends (no timers, no background work): a practice turn streams inside its own request, and guest
// cleanup happens inside the guest sign-in request.
const { app } = bootstrap();

// Vercel calls the default export of a function file as the request handler.
// eslint-disable-next-line import/no-default-export
export default app;
