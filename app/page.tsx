import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HomeHeroScroll } from "@/components/sections/HomeHeroScroll";
import { WhyWeltriq } from "@/components/sections/WhyWeltriq";
import { ServicesShowcase } from "@/components/sections/services/ServicesShowcase";
import { homeServices } from "@/data/services";
import { Process } from "@/components/sections/Process";
import { WeltriqPromise } from "@/components/sections/WeltriqPromise";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { HomeBlogSection } from "@/components/sections/HomeBlogSection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="w-full">
      {/* 1. Hero — Pinned interactive frame-scrub scroll animation */}
      <HomeHeroScroll />

      {/* Trust / Positioning Statement */}
      <Section className="bg-brand-island-spice border-b border-brand-navy/5">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <h2 className="text-3xl md:text-4xl font-display uppercase text-brand-navy leading-tight">
              Quality Workmanship. <br /> Professional Execution.
            </h2>
            <p className="text-lg text-brand-navy/80 text-balance mx-auto">
              Professionally managed roofing, with one accountable partner from planning to completion.
            </p>
          </div>
        </Container>
      </Section>

      <ServicesShowcase services={homeServices} showViewAll />
      <WhyWeltriq />
      <Process />
      <WeltriqPromise />
      <AboutPreview />
      <HomeBlogSection />
      <FinalCTA />
    </main>
  );
}
