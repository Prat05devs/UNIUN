import { motion } from "framer-motion";
import { noteForms } from "../homeData";
import { reveal, revealViewport } from "../motionConfig";
import { SectionHeading } from "../SectionHeading";

export function NoteFormsSection() {
  return (
    <section className="note-forms light-section">
      <SectionHeading
        eyebrow="A note is not just a note"
        title="A note can become anything."
        body="One thought can become a message, a post, a reference, a thread, a channel update, a graph node, or context for Shiv."
      />

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
            <span className="card-icon">{form.number}</span>
            <h3>{form.title}</h3>
            <p>{form.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
