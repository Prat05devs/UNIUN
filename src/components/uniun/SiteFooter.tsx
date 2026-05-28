import {
  BookOpen,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
  SquareCode,
  Users,
  type LucideIcon
} from "lucide-react";

type FooterColumn = {
  title: string;
  links: Array<{ href: string; label: string }>;
};

type SocialLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { href: "#journey", label: "Product tour" },
      { href: "#pillars", label: "Brahma Vishnu Shiv" },
      { href: "#ownership", label: "Ownership" },
      { href: "#top", label: "Start again" }
    ]
  },
  {
    title: "Workspace",
    links: [
      { href: "#journey", label: "Notes" },
      { href: "#journey", label: "Channels" },
      { href: "#journey", label: "Graph" },
      { href: "#journey", label: "Shiv AI" }
    ]
  },
  {
    title: "Community",
    links: [
      { href: "#ownership", label: "Open source" },
      { href: "#ownership", label: "Decentralized" },
      { href: "#ownership", label: "Bring your backend" },
      { href: "#ownership", label: "Your keys" }
    ]
  }
];

const socialLinks: SocialLink[] = [
  { href: "mailto:hello@uniun.app", label: "Email", icon: Mail },
  { href: "#community", label: "Community", icon: Users },
  { href: "#waitlist", label: "Code", icon: SquareCode },
  { href: "#updates", label: "Updates", icon: Send }
];

const trustItems = [
  { icon: ShieldCheck, label: "Offline-first" },
  { icon: BookOpen, label: "Open source" },
  { icon: MessageCircle, label: "Context-aware AI" }
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-watermark" aria-hidden="true">
          UNIUN
        </div>

        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo-row">
              <img src="/assets/uniun_logo.png" alt="" aria-hidden="true" />
              <strong>UNIUN</strong>
            </div>
            <p>
              UNIUN helps people turn notes, conversations, tasks, and AI context
              into a workspace that stays connected.
            </p>

            <div className="footer-socials" aria-label="Social links">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a href={href} aria-label={label} key={label}>
                  <Icon aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-columns">
            {footerColumns.map((column) => (
              <nav aria-label={column.title} className="footer-column" key={column.title}>
                <strong>{column.title}</strong>
                {column.links.map((link) => (
                  <a href={link.href} key={link.label}>
                    {link.label}
                  </a>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="footer-trust" aria-label="UNIUN principles">
          {trustItems.map(({ icon: Icon, label }) => (
            <span key={label}>
              <Icon aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© 2026 UNIUN. All rights reserved.</p>
          <div>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
