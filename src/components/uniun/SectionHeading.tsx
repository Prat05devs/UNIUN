import { motion } from "framer-motion";
import { reveal, revealViewport } from "./motionConfig";
import { cn } from "./utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  body?: string;
  id?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  id,
  align = "left",
  tone = "light",
  className
}: SectionHeadingProps) {
  return (
    <motion.div
      className={cn(
        "section-copy",
        align === "center" && "center-copy",
        tone === "dark" && "dark-copy",
        className
      )}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {body ? <p>{body}</p> : null}
    </motion.div>
  );
}
