"use client";

import { useEffect, useRef, useState } from "react";

/* Material Symbols helper (mirrors UniunHome). */
function Icon({ name }: { name: string }) {
  return (
    <span className="material-symbols-rounded" aria-hidden="true">
      {name}
    </span>
  );
}

type Feature = { icon: string; title: string; body: string };

type Step = {
  id: string;
  num: string;
  label: string;
  img: string;
  alt: string;
  title: string;
  lead: string;
  features: Feature[];
  models?: string[];
  cloud?: { lead: string; models: string[]; href: string; cta: string };
};

/* The three ways to build your Brahman — Brahma · Vishnu · Shiv.
   Anchor ids (graph / vishnu / shiv) are kept so the nav + footer links
   still resolve to these steps. */
const steps: Step[] = [
  {
    id: "graph",
    num: "01",
    label: "Brahma · create",
    img: "/assets/brahma.png",
    alt: "UNIUN knowledge graph — notes and the connections you draw between them",
    title: "Create your own thoughts.",
    lead:
      "Brahma is the act of creation. You author notes and, in authoring them, build the graph — every reference an edge, every note a node in your Brahman.",
    features: [
      { icon: "edit_note", title: "Write notes", body: "the atomic unit of UNIUN — plain thoughts, captured permanently." },
      { icon: "polyline", title: "Draw connections", body: "reference notes as you write; every reference is a graph edge." },
      { icon: "hub", title: "See the graph", body: "an interactive canvas of your Brahman — compose new notes right over it." },
      { icon: "layers", title: "Manas", body: "curate named subsets of notes into focused lenses for your AI." },
      { icon: "draft", title: "Drafts", body: "work in progress that lives only on your device until you publish." }
    ]
  },
  {
    id: "vishnu",
    num: "02",
    label: "Vishnu · share",
    img: "/assets/vishnu_feed.png",
    alt: "UNIUN feed — notes from the people you follow, in time order",
    title: "Take in and share the thoughts of others.",
    lead:
      "Vishnu is the preserver — the social membrane where your Brahman meets everyone else's. Absorb thoughts worth keeping, and offer your own.",
    features: [
      { icon: "dynamic_feed", title: "The Feed", body: "a chronological stream from the people you follow. Time, not an algorithm." },
      { icon: "account_tree", title: "Threads", body: "follow any conversation as a tree of replies — and ask the thread itself." },
      { icon: "tag", title: "Channels", body: "public rooms, plus invite-only private channels with admin-controlled membership." },
      { icon: "lock", title: "Direct messages", body: "end-to-end encrypted; only the recipient is ever visible on the relay." },
      { icon: "bookmark", title: "Saved & followed", body: "keep a thought forever, or subscribe to a note's reference graph." }
    ]
  },
  {
    id: "shiv",
    num: "03",
    label: "Shiv · transform",
    img: "/assets/shiv_home.png",
    alt: "Shiv — the on-device AI assistant grounded in your own notes",
    title: "Churn your thoughts into new ones.",
    lead:
      "Shiv is the transformer — the falling apple. It looks at the Brahman you already have and draws the connections latent in it all along. All of it runs on your device; none of it calls the cloud.",
    features: [
      { icon: "auto_awesome", title: "Shiv chat", body: "talk to your notes or a single Manas, grounded by GraphRAG — branch into a tree." },
      { icon: "style", title: "Nataraj", body: "a swipe-deck that fuses two or three of your notes into a brand-new idea." },
      { icon: "smart_toy", title: "Ganas", body: "autonomous agents that watch a surface, reason over a Manas, and act on a schedule." },
      { icon: "forum", title: "Composer-chat", body: "the same on-device intelligence, inline in every conversation." }
    ],
    models: ["Qwen3 0.6B", "DeepSeek R1 1.5B", "Gemma 4 E2B", "Gemma 4 E4B"],
    cloud: {
      lead: "Need a bigger model? The UNIUN inference gateway serves cloud models too — same chat, your choice of brain:",
      models: ["Claude Fable", "Claude Opus", "GPT-5.5", "GPT-5 mini"],
      href: "/ai-inference",
      cta: "Explore AI inference"
    }
  }
];

