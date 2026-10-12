import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function AboutWhoWeAre() {
  return (
    <Section className="bg-brand-island-spice border-b border-brand-navy/5 py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs md:text-sm font-display uppercase tracking-widest font-bold text-brand-yellow">
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase leading-[1.15] text-brand-navy">
              Kerala&apos;s Trusted Roofing Solutions Partner
            </h2>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-6 lg:pt-2 border-l border-brand-navy/10 pl-6 sm:pl-8 md:pl-10">
            <p className="text-lg md:text-xl text-brand-navy/80 leading-relaxed font-sans text-balance">
              WELTRIQ is positioned as Kerala&apos;s trusted roofing solutions partner, 
              focused on reliable roofing solutions, quality workmanship, professional 
              execution, and customer-first service.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
