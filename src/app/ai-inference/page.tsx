import type { Metadata } from "next";
import { DsxFooter, DsxNav, Icon } from "@/components/uniun/DsxChrome";
import { PlansList } from "@/features/plans/component/plans-list";
import { PricesTable } from "@/features/plans/component/prices-table";

export const metadata: Metadata = {
  title: "AI Inference",
  description:
    "UNIUN cloud inference — run Claude and GPT models through the UNIUN gateway with flat fair-use plans or prepaid credits. The app itself stays free and open source.",
  alternates: {
    canonical: "/ai-inference"
  }
};

export default function AiInferencePage() {
  return (
    <div className="dsx" id="top">
      <DsxNav />

      <main>
        <section className="phead" aria-labelledby="inference-title">
          <div className="wrap">
            <span className="section-label">
              <Icon name="cloud" />
              AI Inference
            </span>
            <h1 id="inference-title">Cloud models, when you want them.</h1>
            <p className="lead" style={{ maxWidth: "56ch" }}>
              UNIUN is free and open source — Shiv runs on your device. When a
              thought needs a bigger model, the UNIUN inference gateway serves
              Claude and GPT in the cloud: pick a flat fair-use plan or prepay
              credits and pay exactly what each request costs.
            </p>

            <PlansList />

            <h2 style={{ marginTop: 48 }}>Model prices</h2>
            <p className="muted" style={{ margin: "8px 0 20px" }}>
              Per one million tokens, for the credits tier.
            </p>
            <PricesTable />
          </div>
        </section>
      </main>

      <DsxFooter />
    </div>
  );
}
