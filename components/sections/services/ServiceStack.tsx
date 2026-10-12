import React from "react";
import { ServicesShowcase } from "@/components/sections/services/ServicesShowcase";
import { allServices } from "@/data/services";

export function ServiceStack() {
  return <ServicesShowcase services={allServices} />;
}
