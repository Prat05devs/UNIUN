import type { Metadata } from "next";
import { SiteFooter } from "../../components/uniun/SiteFooter";
import { SiteNav } from "../../components/uniun/SiteNav";

const supportEmail = "pranavpandey1998developer@gmail.com";
const displaySupportEmail = "pranavpandey1998developer@gmail.com";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Read the UNIUN Terms of Use.",
  alternates: {
    canonical: "/terms-of-service"
  }
};

export default function TermsOfServicePage() {
  return (
    <div className="plain-page">
      <SiteNav />

      <main className="plain-document" id="top">
        <p className="plain-kicker">Legal</p>
        <h1>Terms of Use</h1>
        <p className="plain-updated">Last updated: June 2025</p>

        <section>
          <h2>1. Your Responsibility</h2>
          <p>
            You are solely responsible for all content you publish on UNIUN. By
            using the app, you agree not to post content that is illegal, abusive,
            harassing, or violates others&apos; rights.
          </p>
        </section>

        <section>
          <h2>2. No Abuse or Spam</h2>
          <p>
            Do not use UNIUN to spam, harass, impersonate others, or conduct
            automated activity that disrupts the Nostr network.
          </p>
        </section>

        <section>
          <h2>3. Keep Your Private Key Safe</h2>
          <p>
            Your private key (nsec) is your identity and login. If you lose it,
            your account cannot be recovered — UNIUN has no way to reset or recover
            private keys. Back it up in a secure location.
          </p>
        </section>

        <section>
          <h2>4. Public Content on Relays</h2>
          <p>
            Notes and channel messages you publish are sent to Nostr relays and
            may be visible to anyone on the network. Do not share sensitive
            personal information in public notes.
          </p>
        </section>

        <section>
          <h2>5. App May Change</h2>
          <p>
            UNIUN is in active development. Features, relay behavior, and policies
            may change over time. We will communicate significant updates within
            the app.
          </p>
        </section>

        <section>
          <h2>6. No Warranty</h2>
          <p>
            UNIUN is provided as-is. We make no guarantees about relay uptime,
            third-party server availability, or persistence of content on external
            relays.
          </p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>
            Questions about these terms can be sent to{" "}
            <a href={`mailto:${supportEmail}`}>{displaySupportEmail}</a>.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
