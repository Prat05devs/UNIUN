import { z } from "zod";

export const ChallengeSchema = z.object({
  challenge: z.string(),
  expires_in: z.number()
});

export type Challenge = z.infer<typeof ChallengeSchema>;

export const LoginResponseSchema = z.object({
  account_id: z.string(),
  key_id: z.string(),
  api_key: z.string(),
  new_account: z.boolean()
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// What we persist client-side. The api_key ("uk_…") is returned exactly once
// by the gateway and is not recoverable — the private key itself is never
// stored anywhere.
export const SessionSchema = z.object({
  accountId: z.string(),
  keyId: z.string(),
  apiKey: z.string(),
  newAccount: z.boolean()
});

export type Session = z.infer<typeof SessionSchema>;
