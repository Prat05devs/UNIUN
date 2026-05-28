import { downloadLinks } from "../homeData";
import { SectionHeading } from "../SectionHeading";
import { cn } from "../utils";

export function FinalCtaSection() {
  return (
    <section className="final-section" id="waitlist" aria-labelledby="final-title">
      <div className="final-graph" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <SectionHeading
        eyebrow="Start with one note"
        title="Start with one note."
        body="Build your network. Grow your knowledge. Ask your AI."
        id="final-title"
        align="center"
        tone="dark"
      />

      <div className="cta-row" aria-label="Download links">
        {downloadLinks.map(({ label, href, icon: Icon, primary }) => (
          <a
            className={cn(primary && "primary")}
            href={href}
            key={label}
          >
            <Icon aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>

      <div className="final-preview" aria-label="What UNIUN helps you do">
        <article>
          <span>01</span>
          <strong>Write one note</strong>
          <p>Capture a thought before it disappears.</p>
        </article>
        <article>
          <span>02</span>
          <strong>Connect the context</strong>
          <p>Turn related notes into a living network.</p>
        </article>
        <article>
          <span>03</span>
          <strong>Ask Shiv</strong>
          <p>Explore your own workspace with clarity.</p>
        </article>
      </div>
    </section>
  );
}
