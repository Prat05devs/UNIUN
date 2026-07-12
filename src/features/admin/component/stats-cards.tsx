"use client";

import { Icon } from "@/components/uniun/DsxChrome";
import { AdminStats } from "../types";

const num = new Intl.NumberFormat("en-IN");

export function StatsCards({ stats }: { stats: AdminStats }) {
  const cards = [
    {
      icon: "group",
      title: "Accounts",
      value: num.format(stats.accounts.total),
      note: `${stats.accounts.admins} admin${stats.accounts.admins === 1 ? "" : "s"}`
    },
    {
      icon: "key",
      title: "Active keys",
      value: num.format(stats.keys.active),
      note: "across all accounts"
    },
    {
      icon: "bolt",
      title: "Requests (24h)",
      value: num.format(stats.usage["24h"].requests),
      note: `${num.format(stats.usage["7d"].requests)} in 7d · ${num.format(stats.usage["30d"].requests)} in 30d`
    },
    {
      icon: "token",
      title: "Tokens (30d)",
      value: num.format(
        stats.usage["30d"].prompt_tokens + stats.usage["30d"].completion_tokens
      ),
      note: `cost ${stats.usage["30d"].cost.toFixed(4)}`
    }
  ];

  if (stats.pool) {
    cards.push({
      icon: "water_drop",
      title: "Pool utilization",
      value: `${Math.round(stats.pool.utilization * 100)}%`,
      note: `${num.format(stats.pool.window_tokens_used)} / ${num.format(stats.pool.cap)} tokens`
    });
  }

  return (
    <div className="cols-4">
      {cards.map((card) => (
        <div key={card.title} className="feature-card">
          <span className="isq">
            <Icon name={card.icon} />
          </span>
          <strong>{card.value}</strong>
          <p>
            {card.title}
            <br />
            <span className="muted" style={{ fontSize: ".8rem" }}>
              {card.note}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
