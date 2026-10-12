"use client";

import React, { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { WeltriqCard } from "@/components/ui/weltriq-card";
import {
  MessageSquareText,
  Ruler,
  FileText,
  HardHat,
  ShieldCheck,
  Award,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    id: "01",
    phase: "STEP 01 / 06",
    title: "ENQUIRY",
    icon: MessageSquareText,
  },
  {
    id: "02",
    phase: "STEP 02 / 06",
    title: "SITE ASSESSMENT",
    icon: Ruler,
  },
  {
    id: "03",
    phase: "STEP 03 / 06",
    title: "QUOTATION / PROPOSAL",
    icon: FileText,
  },
  {
    id: "04",
    phase: "STEP 04 / 06",
    title: "ROOFING EXECUTION",
    icon: HardHat,
  },
  {
    id: "05",
    phase: "STEP 05 / 06",
    title: "QUALITY INSPECTION",
    icon: ShieldCheck,
  },
  {
    id: "06",
    phase: "STEP 06 / 06",
    title: "FINAL HANDOVER",
    icon: Award,
  },
];

export function ServiceDelivery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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
    <Section className="relative bg-brand-white border-b border-brand-navy/5 py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Subtle Background Architectural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c153305_1px,transparent_1px),linear-gradient(to_bottom,#0c153305_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <Container className="relative z-10">
        <div ref={containerRef}>
          {/* Header Zone */}
          <div ref={headerRef} className="mb-8 md:mb-10 lg:mb-12 text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-display uppercase tracking-widest font-bold text-brand-navy/70 bg-brand-navy/5 px-4 py-1.5 rounded-full border border-brand-navy/10 inline-block">
              PROJECT DELIVERY
            </span>
            <SectionHeading
              title="How We Deliver"
              subtitle="Structured execution from planning through completion."
              align="center"
            />
          </div>

          {/* Cards Grid — Architectural Bento Style */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {steps.map((step) => (
                <WeltriqCard
                  key={step.id}
                  badge={step.phase}
                  icon={step.icon}
                  stepNumber={step.id}
                  title={step.title}
                  showArrow
                  className="min-h-[190px]"
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

