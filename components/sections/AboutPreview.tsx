import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutPreview() {
  return (
    <Section className="bg-brand-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <span className="text-brand-yellow font-display uppercase tracking-widest text-sm font-bold">
              About WELTRIQ
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase leading-[1.1] text-brand-navy">
              Roofing, Managed <br className="hidden md:block" />
              With Clarity and <br className="hidden md:block" />
              Accountability.
            </h2>
          </div>

          {/* Right Column */}
          <div className="space-y-8 lg:pl-12 lg:border-l border-brand-navy/10">
            <p className="text-lg md:text-xl text-brand-navy/80 leading-relaxed text-balance">
              WELTRIQ is positioned as Kerala&apos;s trusted roofing solutions partner, 
              focused on reliable roofing solutions, quality workmanship, professional 
              execution and customer-first service.
            </p>
            
            <div>
              <Button variant="outline" size="lg" className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-brand-white group" asChild>
                <Link href="/about" className="flex items-center gap-2">
                  About WELTRIQ 
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
