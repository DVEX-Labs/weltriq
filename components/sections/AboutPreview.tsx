import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { WeltriqCard } from "@/components/ui/weltriq-card";
import { ArrowRight, UserCheck, ClipboardCheck, ShieldCheck } from "lucide-react";

const pillars = [
  {
    number: "01",
    phase: "PILLAR 01 / 03",
    title: "One Accountable Partner",
    icon: UserCheck,
    description:
      "A single point of accountability managing planning, materials procurement, and workforce coordination from start to completion.",
  },
  {
    number: "02",
    phase: "PILLAR 02 / 03",
    title: "Structured Project Delivery",
    icon: ClipboardCheck,
    description:
      "Transparent quotations, coordinated installation schedules, and systematic execution without ambiguity or unplanned delays.",
  },
  {
    number: "03",
    phase: "PILLAR 03 / 03",
    title: "Supervised Quality Control",
    icon: ShieldCheck,
    description:
      "Consistent standards and thorough inspection before formal handover to guarantee lasting finish and peace of mind.",
  },
];

export function AboutPreview() {
  return (
    <Section className="bg-brand-white border-y border-brand-navy/5 overflow-hidden py-20 md:py-28 lg:py-32">
      <Container>
        <div className="flex flex-col gap-10 md:gap-14">
          {/* Header Block — Direct & Authoritative with Top-Right CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-brand-navy/10">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs md:text-sm font-display uppercase tracking-widest font-bold text-brand-navy/70 bg-brand-navy/5 px-4 py-1.5 rounded-full border border-brand-navy/10 inline-block">
                About WELTRIQ
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display uppercase leading-[1.08] text-brand-navy">
                Not Just Contractors. Your Roofing Partner.
              </h2>
            </div>

            <div className="shrink-0">
              <Button
                variant="primary"
                size="lg"
                className="group cursor-pointer"
                asChild
              >
                <Link href="/about" className="inline-flex items-center gap-2.5">
                  About WELTRIQ
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 3 Value Pillars across full width — Unified WeltriqCard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {pillars.map((pillar) => (
              <WeltriqCard
                key={pillar.number}
                badge={pillar.phase}
                icon={pillar.icon}
                watermarkNumber={pillar.number}
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

