import { motion } from "framer-motion";
import { Bot, Hash, MessageCircle, Network, Radio, Split } from "lucide-react";
import { noteForms } from "../homeData";
import { reveal, revealViewport } from "../motionConfig";
import { SectionHeading } from "../SectionHeading";

const formIcons = [MessageCircle, Radio, Split, Network, Hash, Bot];
const chipLabels = ["message", "thread", "graph", "AI context"];

export function NoteFormsSection() {
  return (
    <section className="note-forms light-section" id="note-forms">
      <SectionHeading
        eyebrow="A note is not just a note"
        title="A note can become anything."
        body="One thought can become a message, a post, a reference, a thread, a channel update, a graph node, or context for Shiv."
      />

      <div className="note-transform-chip" aria-label="One note can become many forms">
        <strong>One note</strong>
        <div>
          {chipLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>

      <div className="form-grid">
        {noteForms.map((form, index) => (
          <motion.article
            className="form-card"
            key={form.title}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ ...revealViewport, amount: 0.3 }}
            transition={{ delay: index * 0.04 }}
          >
            <div className="form-card-top">
              <span className="card-icon">{form.number}</span>
              {(() => {
                const Icon = formIcons[index] ?? MessageCircle;
                return <Icon className="form-symbol" aria-hidden="true" />;
              })()}
            </div>

            <div className="form-card-content">
              <span>Can become</span>
              <h3>{form.title}</h3>
              <p>{form.body}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
