import {
  Bell,
  Laptop,
  Smartphone,
  SquareCode,
  type LucideIcon
} from "lucide-react";
import type { ProductScreen } from "../PhoneMockup";

export type NoteForm = {
  title: string;
  body: string;
  number: string;
};

export type JourneyStep = {
  id: string;
  label: string;
  title: string;
  body: string;
};

export type Pillar = {
  name: string;
  action: string;
  body: string;
  image: string;
};

export type DownloadLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  primary?: boolean;
};

export const productScreens: ProductScreen[] = [
  { id: "feed", src: "/assets/screen-feed.jpeg", alt: "UNIUN feed screen" },
  { id: "drawer", src: "/assets/screen-drawer.jpeg", alt: "UNIUN side drawer screen" },
  { id: "thread", src: "/assets/screen-thread.jpeg", alt: "UNIUN thread screen" },
  { id: "graph", src: "/assets/screen-graph.jpeg", alt: "UNIUN graph screen" },
  { id: "shiv", src: "/assets/screen-shiv.jpeg", alt: "UNIUN Shiv assistant screen" },
  { id: "tree", src: "/assets/screen-tree.jpeg", alt: "UNIUN conversation tree screen" }
];

export const noteForms: NoteForm[] = [
  ["Message", "Private updates stay connected to the wider story."],
  ["Public Note", "Share a thought without losing where it came from."],
  ["Thread", "Follow replies, references, and decisions back to source."],
  ["Graph Node", "See ideas as a map, not a timeline that disappears."],
  ["Channel Post", "Organize people and conversations around real work."],
  ["AI Context", "Ask from the knowledge you created and saved."]
].map(([title, body], index) => ({
  title,
  body,
  number: String(index + 1).padStart(2, "0")
}));

export const journeySteps: JourneyStep[] = [
  {
    id: "feed",
    label: "Feed",
    title: "See notes like a living feed.",
    body: "Updates stay simple, readable, and connected to people."
  },
  {
    id: "drawer",
    label: "Channels",
    title: "Organize people into public and private spaces.",
    body: "Channels, saved notes, groups, and DMs stay easy to move through."
  },
  {
    id: "thread",
    label: "Threads",
    title: "Follow every idea back to its source.",
    body: "The story does not vanish when a conversation moves forward."
  },
  {
    id: "graph",
    label: "Graph",
    title: "Watch your knowledge connect.",
    body: "Saved, own, and draft notes form a map of what matters."
  },
  {
    id: "shiv",
    label: "Shiv",
    title: "Ask your own notes.",
    body: "Shiv understands the connected context behind your notes."
  },
  {
    id: "tree",
    label: "Conversation Tree",
    title: "Trace answers, questions, and replies as structure.",
    body: "AI output becomes part of the knowledge network too."
  }
];

export const pillars: Pillar[] = [
  {
    name: "Brahma",
    action: "Create",
    body: "Write notes and connect new ideas.",
    image: "./brahma.svg"
  },
  {
    name: "Vishnu",
    action: "Organize",
    body: "Keep feeds, channels, DMs, and groups structured.",
    image: "./vishnu.svg"
  },
  {
    name: "Shiv",
    action: "Reflect",
    body: "Ask questions from your own connected knowledge.",
    image: "./shiva.svg"
  }
];

export const ownership = [
  "Offline-first",
  "Open source",
  "No forced algorithm",
  "Notification-free",
  "Add relay",
  "Bring your own backend",
  "Key management"
];

export const downloadLinks: DownloadLink[] = [
  { label: "Join waitlist", href: "#waitlist", icon: Bell, primary: true },
  { label: "Android coming soon", href: "#waitlist", icon: Smartphone },
  { label: "iPhone coming soon", href: "#waitlist", icon: Smartphone },
  { label: "Desktop coming soon", href: "#waitlist", icon: Laptop },
  { label: "GitHub coming soon", href: "#waitlist", icon: SquareCode }
];
