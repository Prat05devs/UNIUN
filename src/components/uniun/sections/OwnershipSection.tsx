import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { ownership } from "../homeData";
import { reveal, revealViewport } from "../motionConfig";
import { SectionHeading } from "../SectionHeading";

export function OwnershipSection() {
  return (
    <section className="ownership-section light-section" id="ownership">
      <SectionHeading
        eyebrow="Ownership manifesto"
        title="Built for ownership, not addiction."
        body="No forced feed. No unnecessary noise. No platform lock-in. Your notes stay yours."
      />

      <div className="ownership-grid">
        {ownership.map((item) => (
          <motion.article
            key={item}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ ...revealViewport, amount: 0.25 }}
          >
            <ShieldCheck aria-hidden="true" />
            <span>{item}</span>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
