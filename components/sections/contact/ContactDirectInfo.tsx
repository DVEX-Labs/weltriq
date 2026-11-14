import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  ArrowUpRight,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { contactInfo } from "@/data/contact";

export function ContactDirectInfo() {
  const autoQuery = encodeURIComponent(
    contactInfo.address
      ? `WELTRIQ Roofing Solutions, ${contactInfo.address}`
      : "WELTRIQ Roofing Palakkad Kerala"
  );

  const mapEmbedUrl =
    contactInfo.mapEmbedUrl ||
    `https://maps.google.com/maps?q=${autoQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const directionsUrl =
    contactInfo.mapDirectionsUrl ||
    "https://maps.google.com/?q=Weltriq+Roofing+Palakkad+Kerala";

  return (
    <Section className="bg-brand-island-spice border-b border-brand-navy/10 py-16 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Subtle Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c153305_1px,transparent_1px),linear-gradient(to_bottom,#0c153305_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 md:mb-14 space-y-4">
          <span className="text-xs font-display uppercase tracking-widest text-brand-navy/70 bg-brand-navy/5 px-4 py-1.5 rounded-full border border-brand-navy/10 inline-flex items-center gap-1.5 font-bold">
            <MapPin className="w-3.5 h-3.5 text-brand-navy stroke-[2.2]" />
            Direct Contact &amp; Location
          </span>
          <SectionHeading
            title="Get In Touch With WELTRIQ"
            subtitle="Reach out via phone, email, or WhatsApp — or visit our Palakkad head office & yard."
            align="center"
          />
        </div>

        {/* Unified 50/50 Section: Left Cards & Right Map with Identical Width and Height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: 4 Contact Cards in 2x2 Grid (50% Width) */}
          <div className="w-full flex flex-col h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 sm:gap-5 flex-1 h-full">
              {/* Card 1: Head Office */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-gray-200 bg-brand-white p-5 sm:p-6 shadow-[0_4px_24px_rgba(12,21,51,0.05)] hover:shadow-[0_16px_36px_rgba(12,21,51,0.1)] hover:border-brand-navy/30 active:scale-[0.985] transform-gpu hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between group min-h-[220px]"
              >
                <div className="space-y-3">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy border border-brand-navy/10 transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-brand-white">
                    <MapPin className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-display uppercase tracking-wider text-brand-navy/50 block">
                      Head Office
                    </span>
                    <h3 className="text-base sm:text-lg font-display uppercase text-brand-navy mt-1 tracking-wide">
                      {contactInfo.city} Office
                    </h3>
                    <div className="text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-sans mt-1.5 space-y-0.5">
                      <p>{contactInfo.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-display uppercase tracking-wider text-brand-navy group-hover:text-brand-navy/80 transition-colors">
                    View on Maps
                  </span>
                  <div className="w-7 h-7 rounded-full bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-navy group-hover:text-brand-white transition-all duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </a>

              {/* Card 2: Phone */}
              <div
                className="rounded-2xl border border-gray-200 bg-brand-white p-5 sm:p-6 shadow-[0_4px_24px_rgba(12,21,51,0.05)] hover:shadow-[0_16px_36px_rgba(12,21,51,0.1)] hover:border-brand-navy/30 transform-gpu hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between group min-h-[220px]"
              >
                <div className="space-y-3">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy border border-brand-navy/10 transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-brand-white">
                    <Phone className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-display uppercase tracking-wider text-brand-navy/50 block">
                      Call Us Directly
                    </span>
                    <div className="mt-1 space-y-0.5">
                      <a
                        href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                        className="block text-sm sm:text-base font-display text-brand-navy tracking-wide hover:text-brand-yellow transition-colors font-bold"
                      >
                        {contactInfo.phone}
                      </a>
                      {contactInfo.phoneSecondary && (
                        <a
                          href={`tel:${contactInfo.phoneSecondary.replace(/\s+/g, '')}`}
                          className="block text-sm sm:text-base font-display text-brand-navy tracking-wide hover:text-brand-yellow transition-colors font-bold"
                        >
                          {contactInfo.phoneSecondary}
                        </a>
                      )}
                    </div>
                    <div className="text-xs text-brand-navy/70 leading-relaxed font-sans mt-1 space-y-0.5">
                      <p className="whitespace-nowrap">{contactInfo.workingHours}</p>
                      <p className="text-brand-navy/60">Direct engineer consultation</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-display uppercase tracking-wider text-brand-navy group-hover:text-brand-navy/80 transition-colors">
                    Call Now
                  </span>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                    className="w-7 h-7 rounded-full bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-navy group-hover:text-brand-white transition-all duration-300"
                    aria-label={`Call ${contactInfo.phone}`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Card 3: Email */}
              <a
                href={`mailto:${contactInfo.email}`}
                className="rounded-2xl border border-gray-200 bg-brand-white p-5 sm:p-6 shadow-[0_4px_24px_rgba(12,21,51,0.05)] hover:shadow-[0_16px_36px_rgba(12,21,51,0.1)] hover:border-brand-navy/30 active:scale-[0.985] transform-gpu hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between group min-h-[220px]"
              >
                <div className="space-y-3">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy border border-brand-navy/10 transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-brand-white">
                    <Mail className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-display uppercase tracking-wider text-brand-navy/50 block">
                      Email Inquiries
                    </span>
                    <h3 className="text-sm sm:text-base font-display text-brand-navy mt-1 tracking-wide break-all font-bold">
                      {contactInfo.email}
                    </h3>
                    <div className="text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-sans mt-1.5 space-y-0.5">
                      <p>General inquiries &amp; official correspondence</p>
                      <p className="text-brand-navy/60">Replies within 24 working hours</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-display uppercase tracking-wider text-brand-navy group-hover:text-brand-navy/80 transition-colors">
                    Send Email
                  </span>
                  <div className="w-7 h-7 rounded-full bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-navy group-hover:text-brand-white transition-all duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </a>

              {/* Card 4: WhatsApp */}
              <a
                href={`https://wa.me/${contactInfo.whatsappNumber}?text=${encodeURIComponent(
                  contactInfo.whatsappDefaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-gray-200 bg-brand-white p-5 sm:p-6 shadow-[0_4px_24px_rgba(12,21,51,0.05)] hover:shadow-[0_16px_36px_rgba(12,21,51,0.1)] hover:border-brand-navy/30 active:scale-[0.985] transform-gpu hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between group min-h-[220px]"
              >
                <div className="space-y-3">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy border border-brand-navy/10 transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-brand-white">
                    <MessageSquare className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-display uppercase tracking-wider text-brand-navy/50 block">
                      Instant Messaging
                    </span>
                    <h3 className="text-base sm:text-lg font-display uppercase text-brand-navy mt-1 tracking-wide">
                      WhatsApp Chat
                    </h3>
                    <div className="text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-sans mt-1.5 space-y-0.5">
                      <p>Direct chat with our team</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-display uppercase tracking-wider text-brand-navy group-hover:text-brand-navy/80 transition-colors">
                    Chat on WhatsApp
                  </span>
                  <div className="w-7 h-7 rounded-full bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-navy group-hover:text-brand-white transition-all duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Map Card (50% Width & Matching Height) */}
          <div className="w-full flex flex-col h-full min-h-[420px] lg:min-h-0">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/90 shadow-[0_4px_24px_rgba(12,21,51,0.06)] hover:shadow-[0_16px_40px_rgba(12,21,51,0.1)] transition-shadow duration-300 bg-[#0A1024] flex flex-col flex-1 h-full">
              {/* Top Accent Gradient Bar */}
              <div className="h-1 w-full bg-gradient-to-r from-brand-yellow via-amber-400 to-brand-navy shrink-0" />

              {/* Floating Top Left Location Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-navy/90 text-white text-[11px] font-display uppercase tracking-wider border border-white/15 shadow-xl backdrop-blur-md pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Palakkad Head Office &amp; Yard</span>
              </div>

              {/* Google Map iframe Container (Fills exact height via absolute positioning) */}
              <div className="relative w-full flex-1 min-h-[380px] lg:min-h-0 bg-[#0c1533]">
                <iframe
                  src={mapEmbedUrl}
                  title="WELTRIQ Roofing Solutions Office Map"
                  className="absolute inset-0 w-full h-full border-0 select-none"
                  style={{
                    filter: "invert(90%) hue-rotate(180deg) contrast(95%) brightness(95%)",
                  }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Floating Bottom Right Directions Pill */}
                <div className="absolute bottom-4 right-4 z-10">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-navy/95 hover:bg-brand-navy text-white text-xs font-display uppercase tracking-wider font-bold border border-white/15 shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-brand-yellow stroke-[2.2]" />
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3 text-white/50" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
