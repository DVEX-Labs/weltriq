"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { useInspectionModal } from "@/components/providers/InspectionModalProvider";
import { ArrowRight } from "lucide-react";

const promises = [
  {
    id: "01",
    title: "Site Inspection",
    value: "24 hrs",
    detail: "Guaranteed on-site visit within 24 hours of enquiry.",
  },
  {
    id: "02",
    title: "Quotation",
    value: "48 hrs",
    detail: "Detailed, transparent cost breakdown delivered in 48 hours.",
  },
  {
    id: "03",
    title: "Execution",
    value: "On-Time",
    detail: "Professional delivery from planning through final handover.",
  },
];

export function WeltriqPromise() {
  const { openModal } = useInspectionModal();

  return (
    <Section className="bg-brand-navy text-brand-white overflow-hidden">
      <Container>
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
          <span className="text-xs font-display uppercase tracking-widest font-bold text-brand-white/80 bg-white/10 px-4 py-1.5 rounded-full border border-white/20 inline-block">
            The WELTRIQ Promise
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display uppercase leading-[1.08] text-brand-white">
            Clear Commitments. Professional Execution.
          </h2>
        </div>

        {/* Promise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 max-w-5xl mx-auto border border-white/10 rounded-sm overflow-hidden">
          {promises.map((promise) => (
            <div
              key={promise.id}
              className="group relative p-8 md:p-10 lg:p-12 flex flex-col gap-4 hover:bg-white/[0.04] transition-colors duration-300"
            >
              {/* Index */}
              <span className="text-xs font-display font-bold uppercase tracking-widest text-brand-white/40 group-hover:text-brand-white transition-colors duration-300">
                {promise.id}
              </span>

              {/* Large Value */}
              <div className="text-5xl md:text-6xl lg:text-7xl font-display uppercase font-bold text-brand-white leading-none tracking-tight">
                {promise.value}
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-display uppercase tracking-wide text-brand-white/80 group-hover:text-brand-white transition-colors duration-300">
                {promise.title}
              </h3>

              {/* Detail */}
              <p className="text-sm md:text-base text-brand-white/50 leading-relaxed font-sans mt-auto">
                {promise.detail}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-brand-yellow transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-8 md:mt-10">
          <Button
            size="lg"
            variant="primary"
            onClick={() => openModal("Site Inspection")}
            className="group flex items-center gap-2 cursor-pointer"
          >
            <span>Book Site Inspection</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Bottom Tagline */}
        <p className="text-center text-brand-white/40 text-xs font-display uppercase tracking-widest mt-5 md:mt-6">
          Every project. Every time. No exceptions.
        </p>
      </Container>
    </Section>
  );
}
