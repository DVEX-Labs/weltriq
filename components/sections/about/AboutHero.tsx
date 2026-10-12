import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function AboutHero() {
  return (
    <section className="relative min-h-[clamp(520px,62vh,620px)] flex items-center bg-brand-navy text-brand-white overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/75 via-brand-navy/25 to-brand-navy/35" />
      </div>

      <Container className="relative z-10 w-full py-12 md:py-14">
        <div className="max-w-4xl space-y-4 md:space-y-5">
          <span className="text-xs sm:text-sm font-display uppercase tracking-[0.18em] text-brand-yellow">
            ABOUT WELTRIQ
          </span>

          <h1 className="max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] font-display uppercase leading-[1.08] tracking-tight text-brand-white break-normal hyphens-none">
            KERALA&apos;S TRUSTED ROOFING{" "}
            <span className="text-brand-yellow inline-block whitespace-normal sm:whitespace-nowrap">
              SOLUTIONS PARTNER
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-brand-white/85 leading-relaxed text-balance">
            Professionally managed roofing, with one accountable partner from planning to completion.
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
