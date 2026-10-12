import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <Section className="bg-brand-island-spice border-t border-b border-brand-navy/5">
      <Container>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-8">
          <span className="text-brand-yellow font-display uppercase tracking-widest text-sm font-bold">
            Ready to get started?
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase leading-[1.1] text-brand-navy">
            Plan Your Roofing Project
          </h2>
          <p className="text-lg md:text-xl text-brand-navy/70">
            Start with a conversation about your roofing requirement.
          </p>
          <div className="pt-4">
            <Button variant="primary" size="lg" className="group" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                Get a Quote
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
