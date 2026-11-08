"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceData, allServices } from "@/data/services";

export interface ServicesShowcaseProps {
  services?: ServiceData[];
  showViewAll?: boolean;
}

export function ServicesShowcase({
  services = allServices,
  showViewAll = false,
}: ServicesShowcaseProps) {
  const total = services.length;

  return (
    <section
      className="relative w-full bg-brand-white pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 border-b border-brand-navy/5 overflow-visible"
      id="services-showcase"
    >
      <Container className="relative z-10 w-full mb-8 md:mb-12">
        {/* Section Heading Zone */}
        <SectionHeading
          title="Our Services"
          subtitle="Reliable roofing solutions delivered through quality workmanship and professional execution."
        />
      </Container>

      {/* Pure CSS Sticky Stacking Card Deck Container */}
      <Container className="relative z-10 w-full">
        <div className="relative w-full space-y-0">
          {services.map((service, index) => {
            const isImageLeft = index % 2 !== 0;

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="sticky top-[clamp(72px,11vh,108px)] will-change-transform"
                style={{
                  zIndex: index + 10,
                  // Uniform margin-bottom across preceding cards ensures consistent arrival pacing, while final card connects seamlessly with holding scroll
                  marginBottom: index === total - 1 ? "0px" : "clamp(40px, 8vh, 80px)",
                }}
              >
                {/* Physical Card with Clean Grey Border */}
                <div className="relative w-full rounded-xl md:rounded-2xl border border-gray-200 bg-brand-white shadow-[0_12px_40px_rgba(12,21,51,0.06)] overflow-hidden transition-shadow">
                  <div
                    className={`w-full flex flex-col ${
                      isImageLeft ? "md:flex-row-reverse" : "md:flex-row"
                    } relative overflow-hidden bg-brand-white min-h-0 md:min-h-[380px] lg:min-h-[440px]`}
                  >
                    {/* Content Half */}
                    <div className="w-full md:w-[55%] flex flex-col items-start justify-center p-5 sm:p-8 lg:p-14 order-2 md:order-none bg-brand-white">
                      <div className="flex flex-col items-start justify-center space-y-3 sm:space-y-4 md:space-y-5 max-w-lg">
                        {/* Number Pill Badge - Grey Border Style */}
                        <span className="text-[11px] sm:text-xs md:text-sm font-display font-bold uppercase tracking-widest text-brand-navy/60 border border-gray-200 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-sm bg-brand-navy/[0.03]">
                          {service.number} / {String(total).padStart(2, "0")}
                        </span>

                        {/* Service Title */}
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[clamp(2rem,3vw,3rem)] font-display uppercase leading-tight text-brand-navy tracking-wide break-normal text-balance">
                          {service.title}
                        </h3>

                        {/* Service Description */}
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-brand-navy/70 leading-relaxed font-sans text-balance">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Image Half */}
                    <div className="w-full md:w-[45%] flex items-center justify-center relative bg-brand-white order-1 md:order-none p-3.5 sm:p-5 lg:p-8">
                      <div className="relative w-full h-[190px] xs:h-[220px] sm:h-[260px] md:h-[290px] lg:h-[340px] rounded-lg md:rounded-xl overflow-hidden border border-gray-200 shadow-xs group/img bg-white">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 45vw"
                          className="object-cover object-center transform transition-transform duration-700 ease-out group-hover/img:scale-105"
                          priority={index === 0}
                          loading={index === 0 ? "eager" : "lazy"}
                          quality={75}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* In-Flow Scroll Track Spacer: gives the final card the exact same holding scroll plateau as preceding cards before smooth unpinning */}
          <div
            className="block pointer-events-none"
            style={{
              height: "clamp(240px, 40vh, 500px)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Centered Primary View All Services Button */}
        {showViewAll && (
          <div className="pt-8 md:pt-10 flex justify-center relative z-20">
            <Button
              variant="primary"
              size="lg"
              className="group cursor-pointer"
              asChild
            >
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2"
              >
                <span>View All Services</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
