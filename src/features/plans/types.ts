import { z } from "zod";

export const PlanSchema = z.object({
  name: z.string(),
  kind: z.string(), // "subscription" | "credits" | "byok"
  window_seconds: z.number(),
  window_tokens: z.number(),
  weekly_seconds: z.number(),
  weekly_tokens: z.number()
});

export type Plan = z.infer<typeof PlanSchema>;

export const PriceSchema = z.object({
  model: z.string(),
  input_per_mtok: z.number(), // INR per 1M input tokens
  output_per_mtok: z.number() // INR per 1M output tokens
});

export type Price = z.infer<typeof PriceSchema>;
