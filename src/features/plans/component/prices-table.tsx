"use client";

import { InlineLoader } from "@/components/molecules/loading";
import { usePrices } from "../hooks";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

export function PricesTable() {
  const { prices, error, isLoading } = usePrices();

  if (isLoading) return <InlineLoader label="Loading prices…" />;
  if (error) {
    return <p role="alert">Could not load prices. Please try again later.</p>;
  }
  if (!prices.length) return <p className="muted">No prices published yet.</p>;

  return (
    <div className="card" style={{ padding: 20, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px 12px" }}>Model</th>
            <th style={{ textAlign: "right", padding: "8px 12px" }}>
              Input / 1M tokens
            </th>
            <th style={{ textAlign: "right", padding: "8px 12px" }}>
              Output / 1M tokens
            </th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price) => (
            <tr key={price.model}>
              <td style={{ padding: "8px 12px" }}>{price.model}</td>
              <td style={{ textAlign: "right", padding: "8px 12px" }}>
                {inr.format(price.input_per_mtok)}
              </td>
              <td style={{ textAlign: "right", padding: "8px 12px" }}>
                {inr.format(price.output_per_mtok)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted" style={{ marginTop: 12, fontSize: ".85rem" }}>
        A request costs prompt tokens × input price + completion tokens ×
        output price, in INR per million tokens.
      </p>
    </div>
  );
}
