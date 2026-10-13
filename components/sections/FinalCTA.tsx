import React from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative bg-brand-navy overflow-hidden">
      {/* Background Decorative Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Yellow accent top border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-yellow" />

      <Container className="relative z-10 py-24 md:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8 md:space-y-10">
          <span className="text-brand-yellow font-display uppercase tracking-widest text-xs md:text-sm font-bold">
            Ready to get started?
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display uppercase leading-[1.05] text-brand-white text-balance">
            Plan Your{" "}
            <span className="text-brand-yellow">Roofing</span>{" "}
            Project Today.
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-brand-white/60 leading-relaxed max-w-xl text-balance font-sans">
            Start with a conversation. We&apos;ll inspect your site within 24 hours
            and deliver a transparent, detailed quotation in 48 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button variant="primary" size="lg" className="group" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                Get a Free Quote
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-brand-white hover:bg-white/10 hover:border-brand-yellow group"
              asChild
            >
              <Link href="tel:+91" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call Us Now
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 pt-4 text-brand-white/40 text-xs font-display uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-brand-yellow/60" />
              Site Inspection within 24 Hours
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-brand-yellow/60" />
              Quotation within 48 Hours
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-brand-yellow/60" />
              Professional Execution
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
