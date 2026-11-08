"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useInspectionModal } from "@/components/providers/InspectionModalProvider";

export function FinalCTA() {
  const { openModal } = useInspectionModal();
  return (
    <section className="relative bg-brand-island-spice overflow-hidden">
      {/* Background Decorative Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0a1628 1px, transparent 1px), linear-gradient(to bottom, #0a1628 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Yellow accent top border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-yellow" />

      <Container className="relative z-10 py-20 md:py-28 lg:py-32">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-7 md:space-y-9">
          <span className="text-xs font-display uppercase tracking-widest text-brand-navy/70 bg-brand-navy/5 px-4 py-1.5 rounded-full border border-brand-navy/10 inline-block">
            Ready to get started?
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display uppercase leading-[1.05] text-brand-navy text-balance">
            Plan Your Roofing Project Today.
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-brand-navy/70 leading-relaxed max-w-xl text-balance font-sans">
            Start with a conversation. We&apos;ll inspect your site within 24 hours
            and deliver a transparent, detailed quotation in 48 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="group cursor-pointer"
              onClick={() => openModal("General Site Inspection")}
            >
              <span className="flex items-center gap-2">
                Book Site Inspection
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button
              size="lg"
              className="group cursor-pointer bg-brand-navy text-brand-white border border-brand-navy hover:bg-brand-yellow hover:text-brand-navy hover:border-brand-yellow shadow-md hover:shadow-lg hover:-translate-y-0.5"
              asChild
            >
              <Link href="tel:+919747506015" className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 transition-colors group-hover:text-brand-navy" />
                <span>Call Us Now</span>
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
