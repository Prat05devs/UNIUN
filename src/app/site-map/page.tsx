import type { Metadata } from "next";
import { DsxFooter, DsxNav, Icon } from "../../components/uniun/DsxChrome";

const siteMapGroups = [
  {
    title: "Main",
    links: [
      { href: "/", label: "Home" },
      { href: "/#journey", label: "Product tour" },
      { href: "/#pillars", label: "Brahma Vishnu Shiv" },
      { href: "/#ownership", label: "Ownership" },
      { href: "/#waitlist", label: "Join waitlist" }
    ]
  },
  {
    title: "Account",
    links: [
      { href: "/ai-inference", label: "AI Inference" },
      { href: "/login", label: "Login" }
    ]
  },
  {
    title: "Support",
    links: [
      { href: "/support", label: "Support and contact" },
      { href: "mailto:pranavpandey1998developer@gmail.com", label: "Email support" }
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/child-safety", label: "Child Safety Standards (CSAE)" }
    ]
  },
  {
    title: "Website",
    links: [
      { href: "/site-map", label: "Site Map" },
      { href: "/favicon.png", label: "Favicon" },
      { href: "/apple-touch-icon.png", label: "Apple touch icon" }
    ]
  }
];

export const metadata: Metadata = {
  title: "Site Map",
  description: "A simple site map for UNIUN.",
  alternates: {
    canonical: "/site-map"
  }
};

export default function SiteMapPage() {
  return (
    <div className="dsx" id="top">
      <DsxNav />

      <main>
        <section className="phead">
          <div className="wrap">
            <span className="section-label"><Icon name="account_tree" />Website</span>
            <h1>Site Map</h1>
            <p className="lead" style={{ maxWidth: "52ch" }}>
              A simple list of public pages and key sections on the UNIUN website.
            </p>
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sitemap-grid">
              {siteMapGroups.map((group) => (
                <section key={group.title}>
                  <h2>{group.title}</h2>
                  <ul>
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>

      <DsxFooter />
    </div>
  );
}
