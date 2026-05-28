import { pillars } from "../homeData";
import { SectionHeading } from "../SectionHeading";

export function PillarsSection() {
  return (
    <section className="pillars-section" id="pillars" aria-labelledby="pillars-title">
      <SectionHeading
        eyebrow="Built around three simple actions"
        title="Create. Organize. Reflect."
        body="Inspired by creation, preservation, and reflection - designed for everyone."
        id="pillars-title"
      />

      <div className="pillar-cinema">
        {pillars.map(({ name, action, body, icon: Icon }) => (
          <article
            className="pillar-card"
            key={name}
          >
            <Icon aria-hidden="true" />
            <small>{name}</small>
            <h3>{action}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
