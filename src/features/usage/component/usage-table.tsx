"use client";

import { useState } from "react";
import { InlineLoader } from "@/components/molecules/loading";
import { useUsage } from "../hooks";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 4
});

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export function UsageTable() {
  const [page, setPage] = useState(1);
  const { rows, pagination, error, isLoading } = useUsage(page);

  if (isLoading) return <InlineLoader label="Loading usage…" />;
  if (error) {
    return <p role="alert">Could not load usage. Please try again later.</p>;
  }
  if (!rows.length && page === 1) {
    return (
      <p className="muted">
        No requests yet — usage shows up here once you start using the API.
      </p>
    );
  }

  const totalPages = pagination?.total_pages ?? 1;

  return (
    <div className="card" style={{ padding: 20, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px 12px" }}>When</th>
            <th style={{ textAlign: "left", padding: "8px 12px" }}>Model</th>
            <th style={{ textAlign: "right", padding: "8px 12px" }}>Tokens in</th>
            <th style={{ textAlign: "right", padding: "8px 12px" }}>Tokens out</th>
            <th style={{ textAlign: "right", padding: "8px 12px" }}>Cost</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={{ padding: "8px 12px" }}>{formatDate(row.created_at)}</td>
              <td style={{ padding: "8px 12px" }}>{row.model}</td>
              <td style={{ textAlign: "right", padding: "8px 12px" }}>
                {row.prompt_tokens}
              </td>
              <td style={{ textAlign: "right", padding: "8px 12px" }}>
                {row.completion_tokens}
              </td>
              <td style={{ textAlign: "right", padding: "8px 12px" }}>
                {inr.format(row.cost)}
                {row.estimated ? " (est.)" : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="chiprow" style={{ marginTop: 16 }}>
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span className="muted">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
