import { SectionHeading } from "../SectionHeading";

export function AiSection() {
  return (
    <section className="ai-section" aria-labelledby="ai-title">
      <div className="ai-field" aria-hidden="true">
        <div className="ai-note an1">WHAT DID WE DISCUSS?</div>
        <div className="ai-note an2">WHICH NOTES ARE CONNECTED?</div>
        <div className="ai-note an3">WHAT SHOULD WE DO NEXT?</div>
        <div className="ai-orb" />
        <div className="ai-response">
          <strong>Shiv</strong>
          <span>Ask anything. Shiv already understands the context behind your notes.</span>
        </div>
      </div>

      <SectionHeading
        eyebrow="Shiv Sarvagyaata"
        title="AI that knows the context of everything you create."
        body="Shiv understands your notes, connects related thoughts, and helps you ask better questions, find answers, and explore your workspace with clarity."
        id="ai-title"
        align="center"
        tone="dark"
      />
    </section>
  );
}
