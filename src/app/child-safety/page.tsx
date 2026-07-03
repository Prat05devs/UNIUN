import type { Metadata } from "next";
import { SiteFooter } from "../../components/uniun/SiteFooter";
import { SiteNav } from "../../components/uniun/SiteNav";

const supportEmail = "pranavpandey1998developer@gmail.com";
const displaySupportEmail = "pranavpandey1998developer@gmail.com";

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
    <div className="plain-page">
      <SiteNav />

      <main className="plain-document" id="top">
        <p className="plain-kicker">Safety</p>
        <h1>Child Safety Standards</h1>
        <p className="plain-updated">Last updated: June 2025</p>

        <p>
          UNIUN&apos;s policy against Child Sexual Abuse and Exploitation
          (CSAE). We have zero tolerance for content or behavior that endangers
          minors.
        </p>

        <section>
          <h2>1. Zero Tolerance</h2>
          <p>
            UNIUN has an absolute zero-tolerance policy toward child sexual
            abuse and exploitation. Any content, account, or behavior that
            sexualizes, endangers, or exploits a minor is strictly prohibited
            on our platform, without exception.
          </p>
        </section>

        <section>
          <h2>2. Prohibited Content and Conduct</h2>
          <p>
            Users must not create, upload, share, request, solicit, promote,
            link to, or distribute any of the following:
          </p>
          <ul>
            <li>
              Child Sexual Abuse Material (CSAM) in any form, including
              photographs, videos, illustrations, animations, AI-generated
              imagery, or text depictions.
            </li>
            <li>
              Sexualization of minors, including suggestive posing, captions,
              hashtags, or commentary.
            </li>
            <li>
              Grooming behavior — attempting to contact, befriend, or build
              trust with a minor for sexual purposes.
            </li>
            <li>
              Sextortion, coercion, or the non-consensual sharing of intimate
              content involving minors.
            </li>
            <li>
              Trafficking, sale, or exploitation of minors, or content that
              facilitates such activity.
            </li>
            <li>
              Any content that identifies, targets, or exposes a minor to risk
              of harm.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Age Requirement</h2>
          <p>
            UNIUN is not intended for children under the age of 13 (or the
            minimum age of digital consent in your jurisdiction, whichever is
            higher). Accounts found to belong to underage users will be
            removed.
          </p>
        </section>

        <section>
          <h2>4. Detection, Moderation, and Enforcement</h2>
          <p>
            UNIUN is built on the decentralized Nostr protocol. Every note
            includes an in-app <strong>Report</strong> option with categories
            including nudity, illegal content, and other. Any user can also
            block other accounts from Settings → Blocked Users. Reports are
            surfaced to our review team and are also published on the Nostr
            network so other clients and relay operators can act on them.
          </p>
          <p>
            When we become aware of content or accounts involved in child
            sexual abuse or exploitation, we will:
          </p>
          <ul>
            <li>
              Remove the content from surfaces we control and hide it from
              reporting users immediately.
            </li>
            <li>
              Permanently suspend the offending account from UNIUN-operated
              services and add it to our blocklist.
            </li>
            <li>Preserve relevant evidence to the extent permitted by law.</li>
            <li>
              Report confirmed CSAM to the appropriate authorities, including
              the National Center for Missing &amp; Exploited Children (NCMEC)
              via the CyberTipline, or the equivalent authority in your
              jurisdiction.
            </li>
            <li>
              Cooperate fully with law enforcement in response to valid legal
              process.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Reporting CSAE Content</h2>
          <p>
            If you encounter content or behavior on UNIUN that you believe
            violates this policy, please report it immediately:
          </p>
          <ul>
            <li>
              <strong>In-app:</strong> Open the note menu and choose{" "}
              <strong>Report</strong>. Select the category that best matches
              (e.g., <em>illegal</em> or <em>nudity</em>) and submit.
            </li>
            <li>
              <strong>Email:</strong> Contact us at{" "}
              <a href={`mailto:${supportEmail}?subject=CSAE%20Report`}>
                {displaySupportEmail}
              </a>{" "}
              with the subject line &quot;CSAE Report&quot; and as much detail
              as you can safely provide (Nostr event ID, npub, or screenshots).
            </li>
          </ul>
          <p>
            We treat CSAE reports as our highest priority and review them
            promptly.
          </p>
        </section>

        <section>
          <h2>6. Emergency and Law Enforcement Contacts</h2>
          <p>
            If a child is in immediate danger, please contact your local
            emergency services first. To report CSAM directly to authorities,
            you can also use:
          </p>
          <ul>
            <li>
              <strong>NCMEC CyberTipline (USA):</strong>{" "}
              <a
                href="https://report.cybertip.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                report.cybertip.org
              </a>
            </li>
            <li>
              <strong>INHOPE (international hotlines):</strong>{" "}
              <a
                href="https://www.inhope.org/EN/articles/child-helplines"
                target="_blank"
                rel="noopener noreferrer"
              >
                inhope.org
              </a>
            </li>
            <li>
              <strong>India — National Cyber Crime Reporting Portal:</strong>{" "}
              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                cybercrime.gov.in
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Designated Point of Contact</h2>
          <p>
            UNIUN&apos;s designated point of contact for child safety
            inquiries, law enforcement requests, and CSAE reports is:{" "}
            <a href={`mailto:${supportEmail}?subject=CSAE%20Inquiry`}>
              {displaySupportEmail}
            </a>
            .
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
