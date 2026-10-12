import React from "react";
import { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutWhoWeAre } from "@/components/sections/about/AboutWhoWeAre";
import { AboutApproach } from "@/components/sections/about/AboutApproach";
import { AboutMissionVision } from "@/components/sections/about/AboutMissionVision";
import { AboutPhilosophy } from "@/components/sections/about/AboutPhilosophy";
import { WeltriqPromise } from "@/components/sections/WeltriqPromise";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "About Us | WELTRIQ Roofing Solutions",
  description: "Learn about WELTRIQ - Kerala's trusted roofing solutions partner. Professionally managed roofing with one accountable partner from planning to completion.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="w-full">
      {/* 1. Hero */}
      <AboutHero />

      {/* 2. Who We Are */}
      <AboutWhoWeAre />

      {/* 3. Our Approach */}
      <AboutApproach />

      {/* 4. Mission & Vision */}
      <AboutMissionVision />

      {/* 5. Brand Philosophy: EVERY PROJECT STARTS WITH PURPOSE */}
      <AboutPhilosophy />

      {/* 6. WELTRIQ Promise */}
      <WeltriqPromise />

      {/* 7. Final CTA */}
      <FinalCTA />
    </main>
  );
}
