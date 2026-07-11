import { z } from "zod";

// The payments routes are NOT wrapped in the /uniun/v1 envelope — flat JSON.
export const OrderSchema = z.object({
  order_id: z.string(),
  amount: z.number(), // paise
  currency: z.string()
});

export type Order = z.infer<typeof OrderSchema>;

export const VerifySchema = z.object({
  verified: z.boolean(),
  // present when the order was tied to a logged-in account: credits added
  // to the wallet (1 credit = ₹1)
  credited: z.number().optional()
});

export type VerifyResult = z.infer<typeof VerifySchema>;

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export type CheckoutStatus =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; paymentId: string; credited?: number }
  | { state: "error"; message: string };

export interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}
