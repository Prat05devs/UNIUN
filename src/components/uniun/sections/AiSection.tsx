import { SectionHeading } from "../SectionHeading";

const aiChips = [
  "Ask from your notes",
  "Summarize context",
  "Find connections",
  "Branch follow-ups",
  "Local-first AI"
];

export function AiSection() {
  return (
    <section className="ai-section" aria-labelledby="ai-title">
      <div className="ai-layout">
        <div className="ai-copy-panel">
          <SectionHeading
            eyebrow="Shiv - your context-aware assistant"
            title="AI that understands your context."
            body="Shiv does not start from a blank page. It works with the notes you create, save, and connect."
            id="ai-title"
            tone="dark"
          />

          <div className="ai-chip-row" aria-label="Shiv capabilities">
            {aiChips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        </div>

        <div className="ai-field" aria-hidden="true">
          <svg className="ai-lines" viewBox="0 0 900 680" role="presentation">
            <path d="M170 160 C310 260 390 310 450 348" />
            <path d="M720 180 C610 250 540 310 450 348" />
            <path d="M220 520 C330 450 380 405 450 348" />
            <path d="M450 348 C540 420 610 468 690 548" />
          </svg>
          <div className="ai-note an1">Meeting plan</div>
          <div className="ai-note an2">Channel decisions</div>
          <div className="ai-note an3">Saved references</div>
          <div className="ai-orb" />
          <div className="ai-response">
            <strong>Shiv</strong>
            <span>Here is the answer, with the notes that shaped it.</span>
            <small>Follow-up branches ready</small>
          </div>
        </div>
      </div>
    </section>
  );
}
