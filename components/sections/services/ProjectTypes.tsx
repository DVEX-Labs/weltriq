import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { WeltriqCard } from "@/components/ui/weltriq-card";

const projectTypes = [
  { id: "residential", number: "01", title: "Residential" },
  { id: "commercial", number: "02", title: "Commercial" },
  { id: "industrial", number: "03", title: "Industrial" },
];

export function ProjectTypes() {
  return (
    <Section className="bg-brand-island-spice py-20 md:py-28 border-b border-brand-navy/5">
      <Container>
        <div className="flex flex-col items-center text-center space-y-4 mb-16 md:mb-20">
          <span className="text-xs md:text-sm font-sans font-[800] uppercase tracking-widest text-brand-yellow">
            Project Types
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase leading-[1.1] text-brand-navy">
            Roofing For Every Project
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {projectTypes.map((project) => (
            <WeltriqCard
              key={project.id}
              stepNumber={project.number}
              numberPlacement="stacked"
              title={project.title}
              footer="Project Classification"
              footerRight={
                <div className="w-8 h-px bg-brand-navy/20 transition-all duration-300 group-hover:w-12 group-hover:bg-brand-navy" />
              }
              className="p-7 sm:p-8 md:p-9"
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
