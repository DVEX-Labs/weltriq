"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WobbleCard } from "@/components/ui/wobble-card";
import { ServiceData, allServices } from "@/data/services";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ServicesShowcaseProps {
  services?: ServiceData[];
  showViewAll?: boolean;
}

export function ServicesShowcase({
  services = allServices,
  showViewAll = false,
}: ServicesShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stackWrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const accentBarsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!stackWrapperRef.current || services.length === 0) return;

      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      const images = imagesRef.current.filter(Boolean) as HTMLDivElement[];
      const accentBars = accentBarsRef.current.filter(Boolean) as HTMLDivElement[];

      if (cards.length < services.length) return;

      const mm = gsap.matchMedia();

      // Desktop Pinned Scroll-Driven Stack (>= 768px)
      mm.add("(min-width: 768px)", () => {
        // Initial setup for all cards
        cards.forEach((card, index) => {
          if (index === 0) {
            gsap.set(card, { yPercent: 0, y: 0, scale: 1, zIndex: 10, opacity: 1 });
          } else {
            gsap.set(card, { yPercent: 100, y: 0, scale: 1, zIndex: 10 + index, opacity: 1 });
          }
        });

        // Accent bars initial state: card 0 yellow bar opacity 1, others 0
        accentBars.forEach((bar, index) => {
          if (bar) {
            gsap.set(bar, { opacity: index === 0 ? 1 : 0 });
          }
        });

        // Initial image scale for parallax
        images.forEach((img, index) => {
          if (img) {
            gsap.set(img, { scale: index === 0 ? 1.05 : 1.15 });
          }
        });

        /**
         * REUSABLE ANIMATION PACING RULE:
         * The ServicesShowcase animation pacing is mathematically derived from `services.length`.
         * Any future change to card count (5 cards on Home, 10 cards on Services page) automatically preserves
         * consistent per-card transition & holding window pacing without hardcoded values.
         */
        const transitionCount = services.length - 1;
        const pinDistance = transitionCount * 200;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stackWrapperRef.current,
            start: "center center",
            end: `+=${pinDistance}vh`,
            pin: true,
            scrub: 0.8, // Smooth dampening to absorb aggressive mouse wheel flicks
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Loop through card transitions with 45% entrance & 55% active holding plateau
        for (let i = 0; i < transitionCount; i++) {
          const nextCard = cards[i + 1];
          const nextImage = images[i + 1];
          const nextAccentBar = accentBars[i + 1];

          const stepStart = i;
          const moveDuration = 0.45; // 45% entrance movement phase; 0.55 remainder forms resting active holding plateau

          // Next card moves in from bottom
          tl.to(
            nextCard,
            {
              yPercent: 0,
              ease: "none",
              duration: moveDuration,
            },
            stepStart
          );

          if (nextImage) {
            tl.to(
              nextImage,
              {
                scale: 1.05,
                ease: "none",
                duration: moveDuration,
              },
              stepStart
            );
          }

          if (nextAccentBar) {
            tl.to(
              nextAccentBar,
              {
                opacity: 1,
                ease: "none",
                duration: moveDuration * 0.3,
              },
              stepStart
            );
          }

          // Adjust previous cards (k <= i) according to depth refinement:
          // Active card = scale 1, opacity 1
          // Previous card (depth 1): scale 0.96, opacity 0.95
          // 2 cards behind (depth 2): scale 0.93, opacity 0.90
          // 3+ cards behind (depth >= 3): scale 0.90, opacity 0.85
          for (let k = 0; k <= i; k++) {
            const depth = i - k + 1;
            const targetY = -(depth * 14);
            let targetScale = 0.90;
            let targetOpacity = 0.85;

            if (depth === 1) {
              targetScale = 0.96;
              targetOpacity = 0.95;
            } else if (depth === 2) {
              targetScale = 0.93;
              targetOpacity = 0.90;
            }

            tl.to(
              cards[k],
              {
                y: targetY,
                scale: targetScale,
                opacity: targetOpacity,
                ease: "none",
                duration: moveDuration,
              },
              stepStart
            );

            // Fade out top yellow accent bar on inactive background cards
            if (accentBars[k]) {
              tl.to(
                accentBars[k],
                {
                  opacity: 0,
                  ease: "none",
                  duration: moveDuration * 0.3,
                },
                stepStart
              );
            }
          }
        }
      });

      // Mobile Stack (< 768px): Pinned Scroll-Driven Stack with mobile-calibrated pacing
      mm.add("(max-width: 767px)", () => {
        // Initial setup for all cards
        cards.forEach((card, index) => {
          if (index === 0) {
            gsap.set(card, { yPercent: 0, y: 0, scale: 1, zIndex: 10, opacity: 1 });
          } else {
            gsap.set(card, { yPercent: 100, y: 0, scale: 1, zIndex: 10 + index, opacity: 1 });
          }
        });

        // Accent bars initial state
        accentBars.forEach((bar, index) => {
          if (bar) {
            gsap.set(bar, { opacity: index === 0 ? 1 : 0 });
          }
        });

        // Initial image scale for parallax
        images.forEach((img, index) => {
          if (img) {
            gsap.set(img, { scale: index === 0 ? 1.02 : 1.08 });
          }
        });

        const transitionCount = services.length - 1;
        // Calibrated mobile scroll distance: 130vh per card transition for natural touch pacing
        const pinDistance = transitionCount * 130;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stackWrapperRef.current,
            start: "center center",
            end: `+=${pinDistance}vh`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Loop through card transitions
        for (let i = 0; i < transitionCount; i++) {
          const nextCard = cards[i + 1];
          const nextImage = images[i + 1];
          const nextAccentBar = accentBars[i + 1];

          const stepStart = i;
          const moveDuration = 0.45;

          // Next card moves in from bottom
          tl.to(
            nextCard,
            {
              yPercent: 0,
              ease: "none",
              duration: moveDuration,
            },
            stepStart
          );

          if (nextImage) {
            tl.to(
              nextImage,
              {
                scale: 1.02,
                ease: "none",
                duration: moveDuration,
              },
              stepStart
            );
          }

          if (nextAccentBar) {
            tl.to(
              nextAccentBar,
              {
                opacity: 1,
                ease: "none",
                duration: moveDuration * 0.3,
              },
              stepStart
            );
          }

          // Adjust previous cards (k <= i) with calibrated mobile depth
          for (let k = 0; k <= i; k++) {
            const depth = i - k + 1;
            const targetY = -(depth * 8);
            let targetScale = 0.92;
            let targetOpacity = 0.88;

            if (depth === 1) {
              targetScale = 0.96;
              targetOpacity = 0.95;
            } else if (depth === 2) {
              targetScale = 0.94;
              targetOpacity = 0.90;
            }

            tl.to(
              cards[k],
              {
                y: targetY,
                scale: targetScale,
                opacity: targetOpacity,
                ease: "none",
                duration: moveDuration,
              },
              stepStart
            );

            if (accentBars[k]) {
              tl.to(
                accentBars[k],
                {
                  opacity: 0,
                  ease: "none",
                  duration: moveDuration * 0.3,
                },
                stepStart
              );
            }
          }
        }
      });

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef, dependencies: [services] }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-brand-white pt-24 md:pt-36 lg:pt-40 pb-10 md:pb-14 overflow-hidden"
      id="services-showcase"
    >
      <Container className="relative z-10 w-full mb-6 md:mb-8">
        {/* HEADER ZONE - Left aligned matching existing Home Services source of truth */}
        <SectionHeading
          title="Our Services"
          subtitle="Reliable roofing solutions delivered through quality workmanship and professional execution."
        />
      </Container>

      {/* PINNED CARD STACK WRAPPER - Centered in viewport */}
      <div
        ref={stackWrapperRef}
        className="relative w-full min-h-screen flex items-center justify-center py-4 md:py-6"
      >
        <div className="relative w-[92vw] max-w-[1360px] h-[74vh] max-h-[640px] md:h-[72vh] md:max-h-[700px] mx-auto overflow-hidden rounded-md">
          <div className="relative w-full h-full">
            {services.map((service, index) => {
              const isImageLeft = index % 2 !== 0;

              return (
                <div
                  key={service.id}
                  data-service-card={service.id}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className="w-full absolute inset-0 h-full overflow-hidden bg-brand-white group"
                >
                  <WobbleCard 
                    containerClassName="w-full h-full" 
                    className={`w-full h-full flex flex-col ${isImageLeft ? 'md:flex-row-reverse' : 'md:flex-row'} relative overflow-hidden bg-brand-white`}
                  >
                    {/* Content Half (52% on mobile, 55% on desktop) */}
                    <div className="w-full md:w-[55%] h-[52%] md:h-full flex flex-col items-center justify-center p-4 sm:p-8 lg:p-16 text-center order-2 md:order-none bg-brand-white">
                      <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-4 max-w-[95%] md:max-w-md">
                        <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-display text-brand-yellow">
                          {service.number}
                        </span>
                        <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-[clamp(2.5rem,3.5vw,3.5rem)] font-display uppercase leading-tight text-brand-navy tracking-wide break-normal text-balance">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    {/* Image Half (48% on mobile, 45% on desktop) */}
                    <div className="w-full md:w-[45%] h-[48%] md:h-full flex items-center justify-center relative bg-brand-white order-1 md:order-none p-3 sm:p-5 md:p-6 lg:p-8">
                      <div className="relative w-full h-full rounded-md overflow-hidden">
                        <div
                          ref={(el) => {
                            imagesRef.current[index] = el;
                          }}
                          className="absolute inset-0 w-full h-full pointer-events-none"
                        >
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 45vw"
                            className="object-cover object-center"
                            priority={index === 0}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Top Yellow Accent Bar */}
                    <div
                      ref={(el) => {
                        accentBarsRef.current[index] = el;
                      }}
                      className="absolute top-0 left-0 right-0 h-[3px] bg-brand-yellow transition-opacity duration-300 z-20"
                    />
                  </WobbleCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Optional View All Services link for Home page */}
      {showViewAll && (
        <Container className="relative z-20 pt-12 md:pt-16 flex justify-end">
          <Link
            href="/services"
            className="group flex items-center gap-2 text-brand-navy font-semibold uppercase tracking-wider text-sm hover:text-brand-yellow transition-colors shrink-0"
          >
            View All Services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Container>
      )}
    </section>
  );
}
