"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  MessageSquareText,
  Ruler,
  FileText,
  HardHat,
  ShieldCheck,
  Award,
} from "lucide-react";

const steps = [
  {
    id: "01",
    phase: "PHASE 01",
    title: "Enquiry",
    description: "Initial consultation & requirement analysis to define project scope and goals.",
    icon: MessageSquareText,
  },
  {
    id: "02",
    phase: "PHASE 02",
    title: "Site Assessment",
    description: "Comprehensive structural evaluation, accurate measurement & safety risk analysis.",
    icon: Ruler,
  },
  {
    id: "03",
    phase: "PHASE 03",
    title: "Quotation / Proposal",
    description: "Transparent cost breakdown, material specifications & clear delivery schedule.",
    icon: FileText,
  },
  {
    id: "04",
    phase: "PHASE 04",
    title: "Roofing Execution",
    description: "Precision installation by certified technicians adhering to master build standards.",
    icon: HardHat,
  },
  {
    id: "05",
    phase: "PHASE 05",
    title: "Quality Inspection",
    description: "Multi-stage quality auditing and rigorous weather-tightness compliance verification.",
    icon: ShieldCheck,
  },
  {
    id: "06",
    phase: "PHASE 06",
    title: "Final Handover",
    description: "Formal walkthrough, comprehensive warranty issuance & official client sign-off.",
    icon: Award,
  },
];

// Desktop S-Curve coordinates (viewBox="0 0 1000 1560")
// Alternating between X=440 (left turn) and X=560 (right turn)
const DESKTOP_PINS = [
  { x: 440, y: 110, side: "left" },
  { x: 560, y: 370, side: "right" },
  { x: 440, y: 630, side: "left" },
  { x: 560, y: 890, side: "right" },
  { x: 440, y: 1150, side: "left" },
  { x: 560, y: 1410, side: "right" },
] as const;

const DESKTOP_PATH_D =
  "M 440 20 " +
  "L 440 110 " +
  "C 440 240, 560 240, 560 370 " +
  "C 560 500, 440 500, 440 630 " +
  "C 440 760, 560 760, 560 890 " +
  "C 560 1020, 440 1020, 440 1150 " +
  "C 440 1280, 560 1280, 560 1410 " +
  "L 560 1520";

