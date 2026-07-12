import { z } from "zod";

// GET/PUT /uniun/v1/profile — enveloped. username/email stay null until the
// user completes the optional profile step (the keypair is the identity).
export const ProfileSchema = z.object({
  account_id: z.string(),
  pubkey: z.string(),
  username: z.string().nullable(),
  email: z.string().nullable(),
  plan: z.string(),
  role: z.string(),
  created_at: z.string()
});

export type Profile = z.infer<typeof ProfileSchema>;
