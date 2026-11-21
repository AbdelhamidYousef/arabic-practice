import { z } from 'zod';

import { apiFetch } from './client';

const HealthSchema = z.object({ status: z.string() }).passthrough();

export function fetchHealth(signal?: AbortSignal) {
  return apiFetch('/health', { schema: HealthSchema, ...(signal && { signal }) });
}
