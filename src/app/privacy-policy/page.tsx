import type { Metadata } from "next";
import { DsxFooter, DsxNav, Icon } from "../../components/uniun/DsxChrome";

const supportEmail = "pranavpandey1998developer@gmail.com";
const displaySupportEmail = "pranavpandey1998developer@gmail.com";
const lastUpdated = "June 6, 2026";

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy", active: true },
  { href: "/support", label: "Support" },
  { href: "#terms", label: "Terms of Service" }
];

type PolicySection = {
  id: string;
  title: string;
  body: string[];
  link?: { href: string; label: string };
};

const policySections: PolicySection[] = [
  {
    id: "what-we-store-locally",
    title: "1. What We Store Locally",
    body: [
      "UNIUN stores your notes, profile, saved items, channel messages, and settings directly on your device. This data is not sent to any server controlled by UNIUN."
    ]
  },
  {
    id: "what-gets-shared-publicly",
    title: "2. What Gets Shared Publicly",
    body: [
      "When you publish a note or send a message in a public channel, that content is broadcast to Nostr relays. Nostr is an open public protocol — once published, your notes may be visible to anyone connected to those relays. UNIUN does not control third-party relays."
    ]
  },
  {
    id: "your-identity-and-keys",
    title: "3. Your Identity & Keys",
    body: [
      "Your identity is a cryptographic key pair. Your public key is visible to others on the Nostr network. Your private key (nsec) is stored exclusively in your device's secure system keychain (iOS Keychain / Android Keystore). UNIUN never transmits your private key to any server."
    ]
  },
  {
    id: "local-ai-shiv",
    title: "4. Local AI (Shiv)",
    body: [
      "The Shiv AI assistant runs entirely on your device. It accesses only your locally saved notes. No note content is sent to any external AI service or API."
    ]
  },
  {
    id: "media-and-blossom-servers",
    title: "5. Media & Blossom Servers",
    body: [
      "If you attach images or media, they may be uploaded to a Blossom content server of your choice. UNIUN does not operate Blossom servers. Content uploaded there may be publicly accessible by design of the protocol."
    ]
  },
  {
    id: "direct-messages",
    title: "6. Direct Messages",
    body: [
      "DMs are end-to-end encrypted using the Nostr NIP-17 standard. Only the intended recipient can read the message content. Message routing metadata may be visible to relays."
    ]
  },
  {
    id: "your-control",
    title: "7. Your Control",
    body: [
      "You can delete your local data at any time from Settings. Because Nostr is a public protocol, content already published to relays is distributed across many independent nodes — see Section 8 for how to request its deletion across the network."
    ]
  },
  {
    id: "deleting-your-data",
    title: "8. Deleting Your Data",
    body: [
      "UNIUN is a decentralized application built on Nostr, so your published data does not live on a single server we can wipe on your behalf. It is replicated across many independent relays (nodes) operated by different people around the world.",
      "To delete that data everywhere it exists, Nostr provides a standard called NIP-62 \"Request to Vanish.\" You sign a special event (kind 62) with your key that instructs relays to permanently delete all events associated with your public key. Compliant relays honor the request and remove your data, and may forward the request onward to other relays.",
      "Because relays are independently operated, deletion depends on each relay honoring the protocol. UNIUN cannot force a third-party relay to comply, but the NIP-62 request is the network-wide mechanism for asking every node holding your data to remove it. You can read the full specification here:"
    ],
    link: { href: "https://nips.nostr.com/62", label: "Nostr NIP-62 — Request to Vanish" }
  },
  {
    id: "contact",
    title: "9. Contact",
    body: [
      `For privacy questions: ${displaySupportEmail}`
    ]
  }
];

const summaryCards = [
  {
    title: "Your data stays on your device",
    body: "Notes, profile, saved items, channel messages, and settings are stored locally — not on any server controlled by UNIUN.",
    icon: "smartphone"
  },
  {
    title: "Your keys, your control",
    body: "Your private key (nsec) lives only in your device's secure system keychain. UNIUN never transmits it to any server.",
    icon: "verified_user"
  },
  {
    title: "On-device AI",
    body: "The Shiv AI assistant runs entirely on your device and accesses only your locally saved notes. No content leaves your device.",
    icon: "auto_awesome"
  }
];

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the UNIUN Privacy Policy for information about app data, support requests, AI processing, and privacy choices.",
  alternates: {
    canonical: "/privacy-policy"
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="dsx" id="top">
      <DsxNav />

      <main>
        <section className="phead" aria-labelledby="privacy-title">
          <div className="wrap hero-split">
            <div>
              <span className="section-label"><Icon name="lock" />Legal notes</span>
              <h1 id="privacy-title">Privacy Policy</h1>
              <p className="lead" style={{ maxWidth: "46ch" }}>
                UNIUN is built on transparency. Your data stays on your device.
                Below is everything you need to know — no legal jargon.
              </p>
              <span className="updated"><Icon name="schedule" />Last updated: {lastUpdated}</span>
            </div>

            <div className="feature-card" aria-label="Privacy summary">
              <span className="isq"><Icon name="lock" /></span>
              <strong>Your data stays on your device.</strong>
              <p>
                UNIUN is local-first and built around ownership and user control.
                This page explains exactly what stays local and what gets shared.
              </p>
            </div>
          </div>
        </section>

        <section style={{ paddingTop: 0 }} aria-label="Privacy highlights">
          <div className="wrap">
            <div className="cols-3">
              {summaryCards.map(({ title, body, icon }) => (
                <article className="card ftile" key={title}>
                  <span className="isq"><Icon name={icon} /></span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section style={{ paddingTop: "clamp(32px,5vw,56px)" }} aria-label="Privacy Policy document">
          <div className="wrap doc-grid">
            <aside className="rail" aria-label="Legal pages">
              <strong>Legal</strong>
              {legalLinks.map((link) => (
                <a
                  className={link.active ? "active" : undefined}
                  href={link.href}
                  key={link.label}
                >
                  <Icon name="description" />
                  {link.label}
                </a>
              ))}
            </aside>

            <article className="prose">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <a href="/">UNIUN</a>
                <span>/</span>
                <span>Privacy Policy</span>
              </nav>

              <div className="prose-intro">
                <h2>Privacy Policy</h2>
                <p>
                  UNIUN is built on transparency. Your data stays on your device.
                  Below is everything you need to know — no legal jargon.
                </p>
              </div>

              {policySections.map((section) => (
                <section id={section.id} key={section.id}>
                  <h3>{section.title}</h3>
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.link ? (
                    <p>
                      <a
                        href={section.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {section.link.label}
                      </a>
                    </p>
                  ) : null}
                </section>
              ))}

              <div className="callout">
                <Icon name="database" />
                <div>
                  <strong>Privacy or data request?</strong>
                  <p>
                    Email <a href={`mailto:${supportEmail}`}>{displaySupportEmail}</a> and
                    include the account or app context we should use to find your
                    request.
                  </p>
                </div>
              </div>
            </article>

            <aside className="toc" aria-label="Privacy Policy sections">
              <strong style={{ display: "block", fontSize: ".6875rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 10px 12px" }}>On this page</strong>
              {policySections.map((section) => (
                <a href={`#${section.id}`} key={section.id}>
                  {section.title.replace(/^\d+\.\s/, "")}
                </a>
              ))}
              <a className="toc-cta" href={`mailto:${supportEmail}`}>
                <Icon name="mail" />
                Contact privacy
              </a>
            </aside>
          </div>
        </section>
      </main>

      <DsxFooter />
    </div>
  );
}
