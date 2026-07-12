"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PageLoader } from "@/components/molecules/loading";
import { Icon } from "@/components/uniun/DsxChrome";
import { useAdminStats } from "@/features/admin/hooks";
import { useAuth, useRequireAuth } from "@/features/auth/hooks/useAuth";
import { KeysCard } from "@/features/keys/component/keys-card";
import { BillingCard } from "@/features/payments/component/billing-card";
import { ProfileSection } from "@/features/profile/component/profile-section";
import { CreditsSummary } from "@/features/usage/component/credits-summary";
import { UsageTable } from "@/features/usage/component/usage-table";

function WelcomeBanner() {
  const searchParams = useSearchParams();
  const { session } = useAuth();

  if (searchParams.get("welcome") !== "1" && !session?.newAccount) {
    return null;
  }

  return (
    <div className="card" role="status" style={{ padding: 20, marginBottom: 24 }}>
      <strong>Welcome to UNIUN!</strong>
      <p className="muted" style={{ marginTop: 6 }}>
        Your account was created on this first login. Keep your private key
        safe — it is the only way back in.
      </p>
    </div>
  );
}

export function DashboardView() {
  const { session, isLoading } = useRequireAuth();
  const { logout } = useAuth();
  // Silently probes the admin API; regular users just get a 403 and never
  // see the console link.
  const { isAdmin } = useAdminStats();

  if (isLoading || !session) {
    return <PageLoader label="Loading your dashboard…" />;
  }

  return (
    <>
      <Suspense fallback={null}>
        <WelcomeBanner />
      </Suspense>

      <ProfileSection />

      {isAdmin && (
        <div
          className="card"
          style={{ padding: 20, marginBottom: 24 }}
          aria-label="Admin"
        >
          <div className="chiprow" style={{ marginTop: 0, alignItems: "center" }}>
            <span className="chip chip-tonal">admin</span>
            <span className="muted">
              This is your personal dashboard — the operator console lives
              separately.
            </span>
            <a className="btn btn-primary btn-sm" href="/ops-7x4kq9">
              <Icon name="admin_panel_settings" />
              Open admin console
            </a>
          </div>
        </div>
      )}

      <div className="cols-2">
        <CreditsSummary />
        <BillingCard />
      </div>

      <h2 style={{ marginTop: 48 }}>API keys</h2>
      <p className="muted" style={{ margin: "8px 0 20px" }}>
        Use a key as the Bearer token in the UNIUN app or the API. Create one
        per device so you can revoke them independently.
      </p>
      <KeysCard />

      <h2 style={{ marginTop: 48 }}>Recent usage</h2>
      <p className="muted" style={{ margin: "8px 0 20px" }}>
        Every metered request, with its exact token cost.
      </p>
      <UsageTable />

      <div className="chiprow" style={{ marginTop: 32 }}>
        <button className="btn btn-secondary" type="button" onClick={logout}>
          <Icon name="logout" />
          Log out
        </button>
      </div>
    </>
  );
}
