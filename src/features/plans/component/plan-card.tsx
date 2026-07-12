"use client";

import { Icon } from "@/components/uniun/DsxChrome";
import { CheckoutButton } from "@/features/payments/component/checkout-button";
import { TopupControls } from "@/features/payments/component/topup-card";
import { Model, Plan } from "../types";

const KIND_LABELS: Record<string, string> = {
  subscription: "Flat plan",
  credits: "Pay per token"
};

const inr = new Intl.NumberFormat("en-IN");

function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) return `${tokens / 1_000_000}M`;
  if (tokens >= 1_000) return `${tokens / 1_000}k`;
  return String(tokens);
}

function formatWindow(seconds: number): string {
  if (seconds % 86400 === 0) return `${seconds / 86400}d`;
  if (seconds % 3600 === 0) return `${seconds / 3600}h`;
  return `${Math.round(seconds / 60)}m`;
}

interface PlanCardProps {
  plan: Plan;
  models: Model[]; // public catalog, for id → display_name
  isCurrent?: boolean;
  isLoggedIn?: boolean;
}

export function PlanCard({ plan, models, isCurrent, isLoggedIn }: PlanCardProps) {
  const byId = new Map(models.map((m) => [m.id, m]));
  // Empty models list = the plan unlocks ALL models (how credits works).
  const unlocked = plan.models.length
    ? plan.models.map((id) => byId.get(id)?.display_name ?? id)
    : [];
  const buyable = plan.price_paise > 0 && !isCurrent;

  return (
    <div className="feature-card">
      <span className="isq">
        <Icon name={plan.kind === "credits" ? "toll" : "workspace_premium"} />
      </span>
      <strong>
        {plan.name}
        {isCurrent && (
          <span className="chip chip-tonal" style={{ marginLeft: 8 }}>
            your plan
          </span>
        )}
      </strong>
      <p>
        {KIND_LABELS[plan.kind] ?? plan.kind}
        {plan.price_paise > 0 && (
          <> — ₹{inr.format(plan.price_paise / 100)}</>
        )}
      </p>
      <div className="chiprow">
        {unlocked.length > 0
          ? unlocked.map((name) => (
              <span key={name} className="chip">
                {name}
              </span>
            ))
          : plan.kind !== "subscription" && (
              <span className="chip">All models</span>
            )}
        {plan.window_tokens > 0 && (
          <span className="chip">
            {formatTokens(plan.window_tokens)} tokens /{" "}
            {formatWindow(plan.window_seconds)}
          </span>
        )}
        {plan.weekly_tokens > 0 && (
          <span className="chip">
            {formatTokens(plan.weekly_tokens)} tokens / week
          </span>
        )}
        {plan.kind === "credits" && (
          <span className="chip chip-tonal">1 credit = ₹1</span>
        )}
      </div>

      {buyable && (
        <div style={{ marginTop: 16 }}>
          {isLoggedIn ? (
            <CheckoutButton
              plan={plan.name}
              label={`Get ${plan.name} — ₹${inr.format(plan.price_paise / 100)}`}
              description={`UNIUN ${plan.name} plan`}
            />
          ) : (
            <a className="btn btn-primary" href="/login">
              Log in to subscribe
            </a>
          )}
        </div>
      )}

      {/* Credits aren't a purchase — the wallet is topped up in place once
          the account is on the credits plan. */}
      {plan.kind === "credits" && isCurrent && (
        <div style={{ marginTop: 16 }}>
          <TopupControls />
        </div>
      )}
    </div>
  );
}
