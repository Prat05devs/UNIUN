import type { CSSProperties, RefObject } from "react";

type ThoughtMapSectionProps = {
  mapRef: RefObject<HTMLElement | null>;
  mapPinRef: RefObject<HTMLDivElement | null>;
};

const thoughtMapPaths = [
  "M450 310 C360 250 260 245 180 315",
  "M450 310 C510 220 610 190 720 240",
  "M450 310 C540 370 625 420 720 390",
  "M450 310 C390 390 300 430 205 405",
  "M450 310 C468 232 430 165 365 110"
];

const thoughtMapNodes = [
  { label: "draft", x: 20, y: 51, tone: "green" },
  { label: "channel", x: 80, y: 39, tone: "blue" },
  { label: "saved", x: 80, y: 63, tone: "blue" },
  { label: "thread", x: 23, y: 65, tone: "green" },
  { label: "DM", x: 41, y: 18, tone: "orange" }
];

const thoughtMapSignals = [
  { label: "Linked notes", value: "05" },
  { label: "Channels", value: "02" },
  { label: "Shiv context", value: "Ready" }
];

export function ThoughtMapSection({ mapRef, mapPinRef }: ThoughtMapSectionProps) {
  return (
    <section ref={mapRef} className="thought-map-section" aria-labelledby="thought-map-title">
      <div ref={mapPinRef} className="thought-map-pin">
        <div className="thought-map-copy">
          <p className="eyebrow">From private draft to shared context</p>
          <h2 id="thought-map-title">Watch one note become a living map.</h2>
          <p>
            A private idea can branch into saved thoughts, channels, threads,
            direct messages, and AI context without losing where it started.
          </p>
        </div>

        <div className="thought-map-field" aria-hidden="true">
          <div className="thought-map-grid" />

          <div className="thought-map-canvas">
            <div className="thought-map-glow" />
            <div className="thought-map-rings">
              <span />
              <span />
              <span />
            </div>

            <div className="thought-map-note">
              <div className="thought-map-note-top">
                <span>private draft</span>
                <small>12:42</small>
              </div>
              <strong>Meeting plan</strong>
              <p>Five linked ideas becoming a shared map.</p>
              <div className="thought-map-note-links">
                <span />
                <span />
                <span />
              </div>
            </div>

            <svg className="thought-map-lines" viewBox="0 0 900 620" role="presentation">
              {thoughtMapPaths.map((path) => (
                <path d={path} key={path} />
              ))}
            </svg>

            {thoughtMapNodes.map((node) => (
              <div
                className={`network-node ${node.tone}`}
                key={node.label}
                style={
                  {
                    "--x": `${node.x}%`,
                    "--y": `${node.y}%`
                  } as CSSProperties
                }
              >
                <span>{node.label}</span>
              </div>
            ))}

            <div className="thought-map-signal-board">
              {thoughtMapSignals.map((signal) => (
                <div key={signal.label}>
                  <span>{signal.label}</span>
                  <strong>{signal.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
