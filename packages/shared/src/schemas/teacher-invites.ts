import { z } from 'zod';

export const InviteSchema = z.object({
  id: z.string(),
  note: z.string(),
  maxUses: z.number().int().positive(),
  usedCount: z.number().int().nonnegative(),
  expiresAt: z.string(),
  createdAt: z.string(),
  // Derived on the server so the web and the API agree on what "usable" means.
  status: z.enum(['active', 'expired', 'used_up']),
});
export type Invite = z.infer<typeof InviteSchema>;

// `GET /teacher/invites`: newest first. The codes are not stored, so they cannot be listed.
// `invitesOpen` mirrors the server's INVITES_ENABLED: false means sign-up with a code is closed
// (the free-tier deployment), so a code the teacher creates cannot be used yet.
export const InviteListResponseSchema = z.object({
  invites: z.array(InviteSchema),
  invitesOpen: z.boolean(),
});
export type InviteListResponse = z.infer<typeof InviteListResponseSchema>;

// `POST /teacher/invites`
export const CreateInviteRequestSchema = z.strictObject({
  note: z.string().trim().max(100).default(''),
  maxUses: z.number().int().min(1).max(100).default(1),
  expiresInDays: z.number().int().min(1).max(90).default(7),
});
export type CreateInviteRequest = z.input<typeof CreateInviteRequestSchema>;

// The plain code is returned once, here, and never again.
export const CreateInviteResponseSchema = z.object({
  invite: InviteSchema,
  code: z.string(),
  // Path on the web app, e.g. `/register?code=…`; the web adds its own origin.
  invitePath: z.string(),
});
export type CreateInviteResponse = z.infer<typeof CreateInviteResponseSchema>;
