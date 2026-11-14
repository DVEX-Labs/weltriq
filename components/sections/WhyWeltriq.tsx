"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { useInspectionModal } from "@/components/providers/InspectionModalProvider";
import { ArrowRight } from "lucide-react";

const values = [
  {
    number: "01",
    title: "CLARITY",
    description: "Clear understanding of requirements and scope before any work begins.",
  },
  {
    number: "02",
    title: "ACCOUNTABILITY",
    description: "One accountable partner managing the project from start to finish.",
  },
  {
    number: "03",
    title: "QUALITY CONTROL",
    description: "Structured attention to quality at every stage of execution.",
  },
  {
    number: "04",
    title: "COORDINATION",
    description: "Professional coordination of planning, materials and workforce.",
  },
  {
    number: "05",
    title: "PROFESSIONAL EXECUTION",
    description: "Organised delivery from planning through to final handover.",
  },
];

export function WhyWeltriq() {
  const { openModal } = useInspectionModal();
  const [activeValue, setActiveValue] = useState<string>("01");

  return (
    <Section className="bg-white text-brand-navy border-b border-brand-navy/10 overflow-hidden">
      <Container>
        <div className="flex flex-col gap-8 md:gap-10">

          {/* TOP — Label + Heading (full width) */}
          <div className="space-y-3 max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-display uppercase tracking-widest font-bold text-brand-navy/70 bg-brand-navy/5 px-3.5 py-1.5 rounded-full border border-brand-navy/10">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shrink-0"></span>
              Why WELTRIQ
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display uppercase leading-[1.08] text-brand-navy">
              Professionally Managed Roofing.
            </h2>
            <p className="text-brand-navy/70 text-base md:text-lg font-sans leading-relaxed max-w-xl">
              With one accountable partner from planning to completion.
            </p>
          </div>

          {/* BOTTOM — Two columns: 5:7 ratio matching About page layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* LEFT — Supervision & Managed Roofing Visual (Span 5) */}
            <div className="lg:col-span-5 w-full flex items-center justify-center">
              <div className="relative aspect-[16/11] lg:aspect-[5/4] w-full max-w-[440px] rounded-2xl overflow-hidden border border-brand-navy/10 shadow-[0_12px_40px_rgba(12,21,51,0.08)] group bg-brand-navy/5">
                <Image
                  src="/images/refined/why_weltriq_accountability.jpg"
                  alt="WELTRIQ Professional Site Supervision and Accountable Roofing Management"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>

            {/* RIGHT — Values list (Span 7) — Responsive Touch & Hover Feedback */}
            <div className="lg:col-span-7 w-full flex flex-col divide-y divide-brand-navy/10 border-y border-brand-navy/10">
              {values.map((value) => {
                const isActive = activeValue === value.number;

                return (
                  <div
                    key={value.title}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    onClick={() => setActiveValue(value.number)}
                    onTouchStart={() => setActiveValue(value.number)}
                    onMouseEnter={() => setActiveValue(value.number)}
                    className={`group py-3.5 sm:py-4 px-3 sm:px-4 rounded-xl transition-all duration-300 ease-out cursor-pointer select-none touch-manipulation focus:outline-none ${
                      isActive
                        ? "bg-brand-navy/[0.05] shadow-2xs"
                        : "hover:bg-brand-navy/[0.03] active:bg-brand-navy/[0.04]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Proportional Display Number */}
                      <span
                        className={`font-display font-bold text-lg sm:text-xl shrink-0 w-7 sm:w-8 pt-0.5 leading-none transition-all duration-300 ${
                          isActive
                            ? "text-brand-navy scale-105"
                            : "text-brand-navy/35 group-hover:text-brand-navy"
                        }`}
                      >
                        {value.number}
                      </span>

                      {/* Value Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className={`text-sm sm:text-base font-display font-bold uppercase tracking-wide transition-colors duration-300 ${
                              isActive ? "text-brand-navy font-bold" : "text-brand-navy group-hover:text-brand-navy"
                            }`}
                          >
                            {value.title}
                          </h3>
                          <ArrowRight
                            className={`w-3.5 h-3.5 transition-all duration-300 shrink-0 hidden sm:block ${
                              isActive
                                ? "text-brand-navy translate-x-1 opacity-100"
                                : "text-brand-navy/30 group-hover:text-brand-navy group-hover:translate-x-1"
                            }`}
                          />
                        </div>

                        <p
                          className={`text-xs sm:text-sm font-sans font-normal leading-relaxed mt-0.5 transition-colors duration-300 ${
                            isActive ? "text-brand-navy/85" : "text-brand-navy/65"
                          }`}
                        >
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Centered CTA Button */}
          <div className="flex justify-center pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => openModal("General Site Inspection")}
              className="group flex items-center gap-2 cursor-pointer"
            >
              <span>Book Site Inspection</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
