"use client";

import { useState } from "react";
import { RequestError } from "@/lib/api";
import { useCreateOrder, useVerifyPayment } from "./index";
import { CheckoutStatus, RazorpayPaymentResponse } from "../types";

interface UseRazorpayCheckoutOptions {
  amount: number; // paise
  currency?: string;
  description?: string;
}

// The full checkout state machine: create order → open the Razorpay modal →
// verify the signature server-side. Only { verified: true } counts as success.
export function useRazorpayCheckout({
  amount,
  currency = "INR",
  description = "UNIUN payment"
}: UseRazorpayCheckoutOptions) {
  const [status, setStatus] = useState<CheckoutStatus>({ state: "idle" });
  const { createOrder } = useCreateOrder();
  const { verifyPayment } = useVerifyPayment();

  const handleCheckout = async () => {
    if (!window.Razorpay) {
      setStatus({
        state: "error",
        message: "Payment library is still loading. Please try again."
      });
      return;
    }

    setStatus({ state: "loading" });

    try {
      const order = await createOrder({ amount, currency });

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: order.order_id,
        amount: order.amount,
        currency: order.currency,
        name: "UNIUN",
        description,
        theme: { color: "#111111" },
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            const result = await verifyPayment(response);
            if (!result.verified) {
              throw new Error("Payment could not be verified.");
            }
            setStatus({
              state: "success",
              paymentId: response.razorpay_payment_id,
              credited: result.credited
            });
          } catch (error) {
            setStatus({
              state: "error",
              message:
                error instanceof Error
                  ? error.message
                  : "Payment could not be verified."
            });
          }
        },
        modal: {
          ondismiss: () => {
            setStatus({
              state: "error",
              message: "Payment cancelled. You can try again anytime."
            });
          }
        }
      });

      razorpay.on("payment.failed", (response: unknown) => {
        const failure = response as {
          error?: { description?: string };
        };
        setStatus({
          state: "error",
          message:
            failure.error?.description || "Payment failed. Please try again."
        });
      });

      razorpay.open();
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof RequestError || error instanceof Error
            ? error.message
            : "Something went wrong."
      });
    }
  };

  return { status, handleCheckout };
}
