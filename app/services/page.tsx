import React from "react";
import { Metadata } from "next";
import { ServiceHero } from "@/components/sections/services/ServiceHero";
import { ServicesShowcase } from "@/components/sections/services/ServicesShowcase";
import { servicesPageServices } from "@/data/services";
import { ProjectTypes } from "@/components/sections/services/ProjectTypes";
import { WhyWeltriq } from "@/components/sections/WhyWeltriq";
import { ServiceDelivery } from "@/components/sections/services/ServiceDelivery";
import { WeltriqPromise } from "@/components/sections/WeltriqPromise";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Services | WELTRIQ Roofing Solutions",
  description: "Professionally managed roofing services in Kerala. We provide Residential, Commercial, Industrial, Metal, Clay Tile, Ceramic, UPVC, and Polycarbonate roofing solutions.",
  alternates: {
    canonical: "/services"
  }
};

export default function ServicesPage() {
  return (
    <main className="w-full">
      {/* 1. Hero */}
      <ServiceHero />
      
      {/* 2. Services Showcase */}
      <ServicesShowcase services={servicesPageServices} />
      
      {/* 3. Project Types */}
      <ProjectTypes />
      
      {/* 4. Why WELTRIQ */}
      <WhyWeltriq />
      
      {/* 4. Service Delivery */}
      <ServiceDelivery />
      
      {/* 5. WELTRIQ Promise */}
      <WeltriqPromise />
      
      {/* 6. Final CTA */}
      <FinalCTA />
    </main>
  );
}
