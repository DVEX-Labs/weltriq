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

const values = [
  {
    number: "01",
    title: "CLARITY",
    description: "Clear understanding of requirements and scope.",
  },
  {
    number: "02",
    title: "ACCOUNTABILITY",
    description: "One accountable partner throughout the project.",
  },
  {
    number: "03",
    title: "QUALITY CONTROL",
    description: "Structured attention to quality throughout execution.",
  },
  {
    number: "04",
    title: "COORDINATION",
    description: "Professional coordination of planning, materials and workforce.",
  },
  {
    number: "05",
    title: "PROFESSIONAL EXECUTION",
    description: "Organized execution from planning through completion.",
  },
];

export function WhyWeltriq() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const items = itemsRef.current.filter(Boolean);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });

      if (headingRef.current) {
        tl.from(headingRef.current, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        }, 0);
      }

      if (items.length > 0) {
        tl.from(items, {
          y: 22,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        }, 0.15);
      }
    },
    { scope: containerRef }
  );

  return (
    <Section className="bg-brand-navy text-brand-white border-b border-white/5 py-20 md:py-28">
      <Container>
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column - Heading Block */}
          <div ref={headingRef} className="lg:col-span-5 space-y-6">
            <span className="text-brand-yellow font-display uppercase tracking-widest text-xs md:text-sm font-bold block">
              WHY WELTRIQ
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display uppercase leading-[1.08] text-brand-white tracking-wide break-normal hyphens-none">
              PROFESSIONALLY MANAGED ROOFING.
            </h2>
            <p className="text-lg md:text-xl text-brand-white/80 text-balance leading-relaxed font-sans">
              With one accountable partner from planning to completion.
            </p>
          </div>

          {/* Right Column - Editorial Principles List */}
          <div className="lg:col-span-7 flex flex-col space-y-8 lg:pt-2">
            {values.map((value, index) => (
              <div
                key={value.title}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                className="group relative border-l-2 border-white/10 hover:border-brand-yellow pl-6 md:pl-8 py-3 transition-colors duration-300 rounded-r-sm hover:bg-white/[0.02]"
              >
                {/* Active Accent Line */}
                <div className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-brand-yellow scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />

                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-xs md:text-sm font-display font-semibold uppercase tracking-widest text-brand-yellow">
                    {value.number}
                  </span>
                  <h3 className="text-xl md:text-2xl font-display font-bold uppercase tracking-wide text-brand-white">
                    {value.title}
                  </h3>
                </div>

                <p className="text-base md:text-lg text-brand-white/70 leading-relaxed font-sans text-balance">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
