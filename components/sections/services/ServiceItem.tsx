import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ServiceItemProps {
  id: string;
  title: string;
  index: number;
}

export function ServiceItem({ id, title, index }: ServiceItemProps) {
  const formattedNumber = index < 9 ? `0${index + 1}` : `${index + 1}`;

  return (
    <Link 
      id={id}
      href={`/services#${id}`}
      className="group flex flex-col md:flex-row md:items-center py-8 md:py-14 border-b border-brand-navy/10 hover:bg-brand-island-spice transition-colors duration-300 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8"
    >
      <div className="w-16 md:w-32 text-brand-navy/30 font-display text-2xl md:text-4xl font-semibold transition-colors duration-300 group-hover:text-brand-yellow mb-2 md:mb-0">
        {formattedNumber}
      </div>
      
      <div className="flex-1">
        <h3 className="text-xl md:text-3xl lg:text-4xl font-display uppercase text-brand-navy transition-colors">
          {title}
        </h3>
      </div>
      
      {/* Subtle visual indicator on hover */}
      <div className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 items-center justify-center rounded-full bg-brand-yellow/10">
        <ArrowRight className="w-5 h-5 text-brand-yellow" />
      </div>
    </Link>
  );
}
