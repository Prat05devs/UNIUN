import type { Metadata } from "next";
import { SiteFooter } from "../../components/uniun/SiteFooter";
import { SiteNav } from "../../components/uniun/SiteNav";

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
    title: "Support",
    links: [
      { href: "/support", label: "Support and contact" },
      { href: "mailto:Pranavpandey1998developer@gmail.com", label: "Email support" }
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" }
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
    <div className="plain-page">
      <SiteNav />

      <main className="plain-document plain-sitemap" id="top">
        <p className="plain-kicker">Website</p>
        <h1>Site Map</h1>
        <p className="plain-updated">
          A simple list of public pages and key sections on the UNIUN website.
        </p>

        <div className="site-map-list">
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
      </main>

      <SiteFooter />
    </div>
  );
}
