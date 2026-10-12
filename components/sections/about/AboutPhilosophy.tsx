"use client";

import React, { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const pillars = [
  {
    step: "01",
    title: "DEFINE",
  },
  {
    step: "02",
    title: "DESIGN",
  },
  {
    step: "03",
    title: "DELIVER",
  },
];

export function AboutPhilosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stagesRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const stages = stagesRef.current.filter(Boolean);
      const header = headerRef.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          once: true,
          invalidateOnRefresh: true,
        },
        onComplete: () => {
          if (header) gsap.set(header, { clearProps: "all" });
          if (stages.length > 0) gsap.set(stages, { clearProps: "all" });
        },
      });

      if (header) {
        tl.fromTo(
          header,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
          0
        );
      }

      if (stages.length > 0) {
        tl.fromTo(
          stages,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" },
          0.15
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <Section className="relative bg-brand-white text-brand-navy border-b border-brand-navy/10 py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Subtle Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c153305_1px,transparent_1px),linear-gradient(to_bottom,#0c153305_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      <Container className="relative z-10">
        <div ref={containerRef} className="max-w-5xl mx-auto">
          {/* Header Zone */}
          <div
            ref={headerRef}
            className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-14 space-y-4"
          >
            <span className="text-xs font-display uppercase tracking-widest font-bold text-brand-yellow bg-brand-yellow/10 px-4 py-1.5 rounded-full border border-brand-yellow/20 inline-block">
              BRAND PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase leading-[1.08] text-brand-navy tracking-wide">
              EVERY PROJECT STARTS WITH PURPOSE
            </h2>
          </div>

          {/* Editorial 3-Stage Connected Structure */}
          <div className="relative">
            {/* Static Desktop Horizontal Architectural Connector Line */}
            <div className="hidden md:block absolute top-[28px] left-[18%] right-[18%] h-[1px] bg-brand-navy/15 pointer-events-none z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 relative z-10 items-start">
              {pillars.map((pillar, index) => (
                <React.Fragment key={pillar.step}>
                  <div
                    ref={(el) => {
                      stagesRef.current[index] = el;
                    }}
                    className="group relative flex flex-col items-center md:items-start text-center md:text-left"
                  >
                    {/* Stage Number Node */}
                    <div className="relative z-10 bg-brand-white pr-4 md:pr-6 mb-3">
                      <span className="text-3xl md:text-4xl font-display font-extrabold text-brand-yellow group-hover:scale-105 transition-transform duration-300 block">
                        {pillar.step}
                      </span>
                    </div>

                    {/* Subtle Accent Line */}
                    <div className="h-[2px] w-12 bg-brand-yellow/50 group-hover:w-20 group-hover:bg-brand-yellow transition-all duration-300 mb-5" />

                    {/* Stage Title */}
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold uppercase text-brand-navy tracking-wider group-hover:translate-x-1.5 transition-transform duration-300 leading-tight">
                      {pillar.title}
                    </h3>
                  </div>

                  {/* Static Mobile Vertical Connector Line */}
                  {index < pillars.length - 1 && (
                    <div className="md:hidden w-[1px] h-8 bg-brand-yellow/30 mx-auto -my-4 pointer-events-none" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