export function Process() {
  const [activeStep, setActiveStep] = useState<string>("01");

  return (
    <Section className="relative bg-[#FAFAFA] border-b border-brand-navy/5 overflow-hidden py-16 md:py-20 lg:py-24">
      {/* Precision Blueprint Coordinate Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c153308_1px,transparent_1px),linear-gradient(to_bottom,#0c153308_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_65%,transparent_100%)] pointer-events-none" />

      {/* Subtle Topographical Markings */}
      <div className="absolute top-12 left-8 text-[9px] font-mono tracking-widest text-brand-navy/20 uppercase hidden xl:block select-none pointer-events-none">
        GRID REF: 09°58&apos;N 76°17&apos;E // ARCHITECTURAL DELIVERY ROADMAP
      </div>
      <div className="absolute bottom-12 right-8 text-[9px] font-mono tracking-widest text-brand-navy/20 uppercase hidden xl:block select-none pointer-events-none">
        PRECISION MILESTONE TRAIL // PHASES 01—06
      </div>

      <div className="relative z-10 w-full">
        <Container>
          {/* Header */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <span className="text-xs font-display uppercase tracking-widest font-bold text-brand-navy/70 bg-brand-navy/5 px-4 py-1.5 rounded-full border border-brand-navy/10 mb-4 inline-block">
              Seamless Project Delivery
            </span>
            <SectionHeading
              title="Our Process"
              subtitle="Organized project delivery, from first contact to final handover."
              align="center"
            />
          </div>

          {/* ========================================================= */}
          {/* DESKTOP VIEWPORT (≥ 1024px): Static S-Curve Dotted Roadmap */}
          {/* ========================================================= */}
          <div className="hidden lg:block relative mx-auto w-full max-w-[1080px] h-[1560px]">
            {/* SVG S-Curve Map Canvas — Permanently Rendered (No Animation Delay) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1000 1560"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Layer 1: Soft Roadway Corridor */}
              <path
                d={DESKTOP_PATH_D}
                fill="none"
                stroke="#0C1533"
                strokeOpacity="0.04"
                strokeWidth="24"
                strokeLinecap="round"
              />

              {/* Layer 2: Subtle Outline Guide (Faint Dashed Path) */}
              <path
                d={DESKTOP_PATH_D}
                fill="none"
                stroke="#0C1533"
                strokeOpacity="0.14"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                strokeLinecap="round"
              />

              {/* Layer 3: ACTIVE Matte Black Dotted Map Path — Always 100% Visible */}
              <path
                d={DESKTOP_PATH_D}
                fill="none"
                stroke="#0C1533"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="1 10"
              />

              {/* Hairline Connectors Linking Pins to Cards */}
              {DESKTOP_PINS.map((pin, i) => {
                const cardEdgeX = pin.side === "left" ? 400 : 600;
                return (
                  <line
                    key={`connector-${i}`}
                    x1={pin.x}
                    y1={pin.y}
                    x2={cardEdgeX}
                    y2={pin.y}
                    stroke="#0C1533"
                    strokeOpacity="0.18"
                    strokeWidth="1.2"
                    strokeDasharray="2 4"
                  />
                );
              })}
            </svg>

            {/* Desktop Milestone Items (Pins + Alternating Cards) — Fully Interactive */}
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const pin = DESKTOP_PINS[index];
              const isLeft = pin.side === "left";
              const isActive = activeStep === step.id;

              return (
                <div key={step.id}>
                  {/* Concentric Survey Waypoint Pin */}
                  <div
                    style={{
                      left: `${(pin.x / 1000) * 100}%`,
                      top: `${(pin.y / 1560) * 100}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer group"
                    onClick={() => setActiveStep(step.id)}
                  >
                    {/* Outer Target Ring */}
                    <div
                      className={`w-12 h-12 rounded-full border bg-white/95 backdrop-blur-xs flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "scale-115 border-brand-navy ring-4 ring-brand-navy/15 shadow-md"
                          : "border-brand-navy/30 shadow-xs group-hover:scale-110"
                      }`}
                    >
                      {/* Inner Solid Black Pin with Numeral */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs tracking-wider transition-colors duration-200 ${
                          isActive
                            ? "bg-brand-navy text-white shadow-sm"
                            : "bg-brand-navy text-white"
                        }`}
                      >
                        {step.id}
                      </div>
                    </div>
                  </div>

                  {/* Milestone Card (Alternating Left / Right) */}
                  <div
                    style={{
                      top: `${(pin.y / 1560) * 100}%`,
                      transform: "translateY(-50%)",
                    }}
                    className={`absolute z-10 w-[380px] ${
                      isLeft ? "left-6 xl:left-8" : "right-6 xl:right-8"
                    }`}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveStep(step.id)}
                      onMouseEnter={() => setActiveStep(step.id)}
                      className={`relative rounded-2xl p-6 transition-all duration-300 group overflow-hidden touch-manipulation cursor-pointer select-none ${
                        isActive
                          ? "border-2 border-brand-navy/35 bg-white shadow-xl -translate-y-1.5"
                          : "border border-brand-navy/10 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1"
                      }`}
                    >
                      {/* Top Hairline Active Bar */}
                      <div
                        className={`absolute top-0 left-0 right-0 transition-all duration-300 ${
                          isActive
                            ? "h-[3px] bg-brand-navy"
                            : "h-[2px] bg-brand-navy/15 group-hover:bg-brand-navy"
                        }`}
                      />

                      {/* Header: Phase Pill + Architectural Icon */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-display font-bold uppercase tracking-wider transition-colors ${
                            isActive
                              ? "bg-brand-navy/10 text-brand-navy border border-brand-navy/20 font-bold"
                              : "bg-brand-navy/5 text-brand-navy/70 border border-brand-navy/10"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              isActive
                                ? "bg-brand-navy scale-125"
                                : "bg-brand-navy/40 group-hover:bg-brand-navy"
                            }`}
                          />
                          {step.phase}
                        </span>

                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 shadow-2xs ${
                            isActive
                              ? "bg-brand-navy text-white scale-105"
                              : "bg-brand-island-spice text-brand-navy group-hover:bg-brand-navy group-hover:text-white"
                          }`}
                        >
                          <IconComponent className="h-4 w-4 stroke-[2]" />
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-base font-display font-bold uppercase tracking-wide mb-2 transition-colors ${
                          isActive ? "text-brand-navy font-bold" : "text-brand-navy group-hover:text-brand-navy"
                        }`}
                      >
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p
                        className={`text-xs sm:text-sm font-sans leading-relaxed transition-colors ${
                          isActive ? "text-brand-navy/85" : "text-brand-navy/65"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================= */}
          {/* MOBILE & TABLET VIEWPORT (< 1024px): Static Left Spine Trail */}
          {/* ========================================================= */}
          <div className="lg:hidden relative w-full pl-6 sm:pl-10">
            {/* SVG Left Spine Trail — Always 100% Visible */}
            <svg
              className="absolute left-6 sm:left-10 top-0 bottom-0 h-full w-8 -translate-x-1/2 pointer-events-none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Base Corridor */}
              <line
                x1="16"
                y1="20"
                x2="16"
                y2="1600"
                stroke="#0C1533"
                strokeOpacity="0.04"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Base Guide Line */}
              <line
                x1="16"
                y1="20"
                x2="16"
                y2="1600"
                stroke="#0C1533"
                strokeOpacity="0.15"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                strokeLinecap="round"
              />

              {/* Active Black Dotted Trail — Always Visible */}
              <line
                x1="16"
                y1="20"
                x2="16"
                y2="1600"
                stroke="#0C1533"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="1 9"
              />
            </svg>

            {/* Mobile & Tablet Stacked Items — Responsive Touch & Tap to Activate */}
            <div className="flex flex-col gap-8 sm:gap-10">
              {steps.map((step) => {
                const IconComponent = step.icon;
                const isActive = activeStep === step.id;

                return (
                  <div
                    key={step.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    onClick={() => setActiveStep(step.id)}
                    onTouchStart={() => setActiveStep(step.id)}
                    className="group relative flex items-start gap-5 sm:gap-7 cursor-pointer select-none touch-manipulation focus:outline-none"
                  >
                    {/* Concentric Survey Pin on Spine */}
                    <div
                      className={`relative z-20 -ml-6 sm:-ml-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 mt-2 ${
                        isActive
                          ? "scale-115 border-2 border-brand-navy ring-4 ring-brand-navy/15 bg-white shadow-md"
                          : "border border-brand-navy/30 bg-white/95 shadow-xs group-hover:scale-110 group-active:scale-105"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-xs tracking-wider transition-colors duration-200 ${
                          isActive
                            ? "bg-brand-navy text-white shadow-xs"
                            : "bg-brand-navy text-white"
                        }`}
                      >
                        {step.id}
                      </div>
                    </div>

                    {/* Card Content with Responsive Touch & Hover States */}
                    <div
                      className={`relative flex-1 rounded-2xl p-5 sm:p-6 transition-all duration-300 overflow-hidden ${
                        isActive
                          ? "border-2 border-brand-navy/35 bg-white shadow-md -translate-y-0.5"
                          : "border border-brand-navy/10 bg-white shadow-sm hover:shadow-lg hover:border-brand-navy/25 active:border-brand-navy/35 active:scale-[0.985] active:shadow-xs"
                      }`}
                    >
                      {/* Top Hairline Active Bar */}
                      <div
                        className={`absolute top-0 left-0 right-0 transition-all duration-300 ${
                          isActive
                            ? "h-[3px] bg-brand-navy"
                            : "h-[2px] bg-brand-navy/15 group-hover:bg-brand-navy"
                        }`}
                      />

                      <div className="flex items-center justify-between mb-2.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-display font-bold uppercase tracking-wider transition-colors duration-200 ${
                            isActive
                              ? "bg-brand-navy/10 text-brand-navy border border-brand-navy/20 font-bold"
                              : "bg-brand-navy/5 text-brand-navy/70 border border-brand-navy/10"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                              isActive
                                ? "bg-brand-navy scale-125"
                                : "bg-brand-navy/40 group-hover:bg-brand-navy"
                            }`}
                          />
                          {step.phase}
                        </span>

                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-300 shadow-2xs ${
                            isActive
                              ? "bg-brand-navy text-white scale-105"
                              : "bg-brand-island-spice text-brand-navy group-hover:bg-brand-navy group-hover:text-white"
                          }`}
                        >
                          <IconComponent className="h-3.5 w-3.5 stroke-[2]" />
                        </div>
                      </div>

                      <h3
                        className={`text-base font-display font-bold uppercase mb-1.5 transition-colors ${
                          isActive ? "text-brand-navy" : "text-brand-navy group-hover:text-brand-navy"
                        }`}
                      >
                        {step.title}
                      </h3>

                      <p
                        className={`text-xs sm:text-sm font-sans leading-relaxed transition-colors ${
                          isActive ? "text-brand-navy/85" : "text-brand-navy/65"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
