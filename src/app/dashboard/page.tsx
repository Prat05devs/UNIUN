import type { Metadata } from "next";
import { DsxFooter, DsxNav, Icon } from "@/components/uniun/DsxChrome";
import { DashboardView } from "./components/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your UNIUN plan, credits, and usage.",
  alternates: {
    canonical: "/dashboard"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function DashboardPage() {
  return (
    <div className="dsx" id="top">
      <DsxNav />

      <main>
        <section className="phead" aria-labelledby="dashboard-title">
          <div className="wrap">
            <span className="section-label">
              <Icon name="space_dashboard" />
              Your account
            </span>
            <h1 id="dashboard-title">Dashboard.</h1>
            <p className="lead" style={{ maxWidth: "48ch" }}>
              Your plan, credit balance, and recent usage — all in one place.
            </p>

            <div style={{ marginTop: 32 }}>
              <DashboardView />
            </div>
          </div>
        </section>
      </main>

      <DsxFooter />
    </div>
  );
}
