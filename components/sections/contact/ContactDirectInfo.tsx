import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MapPin, Phone, Mail, MessageSquare, ExternalLink } from "lucide-react";

export function ContactDirectInfo() {
  return (
    <Section className="bg-brand-island-spice border-b border-brand-navy/5 py-20 md:py-28">
      <Container>
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs md:text-sm font-display uppercase tracking-widest font-bold text-brand-yellow">
            Direct Contact
          </span>
          <SectionHeading
            title="Get In Touch With WELTRIQ"
            subtitle="Reach out via phone, email, or WhatsApp."
            align="center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Location Card */}
          <div className="rounded-xl border border-brand-navy/10 bg-white p-6 md:p-8 shadow-xs hover:shadow-md transform-gpu hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-island-spice text-brand-navy border border-brand-navy/6 transition-colors">
                <MapPin className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold uppercase text-brand-navy">
                  WELTRIQ
                </h3>
                <p className="text-sm text-brand-navy/70 leading-relaxed font-sans mt-2">
                  2nd Mile, Mepparambu,<br />Palakkad, Kerala
                </p>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="rounded-xl border border-brand-navy/10 bg-white p-6 md:p-8 shadow-xs hover:shadow-md transform-gpu hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-island-spice text-brand-navy border border-brand-navy/6 transition-colors">
                <Phone className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-[10px] font-display font-bold uppercase tracking-widest text-brand-navy/40">
                  Call Us Directly
                </span>
                <h3 className="text-lg font-display font-bold uppercase text-brand-navy mt-1">
                  Phone
                </h3>
                <a
                  href="tel:+919747506015"
                  className="text-base text-brand-navy font-semibold hover:opacity-80 transition-opacity font-sans mt-2 block"
                >
                  +91 97475 06015
                </a>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-navy/10">
              <a
                href="tel:+919747506015"
                className="text-xs font-display font-bold uppercase tracking-wider text-brand-navy flex items-center gap-1 group/link"
              >
                <span>Call Now</span>
                <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="rounded-xl border border-brand-navy/10 bg-white p-6 md:p-8 shadow-xs hover:shadow-md transform-gpu hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-island-spice text-brand-navy border border-brand-navy/6 transition-colors">
                <Mail className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-[10px] font-display font-bold uppercase tracking-widest text-brand-navy/40">
                  Email Support
                </span>
                <h3 className="text-lg font-display font-bold uppercase text-brand-navy mt-1">
                  Email
                </h3>
                <a
                  href="mailto:info@weltriq.in"
                  className="text-base text-brand-navy font-semibold hover:opacity-80 transition-opacity font-sans mt-2 block"
                >
                  info@weltriq.in
                </a>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-navy/10">
              <a
                href="mailto:info@weltriq.in"
                className="text-xs font-display font-bold uppercase tracking-wider text-brand-navy flex items-center gap-1 group/link"
              >
                <span>Send Email</span>
                <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className="rounded-xl border border-brand-navy/10 bg-white p-6 md:p-8 shadow-xs hover:shadow-md transform-gpu hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-island-spice text-brand-navy border border-brand-navy/6 transition-colors">
                <MessageSquare className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-[10px] font-display font-bold uppercase tracking-widest text-brand-navy/40">
                  Instant Messaging
                </span>
                <h3 className="text-lg font-display font-bold uppercase text-brand-navy mt-1">
                  WhatsApp
                </h3>
                <p className="text-sm text-brand-navy/70 leading-relaxed font-sans mt-2">
                  Connect on WhatsApp for quick project queries.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-navy/10">
              <a
                href="https://wa.me/919747506015"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-display font-bold uppercase tracking-wider text-brand-navy flex items-center gap-1 group/link"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
