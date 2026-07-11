import { z } from "zod";

// Shapes per uniun-inference docs/ADMIN.md.

const UsageBucketSchema = z.object({
  requests: z.number(),
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  cost: z.number()
});

export const AdminStatsSchema = z.object({
  accounts: z.object({ total: z.number(), admins: z.number() }),
  keys: z.object({ active: z.number() }),
  usage: z.object({
    "24h": UsageBucketSchema,
    "7d": UsageBucketSchema,
    "30d": UsageBucketSchema
  }),
  pool: z
    .object({
      window_tokens_used: z.number(),
      window_seconds: z.number(),
      cap: z.number(),
      utilization: z.number()
    })
    .optional()
});

export type AdminStats = z.infer<typeof AdminStatsSchema>;

export const AdminAccountSchema = z.object({
  id: z.string(),
  pubkey: z.string(),
  plan: z.string(),
  role: z.enum(["user", "admin"]),
  balance: z.number(),
  tokens_30d: z.number(),
  cost_30d: z.number(),
  keys_active: z.number(),
  created_at: z.string()
});

export type AdminAccount = z.infer<typeof AdminAccountSchema>;

export const AdminPriceSchema = z.object({
  model: z.string(),
  input_per_mtok: z.number(),
  output_per_mtok: z.number()
});

export type AdminPrice = z.infer<typeof AdminPriceSchema>;

export const CreditAdjustResultSchema = z.object({
  balance: z.number(),
  transaction_id: z.string()
});

export type CreditAdjustResult = z.infer<typeof CreditAdjustResultSchema>;

export type CreditOp = "grant" | "deduct" | "set";
