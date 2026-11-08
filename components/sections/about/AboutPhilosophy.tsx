"use client";

import React, { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Compass, Layers, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { WeltriqCard } from "@/components/ui/weltriq-card";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const pillars = [
  {
    step: "01",
    phase: "STAGE 01 / 03",
    title: "DEFINE",
    tag: "Requirement & Site Audit",
    icon: Compass,
    description:
      "Guaranteed on-site inspection within 24 hours to assess structural needs, architectural style, and scope with absolute clarity.",
  },
  {
    step: "02",
    phase: "STAGE 02 / 03",
    title: "DESIGN",
    tag: "Engineering & Material Planning",
    icon: Layers,
    description:
      "Transparent 48-hour cost breakdown, structural truss engineering, and certified material specifications with zero hidden surprises.",
  },
  {
    step: "03",
    phase: "STAGE 03 / 03",
    title: "DELIVER",
    tag: "Supervised Execution",
    icon: ShieldCheck,
    description:
      "Skilled professional installation, rigorous quality audits at every milestone, and guaranteed on-time handover backed by warranty.",
  },
];

export function AboutPhilosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
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
    },
    { scope: containerRef }
  );

  return (
    <Section className="relative bg-brand-white text-brand-navy border-b border-brand-navy/10 py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Subtle Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c153305_1px,transparent_1px),linear-gradient(to_bottom,#0c153305_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      <Container className="relative z-10">
        <div ref={containerRef} className="max-w-6xl mx-auto">
          {/* Header Zone */}
          <div
            ref={headerRef}
            className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-3.5"
          >
            <span className="text-xs font-display uppercase tracking-widest font-bold text-brand-navy/70 bg-brand-navy/5 px-4 py-1.5 rounded-full border border-brand-navy/10 inline-block">
              BRAND PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase leading-[1.08] text-brand-navy tracking-wide">
              EVERY PROJECT STARTS WITH PURPOSE
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-brand-navy/65 max-w-2xl mx-auto font-sans leading-relaxed">
              Our structured three-stage roadmap transforms roofing from unorganized labor into an accountable, engineered, and transparent delivery experience.
            </p>
          </div>

          {/* 3-Stage Philosophy Cards — Standard WeltriqCard Grid (Matching Service Delivery) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {pillars.map((pillar) => (
              <WeltriqCard
                key={pillar.step}
                badge={pillar.phase}
                icon={pillar.icon}
                watermarkNumber={pillar.step}
                title={pillar.title}
                description={pillar.description}
                className="min-h-[200px]"
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