/* the body of one pillar — reused by the pinned (cross-fade) layout and the
   stacked mobile layout, so the copy lives in exactly one place. */
function StepBody({ step }: { step: Step }) {
  return (
    <>
      <div className="how-step-head">
        <span className="how-num mono">{step.num}</span>
        <span className="how-tag">{step.label}</span>
      </div>
      <h3 className="h3">{step.title}</h3>
      <p className="how-lead">{step.lead}</p>

      <ul className="how-features">
        {step.features.map((f) => (
          <li key={f.title}>
            <Icon name={f.icon} />
            <span>
              <b>{f.title}</b> — {f.body}
            </span>
          </li>
        ))}
      </ul>

      {step.models ? (
        <>
          <p className="how-models-label muted">
            On-device models, matched to your phone’s RAM:
          </p>
          <div className="how-models">
            {step.models.map((m) => (
              <span className="chip mono" key={m}>
                {m}
              </span>
            ))}
          </div>
        </>
      ) : null}

      {step.cloud ? (
        <>
          <p className="how-models-label muted">{step.cloud.lead}</p>
          <div className="how-models">
            {step.cloud.models.map((m) => (
              <span className="chip chip-tonal mono" key={m}>
                {m}
              </span>
            ))}
          </div>
          <div className="eyrow" style={{ marginTop: 14 }}>
            <a className="btn btn-tinted btn-sm" href={step.cloud.href}>
              <Icon name="cloud" />
              {step.cloud.cta}
            </a>
          </div>
        </>
      ) : null}
    </>
  );
}

function Phone({ step }: { step: Step }) {
  return (
    <div className="phone phone-shot">
      <div className="screen">
        <img
          src={step.img}
          alt={step.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const triggerRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const nodes = triggerRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    // On reduced motion the layout falls back to a static stack (CSS), and the
    // triggers are display:none — so there is nothing to observe.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(idx)) setActive(idx);
        });
      },
      // A 0-height band at the vertical center: exactly one trigger crosses it.
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how" className="how surface-sec">
      <div className="wrap how-head">
        <span className="section-label">
          <Icon name="deployed_code" />
          How UNIUN works
        </span>
        <h2 className="h2">Three ways to build your Brahman.</h2>
        <p className="lead" style={{ maxWidth: "56ch" }}>
          Your knowledge graph grows three ways — named for the trinity that
          creates, sustains, and transforms.
        </p>
      </div>

      <div className="how-scroller">
        {/* pinned viewport — holds BOTH the phone and the text, centered;
            content cross-fades so nothing drifts as you scroll. */}
        <div className="how-viewport">
          <div className="wrap how-grid">
            <div className="how-stage">
              <div className="phone phone-shot how-phone" aria-live="polite">
                <div className="screen">
                  {steps.map((s, i) => (
                    <img
                      key={s.id}
                      src={s.img}
                      alt={s.alt}
                      className={`how-shot${active === i ? " on" : ""}`}
                      aria-hidden={active !== i}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  ))}
                </div>
              </div>
              <div className="how-dots" aria-hidden="true">
                {steps.map((s, i) => (
                  <span key={s.id} className={active === i ? "on" : undefined} />
                ))}
              </div>
            </div>

            <div className="how-texts">
              {steps.map((s, i) => (
                <article
                  key={s.id}
                  id={s.id}
                  className={`how-text${active === i ? " active" : ""}`}
                  aria-hidden={active !== i}
                >
                  <StepBody step={s} />
                  {/* inline phone — shown only on the stacked (mobile) layout */}
                  <div className="how-step-media">
                    <Phone step={s} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* invisible scroll-length providers — one per pillar; the observer
            watches these to drive the active step on desktop. */}
        <div className="how-triggers" aria-hidden="true">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className="how-trigger"
              data-index={i}
              ref={(el) => {
                triggerRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
