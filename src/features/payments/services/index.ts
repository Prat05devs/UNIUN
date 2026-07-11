import { apiClient } from "@/lib/api";
import {
  Order,
  OrderSchema,
  RazorpayPaymentResponse,
  VerifyResult,
  VerifySchema
} from "../types";

// Bearer is auto-attached when a session exists (the default) — that ties the
// order to the account so a verified payment credits the wallet (1 credit = ₹1).
// Anonymous visitors pay the same way, just without crediting.
export async function createOrder(
  amount: number,
  currency = "INR"
): Promise<Order> {
  const res = await apiClient.postRaw<unknown>("/uniun/v1/payments/orders", {
    amount,
    currency
  });
  return OrderSchema.parse(res);
}

// Per the gateway contract only the create-order call carries the key.
export async function verifyPayment(
  payload: RazorpayPaymentResponse
): Promise<VerifyResult> {
  const res = await apiClient.postRaw<unknown>(
    "/uniun/v1/payments/verify",
    payload,
    { auth: false }
  );
  return VerifySchema.parse(res);
}
