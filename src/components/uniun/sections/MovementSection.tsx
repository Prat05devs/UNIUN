import { SectionHeading } from "../SectionHeading";

const movementUses = [
  "Team planning",
  "Community updates",
  "Private discussions",
  "Shared references",
  "Follow-ups"
];

export function MovementSection() {
  return (
    <section className="movement-section" aria-labelledby="movement-title">
      <div className="movement-clusters" aria-hidden="true">
        <span className="cluster-label public">Public channels</span>
        <span className="cluster-label private">Private channels</span>
        <span className="cluster-label dms">DMs</span>
        <span className="cluster-label tags">Tagged notes</span>
        {Array.from({ length: 18 }).map((_, index) => (
          <i key={index} />
        ))}
      </div>

      <div className="movement-content">
        <SectionHeading
          eyebrow="For people who work with people"
          title="Many people. One direction."
          body="When many people are moving toward one goal, conversations get lost. UNIUN keeps notes, decisions, updates, and references connected."
          tone="dark"
          id="movement-title"
        />

        <div className="movement-use-grid">
          {movementUses.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
