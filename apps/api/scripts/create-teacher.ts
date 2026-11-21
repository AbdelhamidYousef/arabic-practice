import { createInterface } from 'node:readline';

import { closeDb } from '../src/db/client.ts';
import { createTeacherAccount } from '../src/modules/auth/create-teacher.ts';

// Usage: pnpm --filter @arabic/api teacher:create <email> [--name "Display Name"]
// The password is asked for on the terminal with echo off, never taken from argv (a command line
// ends up in shell history and in `ps`). It uses DATABASE_URL from the root .env; for Neon that
// must be the DIRECT connection string (not the -pooler host), see the README.
function readHidden(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = process.stdin;
    if (!input.isTTY) {
      // Piped input (a password manager, a CI secret): one line, nothing to hide.
      const rl = createInterface({ input });
      rl.once('line', (line) => {
        resolve(line);
        rl.close();
      });
      rl.once('close', () => reject(new Error('no password received on stdin')));
      return;
    }
    process.stdout.write(prompt);
    input.setRawMode(true);
    input.resume();
    input.setEncoding('utf8');
    let value = '';
    const onData = (chunk: string) => {
      for (const ch of chunk) {
        if (ch === '\r' || ch === '\n' || ch === '\u0004') {
          input.setRawMode(false);
          input.pause();
          input.off('data', onData);
          process.stdout.write('\n');
          resolve(value);
          return;
        }
        if (ch === '\u0003') {
          input.setRawMode(false);
          process.stdout.write('\n');
          reject(new Error('cancelled'));
          return;
        }
        if (ch === '\u007f' || ch === '\b') value = value.slice(0, -1);
        else value += ch;
      }
    };
    input.on('data', onData);
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const nameAt = args.indexOf('--name');
  const displayName = nameAt >= 0 ? args[nameAt + 1] : undefined;
  const email = args.find((a, i) => !a.startsWith('--') && (nameAt < 0 || i !== nameAt + 1));
  if (!email) throw new Error('usage: teacher:create <email> [--name "Display Name"]');

  const password = await readHidden('Password: ');
  if (process.stdin.isTTY) {
    const again = await readHidden('Repeat password: ');
    if (again !== password) throw new Error('the two passwords differ');
  }
  const created = await createTeacherAccount({ email, password, displayName });
  console.log(`teacher created: ${created.email} (${created.id})`);
}

try {
  await main();
} catch (err) {
  console.error(`teacher:create failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
} finally {
  await closeDb();
}
