import { z } from "zod";

export const CreditsSchema = z.object({
  plan: z.string(),
  balance: z.number()
});

export type Credits = z.infer<typeof CreditsSchema>;

// One metered request, as served by GET /uniun/v1/usage
// (gateway internal/usage/usage_api.go).
export const UsageRowSchema = z.object({
  id: z.string(),
  model: z.string(),
  backend: z.string(),
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  cost: z.number(),
  estimated: z.boolean(),
  created_at: z.string()
});

export type UsageRow = z.infer<typeof UsageRowSchema>;
