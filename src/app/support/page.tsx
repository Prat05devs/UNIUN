import type { Metadata } from "next";
import { DsxFooter, DsxNav, Icon } from "../../components/uniun/DsxChrome";
import { SupportContactForm } from "../../components/uniun/support/SupportContactForm";

const supportEmail = "pranavpandey1998developer@gmail.com";
const displaySupportEmail = "pranavpandey1998developer@gmail.com";

const supportTopics = [
  {
    title: "iOS app support",
    body: "Get help with install issues, app behavior, sign-in, and device-specific problems.",
    icon: "smartphone"
  },
  {
    title: "Bug reports",
    body: "Send reproducible details so the product team can trace and fix the issue faster.",
    icon: "bug_report"
  },
  {
    title: "Privacy requests",
    body: "Ask about data, account deletion, export, or anything related to your information.",
    icon: "verified_user"
  },
  {
    title: "Product feedback",
    body: "Share ideas about notes, channels, graphs, AI context, or the wider UNIUN workflow.",
    icon: "auto_awesome"
  }
];

const contactChannels = [
  {
    title: "Email support",
    body: "Best for account, iOS, privacy, and bug report questions.",
    detail: displaySupportEmail,
    href: `mailto:${supportEmail}`,
    icon: "mail"
  },
  {
    title: "Response window",
    body: "We read support messages during product working hours.",
    detail: "Usually within 1-2 business days",
    href: null,
    icon: "schedule"
  },
  {
    title: "Data requests",
    body: "Use the privacy topic in the form for deletion, export, or account-data questions.",
    detail: "Privacy and account help",
    href: `mailto:${supportEmail}?subject=UNIUN%20privacy%20request`,
    icon: "database"
  },
  {
    title: "App Store support",
    body: "For iPhone or iPad issues, include your device model and iOS version if you can.",
    detail: "iOS app help",
    href: `mailto:${supportEmail}?subject=UNIUN%20iOS%20app%20support`,
    icon: "how_to_reg"
  }
];

export const metadata: Metadata = {
  title: "Support",
  description:
    "Contact UNIUN support for iOS app help, privacy requests, bug reports, and product feedback.",
  alternates: {
    canonical: "/support"
  }
};

export default function SupportPage() {
  return (
    <div className="dsx" id="top">
      <DsxNav />

      <main>
        <section className="phead" aria-labelledby="support-title">
          <div className="wrap hero-split">
            <div>
              <span className="section-label"><Icon name="support" />UNIUN support</span>
              <h1 id="support-title">Help for your notes, network, and AI.</h1>
              <p className="lead" style={{ maxWidth: "48ch" }}>
                Reach the UNIUN team for iOS app support, account questions, privacy
                requests, bug reports, and feedback about the product.
              </p>

              <div className="eyrow">
                <a className="btn btn-primary" href={`mailto:${supportEmail}`}>
                  <Icon name="mail" />
                  Email support
                </a>
                <a className="btn btn-secondary" href="#contact-form">
                  <Icon name="forum" />
                  Use the form
                </a>
              </div>
            </div>

            <div className="feature-card" aria-label="Support availability">
              <span className="isq"><Icon name="support" /></span>
              <strong>We are here to help.</strong>
              <p>
                Send clear details and we will route your message to the right
                product, privacy, or app support path.
              </p>
              <div className="chiprow">
                <span className="chip">iOS</span>
                <span className="chip">Privacy</span>
                <span className="chip">Bugs</span>
                <span className="chip">Feedback</span>
              </div>
            </div>
          </div>
        </section>

        <section style={{ paddingTop: 0 }} aria-label="Support topics">
          <div className="wrap">
            <div className="cols-2">
              {supportTopics.map(({ title, body, icon }) => (
                <article className="card ftile" key={title}>
                  <span className="isq"><Icon name={icon} /></span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact-form" aria-label="Contact UNIUN">
          <div className="wrap form-split">
            <SupportContactForm />

            <div>
              <div style={{ marginBottom: 20 }}>
                <span className="section-label"><Icon name="alternate_email" />Direct paths</span>
                <h2 className="h3">Choose the fastest route.</h2>
                <p className="lead" style={{ fontSize: "1rem", marginTop: 10 }}>
                  Email is the source of truth for support until UNIUN has a
                  dedicated support desk.
                </p>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {contactChannels.map(({ title, body, detail, href, icon }) => {
                  const content = (
                    <>
                      <span className="isq"><Icon name={icon} /></span>
                      <div>
                        <h3>{title}</h3>
                        <p>{body}</p>
                        <span className="detail">{detail}</span>
                      </div>
                    </>
                  );

                  return href ? (
                    <a className="row-card" href={href} key={title}>
                      {content}
                    </a>
                  ) : (
                    <div className="row-card" key={title}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <DsxFooter />
    </div>
  );
}
