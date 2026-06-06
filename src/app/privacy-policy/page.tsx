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
const displaySupportEmail = "hello@uniun.app";
const lastUpdated = "June 6, 2026";

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy", active: true },
  { href: "/support", label: "Support" },
  { href: "#terms", label: "Terms of Service" }
];

const policySections = [
  {
    id: "overview",
    title: "1. Overview",
    body: [
      "UNIUN is designed as a notes, conversations, graph, and AI workspace. This Privacy Policy explains what information may be collected, how it may be used, and the choices available to you when you use UNIUN.",
      "We try to keep the product local-first and privacy-aware. Some features may work on your device, while others may require account, sync, support, analytics, or AI processing services."
    ]
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    body: [
      "Account and contact information may include your name, email address, support messages, and other details you choose to share with us.",
      "App and device information may include device type, operating system version, app version, crash logs, diagnostics, and basic usage signals that help us understand whether UNIUN is working as expected.",
      "User content may include notes, messages, threads, graph relationships, channels, and AI prompts or responses when you use features that store, sync, or process this content."
    ]
  },
  {
    id: "how-we-use-information",
    title: "3. How We Use Information",
    body: [
      "We use information to provide and improve UNIUN, respond to support requests, maintain app reliability, investigate bugs, protect the service, and develop product features.",
      "If AI features are enabled, relevant content or prompts may be processed to generate responses, organize context, or help you search and reason across your workspace."
    ]
  },
  {
    id: "storage-and-processing",
    title: "4. Storage and Processing",
    body: [
      "UNIUN may store some information locally on your device. If sync, account, backup, collaboration, or AI features are enabled, selected information may be transmitted to servers or service providers needed to operate those features.",
      "We aim to limit processing to what is needed for product functionality, support, security, and improvement."
    ]
  },
  {
    id: "sharing",
    title: "5. Sharing Information",
    body: [
      "We do not sell your personal information. We may share information with service providers that help us operate, host, analyze, secure, or support UNIUN.",
      "We may also disclose information if required by law, to protect rights and safety, or as part of a business transfer such as a merger, acquisition, or reorganization."
    ]
  },
  {
    id: "your-choices",
    title: "6. Your Choices",
    body: [
      "You can contact us to request access, correction, deletion, or export of information associated with your account or support history.",
      "You may be able to control app permissions, notifications, analytics, and local storage through your device settings or UNIUN settings as those controls become available."
    ]
  },
  {
    id: "security",
    title: "7. Security",
    body: [
      "We use reasonable technical and organizational safeguards designed to protect information. No system is perfectly secure, so we cannot guarantee absolute protection.",
      "Please keep your device, account, keys, and recovery methods protected, especially when using local-first or bring-your-own-backend workflows."
    ]
  },
  {
    id: "children",
    title: "8. Children",
    body: [
      "UNIUN is not intended for children under 13. If you believe a child has provided personal information, contact us and we will review the request."
    ]
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    body: [
      "We may update this Privacy Policy as UNIUN changes. When we make meaningful changes, we will update the date on this page and may provide additional notice when appropriate."
    ]
  },
  {
    id: "contact",
    title: "10. Contact Us",
    body: [
      `For privacy questions, app support, deletion requests, or data requests, contact us at ${displaySupportEmail}.`
    ]
  }
];

const summaryCards = [
  {
    title: "Local-first by design",
    body: "Some workspace data may stay on your device unless you enable features that need syncing or processing.",
    icon: Smartphone
  },
  {
    title: "No sale of data",
    body: "UNIUN does not sell personal information.",
    icon: ShieldCheck
  },
  {
    title: "AI with context",
    body: "AI features may process selected notes, prompts, or workspace context to generate useful responses.",
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
              How UNIUN handles app data, notes, support requests, diagnostics,
              and AI-related processing.
            </p>
            <span>Last updated: {lastUpdated}</span>
          </div>

          <div className="legal-hero-card" aria-label="Privacy summary">
            <LockKeyhole aria-hidden="true" />
            <strong>Your workspace deserves careful handling.</strong>
            <p>
              UNIUN is being built around ownership, context, and user control.
              This page explains the practical privacy commitments behind that.
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
                This policy describes UNIUN&apos;s approach to privacy for the
                website, app, and related support channels. It is written to be
                readable, but it should not be treated as legal advice.
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
