import { z } from 'zod';

// NIST SP 800-63B: length matters, composition rules ("one capital, one symbol") do not. So: a
// minimum length plus a short block-list of the passwords attackers try first (compared in lower
// case). Not a breach database: it catches the laziest choices.
const COMMON_PASSWORDS = new Set([
  '0123456789',
  '1234567890',
  '12345678910',
  '123456789012',
  '1q2w3e4r5t',
  '1qaz2wsx3edc',
  '1111111111',
  '0000000000',
  'qwertyuiop',
  'qwerty1234',
  'qwerty12345',
  'qwerty123456',
  'asdfghjkl1',
  'password12',
  'password123',
  'password1234',
  'password12345',
  'password123456',
  'passw0rd123',
  'p@ssword123',
  'letmein123',
  'welcome123',
  'welcome1234',
  'iloveyou123',
  'abcdefghij',
  'arabic12345',
]);

export const PASSWORD_MIN_LENGTH = 10;
// argon2 hashes whatever it is given, so an unbounded password is a cheap way to burn CPU and
// memory; far above any passphrase.
export const PASSWORD_MAX_LENGTH = 128;

export const NewPasswordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(PASSWORD_MAX_LENGTH, `Use at most ${PASSWORD_MAX_LENGTH} characters`)
  .refine((p) => !COMMON_PASSWORDS.has(p.toLowerCase()), 'This password is too common');

// Trimmed and lower-cased on the way in (the column is case-insensitive as well). Mirrors what the
// auth rate limiter does to its key.
export const EmailSchema = z.string().trim().toLowerCase().pipe(z.email().max(254));

// Login deliberately has no strength rules: it must accept whatever password already exists.
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1).max(PASSWORD_MAX_LENGTH),
});
export type LoginInput = z.input<typeof LoginSchema>;

// An invite code is 16 random bytes in base64url: 22 characters. The bounds are loose on purpose,
// the database lookup decides; they only stop absurd input.
export const InviteCodeSchema = z
  .string()
  .min(10)
  .max(64)
  .regex(/^[A-Za-z0-9_-]+$/);

export const RegisterSchema = z.object({
  code: InviteCodeSchema,
  email: EmailSchema,
  password: NewPasswordSchema,
  displayName: z.string().trim().min(1).max(60),
});
export type RegisterInput = z.input<typeof RegisterSchema>;

// Changing a password needs the current one (a stolen session alone must not be enough).
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(PASSWORD_MAX_LENGTH),
  newPassword: NewPasswordSchema,
});
export type ChangePasswordInput = z.input<typeof ChangePasswordSchema>;

// A reset token is 32 random bytes in base64url (43 characters); the bounds are loose, the database
// lookup decides.
export const ResetTokenSchema = z
  .string()
  .min(20)
  .max(64)
  .regex(/^[A-Za-z0-9_-]+$/);

// `POST /auth/reset`: the link's token plus the new password, which follows the sign-up rule.
export const ResetPasswordSchema = z.object({
  token: ResetTokenSchema,
  password: NewPasswordSchema,
});
export type ResetPasswordInput = z.input<typeof ResetPasswordSchema>;

// `valid` is false for an unknown, used-up or expired code. The teacher's name is only given for a
// valid code, so the endpoint does not reveal who teaches here to someone guessing.
export const InviteInfoSchema = z.object({
  valid: z.boolean(),
  teacherName: z.string().nullable(),
});
export type InviteInfo = z.infer<typeof InviteInfoSchema>;
