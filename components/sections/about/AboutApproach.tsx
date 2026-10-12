"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRight, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const principles = [
  {
    number: "01",
    phase: "PRINCIPLE 01 / 05",
    title: "CLARITY",
    description: "Clear understanding of requirements and scope.",
  },
  {
    number: "02",
    phase: "PRINCIPLE 02 / 05",
    title: "ACCOUNTABILITY",
    description: "One accountable partner throughout the project.",
  },
  {
    number: "03",
    phase: "PRINCIPLE 03 / 05",
    title: "QUALITY CONTROL",
    description: "Structured attention to quality throughout execution.",
  },
  {
    number: "04",
    phase: "PRINCIPLE 04 / 05",
    title: "COORDINATION",
    description: "Professional coordination of planning, materials and workforce.",
  },
  {
    number: "05",
    phase: "PRINCIPLE 05 / 05",
    title: "PROFESSIONAL EXECUTION",
    description: "Organized execution from planning through completion.",
  },
];

export function AboutApproach() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const header = headerRef.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          once: true,
          invalidateOnRefresh: true,
        },
        onComplete: () => {
          if (header) gsap.set(header, { clearProps: "all" });
        },
      });

      if (header) {
        tl.fromTo(
          header,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          0
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <Section className="relative bg-brand-island-spice border-b border-brand-navy/5 py-16 md:py-24 lg:py-28 overflow-hidden">
      {/* Subtle Background Architectural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c153305_1px,transparent_1px),linear-gradient(to_bottom,#0c153305_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <Container className="relative z-10">
        <div ref={containerRef}>
          {/* Top Center Section Header */}
          <div
            ref={headerRef}
            className="mb-12 md:mb-16 lg:mb-20 text-center max-w-3xl mx-auto space-y-3"
          >
            <span className="text-xs font-display uppercase tracking-widest font-bold text-brand-navy/70 bg-brand-navy/5 px-4 py-1.5 rounded-full border border-brand-navy/10 inline-block">
              OUR APPROACH
            </span>
            <SectionHeading
              title="Built On Professional Delivery Principles"
              subtitle="A structured framework ensuring every roofing project is delivered with engineered precision, transparent accountability, and uncompromising quality."
              align="center"
            />
          </div>

          {/* 2-Column Grid: Left Square Architectural Visual + Right Principle Stream, Vertically Centered */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left Column: Square Architectural Craftsmanship Visual (Vertically Centered) */}
            <div
              ref={leftColRef}
              className="w-full flex items-center justify-center"
            >
              <div className="relative aspect-square w-full max-w-[540px] rounded-2xl overflow-hidden border border-brand-navy/10 shadow-md group">
                <Image
                  src="/images/refined/about_approach_architecture.png"
                  alt="WELTRIQ Roofing Engineering and Craftsmanship"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-80" />

                {/* Floating Benchmark Pill */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-brand-white bg-brand-navy/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-yellow shrink-0" />
                    <span className="text-xs font-display uppercase tracking-wider font-bold">
                      100% Accountable Delivery
                    </span>
                  </div>
                  <span className="text-[10px] font-sans text-brand-white/70 uppercase tracking-widest hidden sm:inline-block">
                    WELTRIQ Standard
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Numbered Principle Stream */}
            <div className="w-full flex flex-col divide-y divide-brand-navy/10 border-y border-brand-navy/10">
              {principles.map((item, index) => (
                <div
                  key={item.number}
                  ref={(el) => {
                    itemsRef.current[index] = el;
                  }}
                  className="group py-5 sm:py-6 lg:py-6.5 px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-xl hover:bg-brand-white/60 transition-all duration-300 ease-out"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    {/* Proportional Display Number */}
                    <span className="font-display font-bold text-2xl sm:text-3xl text-brand-navy/30 group-hover:text-brand-navy transition-colors duration-300 shrink-0 w-10 sm:w-12 pt-0.5 leading-none">
                      {item.number}
                    </span>

                    {/* Principle Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] sm:text-[11px] font-display font-bold uppercase tracking-widest text-brand-navy/50 mb-1 block">
                          {item.phase}
                        </span>
                        <ArrowRight className="w-4 h-4 text-brand-navy/30 group-hover:text-brand-navy group-hover:translate-x-1 transition-all duration-300 shrink-0 hidden sm:block" />
                      </div>

                      <h3 className="text-xl sm:text-2xl font-display font-bold uppercase text-brand-navy tracking-wide leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-sm sm:text-base font-sans font-normal text-brand-navy/70 leading-relaxed text-balance mt-1.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

