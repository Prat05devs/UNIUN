import "./uniun/uniun-ds.css";
import { DsxFooter, DsxNav } from "./uniun/DsxChrome";
import { HowItWorks } from "./uniun/HowItWorks";

/* Material Symbols helper */
function Icon({ name }: { name: string }) {
  return <span className="material-symbols-rounded" aria-hidden="true">{name}</span>;
}

const noteForms = [
  { icon: "forum", label: "Feed post", tonal: true },
  { icon: "account_tree", label: "Thread" },
  { icon: "hub", label: "Graph node" },
  { icon: "tag", label: "Channel" },
  { icon: "lock", label: "Encrypted DM" },
  { icon: "auto_awesome", label: "AI context" }
];

const pillars = [
  {
    glyph: "/brahma.svg",
    role: "Brahma · Create",
    title: "Write & connect",
    body: "Author notes and build your knowledge graph on an interactive canvas. Every reference you draw is an edge."
  },
  {
    glyph: "/vishnu.svg",
    role: "Vishnu · Reflect",
    title: "Feed & messages",
    body: "Follow people in a time-ordered feed, join channels, and message end-to-end encrypted — the social side."
  },
  {
    glyph: "/shiva.svg",
    role: "Shiv · Transform",
    title: "Your on-device AI",
    body: "Chat with your own notes, fuse ideas with Nataraj, and run autonomous Gana agents — all on your phone."
  }
];

const sovereignty = [
  { icon: "cloud_off", title: "Offline-first", body: "Works without a connection." },
  { icon: "code", title: "Open source", body: "Auditable, no black box." },
  { icon: "block", title: "No algorithm", body: "Time, not engagement." },
  { icon: "history_toggle_off", title: "No forced delete", body: "Notes live on the network." },
  { icon: "lock", title: "MLS-encrypted", body: "Private channels & DMs." },
  { icon: "cell_tower", title: "Bring your relay", body: "Run your own backend." },
  { icon: "smartphone", title: "On-device AI", body: "Thoughts never leave." },
  { icon: "notifications_off", title: "Notification-free", body: "Calm by design." }
];

/* Real app screenshot inside the device frame. Screenshots ship with their own
   status bar + notch, so we drop the CSS notch and let the image fill the screen. */
function PhoneShot({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  return (
    <div className="phone phone-shot">
      <div className="screen">
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  );
}

export function UniunHome() {
  return (
    <div className="dsx" id="top">
      {/* NAV — shared chrome, same as every other page */}
      <DsxNav />

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-aura" aria-hidden="true" />
          <div className="wrap hero-grid">
            <div>
              <span className="section-label"><Icon name="hub" />Decentralized · offline-first · on-device AI</span>
              <h1 className="h-hero">Give your Knowledge<br />an Avatar.</h1>
              <p className="lead" style={{ maxWidth: "46ch" }}>
                Capture notes, connect them into a knowledge graph, share on an open network, and ask an
                AI that runs on your phone — <strong>not in someone else’s cloud</strong>.
              </p>
              <div className="eyrow">
                <a className="btn btn-primary" href="#get"><Icon name="bolt" />Join the waitlist</a>
                <a className="btn btn-secondary" href="#how">See how it works</a>
              </div>
              <div className="trust">
                <span><Icon name="lan" />Built on Nostr</span>
                <span><Icon name="lock" />MLS-encrypted</span>
                <span><Icon name="vpn_key" />Your keys, your data</span>
              </div>
            </div>
            <div className="split-media"><PhoneShot src="/assets/vishnu_feed.png" alt="UNIUN feed — notes from the people you follow, in time order" eager /></div>
          </div>
        </section>

        {/* ONE PRIMITIVE */}
        <section id="product" className="surface-sec">
          <div className="wrap">
            <span className="section-label"><Icon name="note_stack" />One primitive</span>
            <h2 className="h2">It all starts with a note.</h2>
            <p className="lead" style={{ maxWidth: "54ch" }}>
              A note is the atom of UNIUN. The same note becomes a feed post, a thread, a node in your graph,
              a channel message, a DM, or context for your AI — and it’s never lost.
            </p>
            <div className="eyrow">
              {noteForms.map((f) => (
                <span className={`chip${f.tonal ? " chip-tonal" : ""}`} key={f.label}>
                  <Icon name={f.icon} />{f.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* TRIMURTI */}
        <section>
          <div className="wrap">
            <span className="section-label"><Icon name="deployed_code" />Brahma · Vishnu · Shiv</span>
            <h2 className="h2">Create. Reflect. Transform.</h2>
            <p className="lead" style={{ maxWidth: "50ch" }}>
              Three surfaces, one mind — named for the trinity that creates, sustains, and transforms.
            </p>
            <div className="cols-3">
              {pillars.map((p) => (
                <article className="card pillar" key={p.role}>
                  <span className="isq"><img src={p.glyph} alt="" /></span>
                  <div className="role">{p.role}</div>
                  <h3 className="h3">{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS — pinned walkthrough */}
        <HowItWorks />

        {/* SOVEREIGNTY */}
        <section id="sovereign">
          <div className="wrap">
            <span className="section-label"><Icon name="shield_lock" />Sovereignty by default</span>
            <h2 className="h2">Notes are forever. You hold the keys.</h2>
            <p className="lead" style={{ maxWidth: "56ch" }}>
              UNIUN never publishes a deletion — nothing erases a note from the network. No company sits between
              you and your data, and your identity is a keypair only you control.
            </p>
            <div className="card" style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", background: "var(--ds-surface-low)" }}>
              <span className="material-symbols-rounded" style={{ color: "var(--primary)" }} aria-hidden="true">vpn_key</span>
              <span className="muted" style={{ fontSize: ".85rem" }}>Your avatar is your key</span>
              <code className="mono" style={{ fontSize: ".9rem", color: "var(--text-secondary)" }}>npub1q…7f3kx</code>
            </div>
            <div className="cols-4">
              {sovereignty.map((s) => (
                <div className="sov" key={s.title}>
                  <Icon name={s.icon} />
                  <b>{s.title}</b>
                  <span>{s.body}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BRAND MOMENT */}
        <section className="surface-sec" style={{ textAlign: "center" }}>
          <div className="wrap" style={{ maxWidth: 760 }}>
            <p className="brandline">“A copy of your mind is only as good as the thoughts you keep — so keep them in a place you own.”</p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="get">
          <div className="wrap center-narrow">
            <span className="section-label" style={{ justifyContent: "center" }}><Icon name="edit_note" />Start with one note</span>
            <h2 className="h2">Build your network. Grow your knowledge.</h2>
            <p className="lead" style={{ margin: "16px auto 0", maxWidth: "50ch" }}>
              Write a note, connect the context, and ask Shiv. UNIUN is live on iPhone — Android and desktop are coming.
            </p>
            <div className="eyrow" style={{ justifyContent: "center" }}>
              <a className="btn btn-primary" href="#"><Icon name="bolt" />Join the waitlist</a>
              <a className="btn btn-secondary" href="https://github.com/basictech01/uniun" target="_blank" rel="noopener noreferrer"><Icon name="code" />View on GitHub</a>
            </div>
            <div className="eyrow" style={{ justifyContent: "center", marginTop: 16 }}>
              <span className="chip"><Icon name="android" />Android · soon</span>
              <a
                className="chip chip-tonal"
                href="https://apps.apple.com/in/app/uniun/id6778077321"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="phone_iphone" />iPhone · on the App Store
              </a>
              <span className="chip"><Icon name="desktop_windows" />Desktop · soon</span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER — shared chrome, same as every other page */}
      <DsxFooter />
    </div>
  );
}
