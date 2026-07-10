"use client";

import Script from "next/script";
import { useState } from "react";

const CHECKOUT_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
const PAYMENTS_API_BASE = process.env.NEXT_PUBLIC_PAYMENTS_API_BASE;

type CheckoutStatus =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; paymentId: string }
  | { state: "error"; message: string };

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

interface RazorpayCheckoutButtonProps {
  amount: number;
  currency?: string;
  label?: string;
  description?: string;
}

export function RazorpayCheckoutButton({
  amount,
  currency = "INR",
  label = "Pay now",
  description = "UNIUN payment"
}: RazorpayCheckoutButtonProps) {
  const [status, setStatus] = useState<CheckoutStatus>({ state: "idle" });

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
      const orderResponse = await fetch(`${PAYMENTS_API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency })
      });

      if (!orderResponse.ok) {
        const { error } = await orderResponse.json().catch(() => ({ error: null }));
        const message = typeof error === "string" ? error : error?.message;
        throw new Error(message || "Could not create the payment order.");
      }

      const order = await orderResponse.json();

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
            const verifyResponse = await fetch(`${PAYMENTS_API_BASE}/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response)
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment could not be verified.");
            }

            setStatus({
              state: "success",
              paymentId: response.razorpay_payment_id
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
          message: failure.error?.description || "Payment failed. Please try again."
        });
      });

      razorpay.open();
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error ? error.message : "Something went wrong."
      });
    }
  };

  return (
    <div>
      <Script src={CHECKOUT_SCRIPT_URL} strategy="lazyOnload" />

      <button
        className="btn btn-primary"
        type="button"
        onClick={handleCheckout}
        disabled={status.state === "loading"}
      >
        {status.state === "loading" ? "Processing…" : label}
      </button>

      {status.state === "success" && (
        <p role="status" style={{ marginTop: 12 }}>
          Payment successful. Reference: {status.paymentId}
        </p>
      )}

      {status.state === "error" && (
        <p role="alert" style={{ marginTop: 12 }}>
          {status.message}
        </p>
      )}
    </div>
  );
}
