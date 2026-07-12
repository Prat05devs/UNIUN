"use client";

import { Icon } from "@/components/uniun/DsxChrome";
import { usePlans } from "@/features/plans/hooks";
import { useProfile } from "@/features/profile/hooks";
import { TopupCard } from "./topup-card";

// The dashboard's "pay for things" slot, driven by the account's plan kind:
// only a credits-plan wallet is funded with rupee top-ups — everyone else
// gets the path to the plans they can actually buy.
export function BillingCard() {
  const { profile } = useProfile();
  const { plans } = usePlans();

  const currentPlan = plans.find((p) => p.name === profile?.plan);

  if (currentPlan?.kind === "credits") {
    return <TopupCard />;
  }

  return (
    <div className="feature-card" aria-label="Plans">
      <span className="isq">
        <Icon name="workspace_premium" />
      </span>
      <strong>Unlock more models.</strong>
      <p>
        Plans bundle cloud models like Claude for a flat monthly price — pick
        one, pay with Razorpay, and it activates instantly.
      </p>
      <div style={{ marginTop: 16 }}>
        <a className="btn btn-primary" href="/ai-inference">
          <Icon name="cloud" />
          View plans
        </a>
      </div>
    </div>
  );
}
