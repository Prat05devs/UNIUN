import { cn } from "./utils";

type FloatingNoteCardProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  className?: string;
};

export function FloatingNoteCard({
  eyebrow = "One note",
  title,
  body,
  className
}: FloatingNoteCardProps) {
  return (
    <div className={cn("floating-note-card", className)}>
      <span>{eyebrow}</span>
      <strong>{title}</strong>
      {body ? <p>{body}</p> : null}
    </div>
  );
}
