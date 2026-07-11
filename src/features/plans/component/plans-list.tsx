"use client";

import { InlineLoader } from "@/components/molecules/loading";
import { usePlans } from "../hooks";
import { PlanCard } from "./plan-card";

export function PlansList() {
  const { plans, error, isLoading } = usePlans();

  if (isLoading) return <InlineLoader label="Loading plans…" />;
  if (error) {
    return <p role="alert">Could not load plans. Please try again later.</p>;
  }
  if (!plans.length) return <p className="muted">No plans available yet.</p>;

  return (
    <div className="cols-3">
      {plans.map((plan) => (
        <PlanCard key={plan.name} plan={plan} />
      ))}
    </div>
  );
}
