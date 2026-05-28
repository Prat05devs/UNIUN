const navLinks = [
  { href: "#journey", label: "Product" },
  { href: "#pillars", label: "Brahma Vishnu Shiv" },
  { href: "#ownership", label: "Ownership" }
];

export function SiteNav() {
  return (
    <header className="site-nav" aria-label="Primary">
      <a className="brand" href="#top" aria-label="UNIUN home">
        <img className="brand-logo" src="/assets/uniun_logo.png" alt="" aria-hidden="true" />
        <span>UNIUN</span>
      </a>
      <nav className="nav-links" aria-label="Page sections">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a className="nav-cta" href="#waitlist">
        Join waitlist
      </a>
    </header>
  );
}
