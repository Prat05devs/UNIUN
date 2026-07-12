import { z } from "zod";

export const ChallengeSchema = z.object({
  challenge: z.string(),
  expires_in: z.number()
});

export type Challenge = z.infer<typeof ChallengeSchema>;

// key_id/api_key are only present when the gateway minted a key: the first
// login (signup) or recovery after every key was revoked. A returning login
// just authenticates — the client reuses the key it saved at signup.
export const LoginResponseSchema = z.object({
  account_id: z.string(),
  key_id: z.string().optional(),
  api_key: z.string().optional(),
  new_account: z.boolean(),
  // False until the account has a username — the dashboard shows the
  // "complete your profile" step. Optional so an older gateway still logs in.
  has_profile: z.boolean().optional()
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// What we persist client-side. The api_key ("uk_…") is returned exactly once
// by the gateway and is not recoverable — the private key itself is never
// stored anywhere.
export const SessionSchema = z.object({
  accountId: z.string(),
  // Unknown when the session was connected with a pasted key (the key API
  // only exposes prefixes, not which one you hold).
  keyId: z.string().optional(),
  apiKey: z.string(),
  newAccount: z.boolean(),
  // Optional: sessions stored before the profile feature don't have it.
  hasProfile: z.boolean().optional()
});

export type Session = z.infer<typeof SessionSchema>;
