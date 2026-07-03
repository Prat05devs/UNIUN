import type { Metadata } from "next";
import { DsxFooter, DsxNav, Icon } from "../../components/uniun/DsxChrome";

const supportEmail = "pranavpandey1998developer@gmail.com";
const displaySupportEmail = "pranavpandey1998developer@gmail.com";
const lastUpdated = "June 2025";

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/child-safety", label: "Child Safety", active: true },
  { href: "/support", label: "Support" }
];

type PolicySection = {
  id: string;
  title: string;
  body: (string | { type: "list"; items: string[] })[];
};

const policySections: PolicySection[] = [
  {
    id: "zero-tolerance",
    title: "1. Zero Tolerance",
    body: [
      "UNIUN has an absolute zero-tolerance policy toward child sexual abuse and exploitation. Any content, account, or behavior that sexualizes, endangers, or exploits a minor is strictly prohibited on our platform, without exception."
    ]
  },
  {
    id: "prohibited-content",
    title: "2. Prohibited Content and Conduct",
    body: [
      "Users must not create, upload, share, request, solicit, promote, link to, or distribute any of the following:",
      {
        type: "list",
        items: [
          "Child Sexual Abuse Material (CSAM) in any form, including photographs, videos, illustrations, animations, AI-generated imagery, or text depictions.",
          "Sexualization of minors, including suggestive posing, captions, hashtags, or commentary.",
          "Grooming behavior — attempting to contact, befriend, or build trust with a minor for sexual purposes.",
          "Sextortion, coercion, or the non-consensual sharing of intimate content involving minors.",
          "Trafficking, sale, or exploitation of minors, or content that facilitates such activity.",
          "Any content that identifies, targets, or exposes a minor to risk of harm."
        ]
      }
    ]
  },
  {
    id: "age-requirement",
    title: "3. Age Requirement",
    body: [
      "UNIUN is not intended for children under the age of 13 (or the minimum age of digital consent in your jurisdiction, whichever is higher). Accounts found to belong to underage users will be removed."
    ]
  },
  {
    id: "detection-and-enforcement",
    title: "4. Detection, Moderation, and Enforcement",
    body: [
      "UNIUN is built on the decentralized Nostr protocol. Every note includes an in-app Report option with categories including nudity, illegal content, and other. Any user can also block other accounts from Settings → Blocked Users. Reports are surfaced to our review team and are also published on the Nostr network so other clients and relay operators can act on them.",
      "When we become aware of content or accounts involved in child sexual abuse or exploitation, we will:",
      {
        type: "list",
        items: [
          "Remove the content from surfaces we control and hide it from reporting users immediately.",
          "Permanently suspend the offending account from UNIUN-operated services and add it to our blocklist.",
          "Preserve relevant evidence to the extent permitted by law.",
          "Report confirmed CSAM to the appropriate authorities, including the National Center for Missing & Exploited Children (NCMEC) via the CyberTipline, or the equivalent authority in your jurisdiction.",
          "Cooperate fully with law enforcement in response to valid legal process."
        ]
      }
    ]
  },
  {
    id: "reporting",
    title: "5. Reporting CSAE Content",
    body: [
      "If you encounter content or behavior on UNIUN that you believe violates this policy, please report it immediately. In-app, open the note menu and choose Report, then select the category that best matches (for example, illegal or nudity) and submit. By email, contact us with the subject line \"CSAE Report\" and as much detail as you can safely provide (Nostr event ID, npub, or screenshots).",
      "We treat CSAE reports as our highest priority and review them promptly."
    ]
  },
  {
    id: "emergency-contacts",
    title: "6. Emergency and Law Enforcement Contacts",
    body: [
      "If a child is in immediate danger, please contact your local emergency services first. To report CSAM directly to authorities, you can also use the resources listed on this page."
    ]
  },
  {
    id: "point-of-contact",
    title: "7. Designated Point of Contact",
    body: [
      `UNIUN's designated point of contact for child safety inquiries, law enforcement requests, and CSAE reports is ${displaySupportEmail}.`
    ]
  }
];

const summaryCards = [
  {
    title: "Zero tolerance",
    body: "Any content or behavior that sexualizes, endangers, or exploits a minor is strictly prohibited — no exceptions.",
    icon: "shield"
  },
  {
    title: "Report in one tap",
    body: "Every note has an in-app Report option with an illegal category, plus per-account blocking from Settings.",
    icon: "report"
  },
  {
    title: "We cooperate with authorities",
    body: "Confirmed CSAM is reported to NCMEC (or the local equivalent) and we cooperate fully with valid legal process.",
    icon: "gavel"
  }
];

