"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PageLoader } from "@/components/molecules/loading";
import { Icon } from "@/components/uniun/DsxChrome";
import { useAuth, useRequireAuth } from "@/features/auth/hooks/useAuth";
import { TopupCard } from "@/features/payments/component/topup-card";
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

  if (isLoading || !session) {
    return <PageLoader label="Loading your dashboard…" />;
  }

  return (
    <>
      <Suspense fallback={null}>
        <WelcomeBanner />
      </Suspense>

      <div className="cols-2">
        <CreditsSummary />
        <TopupCard />
      </div>

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
