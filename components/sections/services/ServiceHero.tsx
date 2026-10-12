import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function ServiceHero() {
  return (
    <section className="relative min-h-[clamp(520px,62vh,620px)] flex items-center bg-brand-navy text-brand-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/refined/services_hero_new.png"
          alt="Architectural roofing structure"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-[center_52%]"
        />
        <div className="absolute inset-0 bg-brand-navy/58" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-brand-navy/25 to-brand-navy/35" />
      </div>

      <Container className="relative z-10 w-full py-20 md:py-24">
        <div className="max-w-4xl space-y-5 md:space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-brand-yellow font-display uppercase tracking-[0.18em] text-xs sm:text-sm">
              OUR SERVICES
            </span>
            <span className="h-px w-10 bg-brand-yellow/70" aria-hidden="true" />
          </div>

          <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display uppercase leading-[0.98] tracking-tight text-brand-white break-normal hyphens-none">
            ROOFING SOLUTIONS
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-brand-white/85 leading-relaxed text-balance">
            Reliable roofing solutions delivered through quality workmanship and professional execution.
          </p>

          <div className="pt-1">
            <Button variant="primary" size="lg" asChild>
              <Link href="/contact" className="inline-flex items-center gap-2">
                Get a Quote <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
