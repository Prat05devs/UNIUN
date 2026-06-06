import type { Metadata } from "next";
import { SiteFooter } from "../../components/uniun/SiteFooter";
import { SiteNav } from "../../components/uniun/SiteNav";

const supportEmail = "Pranavpandey1998developer@gmail.com";
const displaySupportEmail = "hello@uniun.app";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the UNIUN Terms of Service.",
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
        <h1>Terms of Service</h1>
        <p className="plain-updated">Last updated: June 6, 2026</p>

        <section>
          <h2>1. Acceptance</h2>
          <p>
            By using UNIUN, you agree to these Terms of Service. If you do not
            agree, do not use the website, app, or related services.
          </p>
        </section>

        <section>
          <h2>2. Use of UNIUN</h2>
          <p>
            UNIUN is provided to help you create, organize, connect, and explore
            notes, conversations, and related knowledge. You are responsible for
            how you use the product and for the content you add to it.
          </p>
        </section>

        <section>
          <h2>3. Your Content</h2>
          <p>
            You keep ownership of your content. You give UNIUN the limited
            permission needed to operate features you choose to use, such as
            storage, sync, support, sharing, or AI processing.
          </p>
        </section>

        <section>
          <h2>4. Acceptable Use</h2>
          <p>
            Do not use UNIUN to break the law, harm others, disrupt the service,
            attempt unauthorized access, or upload content you do not have the
            right to use.
          </p>
        </section>

        <section>
          <h2>5. AI Features</h2>
          <p>
            AI output may be inaccurate or incomplete. You are responsible for
            reviewing AI responses before relying on them for important decisions.
          </p>
        </section>

        <section>
          <h2>6. Availability</h2>
          <p>
            UNIUN may change, pause, or discontinue features over time. We try to
            keep the product useful and reliable, but we do not guarantee that it
            will always be available or error-free.
          </p>
        </section>

        <section>
          <h2>7. Disclaimer</h2>
          <p>
            UNIUN is provided as is and as available. To the fullest extent
            allowed by law, we disclaim warranties of merchantability, fitness for
            a particular purpose, and non-infringement.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
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
