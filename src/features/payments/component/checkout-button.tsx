"use client";

import Script from "next/script";
import { useRazorpayCheckout } from "../hooks/useRazorpayCheckout";

const CHECKOUT_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

interface CheckoutButtonProps {
  // One of the two: a credit top-up passes `amount` (paise); a subscription
  // purchase passes `plan` (the server decides the price).
  amount?: number; // paise
  plan?: string;
  currency?: string;
  label?: string;
  description?: string;
}

export function CheckoutButton({
  amount,
  plan,
  currency = "INR",
  label = "Pay now",
  description = "UNIUN payment"
}: CheckoutButtonProps) {
  const { status, handleCheckout } = useRazorpayCheckout({
    amount,
    plan,
    currency,
    description
  });

  return (
    <div>
      <Script src={CHECKOUT_SCRIPT_URL} strategy="lazyOnload" />

      <button
        className="btn btn-primary"
        type="button"
        onClick={() => void handleCheckout()}
        disabled={status.state === "loading"}
      >
        {status.state === "loading" ? "Processing…" : label}
      </button>

      {status.state === "success" && (
        <p role="status" style={{ marginTop: 12 }}>
          Payment successful. Reference: {status.paymentId}
          {status.credited != null && (
            <> — {status.credited} credits added to your wallet.</>
          )}
          {status.plan && <> — you are now on the {status.plan} plan.</>}
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
