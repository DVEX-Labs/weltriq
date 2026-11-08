import React from "react";
import { Metadata } from "next";
import { ServiceHero } from "@/components/sections/services/ServiceHero";
import { ServicesShowcase } from "@/components/sections/services/ServicesShowcase";
import { servicesPageServices } from "@/data/services";
import { ServiceDelivery } from "@/components/sections/services/ServiceDelivery";
import { WeltriqPromise } from "@/components/sections/WeltriqPromise";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Services | WELTRIQ Roofing Solutions",
  description: "Professionally managed roofing services in Kerala. We provide Clay Tile, Metal, Ceramic, Polycarbonate, Shingles, UPVC, Stone Coated roofing, Sheet Installation, and Roof Renovation.",
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
      
      {/* 3. Service Delivery */}
      <ServiceDelivery />
      
      {/* 4. WELTRIQ Promise */}
      <WeltriqPromise />
      
      {/* 5. Final CTA */}
      <FinalCTA />
    </main>
  );
}
