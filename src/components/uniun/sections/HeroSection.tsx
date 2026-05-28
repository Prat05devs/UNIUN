import { ArrowDown, Bell, SquareCode } from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero-sequence" aria-labelledby="hero-title">
      <div className="hero-pin">
        <div className="cinema-field" aria-hidden="true">
          <video className="hero-video" autoPlay muted loop playsInline preload="metadata">
            <source src="/Scene.mov" type="video/mp4" />
          </video>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">A living network for thought</p>
          <h1 id="hero-title">Your notes. Your network. Your AI.</h1>
          <p>
            UNIUN helps you write, connect, organize, and ask from your own
            knowledge - privately, locally, and in your control.
          </p>

          <div className="hero-actions" aria-label="UNIUN actions">
            <a className="primary" href="#waitlist">
              <Bell aria-hidden="true" />
              Join waitlist
            </a>
            <a href="#waitlist">
              <SquareCode aria-hidden="true" />
              GitHub soon
            </a>
          </div>
        </div>

        <a className="scroll-cue" href="#note-forms">
          <span>Scroll to see how one note becomes a network</span>
          <ArrowDown aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
