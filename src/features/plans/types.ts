import { z } from "zod";

export const PlanSchema = z.object({
  name: z.string(),
  kind: z.string(), // "subscription" | "credits"
  // 0 = free / not purchasable. paise / 100 = ₹.
  price_paise: z.number(),
  // Model ids the plan unlocks. EMPTY = unlocks ALL models (how credits works).
  models: z.array(z.string()),
  window_seconds: z.number(),
  window_tokens: z.number(),
  weekly_seconds: z.number(),
  weekly_tokens: z.number()
});

export type Plan = z.infer<typeof PlanSchema>;

// Public model catalog (/uniun/v1/models) — only `available` models are listed.
export const ModelSchema = z.object({
  id: z.string(),
  display_name: z.string(),
  // Display label for grouping (subscription/api/local) — not sent anywhere.
  backend: z.string()
});

export type Model = z.infer<typeof ModelSchema>;

export const PriceSchema = z.object({
  model: z.string(),
  input_per_mtok: z.number(), // INR per 1M input tokens
  output_per_mtok: z.number() // INR per 1M output tokens
});

export type Price = z.infer<typeof PriceSchema>;
