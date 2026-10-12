import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { services } from "@/data/services";
import { ServiceItem } from "@/components/sections/services/ServiceItem";

export function ServicePresentation() {
  return (
    <Section className="bg-brand-white">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col border-t border-brand-navy/10 mt-8">
            {services.map((service, index) => (
              <ServiceItem 
                key={service.id} 
                id={service.id} 
                title={service.title} 
                index={index} 
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
