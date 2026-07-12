"use client";

import { useState } from "react";
import { InlineLoader } from "@/components/molecules/loading";
import { usePlans } from "@/features/plans/hooks";
import {
  useAdjustCredits,
  useAdminAccounts,
  useUpdateAccount
} from "../hooks";
import { AdminAccount } from "../types";

const num = new Intl.NumberFormat("en-IN");

const cell: React.CSSProperties = { padding: "8px 12px" };
const cellRight: React.CSSProperties = { ...cell, textAlign: "right" };

function AccountRow({ account }: { account: AdminAccount }) {
  const { plans } = usePlans();
  const { updateAccount, isUpdating } = useUpdateAccount();
  const { adjustCredits, isAdjusting } = useAdjustCredits();
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<unknown>) => {
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    }
  };

  const handleGrant = () => {
    const raw = window.prompt(
      `Grant credits to ${account.pubkey.slice(0, 12)}… (current balance ${account.balance})`,
      "100"
    );
    if (raw === null) return;
    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount < 0) {
      setError("Amount must be a non-negative number.");
      return;
    }
    const reason = window.prompt("Reason (written to the audit ledger)", "manual grant") ?? "";
    void run(() => adjustCredits({ id: account.id, op: "grant", amount, reason }));
  };

  return (
    <>
      <tr>
        <td style={cell}>
          <code title={account.pubkey}>{account.pubkey.slice(0, 12)}…</code>
        </td>
        <td style={cell}>
          {account.username || account.email ? (
            <>
              {account.username && <strong>@{account.username}</strong>}
              {account.email && (
                <div className="muted" style={{ fontSize: "0.85em" }}>
                  {account.email}
                </div>
              )}
            </>
          ) : (
            <span className="muted">—</span>
          )}
        </td>
        <td style={cell}>
          <select
            value={account.plan}
            disabled={isUpdating || !plans.length}
            onChange={(e) =>
              void run(() =>
                updateAccount({ id: account.id, plan: e.target.value })
              )
            }
          >
            {(plans.length ? plans : [{ name: account.plan }]).map((plan) => (
              <option key={plan.name} value={plan.name}>
                {plan.name}
              </option>
            ))}
          </select>
        </td>
        <td style={cell}>
          <span className={account.role === "admin" ? "chip chip-tonal" : "chip"}>
            {account.role}
          </span>
        </td>
        <td style={cellRight}>{num.format(account.balance)}</td>
        <td style={cellRight}>{num.format(account.tokens_30d)}</td>
        <td style={cellRight}>{account.keys_active}</td>
        <td style={cell}>
          <div className="chiprow" style={{ marginTop: 0 }}>
            <button
              className="btn btn-secondary btn-sm"
              type="button"
              disabled={isAdjusting}
              onClick={handleGrant}
            >
              Grant credits
            </button>
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              disabled={isUpdating}
              onClick={() =>
                void run(() =>
                  updateAccount({
                    id: account.id,
                    role: account.role === "admin" ? "user" : "admin"
                  })
                )
              }
            >
              {account.role === "admin" ? "Demote" : "Make admin"}
            </button>
          </div>
        </td>
      </tr>
      {error && (
        <tr>
          <td colSpan={8} style={cell}>
            <p role="alert" style={{ margin: 0 }}>
              {error}
            </p>
          </td>
        </tr>
      )}
    </>
  );
}

export function AccountsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const { accounts, pagination, error, isLoading } = useAdminAccounts(page, q);

  const totalPages = pagination?.total_pages ?? 1;

  return (
    <div className="card" style={{ padding: 20, overflowX: "auto" }}>
      <form
        className="chiprow"
        style={{ marginTop: 0, marginBottom: 16 }}
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setQ(search.trim());
        }}
      >
        <label className="field" style={{ marginBottom: 0, flex: 1 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by pubkey prefix…"
            spellCheck={false}
          />
        </label>
        <button className="btn btn-secondary btn-sm" type="submit">
          Search
        </button>
      </form>

      {isLoading && <InlineLoader label="Loading accounts…" />}
      {!!error && <p role="alert">Could not load accounts.</p>}

      {!isLoading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...cell, textAlign: "left" }}>Pubkey</th>
              <th style={{ ...cell, textAlign: "left" }}>User</th>
              <th style={{ ...cell, textAlign: "left" }}>Plan</th>
              <th style={{ ...cell, textAlign: "left" }}>Role</th>
              <th style={cellRight}>Balance</th>
              <th style={cellRight}>Tokens 30d</th>
              <th style={cellRight}>Keys</th>
              <th style={{ ...cell, textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <AccountRow key={account.id} account={account} />
            ))}
          </tbody>
        </table>
      )}

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
