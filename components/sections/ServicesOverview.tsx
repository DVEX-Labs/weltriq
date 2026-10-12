import React from "react";
import { ServicesShowcase } from "@/components/sections/services/ServicesShowcase";
import { homeServices } from "@/data/services";

export function ServicesOverview() {
  return <ServicesShowcase services={homeServices} showViewAll />;
}
