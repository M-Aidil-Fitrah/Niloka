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
          ".site-nav",
          {
            autoAlpha: 0,
            y: -24,
            duration: 0.7,
          },
          "-=0.55",
        )
        .from(
          ".hero-title, .hero-copy, .hero-actions",
          {
            autoAlpha: 0,
            y: 42,
            duration: 0.85,
            stagger: 0.08,
          },
          "-=0.35",
        );

      gsap.to(".site-nav > div", {
        backgroundColor: "rgba(23, 34, 23, 0.86)",
        borderColor: "rgba(255, 253, 247, 0.26)",
        scrollTrigger: {
          trigger: ".landing-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
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

      gsap.from(".footer-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".footer-line",
          start: "top 92%",
        },
      });

      gsap.fromTo(
        ".footer-word",
        {
          yPercent: 18,
        },
        {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: ".footer-word",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
