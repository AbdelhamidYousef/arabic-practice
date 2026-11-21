import { z } from 'zod';

import { apiFetch } from './client';

// The export is a file for the person, not data the app reads, so its shape is not parsed here.
export const fetchExport = (): Promise<unknown> => apiFetch('/me/export', { schema: z.unknown() });

export async function deleteAccount(password: string): Promise<void> {
  await apiFetch('/me', { method: 'DELETE', body: { password }, schema: z.unknown() });
}