const emergencyContacts = [
  {
    label: "NCMEC CyberTipline (USA)",
    href: "https://report.cybertip.org/",
    display: "report.cybertip.org"
  },
  {
    label: "INHOPE (international hotlines)",
    href: "https://www.inhope.org/EN/articles/child-helplines",
    display: "inhope.org"
  },
  {
    label: "India — National Cyber Crime Reporting Portal",
    href: "https://cybercrime.gov.in/",
    display: "cybercrime.gov.in"
  }
];

export const metadata: Metadata = {
  title: "Child Safety Standards (CSAE)",
  description:
    "UNIUN's standards against child sexual abuse and exploitation (CSAE). Our zero-tolerance policy, moderation practices, reporting channels, and cooperation with law enforcement.",
  alternates: {
    canonical: "/child-safety"
  }
};

export default function ChildSafetyPage() {
  return (
    <div className="dsx" id="top">
      <DsxNav />

      <main>
        <section className="phead" aria-labelledby="child-safety-title">
          <div className="wrap hero-split">
            <div>
              <span className="section-label"><Icon name="shield" />Safety</span>
              <h1 id="child-safety-title">Child Safety Standards</h1>
              <p className="lead" style={{ maxWidth: "46ch" }}>
                UNIUN&apos;s policy against Child Sexual Abuse and Exploitation
                (CSAE). We have zero tolerance for content or behavior that
                endangers minors.
              </p>
              <span className="updated"><Icon name="schedule" />Last updated: {lastUpdated}</span>
            </div>

            <div className="feature-card" aria-label="Child safety summary">
              <span className="isq"><Icon name="shield" /></span>
              <strong>Zero tolerance for CSAE.</strong>
              <p>
                Content that sexualizes, endangers, or exploits a minor is
                removed, accounts are permanently suspended, and confirmed CSAM
                is reported to the appropriate authorities.
              </p>
            </div>
          </div>
        </section>

        <section style={{ paddingTop: 0 }} aria-label="Child safety highlights">
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

        <section style={{ paddingTop: "clamp(32px,5vw,56px)" }} aria-label="Child Safety Standards document">
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
                <span>Child Safety</span>
              </nav>

              <div className="prose-intro">
                <h2>Child Safety Standards</h2>
                <p>
                  UNIUN&apos;s policy against Child Sexual Abuse and Exploitation
                  (CSAE). We have zero tolerance for content or behavior that
                  endangers minors.
                </p>
              </div>

              {policySections.map((section) => (
                <section id={section.id} key={section.id}>
                  <h3>{section.title}</h3>
                  {section.body.map((block, i) =>
                    typeof block === "string" ? (
                      <p key={i}>{block}</p>
                    ) : (
                      <ul key={i}>
                        {block.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )
                  )}
                </section>
              ))}

              <section id="hotlines">
                <h3>Emergency hotlines</h3>
                <ul>
                  {emergencyContacts.map(({ label, href, display }) => (
                    <li key={href}>
                      <strong>{label}:</strong>{" "}
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {display}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="callout">
                <Icon name="report" />
                <div>
                  <strong>Report CSAE content</strong>
                  <p>
                    Use the in-app Report option on any note, or email{" "}
                    <a href={`mailto:${supportEmail}?subject=CSAE%20Report`}>
                      {displaySupportEmail}
                    </a>{" "}
                    with subject &quot;CSAE Report&quot; and any evidence you
                    can safely share.
                  </p>
                </div>
              </div>
            </article>

            <aside className="toc" aria-label="Child Safety sections">
              <strong style={{ display: "block", fontSize: ".6875rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 10px 12px" }}>On this page</strong>
              {policySections.map((section) => (
                <a href={`#${section.id}`} key={section.id}>
                  {section.title.replace(/^\d+\.\s/, "")}
                </a>
              ))}
              <a href="#hotlines">Emergency hotlines</a>
              <a className="toc-cta" href={`mailto:${supportEmail}?subject=CSAE%20Report`}>
                <Icon name="mail" />
                Report CSAE
              </a>
            </aside>
          </div>
        </section>
      </main>

      <DsxFooter />
    </div>
  );
}
