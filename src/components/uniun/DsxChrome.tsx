/* Shared chrome for the new (dsx) design system — the same glass nav and
   footer used on the home page, extracted so every content page (legal,
   support, site map) matches it exactly. Links use absolute "/#…" hrefs so
   the in-page anchors resolve correctly from any route. */
import "./uniun-ds.css";
import { NavAuthButton } from "@/features/auth/component/nav-auth-button";

/* Material Symbols helper (mirrors the one in UniunHome). */
export function Icon({ name }: { name: string }) {
  return (
    <span className="material-symbols-rounded" aria-hidden="true">
      {name}
    </span>
  );
}

const navLinks = [
  { href: "/#vishnu", label: "Feed" },
  { href: "/#graph", label: "Graph" },
  { href: "/#shiv", label: "Shiv AI" },
  { href: "/#sovereign", label: "Sovereignty" },
  { href: "/ai-inference", label: "AI Inference" }
];

export function DsxNav() {
  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-inner">
        <a className="brand" href="/" aria-label="UNIUN home">
          <span className="mark">
            <img src="/assets/uniun_logo.svg" alt="" aria-hidden="true" />
          </span>
          <span className="word">UNIUN</span>
        </a>
        <div className="nav-links">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <NavAuthButton />
          <a className="btn btn-primary btn-sm" href="/#get">
            Join waitlist
          </a>
        </div>
      </div>
    </nav>
  );
}

export function DsxFooter() {
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <a className="brand" href="/">
          <span className="mark">
            <img src="/assets/uniun_logo.svg" alt="" aria-hidden="true" />
          </span>
          <span className="word">UNIUN</span>
        </a>
        <div className="foot-links">
          <a href="/#vishnu">Feed</a>
          <a href="/#graph">Graph</a>
          <a href="/#shiv">Shiv AI</a>
          <a href="/#sovereign">Sovereignty</a>
          <a href="/ai-inference">AI Inference</a>
          <a href="/login">Login</a>
          <a href="/privacy-policy">Privacy</a>
          <a href="/terms-of-service">Terms</a>
          <a href="/support">Support</a>
          <a href="/site-map">Site map</a>
          <a
            href="https://github.com/basictech01/uniun"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
        <span className="muted" style={{ fontSize: ".85rem" }}>
          Your notes, your network, your AI.
        </span>
      </div>
    </footer>
  );
}
