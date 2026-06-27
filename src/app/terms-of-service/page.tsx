import type { Metadata } from "next";
import { DsxFooter, DsxNav, Icon } from "../../components/uniun/DsxChrome";

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
    <div className="dsx" id="top">
      <DsxNav />

      <main>
        <section className="phead">
          <div className="wrap" style={{ maxWidth: 760 }}>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">UNIUN</a>
              <span>/</span>
              <span>Terms of Use</span>
            </nav>
            <span className="section-label"><Icon name="gavel" />Legal</span>
            <h1>Terms of Use</h1>
            <span className="updated"><Icon name="schedule" />Last updated: June 2025</span>
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <div className="wrap prose" style={{ maxWidth: 760 }}>
            <section>
              <h3>1. Your Responsibility</h3>
              <p>
                You are solely responsible for all content you publish on UNIUN. By
                using the app, you agree not to post content that is illegal, abusive,
                harassing, hateful, sexually explicit, or that violates others&apos;
                rights. Objectionable content and abusive behavior are not welcome on
                UNIUN.
              </p>
            </section>

            <section>
              <h3>2. No Abuse or Spam</h3>
              <p>
                Do not use UNIUN to spam, harass, impersonate others, or conduct
                automated activity that disrupts the Nostr network. UNIUN is
                decentralized: any note menu includes a Report option (categories:
                nudity, malware, profanity, illegal, spam, impersonation, other) and
                any user can be blocked from Settings → Blocked Users. Reported notes
                are immediately hidden from your feed and blocked users&apos; content
                never reaches you. Reports are also published on the Nostr network so
                other clients and relay operators can act on them.
              </p>
              <p>
                Abuse reports:{" "}
                <a href={`mailto:${supportEmail}`}>{displaySupportEmail}</a>
              </p>
            </section>

            <section>
              <h3>3. Keep Your Private Key Safe</h3>
              <p>
                Your private key (nsec) is your identity and login. If you lose it,
                your account cannot be recovered — UNIUN has no way to reset or recover
                private keys. Back it up in a secure location.
              </p>
            </section>

            <section>
              <h3>4. Public Content on Relays</h3>
              <p>
                Notes and channel messages you publish are sent to Nostr relays and
                may be visible to anyone on the network. Do not share sensitive
                personal information in public notes.
              </p>
            </section>

            <section>
              <h3>5. App May Change</h3>
              <p>
                UNIUN is in active development. Features, relay behavior, and policies
                may change over time. We will communicate significant updates within
                the app.
              </p>
            </section>

            <section>
              <h3>6. No Warranty</h3>
              <p>
                UNIUN is provided as-is. We make no guarantees about relay uptime,
                third-party server availability, or persistence of content on external
                relays.
              </p>
            </section>

            <section>
              <h3>7. Contact</h3>
              <p>
                Questions about these terms can be sent to{" "}
                <a href={`mailto:${supportEmail}`}>{displaySupportEmail}</a>.
              </p>
            </section>

            <div className="callout">
              <Icon name="mail" />
              <div>
                <strong>Questions about these terms?</strong>
                <p>
                  Email <a href={`mailto:${supportEmail}`}>{displaySupportEmail}</a> and
                  we&apos;ll get back to you.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <DsxFooter />
    </div>
  );
}
