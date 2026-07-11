import type { Metadata } from "next";
import { DsxFooter, DsxNav, Icon } from "@/components/uniun/DsxChrome";
import { LoginForm } from "@/features/auth/component/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to UNIUN with your keypair.",
  alternates: {
    canonical: "/login"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function LoginPage() {
  return (
    <div className="dsx" id="top">
      <DsxNav />

      <main>
        <section className="phead" aria-labelledby="login-title">
          <div className="wrap hero-split">
            <div>
              <span className="section-label">
                <Icon name="passkey" />
                Keypair login
              </span>
              <h1 id="login-title">Your key is your account.</h1>
              <p className="lead" style={{ maxWidth: "48ch" }}>
                No email, no password, no signup. Sign a one-time challenge
                with your private key — the first login creates your account.
              </p>
            </div>

            <LoginForm />
          </div>
        </section>
      </main>

      <DsxFooter />
    </div>
  );
}
