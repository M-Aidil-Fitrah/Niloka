"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type LandingMotionProps = {
  children: ReactNode;
};

export function LandingMotion({ children }: LandingMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTimeline
        .from(".landing-hero", {
          autoAlpha: 0,
          clipPath: "inset(8% 6% 8% 6% round 8px)",
          duration: 1.1,
        })
        .from(
          ".landing-nav",
          {
            autoAlpha: 0,
            y: -18,
            duration: 0.7,
          },
          "-=0.55",
        )
        .from(
          ".hero-reveal, .hero-title, .hero-copy, .hero-actions",
          {
            autoAlpha: 0,
            y: 42,
            duration: 0.85,
            stagger: 0.08,
          },
          "-=0.35",
        )
        .from(
          ".hero-panel",
          {
            autoAlpha: 0,
            rotate: -2,
            scale: 0.92,
            y: 36,
            duration: 0.85,
          },
          "-=0.5",
        );

      gsap.to(".hero-panel", {
        y: -18,
        duration: 3.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.utils.toArray<HTMLElement>(".category-card").forEach((element, index) => {
        gsap.from(element, {
          autoAlpha: 0,
          y: 56,
          rotate: index % 2 === 0 ? -1.5 : 1.5,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".product-card").forEach((element, index) => {
        gsap.from(element, {
          autoAlpha: 0,
          y: 44,
          duration: 0.75,
          delay: index * 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".reveal-block, .metric-card").forEach((element) => {
        gsap.from(element, {
          autoAlpha: 0,
          y: 48,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
          },
        });
      });

      gsap.from(".footer-word", {
        autoAlpha: 0,
        yPercent: 22,
        letterSpacing: "0.08em",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".footer-word",
          start: "top 92%",
        },
      });
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
