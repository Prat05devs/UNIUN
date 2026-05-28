import type { RefObject } from "react";
import { PhoneMockup } from "../../PhoneMockup";
import { journeySteps, productScreens } from "../homeData";
import { SectionHeading } from "../SectionHeading";
import { cn } from "../utils";

type ProductJourneySectionProps = {
  activeScreen: string;
  journeyRef: RefObject<HTMLElement | null>;
  journeyPinRef: RefObject<HTMLDivElement | null>;
};

export function ProductJourneySection({
  activeScreen,
  journeyRef,
  journeyPinRef
}: ProductJourneySectionProps) {
  return (
    <section
      ref={journeyRef}
      className="journey-section"
      id="journey"
      aria-labelledby="journey-title"
    >
      <div ref={journeyPinRef} className="journey-sticky">
        <div className="journey-ambient" aria-hidden="true">
          <span className="journey-light journey-light-a" />
          <span className="journey-light journey-light-b" />
        </div>

        <div className="journey-stage">
          <div className="journey-text">
            <SectionHeading
              eyebrow="From thought to network"
              title="The product changes as the story grows."
              id="journey-title"
              tone="dark"
            />

            <div className="journey-copy">
              {journeySteps.map((step, index) => (
                <article
                  aria-hidden={activeScreen !== step.id}
                  key={step.id}
                  className={cn("journey-step", activeScreen === step.id && "active")}
                >
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <span>{step.label}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="phone-showcase-wrap">
            <div className="phone-showcase" aria-live="polite">
              <PhoneMockup screens={productScreens} activeId={activeScreen} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
