"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journeySteps } from "./homeData";

type MotionRef<T> = RefObject<T | null>;

type UseUniunHomeMotionParams = {
  rootRef: MotionRef<HTMLDivElement>;
  mapRef: MotionRef<HTMLElement>;
  mapPinRef: MotionRef<HTMLDivElement>;
  journeyRef: MotionRef<HTMLElement>;
  journeyPinRef: MotionRef<HTMLDivElement>;
  activeScreenRef: { current: string };
  setActiveScreen: (screenId: string) => void;
  prefersReducedMotion: boolean | null;
};

export function useUniunHomeMotion({
  rootRef,
  mapRef,
  mapPinRef,
  journeyRef,
  journeyPinRef,
  activeScreenRef,
  setActiveScreen,
  prefersReducedMotion
}: UseUniunHomeMotionParams) {
  useEffect(() => {
    if (prefersReducedMotion) return;

    const map = mapRef.current;
    const mapPin = mapPinRef.current;
    const journey = journeyRef.current;
    const journeyPin = journeyPinRef.current;
    if (!map || !mapPin || !journey || !journeyPin) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.set(".scroll-progress", {
        transformOrigin: "left center",
        scaleX: 0
      });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          gsap.set(".scroll-progress", { scaleX: self.progress });
        }
      });

      media.add("(min-width: 981px)", () => {
        const paths = gsap.utils.toArray<SVGPathElement>(".thought-map-lines path");
        paths.forEach((path) => {
          const length = path.getTotalLength();
          path.style.strokeDasharray = `${length}`;
          path.style.strokeDashoffset = `${length}`;
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: map,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              pin: mapPin,
              anticipatePin: 1
            }
          })
          .fromTo(
            ".thought-map-note",
            { autoAlpha: 0, y: 34, scale: 0.86 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.2 },
            0.06
          )
          .to(".thought-map-note", { scale: 0.78, y: -36, duration: 0.28 }, 0.25)
          .fromTo(
            ".thought-map-rings span",
            { autoAlpha: 0, scale: 0.82 },
            { autoAlpha: 1, scale: 1, stagger: 0.04, duration: 0.34 },
            0.22
          )
          .to(paths, { strokeDashoffset: 0, stagger: 0.025, duration: 0.34 }, 0.3)
          .fromTo(
            ".thought-map-field .network-node",
            { autoAlpha: 0, scale: 0.35 },
            { autoAlpha: 1, scale: 1, stagger: 0.045, duration: 0.35 },
            0.34
          )
          .fromTo(
            ".thought-map-signal-board",
            { autoAlpha: 0, x: 28 },
            { autoAlpha: 1, x: 0, duration: 0.24 },
            0.5
          )
          .to(".thought-map-grid", { y: 86, opacity: 0.38, duration: 0.8 }, 0)
          .to(".thought-map-glow", { scale: 1.18, opacity: 0.68, duration: 0.8 }, 0);
      });

      media.add("(min-width: 981px)", () => {
        ScrollTrigger.create({
          trigger: journey,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          pin: journeyPin,
          anticipatePin: 1,
          onUpdate: (self) => {
            const index = Math.min(
              journeySteps.length - 1,
              Math.floor(self.progress * journeySteps.length)
            );
            const nextScreen = journeySteps[index].id;

            if (activeScreenRef.current !== nextScreen) {
              activeScreenRef.current = nextScreen;
              setActiveScreen(nextScreen);
            }
          }
        });

        gsap.to(".journey-light-a", {
          x: "34vw",
          y: "18vh",
          opacity: 0.62,
          ease: "none",
          scrollTrigger: {
            trigger: journey,
            start: "top top",
            end: "bottom bottom",
            scrub: true
          }
        });

        gsap.to(".journey-light-b", {
          x: "-28vw",
          y: "-14vh",
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: journey,
            start: "top top",
            end: "bottom bottom",
            scrub: true
          }
        });

        gsap.fromTo(
          ".pillar-card",
          { autoAlpha: 0.42, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".pillars-section",
              start: "top 68%"
            }
          }
        );
      });
    }, rootRef);

    const hashScrollTimeout = window.setTimeout(() => {
      const targetId = window.location.hash.slice(1);
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      ScrollTrigger.refresh();
      const navSafeTop = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-safe-top")
      );
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        (Number.isNaN(navSafeTop) ? 104 : navSafeTop);
      window.scrollTo({ top, behavior: "auto" });
    }, 120);

    return () => {
      window.clearTimeout(hashScrollTimeout);
      media.revert();
      ctx.revert();
    };
  }, [
    activeScreenRef,
    mapPinRef,
    mapRef,
    journeyPinRef,
    journeyRef,
    prefersReducedMotion,
    rootRef,
    setActiveScreen
  ]);
}
