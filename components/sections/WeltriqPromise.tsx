import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArrowUpRight } from "lucide-react";

const promises = [
  {
    id: "01",
    title: "Site Inspection",
    value: "Within 24 Hours",
  },
  {
    id: "02",
    title: "Quotation",
    value: "Within 48 Hours",
  },
  {
    id: "03",
    title: "Execution",
    value: "Professional & On-Time",
  },
];

export function WeltriqPromise() {
  return (
    <Section className="bg-brand-navy text-brand-white">
      <Container>
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-14 space-y-6">
          <span className="text-brand-yellow font-display uppercase tracking-widest text-sm font-bold">
            The WELTRIQ Promise
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase leading-[1.1] text-brand-white">
            Clear commitments. <br /> Professional execution.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {promises.map((promise) => (
            <div
              key={promise.id}
              className="group relative bg-brand-navy border border-white/10 hover:border-brand-yellow/80 rounded-sm p-8 md:p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Top Bar: Editorial Index & Minimal Action Indicator */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs md:text-sm font-display font-bold uppercase tracking-widest text-brand-yellow/80">
                  {promise.id}
                </span>
                <ArrowUpRight className="w-5 h-5 text-brand-yellow/60 group-hover:text-brand-yellow group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>

              {/* Main Title */}
              <h3 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wide text-brand-white mb-8 group-hover:text-brand-white">
                {promise.title}
              </h3>

              {/* Bottom Divider & Supporting Promise Value */}
              <div className="border-t border-white/10 pt-4 mt-auto">
                <span className="text-sm md:text-base font-sans font-semibold uppercase tracking-wider text-brand-yellow">
                  {promise.value}
                </span>
              </div>

              {/* Subtle Thin Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 h-[2px] w-10 group-hover:w-full bg-brand-yellow transition-all duration-300" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

