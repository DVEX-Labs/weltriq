import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Target, Eye } from "lucide-react";

export function AboutMissionVision() {
  return (
    <Section className="bg-brand-white text-brand-navy py-16 md:py-20 lg:py-24 relative overflow-hidden border-b border-brand-navy/10">
      {/* Background Subtle Accent Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c153305_1px,transparent_1px),linear-gradient(to_bottom,#0c153305_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-12 space-y-3">
          <span className="text-xs font-display uppercase tracking-widest font-bold text-brand-navy/70 bg-brand-navy/5 px-4 py-1.5 rounded-full border border-brand-navy/10 inline-block">
            OUR DIRECTION
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase leading-[1.1] text-brand-navy">
            Purpose &amp; Direction
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mission Card */}
          <Card className="bg-brand-white border border-gray-200 shadow-[0_12px_40px_rgba(12,21,51,0.06)] p-8 md:p-10 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-navy transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />

            {/* Background Watermark Icon */}
            <div
              aria-hidden="true"
              className="absolute -bottom-8 -right-8 pointer-events-none text-brand-navy/[0.04] group-hover:text-brand-navy/[0.12] transition-all duration-500 ease-out transform translate-y-2 lg:translate-y-4 lg:group-hover:translate-y-0 group-hover:scale-105"
            >
              <Target className="w-44 h-44 sm:w-52 sm:h-52 stroke-[1.25]" />
            </div>

            <CardContent className="p-0 flex flex-col h-full space-y-6 relative z-10">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-brand-navy/60">
                Our Purpose
              </span>

              <h3 className="text-2xl md:text-3xl font-display uppercase font-bold text-brand-navy">
                Mission
              </h3>

              <p className="text-base md:text-lg text-brand-navy/75 leading-relaxed font-sans text-balance">
                Deliver reliable roofing solutions through quality workmanship, professional execution, and customer-first service.
              </p>
            </CardContent>
          </Card>

          {/* Vision Card */}
          <Card className="bg-brand-white border border-gray-200 shadow-[0_12px_40px_rgba(12,21,51,0.06)] p-8 md:p-10 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-navy transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />

            {/* Background Watermark Icon */}
            <div
              aria-hidden="true"
              className="absolute -bottom-8 -right-8 pointer-events-none text-brand-navy/[0.04] group-hover:text-brand-navy/[0.12] transition-all duration-500 ease-out transform translate-y-2 lg:translate-y-4 lg:group-hover:translate-y-0 group-hover:scale-105"
            >
              <Eye className="w-44 h-44 sm:w-52 sm:h-52 stroke-[1.25]" />
            </div>

            <CardContent className="p-0 flex flex-col h-full space-y-6 relative z-10">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-brand-navy/60">
                Our Ambition
              </span>

              <h3 className="text-2xl md:text-3xl font-display uppercase font-bold text-brand-navy">
                Vision
              </h3>

              <p className="text-base md:text-lg text-brand-navy/75 leading-relaxed font-sans text-balance">
                To become South India&apos;s most trusted roofing solutions company by delivering exceptional roofing experiences and creating 1,000 happy customers.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
