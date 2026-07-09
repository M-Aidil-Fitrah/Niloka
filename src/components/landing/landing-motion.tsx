"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type LandingMotionProps = {
  children: ReactNode;
};

export function LandingMotion({ children }: LandingMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const previousScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return () => {
          window.history.scrollRestoration = previousScrollRestoration;
        };
      }

      const lenis = new Lenis({
        duration: 1.08,
        easing: (time: number) => Math.min(1, 1.001 - 2 ** (-10 * time)),
        smoothWheel: true,
        orientation: "vertical",
      });
      const cleanupAnchorLinks: Array<() => void> = [];
      const updateLenis = (time: number) => {
        lenis.raf(time * 1000);
      };

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);

      gsap.utils.toArray<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
        const scrollToAnchor = (event: MouseEvent) => {
          const targetId = anchor.getAttribute("href");

          if (!targetId || targetId === "#") {
            return;
          }

          event.preventDefault();
          lenis.scrollTo(targetId, {
            offset: -16,
          });
        };

        anchor.addEventListener("click", scrollToAnchor);
        cleanupAnchorLinks.push(() => {
          anchor.removeEventListener("click", scrollToAnchor);
        });
      });

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

      gsap.fromTo(
        ".site-nav-surface",
        {
          backdropFilter: "blur(0px)",
          backgroundColor: "rgba(23, 34, 23, 0)",
          borderColor: "rgba(255, 253, 247, 0)",
          boxShadow: "0 0 0 rgba(23, 34, 23, 0)",
        },
        {
          backdropFilter: "blur(18px)",
          backgroundColor: "rgba(23, 34, 23, 0.2)",
          borderColor: "rgba(255, 253, 247, 0.18)",
          boxShadow: "0 12px 36px rgba(23, 34, 23, 0.1)",
          ease: "none",
          scrollTrigger: {
            trigger: ".landing-hero",
            start: "top+=18 top",
            end: "+=170",
            scrub: true,
          },
        },
      );

      gsap.to(".hero-card img", {
        yPercent: 8,
        scale: 1.04,
        ease: "none",
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

      gsap.utils.toArray<HTMLElement>(".review-card").forEach((element, index) => {
        gsap.from(element, {
          autoAlpha: 0,
          y: 36,
          duration: 0.8,
          delay: index * 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
          },
        });
      });

      gsap.from(".footer-word-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".footer-parallax",
          start: "top 92%",
        },
      });

      gsap.fromTo(
        ".footer-parallax",
        {
          yPercent: 14,
        },
        {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: ".footer-parallax",
            start: "top 96%",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      return () => {
        cleanupAnchorLinks.forEach((cleanup) => {
          cleanup();
        });
        gsap.ticker.remove(updateLenis);
        lenis.destroy();
        window.history.scrollRestoration = previousScrollRestoration;
      };
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
