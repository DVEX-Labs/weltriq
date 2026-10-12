import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ title, subtitle, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col space-y-3", align === "center" ? "text-center items-center" : "text-left", className)}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display uppercase leading-tight text-brand-navy">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-brand-navy/70 max-w-2xl text-balance">
          {subtitle}
        </p>
      )}
    </div>
  );
}
