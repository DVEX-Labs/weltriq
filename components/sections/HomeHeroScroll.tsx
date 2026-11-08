"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useInspectionModal } from "@/components/providers/InspectionModalProvider";
import { ArrowRight } from "lucide-react";

export function HomeHeroScroll() {
  const { openModal } = useInspectionModal();
  const [readyToAnimate, setReadyToAnimate] = useState(false);

  useEffect(() => {
    // If loader already completed in this session or navigating back, show immediately
    if (typeof window !== "undefined" && (window as unknown as { __WELTRIQ_LOADED__?: boolean }).__WELTRIQ_LOADED__) {
      setReadyToAnimate(true);
      return;
    }

    const handleLoaderFinish = () => {
      setReadyToAnimate(true);
    };

    window.addEventListener("weltriq-loader-finish", handleLoaderFinish);

    // Fallback timer at 1450ms in case loader event fired prior to mount
    const fallbackTimer = setTimeout(() => {
      setReadyToAnimate(true);
    }, 1450);

    return () => {
      window.removeEventListener("weltriq-loader-finish", handleLoaderFinish);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[85dvh] sm:min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-black pt-24 sm:pt-28 pb-14 sm:pb-16 lg:py-24">
      {/* Background Hero Image with Priority Loading */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero.png"
          alt="WELTRIQ Kerala Architectural Roofing Solutions"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_12%] sm:object-[center_20%] md:object-[center_28%] lg:object-[center_32%] transform scale-100 animate-in fade-in duration-1000"
          quality={90}
        />

        {/* Realistic Twilight Lighting Overlays — Preserves open sky vibrancy, uncrops villa, and ensures crisp white text legibility */}
        {/* 1. Subtle top scrim for navbar navigation icons */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* 2. Soft atmospheric dusk glow connecting zenith to warm horizon without darkening colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-black/70 pointer-events-none" />

        {/* 3. Centered radial text-contrast veil: keeps white typography sharp while leaving sky and house open and luminous */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_46%,rgba(10,17,40,0.5)_0%,rgba(10,17,40,0.18)_55%,transparent_100%)] pointer-events-none" />

        {/* 4. Bottom seamless transition to section below */}
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 w-full flex flex-col justify-center items-center text-center px-4">
        <Container className="w-full">
          <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6 md:space-y-8 flex flex-col items-center">

            {/* Main Headline with Staggered Kinetic Mask Reveal */}
            <h1 className="max-w-5xl text-[clamp(2rem,7.2vw,2.75rem)] sm:text-5xl md:text-6xl lg:text-[clamp(3rem,5vw,5.25rem)] font-display uppercase leading-[1.04] sm:leading-[1.0] md:leading-[0.98] tracking-tight text-white text-balance drop-shadow-2xl">
              <span className="block overflow-hidden py-1">
                <span
                  className={`block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    readyToAnimate
                      ? "translate-y-0 opacity-100"
                      : "translate-y-[115%] opacity-0"
                  }`}
                >
                  Kerala&apos;s
                </span>
              </span>
              <span className="block overflow-hidden py-1">
                <span
                  className={`block transition-all duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    readyToAnimate
                      ? "translate-y-0 opacity-100"
                      : "translate-y-[115%] opacity-0"
                  }`}
                >
                  Trusted Roofing
                </span>
              </span>
              <span className="block overflow-hidden py-1">
                <span
                  className={`block transition-all duration-700 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    readyToAnimate
                      ? "translate-y-0 opacity-100"
                      : "translate-y-[115%] opacity-0"
                  }`}
                >
                  Solutions Partner
                </span>
              </span>
            </h1>

            {/* Single Primary CTA with Staggered Entrance */}
            <div
              className={`pt-2 flex justify-center transition-all duration-700 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                readyToAnimate
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-6 opacity-0 scale-95"
              }`}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => openModal("General Site Inspection")}
                className="group cursor-pointer shadow-xl hover:shadow-brand-yellow/20"
              >
                <span className="flex items-center gap-2">
                  Book Site Inspection
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>

          </div>
        </Container>
      </div>
    </section>
  );
}
