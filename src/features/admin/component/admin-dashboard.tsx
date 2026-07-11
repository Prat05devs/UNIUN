"use client";

import { PageLoader } from "@/components/molecules/loading";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAdminStats } from "../hooks";
import { AccountsTable } from "./accounts-table";
import { PricesEditor } from "./prices-editor";
import { StatsCards } from "./stats-cards";

// Rendered when the visitor is not a verified admin. Deliberately looks like a
// plain missing page so the route stays unremarkable to anyone who stumbles on
// it — no login prompt, no mention of admin.
function NotFound() {
  return (
    <div className="wrap" style={{ padding: "18vh 0", textAlign: "center" }}>
      <h1>404</h1>
      <p className="muted">This page could not be found.</p>
    </div>
  );
}

export function AdminDashboard() {
  const { session, isLoading: authLoading } = useAuth();
  const { stats, isAdmin, denied, isLoading, error } = useAdminStats();

  if (authLoading || (session && isLoading)) {
    return <PageLoader label="Loading…" />;
  }

  // No session, non-admin key, or any auth failure → pretend it doesn't exist.
  if (!session || denied || (!isAdmin && !error)) {
    return <NotFound />;
  }

  if (!isAdmin) {
    return <p role="alert">Could not load the dashboard. Try again later.</p>;
  }

  return (
    <>
      <StatsCards stats={stats!} />

      <h2 style={{ marginTop: 48 }}>Accounts</h2>
      <p className="muted" style={{ margin: "8px 0 20px" }}>
        Change plans, promote or demote admins, and grant credits — every
        mutation is written to the audit ledger.
      </p>
      <AccountsTable />

      <h2 style={{ marginTop: 48 }}>Model prices</h2>
      <p className="muted" style={{ margin: "8px 0 20px" }}>
        Per-model price for the credits tier, per 1M tokens. Edits are live —
        no restart.
      </p>
      <PricesEditor />
    </>
  );
}
