"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { journeySteps } from "./homeData";

type MotionRef<T> = RefObject<T | null>;

type UseUniunHomeMotionParams = {
  rootRef: MotionRef<HTMLDivElement>;
  journeyRef: MotionRef<HTMLElement>;
  journeyPinRef: MotionRef<HTMLDivElement>;
  activeScreenRef: { current: string };
  setActiveScreen: (screenId: string) => void;
  prefersReducedMotion: boolean | null;
};

export function useUniunHomeMotion({
  rootRef,
  journeyRef,
  journeyPinRef,
  activeScreenRef,
  setActiveScreen,
  prefersReducedMotion
}: UseUniunHomeMotionParams) {
  useEffect(() => {
    const journey = journeyRef.current;
    const journeyPin = journeyPinRef.current;
    if (!journey || !journeyPin) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    let lenis: Lenis | null = null;
    let rafId = 0;
    const refreshScroll = () => ScrollTrigger.refresh();
    const images = Array.from(rootRef.current?.querySelectorAll("img") ?? []);

    if (!prefersReducedMotion) {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        touchMultiplier: 1.08,
        lerp: 0.12
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };

      rafId = window.requestAnimationFrame(raf);
      lenis.on("scroll", ScrollTrigger.update);
    }

    window.addEventListener("load", refreshScroll);
    images.forEach((image) => {
      if (!image.complete) image.addEventListener("load", refreshScroll, { once: true });
    });

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      media.add("(min-width: 1024px)", () => {
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

      media.add("(min-width: 768px) and (max-width: 1023px)", () => {
        gsap.fromTo(
          ".journey-step",
          { autoAlpha: 0.45, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: journey,
              start: "top 70%"
            }
          }
        );
      });

      media.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".note-step, .mobile-reel-step, .manifesto-lines p").forEach(
          (item) => {
            gsap.fromTo(
              item,
              { autoAlpha: 0, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.64,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: item,
                  start: "top 82%"
                }
              }
            );
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
      window.removeEventListener("load", refreshScroll);
      images.forEach((image) => image.removeEventListener("load", refreshScroll));
      if (rafId) window.cancelAnimationFrame(rafId);
      lenis?.destroy();
      media.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ctx.revert();
    };
  }, [
    activeScreenRef,
    journeyPinRef,
    journeyRef,
    prefersReducedMotion,
    rootRef,
    setActiveScreen
  ]);
}
