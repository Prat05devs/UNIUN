"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { productScreens } from "./uniun/homeData";
import { SiteFooter } from "./uniun/SiteFooter";
import { SiteNav } from "./uniun/SiteNav";
import { AiSection } from "./uniun/sections/AiSection";
import { FinalCtaSection } from "./uniun/sections/FinalCtaSection";
import { HeroSection } from "./uniun/sections/HeroSection";
import { MovementSection } from "./uniun/sections/MovementSection";
import { NoteFormsSection } from "./uniun/sections/NoteFormsSection";
import { OwnershipSection } from "./uniun/sections/OwnershipSection";
import { PillarsSection } from "./uniun/sections/PillarsSection";
import { ProductJourneySection } from "./uniun/sections/ProductJourneySection";
import { ThoughtMapSection } from "./uniun/sections/ThoughtMapSection";
import { useUniunHomeMotion } from "./uniun/useUniunHomeMotion";

export function UniunHome() {
  const [activeScreen, setActiveScreen] = useState(productScreens[0].id);
  const rootRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLElement>(null);
  const mapPinRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLElement>(null);
  const journeyPinRef = useRef<HTMLDivElement>(null);
  const activeScreenRef = useRef(activeScreen);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    activeScreenRef.current = activeScreen;
  }, [activeScreen]);

  useUniunHomeMotion({
    rootRef,
    mapRef,
    mapPinRef,
    journeyRef,
    journeyPinRef,
    activeScreenRef,
    setActiveScreen,
    prefersReducedMotion
  });

  return (
    <div ref={rootRef}>
      <div className="scroll-progress" aria-hidden="true" />
      <SiteNav />

      <main id="top">
        <HeroSection />
        <NoteFormsSection />
        <ThoughtMapSection mapRef={mapRef} mapPinRef={mapPinRef} />
        <ProductJourneySection
          activeScreen={activeScreen}
          journeyRef={journeyRef}
          journeyPinRef={journeyPinRef}
        />
        <PillarsSection />
        <MovementSection />
        <AiSection />
        <OwnershipSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
