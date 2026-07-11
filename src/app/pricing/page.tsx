import type { Metadata } from "next";
import { DsxFooter, DsxNav, Icon } from "@/components/uniun/DsxChrome";
import { PlansList } from "@/features/plans/component/plans-list";
import { PricesTable } from "@/features/plans/component/prices-table";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "UNIUN plans and per-token model prices — flat fair-use plans or prepaid credits.",
  alternates: {
    canonical: "/pricing"
  }
};

export default function PricingPage() {
  return (
    <div className="dsx" id="top">
      <DsxNav />

      <main>
        <section className="phead" aria-labelledby="pricing-title">
          <div className="wrap">
            <span className="section-label">
              <Icon name="sell" />
              Plans &amp; pricing
            </span>
            <h1 id="pricing-title">Simple plans, transparent prices.</h1>
            <p className="lead" style={{ maxWidth: "52ch" }}>
              Pick a flat plan with fair-use limits, or prepay credits and pay
              exactly what each request costs.
            </p>

            <PlansList />

            <h2 style={{ marginTop: 48 }}>Model prices</h2>
            <p className="muted" style={{ margin: "8px 0 20px" }}>
              INR per one million tokens.
            </p>
            <PricesTable />
          </div>
        </section>
      </main>

      <DsxFooter />
    </div>
  );
}
