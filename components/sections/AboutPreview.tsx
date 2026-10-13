import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "10+", label: "Roofing Services" },
  { value: "24h", label: "Site Inspection" },
  { value: "100%", label: "Client First" },
];

export function AboutPreview() {
  return (
    <Section className="bg-brand-white overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-brand-yellow font-display uppercase tracking-widest text-xs md:text-sm font-bold">
                About WELTRIQ
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display uppercase leading-[1.08] text-brand-navy">
                Roofing, Managed With{" "}
                <span className="relative inline-block">
                  Clarity
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-brand-yellow" />
                </span>{" "}
                and Accountability.
              </h2>
            </div>

            {/* Stat Row */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1 border-l-2 border-brand-yellow pl-4">
                  <span className="text-2xl md:text-3xl font-display font-bold text-brand-navy">
                    {stat.value}
                  </span>
                  <span className="text-xs text-brand-navy/60 font-display uppercase tracking-widest leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 lg:pl-12 lg:border-l border-brand-navy/10">
            <p className="text-base md:text-lg lg:text-xl text-brand-navy/75 leading-relaxed text-balance">
              WELTRIQ is Kerala&apos;s trusted roofing solutions partner —
              focused on reliable roofing solutions, quality workmanship,
              professional execution and a customer-first approach to every
              single project.
            </p>

            <p className="text-sm md:text-base text-brand-navy/55 leading-relaxed font-sans">
              From residential homes to commercial and industrial buildings, we
              bring one accountable partner to every project, ensuring clarity
              from enquiry through final handover.
            </p>

            <Button
              variant="outline"
              size="lg"
              className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-brand-white group"
              asChild
            >
              <Link href="/about" className="flex items-center gap-2">
                About WELTRIQ
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
