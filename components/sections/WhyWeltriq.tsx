"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const values = [
  {
    number: "01",
    title: "CLARITY",
    description: "Clear understanding of requirements and scope before any work begins.",
  },
  {
    number: "02",
    title: "ACCOUNTABILITY",
    description: "One accountable partner managing the project from start to finish.",
  },
  {
    number: "03",
    title: "QUALITY CONTROL",
    description: "Structured attention to quality at every stage of execution.",
  },
  {
    number: "04",
    title: "COORDINATION",
    description: "Professional coordination of planning, materials and workforce.",
  },
  {
    number: "05",
    title: "PROFESSIONAL EXECUTION",
    description: "Organised delivery from planning through to final handover.",
  },
];

export function WhyWeltriq() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const items = itemsRef.current.filter(Boolean);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      if (imageRef.current) {
        tl.from(imageRef.current, {
          x: -40,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        }, 0);
      }

      if (headingRef.current) {
        tl.from(headingRef.current, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        }, 0.1);
      }

      if (items.length > 0) {
        tl.from(items, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
        }, 0.25);
      }
    },
    { scope: sectionRef }
  );

  return (
    <Section className="bg-brand-navy text-brand-white overflow-hidden">
      <Container>
        <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — Image + Title block */}
          <div className="flex flex-col gap-8">
            {/* Label + Heading */}
            <div ref={headingRef} className="space-y-4">
              <span className="text-brand-yellow font-display uppercase tracking-widest text-xs md:text-sm font-bold">
                Why WELTRIQ
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display uppercase leading-[1.08] text-brand-white">
                Professionally{" "}
                <br className="hidden md:block" />
                Managed{" "}
                <br className="hidden md:block" />
                <span className="text-brand-yellow">Roofing.</span>
              </h2>
              <p className="text-brand-white/60 text-base md:text-lg font-sans leading-relaxed max-w-sm">
                With one accountable partner from planning to completion.
              </p>
            </div>

            {/* Image */}
            <div
              ref={imageRef}
              className="relative w-full aspect-[4/3] rounded-sm overflow-hidden"
            >
              <Image
                src="/images/refined/about_approach_architecture.png"
                alt="Professional roofing management"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              {/* Subtle overlay for contrast */}
              <div className="absolute inset-0 bg-brand-navy/20" />
              {/* Yellow bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-yellow" />
            </div>
          </div>

          {/* RIGHT — Values list */}
          <div className="flex flex-col divide-y divide-white/10">
            {values.map((value, index) => (
              <div
                key={value.title}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                className="group flex items-start gap-5 py-6 md:py-7 hover:bg-white/[0.03] px-4 -mx-4 rounded-sm transition-colors duration-300"
              >
                {/* Number */}
                <span className="text-xs font-display font-bold uppercase tracking-widest text-brand-yellow mt-1 shrink-0 w-6">
                  {value.number}
                </span>

                {/* Content */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base md:text-lg font-display font-bold uppercase tracking-wide text-brand-white group-hover:text-brand-yellow transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-sm md:text-base text-brand-white/55 leading-relaxed font-sans">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </Section>
  );
}
