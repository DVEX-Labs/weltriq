import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Target, Eye } from "lucide-react";

export function AboutMissionVision() {
  return (
    <Section className="bg-brand-navy text-brand-white py-16 md:py-20 relative overflow-hidden">
      {/* Background Accent Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-12 space-y-4">
          <span className="text-xs md:text-sm font-display uppercase tracking-widest font-bold text-brand-yellow bg-brand-yellow/10 px-4 py-1.5 rounded-full border border-brand-yellow/20">
            Purpose &amp; Direction
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase leading-[1.1] text-brand-white">
            Purpose &amp; Direction
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mission Card */}
          <Card className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-2xl relative overflow-hidden group hover:border-brand-yellow/60 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            <CardContent className="p-0 flex flex-col h-full space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold uppercase tracking-wider text-brand-yellow">
                  Our Purpose
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-yellow/10 text-brand-yellow">
                  <Target className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-display uppercase font-bold text-brand-white">
                Mission
              </h3>

              <p className="text-base md:text-lg text-brand-white/85 leading-relaxed font-sans text-balance">
                Deliver reliable roofing solutions through quality workmanship, professional execution, and customer-first service.
              </p>
            </CardContent>
          </Card>

          {/* Vision Card */}
          <Card className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-2xl relative overflow-hidden group hover:border-brand-yellow/60 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            <CardContent className="p-0 flex flex-col h-full space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold uppercase tracking-wider text-brand-yellow">
                  Our Ambition
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-yellow/10 text-brand-yellow">
                  <Eye className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-display uppercase font-bold text-brand-white">
                Vision
              </h3>

              <p className="text-base md:text-lg text-brand-white/85 leading-relaxed font-sans text-balance">
                To become South India&apos;s most trusted roofing solutions company by delivering exceptional roofing experiences and creating 1,000 happy customers.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
