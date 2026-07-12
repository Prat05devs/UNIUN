"use client";

import { PageLoader } from "@/components/molecules/loading";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAdminStats } from "../hooks";
import { AccountsTable } from "./accounts-table";
import { ModelsEditor } from "./models-editor";
import { PlansEditor } from "./plans-editor";
import { PricesEditor } from "./prices-editor";
import { ProvidersEditor } from "./providers-editor";
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

      <h2 style={{ marginTop: 48 }}>Plans</h2>
      <p className="muted" style={{ margin: "8px 0 20px" }}>
        Each plan carries a price and the set of models it unlocks — no models
        checked means the plan unlocks everything (how credits works). Edits are
        live and reflected on the public AI Inference page.
      </p>
      <PlansEditor />

      <h2 style={{ marginTop: 48 }}>Model catalog</h2>
      <p className="muted" style={{ margin: "8px 0 20px" }}>
        The models plans can unlock. Use “Discover Claude models” to pick real
        ids from the sidecar instead of typing them; hide a model to pull it
        from the public list without deleting it.
      </p>
      <ModelsEditor />

      <h2 style={{ marginTop: 48 }}>Model prices</h2>
      <p className="muted" style={{ margin: "8px 0 20px" }}>
        Per-model price for the credits tier, per 1M tokens. Edits are live —
        no restart.
      </p>
      <PricesEditor />

      <h2 style={{ marginTop: 48 }}>Provider credentials</h2>
      <p className="muted" style={{ margin: "8px 0 20px" }}>
        Backend API keys and base URLs, stored in the database. Applied on the
        next gateway restart.
      </p>
      <ProvidersEditor />
    </>
  );
}
