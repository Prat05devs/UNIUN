"use client";

import { InlineLoader } from "@/components/molecules/loading";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfile } from "@/features/profile/hooks";
import { useModels, usePlans } from "../hooks";
import { PlanCard } from "./plan-card";

export function PlansList() {
  const { plans, error, isLoading } = usePlans();
  const { models } = useModels();
  const { session } = useAuth();
  // Only fetched when logged in — used to badge the user's current plan.
  const { profile } = useProfile();

  if (isLoading) return <InlineLoader label="Loading plans…" />;
  if (error) {
    return <p role="alert">Could not load plans. Please try again later.</p>;
  }
  if (!plans.length) return <p className="muted">No plans available yet.</p>;

  return (
    <div className="cols-3">
      {plans.map((plan) => (
        <PlanCard
          key={plan.name}
          plan={plan}
          models={models}
          isCurrent={profile?.plan === plan.name}
          isLoggedIn={!!session}
        />
      ))}
    </div>
  );
}
