import type { Metadata } from "next";
import {
  Database,
  FileText,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Smartphone,
  Sparkles
} from "lucide-react";
import { SiteFooter } from "../../components/uniun/SiteFooter";
import { SiteNav } from "../../components/uniun/SiteNav";

const supportEmail = "pranavpandey1998developer@gmail.com";
const displaySupportEmail = "pranavpandey1998developer@gmail.com";
const lastUpdated = "June 6, 2026";

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy", active: true },
  { href: "/support", label: "Support" },
  { href: "#terms", label: "Terms of Service" }
];

const policySections = [
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
      "You can delete your local data at any time from Settings. Because Nostr is a public protocol, notes already published to relays cannot be retracted — this is an intentional property of the network, not a limitation of the app."
    ]
  },
  {
    id: "contact",
    title: "8. Contact",
    body: [
      `For privacy questions: ${displaySupportEmail}`
    ]
  }
];

const summaryCards = [
  {
    title: "Your data stays on your device",
    body: "Notes, profile, saved items, channel messages, and settings are stored locally — not on any server controlled by UNIUN.",
    icon: Smartphone
  },
  {
    title: "Your keys, your control",
    body: "Your private key (nsec) lives only in your device's secure system keychain. UNIUN never transmits it to any server.",
    icon: ShieldCheck
  },
  {
    title: "On-device AI",
    body: "The Shiv AI assistant runs entirely on your device and accesses only your locally saved notes. No content leaves your device.",
    icon: Sparkles
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
    <div className="legal-page">
      <SiteNav />

      <main id="top">
        <section className="legal-hero" aria-labelledby="privacy-title">
          <div className="legal-hero-copy">
            <p className="eyebrow">Legal notes</p>
            <h1 id="privacy-title">Privacy Policy</h1>
            <p>
              UNIUN is built on transparency. Your data stays on your device.
              Below is everything you need to know — no legal jargon.
            </p>
            <span>Last updated: {lastUpdated}</span>
          </div>

          <div className="legal-hero-card" aria-label="Privacy summary">
            <LockKeyhole aria-hidden="true" />
            <strong>Your data stays on your device.</strong>
            <p>
              UNIUN is local-first and built around ownership and user control.
              This page explains exactly what stays local and what gets shared.
            </p>
          </div>
        </section>

        <section className="legal-summary" aria-label="Privacy highlights">
          {summaryCards.map(({ title, body, icon: Icon }) => (
            <article key={title}>
              <Icon aria-hidden="true" />
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </section>

        <section className="legal-document-section" aria-label="Privacy Policy document">
          <aside className="legal-sidebar" aria-label="Legal pages">
            <strong>Legal</strong>
            {legalLinks.map((link) => (
              <a
                className={link.active ? "active" : undefined}
                href={link.href}
                key={link.label}
              >
                <FileText aria-hidden="true" />
                {link.label}
              </a>
            ))}
          </aside>

          <article className="legal-document">
            <nav className="legal-breadcrumb" aria-label="Breadcrumb">
              <a href="/">UNIUN</a>
              <span>/</span>
              <span>Privacy Policy</span>
            </nav>

            <div className="legal-document-intro">
              <h2>Privacy Policy</h2>
              <p>
                UNIUN is built on transparency. Your data stays on your device.
                Below is everything you need to know — no legal jargon.
              </p>
            </div>

            {policySections.map((section) => (
              <section className="legal-copy-section" id={section.id} key={section.id}>
                <h3>{section.title}</h3>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}

            <div className="legal-contact-card">
              <Database aria-hidden="true" />
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

          <aside className="legal-toc" aria-label="Privacy Policy sections">
            <strong>On this page</strong>
            {policySections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                {section.title.replace(/^\d+\.\s/, "")}
              </a>
            ))}
            <a className="legal-toc-contact" href={`mailto:${supportEmail}`}>
              <Mail aria-hidden="true" />
              Contact privacy
            </a>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
