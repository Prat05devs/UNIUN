"use client";

import { InlineLoader } from "@/components/molecules/loading";
import { Icon } from "@/components/uniun/DsxChrome";
import { RequestError } from "@/lib/api";
import { useCredits } from "../hooks";

const inr = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2
});

export function CreditsSummary() {
  const { credits, error, isLoading } = useCredits();

  if (isLoading) return <InlineLoader label="Loading your plan…" />;
  if (error) {
    const expired =
      error instanceof RequestError &&
      (error.type === "unauthorized" || error.type === "invalid_api_key");
    return (
      <p role="alert">
        {expired ? (
          <>
            Your session is no longer valid — <a href="/login">log in again</a>
            .
          </>
        ) : (
          "Could not load your plan. Please try again later."
        )}
      </p>
    );
  }
  if (!credits) return null;

  return (
    <div className="feature-card" aria-label="Plan and balance">
      <span className="isq">
        <Icon name="account_balance_wallet" />
      </span>
      <strong>Your plan</strong>
      <div className="chiprow">
        <span className="chip chip-tonal">{credits.plan}</span>
        <span className="chip">{inr.format(credits.balance)} credits</span>
      </div>
      <p className="muted" style={{ marginTop: 8, fontSize: ".85rem" }}>
        1 credit = ₹1. Credits are debited at the exact per-token price of each
        request.
      </p>
    </div>
  );
}
