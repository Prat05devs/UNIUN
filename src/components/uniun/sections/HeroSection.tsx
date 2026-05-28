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
        </div>
      </div>
    </section>
  );
}
