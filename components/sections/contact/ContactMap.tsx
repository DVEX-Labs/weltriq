"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Navigation, ExternalLink } from "lucide-react";
import { contactInfo } from "@/data/contact";

export function ContactMap() {
  const autoQuery = encodeURIComponent(
    contactInfo.address
      ? `WELTRIQ Roofing Solutions, ${contactInfo.address}`
      : "WELTRIQ Roofing Palakkad Kerala"
  );

  const mapEmbedUrl =
    contactInfo.mapEmbedUrl ||
    `https://maps.google.com/maps?q=${autoQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const directionsUrl =
    contactInfo.mapDirectionsUrl ||
    "https://maps.google.com/?q=Weltriq+Roofing+Palakkad+Kerala";

  return (
    <Section className="bg-brand-navy text-brand-white py-16 md:py-20 lg:py-24 relative overflow-hidden border-t border-white/10">
      {/* Subtle Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Decorative Glow */}
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-12 space-y-4">
          <span className="text-xs font-display uppercase tracking-widest text-brand-yellow bg-brand-yellow/10 px-4 py-1.5 rounded-full border border-brand-yellow/20 inline-block font-bold">
            Interactive Location Map
          </span>
          <SectionHeading
            title="Visit Our Head Office & Yard"
            subtitle="Explore our central operations base in Palakkad, Kerala. View roofing profiles, consult structural engineers, and plan your project."
            align="center"
            className="text-white [&_h2]:text-white [&_p]:text-white/70"
          />
        </div>

        {/* Map Container with Dark Theme */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] bg-[#0A1024]">
          {/* Top Brand Accent Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-brand-yellow via-amber-400 to-brand-navy" />

          {/* Interactive Dark Theme Google Map */}
          <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[540px] bg-[#0c1533]">
            <iframe
              src={mapEmbedUrl}
              title="WELTRIQ Roofing Solutions Office Map"
              className="w-full h-full border-0 select-none"
              style={{
                filter: "invert(90%) hue-rotate(180deg) contrast(95%) brightness(95%)",
              }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Bottom Right Floating Directions Pill */}
            <div className="absolute bottom-4 right-4 z-10">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-navy/95 hover:bg-brand-navy text-white text-xs font-display uppercase tracking-wider font-bold border border-white/15 shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-brand-yellow stroke-[2.2]" />
                <span>Get Directions</span>
                <ExternalLink className="w-3 h-3 text-white/50" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
