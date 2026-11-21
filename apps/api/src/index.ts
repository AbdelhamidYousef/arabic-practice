import { createApp } from './app.ts';

// Long-running server (local dev, e2e). Anything testable lives in createApp().
const port = Number(process.env.PORT ?? 3002);
createApp().listen(port, () => {
  console.log(`api listening on http://localhost:${port}`);
});
