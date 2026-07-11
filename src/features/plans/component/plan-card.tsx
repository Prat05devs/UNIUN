import { Icon } from "@/components/uniun/DsxChrome";
import { Plan } from "../types";

const KIND_LABELS: Record<string, string> = {
  subscription: "Flat plan",
  credits: "Pay per token",
  byok: "Bring your own key"
};

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

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className="feature-card">
      <span className="isq">
        <Icon name={plan.kind === "credits" ? "toll" : "workspace_premium"} />
      </span>
      <strong>{plan.name}</strong>
      <p>{KIND_LABELS[plan.kind] ?? plan.kind}</p>
      <div className="chiprow">
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
    </div>
  );
}
