import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowDown } from "lucide-react";

export function ContactHero() {
  return (
    <section className="relative min-h-[clamp(520px,62vh,620px)] flex items-center bg-brand-navy text-brand-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/refined/contact_hero.webp"
          alt="Contemporary commercial roofing architecture"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-[center_45%]"
        />
        <div className="absolute inset-0 bg-brand-navy/58" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/75 via-brand-navy/25 to-brand-navy/35" />
      </div>

      <Container className="relative z-10 w-full py-20 md:py-24">
        <div className="max-w-4xl space-y-5 md:space-y-6">
          <span className="text-xs sm:text-sm font-display uppercase tracking-[0.18em] text-brand-yellow">
            CONTACT WELTRIQ
          </span>

          <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display uppercase leading-[0.98] tracking-tight text-brand-white break-normal hyphens-none text-balance">
            PLAN YOUR <span className="text-brand-yellow">ROOFING PROJECT</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-brand-white/85 leading-relaxed text-balance">
            Start with a conversation about your roofing requirement.
          </p>

          <div className="pt-1">
            <Button variant="primary" size="lg" asChild>
              <a href="#enquiry" className="inline-flex items-center gap-2">
                Start Your Enquiry <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
