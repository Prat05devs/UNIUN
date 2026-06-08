import type { Metadata } from "next";
import {
  Bug,
  Clock3,
  DatabaseZap,
  LifeBuoy,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRoundCheck
} from "lucide-react";
import { SiteFooter } from "../../components/uniun/SiteFooter";
import { SiteNav } from "../../components/uniun/SiteNav";
import { SupportContactForm } from "../../components/uniun/support/SupportContactForm";

const supportEmail = "pranavpandey1998developer@gmail.com";
const displaySupportEmail = "pranavpandey1998developer@gmail.com";

const supportTopics = [
  {
    title: "iOS app support",
    body: "Get help with install issues, app behavior, sign-in, and device-specific problems.",
    icon: Smartphone
  },
  {
    title: "Bug reports",
    body: "Send reproducible details so the product team can trace and fix the issue faster.",
    icon: Bug
  },
  {
    title: "Privacy requests",
    body: "Ask about data, account deletion, export, or anything related to your information.",
    icon: ShieldCheck
  },
  {
    title: "Product feedback",
    body: "Share ideas about notes, channels, graphs, AI context, or the wider UNIUN workflow.",
    icon: Sparkles
  }
];

const contactChannels = [
  {
    title: "Email support",
    body: "Best for account, iOS, privacy, and bug report questions.",
    detail: displaySupportEmail,
    href: `mailto:${supportEmail}`,
    icon: Mail
  },
  {
    title: "Response window",
    body: "We read support messages during product working hours.",
    detail: "Usually within 1-2 business days",
    href: null,
    icon: Clock3
  },
  {
    title: "Data requests",
    body: "Use the privacy topic in the form for deletion, export, or account-data questions.",
    detail: "Privacy and account help",
    href: `mailto:${supportEmail}?subject=UNIUN%20privacy%20request`,
    icon: DatabaseZap
  },
  {
    title: "App Store support",
    body: "For iPhone or iPad issues, include your device model and iOS version if you can.",
    detail: "iOS app help",
    href: `mailto:${supportEmail}?subject=UNIUN%20iOS%20app%20support`,
    icon: UserRoundCheck
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
    <div className="support-page">
      <SiteNav />

      <main id="top">
        <section className="support-hero" aria-labelledby="support-title">
          <div className="support-hero-copy">
            <p className="eyebrow">UNIUN support</p>
            <h1 id="support-title">Help for your notes, network, and AI.</h1>
            <p>
              Reach the UNIUN team for iOS app support, account questions, privacy
              requests, bug reports, and feedback about the product.
            </p>

            <div className="support-hero-actions">
              <a className="primary" href={`mailto:${supportEmail}`}>
                <Mail aria-hidden="true" />
                Email support
              </a>
              <a href="#contact-form">
                <MessageSquareText aria-hidden="true" />
                Use the form
              </a>
            </div>
          </div>

          <div className="support-hero-panel" aria-label="Support availability">
            <div className="support-status-card">
              <span>
                <LifeBuoy aria-hidden="true" />
                Support desk
              </span>
              <strong>We are here to help.</strong>
              <p>
                Send clear details and we will route your message to the right
                product, privacy, or app support path.
              </p>
            </div>

            <div className="support-mini-grid">
              <span>iOS</span>
              <span>Privacy</span>
              <span>Bugs</span>
              <span>Feedback</span>
            </div>
          </div>
        </section>

        <section className="support-topics" aria-label="Support topics">
          {supportTopics.map(({ title, body, icon: Icon }) => (
            <article key={title}>
              <div>
                <Icon aria-hidden="true" />
              </div>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </section>

        <section className="support-contact-section" id="contact-form" aria-label="Contact UNIUN">
          <SupportContactForm />

          <div className="support-channel-list">
            <div className="support-channel-heading">
              <span>Direct paths</span>
              <h2>Choose the fastest route.</h2>
              <p>
                Email is the source of truth for support until UNIUN has a
                dedicated support desk.
              </p>
            </div>

            {contactChannels.map(({ title, body, detail, href, icon: Icon }) => {
              const content = (
                <>
                  <div className="support-channel-icon">
                    <Icon aria-hidden="true" />
                  </div>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                    <strong>{detail}</strong>
                  </div>
                </>
              );

              return href ? (
                <a className="support-channel-card" href={href} key={title}>
                  {content}
                </a>
              ) : (
                <div className="support-channel-card" key={title}>
                  {content}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
