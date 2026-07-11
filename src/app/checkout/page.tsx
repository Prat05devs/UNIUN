import type { Metadata } from "next";
import { DsxFooter, DsxNav, Icon } from "@/components/uniun/DsxChrome";
import { CheckoutButton } from "@/features/payments/component/checkout-button";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your UNIUN payment securely with Razorpay.",
  alternates: {
    canonical: "/checkout"
  }
};

export default function CheckoutPage() {
  return (
    <div className="dsx" id="top">
      <DsxNav />

      <main>
        <section className="phead" aria-labelledby="checkout-title">
          <div className="wrap hero-split">
            <div>
              <span className="section-label">
                <Icon name="credit_card" />
                Secure checkout
              </span>
              <h1 id="checkout-title">Complete your payment.</h1>
              <p className="lead" style={{ maxWidth: "48ch" }}>
                Payments are processed securely by Razorpay. Your card details
                never touch our servers.
              </p>

              <div className="eyrow">
                <CheckoutButton
                  amount={50000}
                  label="Pay ₹500"
                  description="UNIUN checkout"
                />
              </div>
            </div>

            <div className="feature-card" aria-label="Payment security">
              <span className="isq"><Icon name="lock" /></span>
              <strong>Protected by Razorpay.</strong>
              <p>
                Every payment is verified on our servers with a cryptographic
                signature check before it is confirmed.
              </p>
              <div className="chiprow">
                <span className="chip">UPI</span>
                <span className="chip">Cards</span>
                <span className="chip">Netbanking</span>
                <span className="chip">Wallets</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <DsxFooter />
    </div>
  );
}
