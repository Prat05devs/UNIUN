import { z } from "zod";

// A key row from GET /uniun/v1/keys. Only the prefix survives — the gateway
// stores a hash, so the full secret is shown exactly once, at mint time.
export const ApiKeySchema = z.object({
  id: z.string(),
  prefix: z.string(),
  name: z.string(),
  revoked: z.boolean(),
  created_at: z.string()
});

export type ApiKey = z.infer<typeof ApiKeySchema>;

export const MintedKeySchema = z.object({
  key_id: z.string(),
  api_key: z.string()
});

export type MintedKey = z.infer<typeof MintedKeySchema>;
