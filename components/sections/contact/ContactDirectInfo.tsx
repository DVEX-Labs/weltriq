import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MapPin, Phone, Mail, MessageSquare, ArrowUpRight } from "lucide-react";

export function ContactDirectInfo() {
  return (
    <Section className="bg-brand-white border-b border-brand-navy/10 py-20 md:py-28 relative overflow-hidden">
      {/* Subtle Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c153305_1px,transparent_1px),linear-gradient(to_bottom,#0c153305_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 md:mb-16 space-y-4">
          <span className="text-xs font-display uppercase tracking-widest text-brand-navy/70 bg-brand-navy/5 px-4 py-1.5 rounded-full border border-brand-navy/10 inline-block">
            Direct Contact
          </span>
          <SectionHeading
            title="Get In Touch With WELTRIQ"
            subtitle="Reach out via phone, email, or WhatsApp."
            align="center"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-6xl mx-auto">
          {/* Location Card */}
          <a
            href="https://maps.google.com/?q=Weltriq+Roofing+Palakkad+Kerala"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-gray-200 bg-brand-white p-6 sm:p-7 shadow-[0_4px_24px_rgba(12,21,51,0.05)] hover:shadow-[0_18px_48px_rgba(12,21,51,0.1)] hover:border-brand-navy/30 transform-gpu hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between group min-h-[270px]"
          >
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy border border-brand-navy/10 transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-brand-white">
                <MapPin className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-[11px] font-display uppercase tracking-wider text-brand-navy/50">
                  Head Office
                </span>
                <h3 className="text-lg font-display uppercase text-brand-navy mt-1 tracking-wide">
                  Palakkad Office
                </h3>
                <div className="text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-sans mt-2 space-y-0.5">
                  <p>2nd Mile, Mepparambu</p>
                  <p className="text-brand-navy/60">Palakkad, Kerala 678006</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-display uppercase tracking-wider text-brand-navy group-hover:text-brand-navy/80 transition-colors">
                View on Maps
              </span>
              <div className="w-7 h-7 rounded-full bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-navy group-hover:text-brand-white transition-all duration-300">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </a>

          {/* Phone Card */}
          <a
            href="tel:+919747506015"
            className="rounded-2xl border border-gray-200 bg-brand-white p-6 sm:p-7 shadow-[0_4px_24px_rgba(12,21,51,0.05)] hover:shadow-[0_18px_48px_rgba(12,21,51,0.1)] hover:border-brand-navy/30 transform-gpu hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between group min-h-[270px]"
          >
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy border border-brand-navy/10 transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-brand-white">
                <Phone className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-[11px] font-display uppercase tracking-wider text-brand-navy/50">
                  Call Us Directly
                </span>
                <h3 className="text-lg font-display text-brand-navy mt-1 tracking-wide">
                  +91 97475 06015
                </h3>
                <div className="text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-sans mt-2 space-y-0.5">
                  <p className="whitespace-nowrap">Mon – Sat: 9:00 AM – 6:30 PM</p>
                  <p className="text-brand-navy/60">Direct engineer consultation</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-display uppercase tracking-wider text-brand-navy group-hover:text-brand-navy/80 transition-colors">
                Call Now
              </span>
              <div className="w-7 h-7 rounded-full bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-navy group-hover:text-brand-white transition-all duration-300">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </a>

          {/* Email Card */}
          <a
            href="mailto:info@weltriq.in"
            className="rounded-2xl border border-gray-200 bg-brand-white p-6 sm:p-7 shadow-[0_4px_24px_rgba(12,21,51,0.05)] hover:shadow-[0_18px_48px_rgba(12,21,51,0.1)] hover:border-brand-navy/30 transform-gpu hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between group min-h-[270px]"
          >
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy border border-brand-navy/10 transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-brand-white">
                <Mail className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-[11px] font-display uppercase tracking-wider text-brand-navy/50">
                  Email Support
                </span>
                <h3 className="text-lg font-display uppercase text-brand-navy mt-1 tracking-wide">
                  info@weltriq.in
                </h3>
                <div className="text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-sans mt-2 space-y-0.5">
                  <p>Send plans, drawings &amp; RFPs</p>
                  <p className="text-brand-navy/60">Prompt response guaranteed</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-display uppercase tracking-wider text-brand-navy group-hover:text-brand-navy/80 transition-colors">
                Send Email
              </span>
              <div className="w-7 h-7 rounded-full bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-navy group-hover:text-brand-white transition-all duration-300">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </a>

          {/* WhatsApp Card */}
          <a
            href="https://wa.me/919747506015"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-gray-200 bg-brand-white p-6 sm:p-7 shadow-[0_4px_24px_rgba(12,21,51,0.05)] hover:shadow-[0_18px_48px_rgba(12,21,51,0.1)] hover:border-brand-navy/30 transform-gpu hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between group min-h-[270px]"
          >
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy border border-brand-navy/10 transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-brand-white">
                <MessageSquare className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-[11px] font-display uppercase tracking-wider text-brand-navy/50">
                  Instant Messaging
                </span>
                <h3 className="text-lg font-display uppercase text-brand-navy mt-1 tracking-wide">
                  WhatsApp Chat
                </h3>
                <div className="text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-sans mt-2 space-y-0.5">
                  <p>Fast estimates &amp; quick queries</p>
                  <p className="text-brand-navy/60">Direct messaging via WhatsApp</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-display uppercase tracking-wider text-brand-navy group-hover:text-brand-navy/80 transition-colors">
                Chat on WhatsApp
              </span>
              <div className="w-7 h-7 rounded-full bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-navy group-hover:text-brand-white transition-all duration-300">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </a>
        </div>
      </Container>
    </Section>
  );
}
