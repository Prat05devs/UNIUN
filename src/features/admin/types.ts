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
  username: z.string().nullable(),
  email: z.string().nullable(),
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

// Full plan row from /admin/plans — public /plans hides pool_window_tokens.
export const AdminPlanSchema = z.object({
  name: z.string(),
  kind: z.string(), // subscription | credits
  price_paise: z.number(), // 0 = free / not purchasable
  models: z.array(z.string()), // empty = unlocks ALL models
  window_seconds: z.number(),
  window_tokens: z.number(),
  weekly_seconds: z.number(),
  weekly_tokens: z.number(),
  pool_window_tokens: z.number()
});

export type AdminPlan = z.infer<typeof AdminPlanSchema>;

export const AdminModelSchema = z.object({
  id: z.string(),
  display_name: z.string(),
  category: z.string(), // free | paid
  available: z.boolean() // false hides it from the public /models list
});

export type AdminModel = z.infer<typeof AdminModelSchema>;

export const CreditAdjustResultSchema = z.object({
  balance: z.number(),
  transaction_id: z.string()
});

export type CreditAdjustResult = z.infer<typeof CreditAdjustResultSchema>;

export type CreditOp = "grant" | "deduct" | "set";
