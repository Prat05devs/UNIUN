import "./uniun/uniun-ds.css";

/* Material Symbols helper */
function Icon({ name }: { name: string }) {
  return <span className="material-symbols-rounded" aria-hidden="true">{name}</span>;
}

const navLinks = [
  { href: "#vishnu", label: "Feed" },
  { href: "#graph", label: "Graph" },
  { href: "#shiv", label: "Shiv AI" },
  { href: "#sovereign", label: "Sovereignty" }
];

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
      {/* NAV */}
      <nav className="nav" aria-label="Primary">
        <div className="nav-inner">
          <a className="brand" href="#top" aria-label="UNIUN home">
            <span className="mark"><img src="/assets/uniun_logo.svg" alt="" aria-hidden="true" /></span>
            <span className="word">UNIUN</span>
          </a>
          <div className="nav-links">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>
          <a className="btn btn-primary btn-sm" href="#get">Join waitlist</a>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-aura" aria-hidden="true" />
          <div className="wrap hero-grid">
            <div>
              <span className="section-label"><Icon name="hub" />Decentralized · offline-first · on-device AI</span>
              <h1 className="h-hero">Your decentralized<br />second brain.</h1>
              <p className="lead" style={{ maxWidth: "46ch" }}>
                Capture notes, connect them into a knowledge graph, share on an open network, and ask an
                AI that runs on your phone — <strong>not in someone else’s cloud</strong>.
              </p>
              <div className="eyrow">
                <a className="btn btn-primary" href="#get"><Icon name="bolt" />Join the waitlist</a>
                <a className="btn btn-secondary" href="#vishnu">See how it works</a>
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

        {/* VISHNU */}
        <section id="vishnu" className="surface-sec">
          <div className="wrap">
            <div className="split">
              <div>
                <span className="section-label"><Icon name="forum" />Vishnu · the social layer</span>
                <h2 className="h2">A feed in time, not an algorithm.</h2>
                <p className="lead">
                  Notes from the people you follow, in order — no ranking engine deciding what you think about.
                  And because every message is just a note, channels and DMs behave exactly like your feed.
                </p>
                <div className="eyrow">
                  <span className="e2e"><Icon name="lock" />End-to-end encrypted</span>
                  <span className="chip"><Icon name="account_tree" />Threads, references on top</span>
                  <span className="chip"><Icon name="bookmark" />Save & follow notes</span>
                  <span className="chip"><Icon name="cell_tower" />Add your own relay</span>
                </div>
              </div>
              <div className="split-media"><PhoneShot src="/assets/drawer.png" alt="UNIUN navigation drawer — channels, groups, private spaces, and direct messages" /></div>
            </div>
            <div className="cols-3" style={{ marginTop: "clamp(36px,5vw,60px)" }}>
              <article className="card">
                <div className="card-head"><div className="lhs"><span className="isq"><Icon name="tag" /></span><span className="card-title">Channels</span></div></div>
                <p style={{ marginTop: 12 }}>Public rooms organized by topic. Join by QR or channel id — the first event becomes the permanent room.</p>
              </article>
              <article className="card">
                <div className="card-head"><div className="lhs"><span className="isq"><Icon name="lock" /></span><span className="card-title">Private channels</span></div></div>
                <p style={{ marginTop: 12 }}>Invite-only group spaces, MLS-encrypted, with admin-approved membership and pending requests.</p>
              </article>
              <article className="card">
                <div className="card-head"><div className="lhs"><span className="isq"><Icon name="alternate_email" /></span><span className="card-title">Direct messages</span></div></div>
                <p style={{ marginTop: 12 }}>One-to-one and end-to-end encrypted — only the recipient is ever visible on the relay.</p>
              </article>
            </div>
          </div>
        </section>

        {/* BRAHMA GRAPH */}
        <section id="graph">
          <div className="wrap split rev">
            <div>
              <span className="section-label"><Icon name="hub" />Brahma · the graph</span>
              <h2 className="h2">Your notes, as a graph.</h2>
              <p className="lead">
                Every note is a node; every reference is an edge. Saved, your own, and draft notes form a living
                map you can pan, search, and build on — then scope your AI to any slice of it as a <strong>Manas</strong>.
              </p>
              <div className="eyrow">
                <span className="chip"><Icon name="grain" />Force-graph canvas</span>
                <span className="chip"><Icon name="layers" />Scope to a Manas</span>
                <span className="chip"><Icon name="edit_note" />Compose on the graph</span>
              </div>
            </div>
            <div className="split-media"><PhoneShot src="/assets/brahma.png" alt="UNIUN knowledge graph — saved, own, and draft notes as connected nodes" /></div>
          </div>
        </section>

        {/* SHIV */}
        <section id="shiv" className="surface-sec">
          <div className="wrap split">
            <div>
              <span className="section-label"><Icon name="auto_awesome" />Shiv · on-device AI</span>
              <h2 className="h2">An AI that runs on your phone.</h2>
              <p className="lead">
                Shiv answers from the notes you’ve created and saved — grounded in your own knowledge through GraphRAG.
                Pick a model matched to your phone’s RAM; your thoughts never leave the device.
              </p>
              <div className="chiprow">
                <span className="chip chip-tonal"><Icon name="graph_3" />Grounded in your notes</span>
                <span className="chip"><Icon name="account_tree" />Branch into a tree</span>
                <span className="chip"><Icon name="edit_note" />Inline composer-chat</span>
              </div>
              <p className="muted" style={{ marginTop: 22, fontSize: ".85rem" }}>On-device models, matched to your RAM:</p>
              <div className="chiprow">
                <span className="chip mono">Qwen3 0.6B</span>
                <span className="chip mono">DeepSeek R1 1.5B</span>
                <span className="chip mono">Gemma 4 E2B</span>
                <span className="chip mono">Gemma 4 E4B</span>
              </div>
            </div>
            <div className="split-media"><PhoneShot src="/assets/shiv_home.png" alt="Shiv — the on-device AI assistant home screen" /></div>
          </div>
        </section>

        {/* NATARAJ */}
        <section id="nataraj">
          <div className="wrap split rev">
            <div>
              <span className="section-label"><Icon name="style" />Nataraj · idea fusion</span>
              <h2 className="h2">Make new ideas from old ones.</h2>
              <p className="lead">
                A swipe deck that fuses two or three of your own notes into a brand-new idea. Keep the ones that
                spark and publish them back into your graph as a draft — new thought made from what you already know.
              </p>
              <div className="eyrow">
                <span className="chip"><Icon name="swipe" />Skip · Keep · Discuss</span>
                <span className="chip"><Icon name="shuffle" />Shuffle sources</span>
              </div>
            </div>
            <div className="split-media"><PhoneShot src="/assets/shiv_natraj.png" alt="Nataraj — a new idea composed from referenced notes, ready to publish as a draft" /></div>
          </div>
        </section>

        {/* GANA */}
        <section id="gana" className="surface-sec">
          <div className="wrap">
            <span className="section-label"><Icon name="smart_toy" />Gana · autonomous agents</span>
            <h2 className="h2">Agents that work while you don’t.</h2>
            <p className="lead" style={{ maxWidth: "56ch" }}>
              A Gana watches a surface, reasons over a Manas you assign it, and acts on its own — summarizing,
              curating, or publishing on a schedule. Your mind, reaching into the world without you in the loop.
            </p>
            <div className="cols-2">
              <article className="card">
                <div className="card-head">
                  <div className="lhs"><span className="isq"><Icon name="summarize" /></span>
                    <div><div className="card-title">Daily digest</div><div className="muted" style={{ fontSize: ".82rem" }}>Last run · 8:00 AM</div></div></div>
                  <span className="switch" />
                </div>
                <div className="gana-rows">
                  <div className="gana-row"><Icon name="visibility" />Watches <b>#tech channel</b></div>
                  <div className="gana-row"><Icon name="layers" />Reasons over <b>Work Manas</b></div>
                  <div className="gana-row"><Icon name="schedule" />Every morning</div>
                  <div className="gana-row"><Icon name="send" />Publishes to <b>your feed</b></div>
                </div>
              </article>
              <article className="card">
                <div className="card-head">
                  <div className="lhs"><span className="isq"><Icon name="bookmark_add" /></span>
                    <div><div className="card-title">Saved curator</div><div className="muted" style={{ fontSize: ".82rem" }}>Paused</div></div></div>
                  <span className="switch off" />
                </div>
                <div className="gana-rows">
                  <div className="gana-row"><Icon name="visibility" />Watches <b>Saved notes</b></div>
                  <div className="gana-row"><Icon name="layers" />Reasons over <b>Research Manas</b></div>
                  <div className="gana-row"><Icon name="bolt" />When something new arrives</div>
                  <div className="gana-row"><Icon name="draft" />Saves as a <b>draft</b></div>
                </div>
              </article>
            </div>
          </div>
        </section>

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
              Write a note, connect the context, and ask Shiv. UNIUN is coming to Android, iPhone, and desktop.
            </p>
            <div className="eyrow" style={{ justifyContent: "center" }}>
              <a className="btn btn-primary" href="#"><Icon name="bolt" />Join the waitlist</a>
              <a className="btn btn-secondary" href="https://github.com/basictech01/uniun" target="_blank" rel="noopener noreferrer"><Icon name="code" />View on GitHub</a>
            </div>
            <div className="eyrow" style={{ justifyContent: "center", marginTop: 16 }}>
              <span className="chip"><Icon name="android" />Android · soon</span>
              <span className="chip"><Icon name="phone_iphone" />iPhone · soon</span>
              <span className="chip"><Icon name="desktop_windows" />Desktop · soon</span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="foot">
        <div className="wrap foot-grid">
          <a className="brand" href="#top"><span className="mark"><img src="/assets/uniun_logo.svg" alt="" aria-hidden="true" /></span><span className="word">UNIUN</span></a>
          <div className="foot-links">
            <a href="#vishnu">Feed</a><a href="#graph">Graph</a><a href="#shiv">Shiv AI</a><a href="#sovereign">Sovereignty</a>
            <a href="/privacy-policy">Privacy</a><a href="/terms-of-service">Terms</a><a href="/support">Support</a>
            <a href="https://github.com/basictech01/uniun" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
          <span className="muted" style={{ fontSize: ".85rem" }}>Your notes, your network, your AI.</span>
        </div>
      </footer>
    </div>
  );
}
