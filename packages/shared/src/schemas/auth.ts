import { z } from 'zod';

// Trimmed and lower-cased on the way in; the database column is case-insensitive as well.
const email = z.string().trim().toLowerCase().pipe(z.email().max(254));

// argon2 hashes whatever it is given, so an unbounded password is a cheap way to burn CPU and
// memory. 200 characters is far above any human password manager's output.
const password = z.string().min(1).max(200);

export const LoginSchema = z.object({ email, password });
export type LoginInput = z.infer<typeof LoginSchema>;
