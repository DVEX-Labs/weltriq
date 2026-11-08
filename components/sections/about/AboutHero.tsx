"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useInspectionModal } from "@/components/providers/InspectionModalProvider";

export function AboutHero() {
  const { openModal } = useInspectionModal();
  return (
    <section className="relative min-h-[clamp(520px,62vh,620px)] flex items-center bg-brand-navy text-brand-white overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/refined/about_hero.webp"
          alt="Contemporary residential roofing architecture"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-[center_45%]"
        />
        <div className="absolute inset-0 bg-brand-navy/58" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-brand-navy/25 to-brand-navy/35" />
      </div>

      <Container className="relative z-10 w-full py-20 md:py-24">
        <div className="max-w-4xl space-y-5 md:space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-brand-white/80 font-display uppercase tracking-[0.18em] text-xs sm:text-sm">
              ABOUT WELTRIQ
            </span>
            <span className="h-px w-10 bg-brand-white/30" aria-hidden="true" />
          </div>

          <h1 className="max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(2.5rem,4vw,3.75rem)] font-display uppercase leading-[1.02] tracking-tight text-brand-white break-normal hyphens-none">
            KERALA&apos;S TRUSTED ROOFING<br className="hidden sm:inline" />{" "}
            SOLUTIONS PARTNER
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-brand-white/85 leading-relaxed text-balance">
            Professionally managed roofing, with one accountable partner from planning to completion.
          </p>

          <div className="pt-1">
            <Button
              variant="primary"
              size="lg"
              className="group cursor-pointer"
              onClick={() => openModal("General Site Inspection")}
            >
              <span className="inline-flex items-center gap-2">
                Book Site Inspection <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
